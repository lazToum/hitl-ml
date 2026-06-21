-- Map Dex subject IDs to local players.
-- On first login the middleware creates the player row; subsequent
-- requests look it up by external_id.
ALTER TABLE players ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
