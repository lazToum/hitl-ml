use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    models::{
        clue::{Clue, CreateClue, Hint},
        hunt::{CreateHunt, Hunt, HuntSummary, UpdateHunt},
    },
};

// ── Hunt CRUD ─────────────────────────────────────────────────

pub async fn create(db: &PgPool, creator_id: Uuid, req: CreateHunt) -> Result<Hunt> {
    sqlx::query_as!(
        Hunt,
        "INSERT INTO hunts (title, description, creator_id, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *",
        req.title,
        req.description,
        creator_id,
        req.start_time,
        req.end_time,
    )
    .fetch_one(db)
    .await
    .map_err(Into::into)
}

pub async fn get(db: &PgPool, hunt_id: Uuid) -> Result<Hunt> {
    sqlx::query_as!(Hunt, "SELECT * FROM hunts WHERE id = $1", hunt_id)
        .fetch_one(db)
        .await
        .map_err(|_| AppError::NotFound("hunt not found".into()))
}

pub async fn list_by_creator(db: &PgPool, creator_id: Uuid) -> Result<Vec<HuntSummary>> {
    sqlx::query_as!(
        HuntSummary,
        r#"SELECT h.id, h.title, h.status, h.created_at,
                  COUNT(c.id) AS "clue_count!: i64"
           FROM hunts h
           LEFT JOIN clues c ON c.hunt_id = h.id
           WHERE h.creator_id = $1
           GROUP BY h.id
           ORDER BY h.created_at DESC"#,
        creator_id,
    )
    .fetch_all(db)
    .await
    .map_err(Into::into)
}

pub async fn update(db: &PgPool, hunt_id: Uuid, creator_id: Uuid, req: UpdateHunt) -> Result<Hunt> {
    let hunt = get(db, hunt_id).await?;
    if hunt.creator_id != creator_id {
        return Err(AppError::Forbidden);
    }

    sqlx::query_as!(
        Hunt,
        "UPDATE hunts SET
            title       = COALESCE($1, title),
            description = COALESCE($2, description),
            status      = COALESCE($3, status),
            start_time  = COALESCE($4, start_time),
            end_time    = COALESCE($5, end_time),
            updated_at  = $6
         WHERE id = $7
         RETURNING *",
        req.title,
        req.description,
        req.status,
        req.start_time,
        req.end_time,
        Utc::now(),
        hunt_id,
    )
    .fetch_one(db)
    .await
    .map_err(Into::into)
}

// ── Clue CRUD ─────────────────────────────────────────────────

pub async fn upsert_clue(
    db: &PgPool,
    hunt_id: Uuid,
    creator_id: Uuid,
    req: CreateClue,
) -> Result<Clue> {
    ensure_owner(db, hunt_id, creator_id).await?;

    let clue = sqlx::query_as!(
        Clue,
        "INSERT INTO clues
            (hunt_id, sequence, title, body, media_url,
             answer_type, answer_value, answer_tolerance,
             hint_unlock_after_minutes, hint_unlock_after_attempts)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (hunt_id, sequence) DO UPDATE SET
            title                       = EXCLUDED.title,
            body                        = EXCLUDED.body,
            media_url                   = EXCLUDED.media_url,
            answer_type                 = EXCLUDED.answer_type,
            answer_value                = EXCLUDED.answer_value,
            answer_tolerance            = EXCLUDED.answer_tolerance,
            hint_unlock_after_minutes   = EXCLUDED.hint_unlock_after_minutes,
            hint_unlock_after_attempts  = EXCLUDED.hint_unlock_after_attempts
         RETURNING *",
        hunt_id,
        req.sequence,
        req.title,
        req.body,
        req.media_url,
        req.answer_type,
        req.answer_value,
        req.answer_tolerance.unwrap_or(0.85),
        req.hint_unlock_after_minutes.unwrap_or(5),
        req.hint_unlock_after_attempts.unwrap_or(3),
    )
    .fetch_one(db)
    .await?;

    // Replace hints if provided
    if let Some(hints) = req.hints {
        sqlx::query!("DELETE FROM hints WHERE clue_id = $1", clue.id)
            .execute(db)
            .await?;

        for (i, body) in hints.into_iter().enumerate() {
            sqlx::query!(
                "INSERT INTO hints (clue_id, sequence, body) VALUES ($1, $2, $3)",
                clue.id,
                (i + 1) as i32,
                body,
            )
            .execute(db)
            .await?;
        }
    }

    // Generate stable QR/NFC token if not already present
    let token = token_for_clue(db, clue.id).await?;
    tracing::debug!("clue {} → token {}", clue.id, token);

    Ok(clue)
}

