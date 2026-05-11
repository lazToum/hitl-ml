-- ============================================================
-- Treasure Hunt — PostgreSQL schema
-- Source of truth for both Rust and Python implementations
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Players ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name    TEXT NOT NULL,
    email           TEXT UNIQUE,
    anon_token      TEXT UNIQUE,        -- anonymous player token
    role            TEXT NOT NULL DEFAULT 'player'
                    CHECK (role IN ('player', 'creator', 'observer')),
    external_id     TEXT UNIQUE,               -- OIDC subject ID for SSO login
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Hunts ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hunts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    creator_id      UUID NOT NULL REFERENCES players(id),
    status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'archived')),
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Clues ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clues (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunt_id                     UUID NOT NULL REFERENCES hunts(id) ON DELETE CASCADE,
    sequence                    INTEGER NOT NULL,
    title                       TEXT NOT NULL,
    body                        TEXT NOT NULL,
    media_url                   TEXT,
    answer_type                 TEXT NOT NULL
                                CHECK (answer_type IN ('text', 'qr', 'nfc', 'gps', 'photo')),
    -- text answer, QR/NFC token, or "lat,lon" for GPS
    answer_value                TEXT NOT NULL,
    -- fuzzy threshold (0–1) for text; radius in metres for GPS
    answer_tolerance            DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    hint_unlock_after_minutes   INTEGER NOT NULL DEFAULT 5,
    hint_unlock_after_attempts  INTEGER NOT NULL DEFAULT 3,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (hunt_id, sequence)
);

-- ── Hints ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hints (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clue_id     UUID NOT NULL REFERENCES clues(id) ON DELETE CASCADE,
    sequence    INTEGER NOT NULL,
    body        TEXT NOT NULL,
    UNIQUE (clue_id, sequence)
);

-- ── Clue tokens (QR / NFC) ───────────────────────────────────
-- One stable token per clue; both QR and NFC encode /scan/{token}
CREATE TABLE IF NOT EXISTS clue_tokens (
    token       TEXT PRIMARY KEY,
    clue_id     UUID NOT NULL REFERENCES clues(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Teams ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunt_id     UUID NOT NULL REFERENCES hunts(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, player_id)
);

-- ── Sessions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunt_id                 UUID NOT NULL REFERENCES hunts(id) ON DELETE CASCADE,
    player_id               UUID NOT NULL REFERENCES players(id),
    team_id                 UUID REFERENCES teams(id),
    current_clue_sequence   INTEGER NOT NULL DEFAULT 1,
    started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at            TIMESTAMPTZ
);

-- ── Session clue progress ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_clues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    clue_id         UUID NOT NULL REFERENCES clues(id) ON DELETE CASCADE,
    unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    solved_at       TIMESTAMPTZ,
    attempts        INTEGER NOT NULL DEFAULT 0,
    hints_used      INTEGER NOT NULL DEFAULT 0,
    UNIQUE (session_id, clue_id)
);

-- ── Event log (audit + analytics) ────────────────────────────
CREATE TABLE IF NOT EXISTS events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    clue_id     UUID REFERENCES clues(id) ON DELETE SET NULL,
    event_type  TEXT NOT NULL,
    payload     JSONB,
    ts          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_hunts_creator    ON hunts(creator_id);
CREATE INDEX IF NOT EXISTS idx_hunts_status     ON hunts(status);
CREATE INDEX IF NOT EXISTS idx_clues_hunt       ON clues(hunt_id, sequence);
CREATE INDEX IF NOT EXISTS idx_hints_clue       ON hints(clue_id, sequence);
CREATE INDEX IF NOT EXISTS idx_sessions_hunt    ON sessions(hunt_id);
CREATE INDEX IF NOT EXISTS idx_sessions_player  ON sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_sc_session       ON session_clues(session_id);
CREATE INDEX IF NOT EXISTS idx_events_session   ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_ts        ON events(ts);
