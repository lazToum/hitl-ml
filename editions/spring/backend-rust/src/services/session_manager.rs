use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    models::{
        clue::{Clue, ClueView},
        session::{Session, SessionClue, SessionStatus, StartSession},
    },
    services::hint_engine,
};

pub async fn start(db: &PgPool, player_id: Uuid, req: StartSession) -> Result<Session> {
    // Verify hunt exists and is active
    let hunt = sqlx::query!("SELECT id, status FROM hunts WHERE id = $1", req.hunt_id)
        .fetch_one(db)
        .await
        .map_err(|_| AppError::NotFound("hunt not found".into()))?;

    if hunt.status != "active" {
        return Err(AppError::BadRequest("hunt is not active".into()));
    }

    // Verify first clue exists
    let first_clue: Clue = sqlx::query_as!(
        Clue,
        "SELECT * FROM clues WHERE hunt_id = $1 ORDER BY sequence LIMIT 1",
        req.hunt_id,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::BadRequest("hunt has no clues".into()))?;

    let mut tx = db.begin().await?;

    let session: Session = sqlx::query_as!(
        Session,
        "INSERT INTO sessions (hunt_id, player_id, team_id)
         VALUES ($1, $2, $3)
         RETURNING id, hunt_id, player_id, team_id, current_clue_sequence, started_at, completed_at",
        req.hunt_id,
        player_id,
        req.team_id,
    )
    .fetch_one(&mut *tx)
    .await?;

    // Unlock first clue
    sqlx::query!(
        "INSERT INTO session_clues (session_id, clue_id) VALUES ($1, $2)",
        session.id,
        first_clue.id,
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(session)
}

pub async fn current_clue(db: &PgPool, session_id: Uuid, player_id: Uuid) -> Result<ClueView> {
    let session = fetch_session(db, session_id, player_id).await?;

    let clue: Clue = sqlx::query_as!(
        Clue,
        "SELECT * FROM clues WHERE hunt_id = $1 AND sequence = $2",
        session.hunt_id,
        session.current_clue_sequence,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("current clue not found".into()))?;

    let hints = hint_engine::unlocked_hints(db, session_id, clue.id).await?;

    Ok(ClueView {
        id: clue.id,
        sequence: clue.sequence,
        title: clue.title,
        body: clue.body,
        media_url: clue.media_url,
        answer_type: clue.answer_type,
        hints,
    })
}

pub async fn advance(db: &PgPool, session_id: Uuid, clue_id: Uuid) -> Result<Option<Clue>> {
    let session = sqlx::query_as!(Session, "SELECT * FROM sessions WHERE id = $1", session_id,)
        .fetch_one(db)
        .await?;

    // Mark current clue solved
    sqlx::query!(
        "UPDATE session_clues SET solved_at = $1
         WHERE session_id = $2 AND clue_id = $3",
        Utc::now(),
        session_id,
        clue_id,
    )
    .execute(db)
    .await?;

    let next_sequence = session.current_clue_sequence + 1;

    let next_clue = sqlx::query_as!(
        Clue,
        "SELECT * FROM clues WHERE hunt_id = $1 AND sequence = $2",
        session.hunt_id,
        next_sequence,
    )
    .fetch_optional(db)
    .await?;

    match &next_clue {
        Some(clue) => {
            // Unlock next clue
            sqlx::query!(
                "INSERT INTO session_clues (session_id, clue_id) VALUES ($1, $2)
                 ON CONFLICT DO NOTHING",
                session_id,
                clue.id,
            )
            .execute(db)
            .await?;

            sqlx::query!(
                "UPDATE sessions SET current_clue_sequence = $1 WHERE id = $2",
                next_sequence,
                session_id,
            )
            .execute(db)
            .await?;
        }
        None => {
            // Hunt complete
            sqlx::query!(
                "UPDATE sessions SET completed_at = $1 WHERE id = $2",
                Utc::now(),
                session_id,
            )
            .execute(db)
            .await?;
        }
    }

    Ok(next_clue)
}

pub async fn increment_attempts(db: &PgPool, session_id: Uuid, clue_id: Uuid) -> Result<i32> {
    let row = sqlx::query!(
        "UPDATE session_clues SET attempts = attempts + 1
         WHERE session_id = $1 AND clue_id = $2
         RETURNING attempts",
        session_id,
        clue_id,
    )
    .fetch_one(db)
    .await?;
    Ok(row.attempts)
}

pub async fn status(db: &PgPool, session_id: Uuid, player_id: Uuid) -> Result<SessionStatus> {
    let session = fetch_session(db, session_id, player_id).await?;

    let total = sqlx::query!(
        "SELECT COUNT(*) as n FROM clues WHERE hunt_id = $1",
        session.hunt_id
    )
    .fetch_one(db)
    .await?
    .n
    .unwrap_or(0);

    let sc = sqlx::query_as!(
        SessionClue,
        "SELECT * FROM session_clues WHERE session_id = $1
         ORDER BY unlocked_at DESC LIMIT 1",
        session_id,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("no clues unlocked".into()))?;

    let clue_meta = sqlx::query!(
        "SELECT hint_unlock_after_minutes FROM clues WHERE id = $1",
        sc.clue_id,
    )
    .fetch_one(db)
    .await?;

    let elapsed = Utc::now()
        .signed_duration_since(session.started_at)
        .num_minutes();
    let hints_available =
        (clue_meta.hint_unlock_after_minutes as i64 <= elapsed || sc.attempts >= 3) as i32;

    Ok(SessionStatus {
        session,
        current_clue_index: sc.hints_used,
        total_clues: total,
        hints_available,
        elapsed_minutes: elapsed,
    })
}

async fn fetch_session(db: &PgPool, session_id: Uuid, player_id: Uuid) -> Result<Session> {
    sqlx::query_as!(
        Session,
        "SELECT * FROM sessions WHERE id = $1 AND player_id = $2",
        session_id,
        player_id,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("session not found".into()))
}