pub async fn get_clue_by_seq(db: &PgPool, hunt_id: Uuid, sequence: i32) -> Result<Clue> {
    sqlx::query_as!(
        Clue,
        "SELECT * FROM clues WHERE hunt_id = $1 AND sequence = $2",
        hunt_id,
        sequence,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("clue not found".into()))
}

pub async fn list_clues(db: &PgPool, hunt_id: Uuid) -> Result<Vec<Clue>> {
    sqlx::query_as!(
        Clue,
        "SELECT * FROM clues WHERE hunt_id = $1 ORDER BY sequence",
        hunt_id,
    )
    .fetch_all(db)
    .await
    .map_err(Into::into)
}

pub async fn list_hints(db: &PgPool, clue_id: Uuid) -> Result<Vec<Hint>> {
    sqlx::query_as!(
        Hint,
        "SELECT * FROM hints WHERE clue_id = $1 ORDER BY sequence",
        clue_id,
    )
    .fetch_all(db)
    .await
    .map_err(Into::into)
}

// ── Token management ──────────────────────────────────────────

async fn token_for_clue(db: &PgPool, clue_id: Uuid) -> Result<String> {
    if let Some(row) = sqlx::query!("SELECT token FROM clue_tokens WHERE clue_id = $1", clue_id)
        .fetch_optional(db)
        .await?
    {
        return Ok(row.token);
    }

    let token = generate_token();
    sqlx::query!(
        "INSERT INTO clue_tokens (token, clue_id) VALUES ($1, $2)",
        token,
        clue_id,
    )
    .execute(db)
    .await?;

    Ok(token)
}

fn generate_token() -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..12)
        .map(|_| CHARSET[rng.gen_range(0..CHARSET.len())] as char)
        .collect()
}

async fn ensure_owner(db: &PgPool, hunt_id: Uuid, creator_id: Uuid) -> Result<()> {
    let row = sqlx::query!("SELECT creator_id FROM hunts WHERE id = $1", hunt_id)
        .fetch_one(db)
        .await
        .map_err(|_| AppError::NotFound("hunt not found".into()))?;
    if row.creator_id != creator_id {
        return Err(AppError::Forbidden);
    }
    Ok(())
}

pub async fn delete(db: &PgPool, hunt_id: Uuid, creator_id: Uuid) -> Result<()> {
    let hunt = get(db, hunt_id).await?;
    if hunt.creator_id != creator_id {
        return Err(AppError::Forbidden);
    }
    // Manually clear child rows that may lack ON DELETE CASCADE on existing DBs.
    // Order matters: events → sessions (cascades session_clues) → hunt (cascades everything else).
    sqlx::query(
        "DELETE FROM events WHERE session_id IN (SELECT id FROM sessions WHERE hunt_id = $1)"
    )
    .bind(hunt_id)
    .execute(db)
    .await?;
    sqlx::query("DELETE FROM sessions WHERE hunt_id = $1")
        .bind(hunt_id)
        .execute(db)
        .await?;
    sqlx::query("DELETE FROM hunts WHERE id = $1")
        .bind(hunt_id)
        .execute(db)
        .await?;
    Ok(())
}

pub async fn delete_clue(db: &PgPool, hunt_id: Uuid, creator_id: Uuid, sequence: i32) -> Result<()> {
    ensure_owner(db, hunt_id, creator_id).await?;
    let result = sqlx::query("DELETE FROM clues WHERE hunt_id = $1 AND sequence = $2")
        .bind(hunt_id)
        .bind(sequence)
        .execute(db)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("clue not found".into()));
    }
    Ok(())
}

pub async fn list_active(db: &PgPool) -> Result<Vec<HuntSummary>> {
    sqlx::query_as!(
        HuntSummary,
        r#"SELECT h.id, h.title, h.status, h.created_at,
                  COUNT(c.id) AS "clue_count!: i64"
           FROM hunts h
           LEFT JOIN clues c ON c.hunt_id = h.id
           WHERE h.status = 'active'
           GROUP BY h.id
           ORDER BY h.created_at DESC"#,
    )
    .fetch_all(db)
    .await
    .map_err(Into::into)
}
