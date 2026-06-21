# Designing for Humans: The Schema

```{epigraph}
A database schema is a theory about the world. Every constraint is a claim about what is always true.

-- Chapter 3
```

---

## Think about it

**1.** You design a table called `annotations`. What columns does it need? Write them down before reading further. Now compare your list to what this chapter uses. What did you include that this chapter doesn't? What did this chapter include that you missed? What does each difference reveal about your assumptions?

**2.** A foreign key constraint says "this row cannot exist without that row." What assumption about the world does that encode? What happens when the assumption is wrong?

**3.** The schema uses `TEXT` for the `status` column with a `CHECK` constraint rather than a Postgres `ENUM`. Why might you prefer one over the other? Which choice makes future changes easier?

---

## Schema as specification

Before writing a single line of application code, we designed a database schema. That order matters.

A schema is not just storage. It is a formal specification of what the system believes about the world. Every table name is a concept. Every column type is a claim about the range of valid values. Every foreign key is an assertion about dependencies. Every nullable column is an admission of uncertainty.

When you design a HITL system, schema design is partly a data engineering problem and partly a conceptual one: *what are the entities in this domain, and what do we need to remember about them?*

Let us walk through `db/schema.sql` and read it as a design document rather than a technical artifact.

---

## Players

```sql
CREATE TABLE IF NOT EXISTS players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name    TEXT NOT NULL,
    email           TEXT UNIQUE,
    anon_token      TEXT UNIQUE,
    role            TEXT NOT NULL DEFAULT 'player'
                    CHECK (role IN ('player', 'creator', 'observer')),
    external_id     TEXT UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Three things to notice.

**`email` is nullable.** The system allows anonymous players. An `anon_token` can serve as an identity without an email address. This is a privacy choice, but it is also a HITL design choice: we are preserving the ability to study player behavior without requiring players to identify themselves. The tradeoff is that anonymous sessions are harder to connect across multiple hunts.

**`role` is a text column with a CHECK constraint.** Three roles: `player`, `creator`, `observer`. This is the access control model baked into the schema. Adding a fourth role — say, `analyst` — requires a schema migration and a code change. That friction is intentional: roles are consequential, and making them hard to change discourages casual proliferation.

**`external_id` maps to OIDC.** When a player logs in via Zitadel, the token's subject ID goes here. The middleware creates the player row on first login, using this field to recognize returning players. The player does not set this field — the system does, automatically. This is an example of the system deciding something about you without asking.

---

## Hunts and clues

```sql
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
```

A hunt is owned by exactly one player (who must have `role = 'creator'`, though the schema does not enforce this — the API does). The status lifecycle is `draft → active → archived`. Once archived, a hunt cannot be reactivated — the API enforces this too.

The `start_time` and `end_time` columns are nullable. This means hunts can be time-bounded or not. An `active` hunt with no `end_time` runs indefinitely. This flexibility is useful for development but requires care in production.

```sql
CREATE TABLE IF NOT EXISTS clues (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunt_id                     UUID NOT NULL REFERENCES hunts(id) ON DELETE CASCADE,
    sequence                    INTEGER NOT NULL,
    title                       TEXT NOT NULL,
    body                        TEXT NOT NULL,
    media_url                   TEXT,
    answer_type                 TEXT NOT NULL
                                CHECK (answer_type IN ('text', 'qr', 'nfc', 'gps', 'photo')),
    answer_value                TEXT NOT NULL,
    answer_tolerance            DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    hint_unlock_after_minutes   INTEGER NOT NULL DEFAULT 5,
    hint_unlock_after_attempts  INTEGER NOT NULL DEFAULT 3,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (hunt_id, sequence)
);
```

The clue table is where most HITL design decisions live.

**`answer_type`** encodes the five answer modalities: text (fuzzy match), QR code (token scan), NFC (tag tap), GPS (location proximity), photo (image verification by AI). Each type requires different validation logic. The schema records the type; the application chooses the validator.

**`answer_tolerance`** is a per-clue threshold. For text answers, it is a similarity score from 0 to 1. For GPS, it is a radius in metres. Encoding this per-clue rather than globally is a control decision: the creator has fine-grained authority over how strict each clue is.

**`hint_unlock_after_minutes` and `hint_unlock_after_attempts`** are the hint policy. These are also per-clue. A hard clue might unlock after 2 minutes; an easy clue might never unlock automatically. The defaults (5 minutes, 3 attempts) are the developer's best guess about reasonable behavior. Players never see these numbers — they just experience their effects.

**`UNIQUE (hunt_id, sequence)`** prevents two clues from having the same position in a hunt. This is a schema-level enforcement of an ordering invariant that would be very hard to enforce in application code alone.

---

## Sessions and progress

```sql
CREATE TABLE IF NOT EXISTS sessions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hunt_id                 UUID NOT NULL REFERENCES hunts(id),
    player_id               UUID NOT NULL REFERENCES players(id),
    team_id                 UUID REFERENCES teams(id),
    current_clue_sequence   INTEGER NOT NULL DEFAULT 1,
    started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at            TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS session_clues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    clue_id         UUID NOT NULL REFERENCES clues(id),
    unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    solved_at       TIMESTAMPTZ,
    attempts        INTEGER NOT NULL DEFAULT 0,
    hints_used      INTEGER NOT NULL DEFAULT 0,
    UNIQUE (session_id, clue_id)
);
```

The `sessions` table tracks where each player is in a hunt. `current_clue_sequence` is the current position. `completed_at` is null until the hunt is finished. These two columns are the "live state" of the game.

The `session_clues` table is the behavioral record. For each clue a player encounters, it records: when they got the clue (`unlocked_at`), when they solved it (`solved_at`), how many times they tried (`attempts`), and how many hints they used (`hints_used`). This is the raw feedback loop data.

Notice what is *not* recorded: the specific wrong answers the player submitted. The system records that they tried 4 times; it does not record what they guessed. This is a deliberate omission — storing wrong guesses would be useful for analysis but raises privacy concerns and storage costs. The schema leaves this gap.

:::{admonition} The data you don't collect
:class: note
Every column you do not create is a decision about what feedback you will never have. The absence of a `wrong_answers` column means the system can tell you that a clue was hard, but not *why* it was hard — whether players were guessing random things or consistently guessing the same wrong answer. That distinction matters enormously for clue improvement.
:::

---

## The event log

```sql
CREATE TABLE IF NOT EXISTS events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES sessions(id),
    clue_id     UUID REFERENCES clues(id),
    event_type  TEXT NOT NULL,
    payload     JSONB,
    ts          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

