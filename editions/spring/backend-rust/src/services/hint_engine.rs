use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    models::{
        clue::{Hint, HintView},
        session::SessionClue,
    },
};

/// Returns the next unlocked hint for a session clue, or an error if none are available.
pub async fn request_hint(db: &PgPool, session_id: Uuid, clue_id: Uuid) -> Result<HintView> {
    let sc = fetch_session_clue(db, session_id, clue_id).await?;
    let clue = fetch_clue_meta(db, clue_id).await?;
    let total_hints = count_hints(db, clue_id).await?;

    if total_hints == 0 {
        return Err(AppError::NotFound("no hints for this clue".into()));
    }

    let next_sequence = sc.hints_used + 1;

    // Check unlock eligibility
    if !hint_unlocked(&sc, &clue, next_sequence) {
        return Err(AppError::BadRequest(
            "hint not yet available — keep trying or wait a bit".into(),
        ));
    }

    if next_sequence > total_hints as i32 {
        return Err(AppError::NotFound("no more hints available".into()));
    }

    // Fetch and record
    let hint = sqlx::query_as!(
        Hint,
        "SELECT id, clue_id, sequence, body
         FROM hints
         WHERE clue_id = $1 AND sequence = $2",
        clue_id,
        next_sequence,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("hint not found".into()))?;

    sqlx::query!(
        "UPDATE session_clues SET hints_used = $1 WHERE session_id = $2 AND clue_id = $3",
        next_sequence,
        session_id,
        clue_id,
    )
    .execute(db)
    .await?;

    Ok(HintView {
        sequence: hint.sequence,
        body: hint.body,
    })
}

/// Returns all hints unlocked so far for a session clue (for display on revisit)
pub async fn unlocked_hints(db: &PgPool, session_id: Uuid, clue_id: Uuid) -> Result<Vec<HintView>> {
    let sc = fetch_session_clue(db, session_id, clue_id).await?;

    let hints = sqlx::query_as!(
        Hint,
        "SELECT id, clue_id, sequence, body
         FROM hints
         WHERE clue_id = $1 AND sequence <= $2
         ORDER BY sequence",
        clue_id,
        sc.hints_used,
    )
    .fetch_all(db)
    .await?;

    Ok(hints
        .into_iter()
        .map(|h| HintView {
            sequence: h.sequence,
            body: h.body,
        })
        .collect())
}

// ── Internal helpers ──────────────────────────────────────────

struct ClueMeta {
    hint_unlock_after_minutes: i32,
    hint_unlock_after_attempts: i32,
}

async fn fetch_session_clue(db: &PgPool, session_id: Uuid, clue_id: Uuid) -> Result<SessionClue> {
    sqlx::query_as!(
        SessionClue,
        "SELECT id, session_id, clue_id, unlocked_at, solved_at, attempts, hints_used
         FROM session_clues
         WHERE session_id = $1 AND clue_id = $2",
        session_id,
        clue_id,
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("session clue not found".into()))
}

async fn fetch_clue_meta(db: &PgPool, clue_id: Uuid) -> Result<ClueMeta> {
    let row = sqlx::query!(
        "SELECT hint_unlock_after_minutes, hint_unlock_after_attempts FROM clues WHERE id = $1",
        clue_id
    )
    .fetch_one(db)
    .await
    .map_err(|_| AppError::NotFound("clue not found".into()))?;

    Ok(ClueMeta {
        hint_unlock_after_minutes: row.hint_unlock_after_minutes,
        hint_unlock_after_attempts: row.hint_unlock_after_attempts,
    })
}

async fn count_hints(db: &PgPool, clue_id: Uuid) -> Result<i64> {
    let row = sqlx::query!(
        "SELECT COUNT(*) as n FROM hints WHERE clue_id = $1",
        clue_id
    )
    .fetch_one(db)
    .await?;
    Ok(row.n.unwrap_or(0))
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;

    fn meta(minutes: i32, attempts: i32) -> ClueMeta {
        ClueMeta { hint_unlock_after_minutes: minutes, hint_unlock_after_attempts: attempts }
    }

    fn sc(elapsed_secs: i64, attempts: i32, hints_used: i32) -> SessionClue {
        SessionClue {
            id:          uuid::Uuid::nil(),
            session_id:  uuid::Uuid::nil(),
            clue_id:     uuid::Uuid::nil(),
            unlocked_at: Utc::now() - chrono::Duration::seconds(elapsed_secs),
            solved_at:   None,
            attempts,
            hints_used,
        }
    }

    #[test]
    fn first_hint_unlocks_after_time() {
        let clue = meta(5, 10);  // unlock after 5 min or 10 attempts
        // 6 minutes elapsed, 0 attempts → should unlock
        assert!(hint_unlocked(&sc(360, 0, 0), &clue, 1));
    }

    #[test]
    fn first_hint_unlocks_after_attempts() {
        let clue = meta(30, 3);  // unlock after 30 min or 3 attempts
        // 10 seconds elapsed, 3 attempts → should unlock
        assert!(hint_unlocked(&sc(10, 3, 0), &clue, 1));
    }

    #[test]
    fn first_hint_not_yet_available() {
        let clue = meta(5, 3);
        // 1 minute elapsed, 1 attempt — neither threshold met
        assert!(!hint_unlocked(&sc(60, 1, 0), &clue, 1));
    }

    #[test]
    fn subsequent_hints_always_available() {
        let clue = meta(999, 999);  // impossible thresholds
        // hint 2 and beyond are always available once hint 1 was used
        assert!(hint_unlocked(&sc(0, 0, 1), &clue, 2));
        assert!(hint_unlocked(&sc(0, 0, 2), &clue, 3));
    }

    #[test]
    fn threshold_of_zero_always_unlocks() {
        let clue = meta(0, 0);
        assert!(hint_unlocked(&sc(0, 0, 0), &clue, 1));
    }
}

fn hint_unlocked(sc: &SessionClue, clue: &ClueMeta, next_sequence: i32) -> bool {
    // First hint: check time or attempts threshold
    if next_sequence == 1 {
        let elapsed = Utc::now()
            .signed_duration_since(sc.unlocked_at)
            .num_minutes();
        return elapsed >= clue.hint_unlock_after_minutes as i64
            || sc.attempts >= clue.hint_unlock_after_attempts;
    }
    // Subsequent hints: already used the previous one
    true
}