The `events` table is a catch-all audit log. Every significant action — QR scan, answer submission, hint request, session start, session complete — generates an event row. The `payload` is a JSONB blob that can hold arbitrary data specific to the event type.

This table is the "open loop" mentioned in Chapter 2. It will accumulate data indefinitely. Eventually it should feed:

- Clue difficulty calibration (compare estimated vs. actual performance)
- Player performance analytics (which players consistently struggle?)
- Hunt quality metrics (which hunts have unusually high drop-off rates?)

Building those analytics pipelines is beyond the scope of this edition. But the data is here. The loop can be closed later, if someone decides to close it.

---

## Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_hunts_creator    ON hunts(creator_id);
CREATE INDEX IF NOT EXISTS idx_sessions_player  ON sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_sc_session       ON session_clues(session_id);
CREATE INDEX IF NOT EXISTS idx_events_ts        ON events(ts);
```

A few indexes to keep the most common queries fast. The `events` table is indexed by time because the most common access pattern is "show me all events in the last N minutes for this hunt" — used by the observer dashboard WebSocket feed.

---

## Running the schema

If you have postgres running:

```bash
cd editions/spring
docker compose up postgres -d
# wait for healthy
cd backend-rust
DATABASE_URL=postgres://hunt:hunt_secret@localhost:5432/treasure_hunt \
  cargo sqlx migrate run
```

This applies both migrations: the initial schema and the `external_id` column added for OIDC identities.

---

## Reflection

The schema encodes a specific theory of what a treasure hunt is. Not all treasure hunts fit it.

What would you need to change to support: a hunt where clues can branch (multiple valid next clues depending on your answer)? A hunt where the same clue can be attempted by multiple players simultaneously for a race? A hunt where hints are purchased with in-game currency?

Pick one. Sketch the schema change. What existing assumptions does it break?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
