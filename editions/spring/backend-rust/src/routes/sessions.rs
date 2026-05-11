use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    middleware::AuthUser,
    models::{
        clue::AnswerSubmission,
        event::types,
        session::{SessionStatus, StartSession, ValidationResponse},
    },
    services::{clue_validator, event_logger::EventLogger, hint_engine, session_manager},
    state::AppState,
};

pub async fn start(
    auth: AuthUser,
    State(state): State<AppState>,
    Json(req): Json<StartSession>,
) -> Result<Json<serde_json::Value>> {
    let session = session_manager::start(&state.db, auth.id, req).await?;
    let logger  = EventLogger::new(&state.db, &state.broadcaster);
    logger.log(session.id, session.hunt_id, None, types::SESSION_STARTED, json!({})).await?;
    Ok(Json(json!({ "session": session })))
}

pub async fn status(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<SessionStatus>> {
    session_manager::status(&state.db, id, auth.id).await.map(Json)
}

pub async fn current_clue(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let clue    = session_manager::current_clue(&state.db, id, auth.id).await?;
    let hunt_id = fetch_hunt_id(&state, id, auth.id).await?;
    EventLogger::new(&state.db, &state.broadcaster)
        .log(id, hunt_id, Some(clue.id), types::CLUE_VIEWED, json!({ "sequence": clue.sequence }))
        .await?;
    Ok(Json(json!({ "clue": clue })))
}

pub async fn submit_answer(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<AnswerSubmission>,
) -> Result<Json<ValidationResponse>> {
    let clue_view = session_manager::current_clue(&state.db, id, auth.id).await?;

    // Rate limit: max 10 answer attempts per player per clue per minute
    if let Some(redis) = &state.redis {
        let key        = format!("rate:answer:{}:{}", auth.id, clue_view.id);
        let mut conn   = redis.clone();
        let count: i64 = redis::cmd("INCR").arg(&key).query_async(&mut conn).await.unwrap_or(0);
        if count == 1 {
            let _ = redis::cmd("EXPIRE").arg(&key).arg(60i64)
                .query_async::<_, ()>(&mut conn).await;
        }
        if count > 10 {
            return Err(AppError::BadRequest("too many attempts — try again in a minute".into()));
        }
    }

    let clue = sqlx::query_as!(
        crate::models::clue::Clue,
        "SELECT * FROM clues WHERE id = $1",
        clue_view.id,
    )
    .fetch_one(&state.db)
    .await?;

    let attempts = session_manager::increment_attempts(&state.db, id, clue.id).await?;
    let result   = clue_validator::validate(&clue, &req, Some(&state.ai)).await?;

    let hunt_id = fetch_hunt_id(&state, id, auth.id).await?;
    let logger  = EventLogger::new(&state.db, &state.broadcaster);
    logger.log(id, hunt_id, Some(clue.id), types::ANSWER_ATTEMPTED,
        json!({ "value": req.value, "score": result.score, "passed": result.passed, "attempts": attempts }),
    ).await?;

    if result.passed {
        logger.log(id, hunt_id, Some(clue.id), types::ANSWER_CORRECT, json!({})).await?;
        let next         = session_manager::advance(&state.db, id, clue.id).await?;
        let hunt_complete = next.is_none();
        if hunt_complete {
            logger.log(id, hunt_id, None, types::SESSION_COMPLETED, json!({})).await?;
        }
        return Ok(Json(ValidationResponse {
            passed: true,
            score: result.score,
            feedback: result.feedback.as_str().into(),
            next_clue: next.map(|c| crate::models::session::ClueProgress {
                sequence: c.sequence,
                title: c.title,
            }),
            hunt_complete,
        }));
    }

    Ok(Json(ValidationResponse {
        passed: false,
        score: result.score,
        feedback: result.feedback.as_str().into(),
        next_clue: None,
        hunt_complete: false,
    }))
}

pub async fn request_hint(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let clue_view = session_manager::current_clue(&state.db, id, auth.id).await?;
    let hunt_id   = fetch_hunt_id(&state, id, auth.id).await?;
    let logger    = EventLogger::new(&state.db, &state.broadcaster);

    match hint_engine::request_hint(&state.db, id, clue_view.id).await {
        Ok(hint) => {
            logger.log(id, hunt_id, Some(clue_view.id), types::HINT_REQUESTED,
                json!({ "sequence": hint.sequence, "source": "static" })).await?;
            Ok(Json(json!({ "hint": hint, "source": "static" })))
        }

        // All static hints exhausted — try AI adaptive hint
        Err(AppError::NotFound(_)) => {
            let clue = sqlx::query_as!(
                crate::models::clue::Clue,
                "SELECT * FROM clues WHERE id = $1",
                clue_view.id,
            )
            .fetch_one(&state.db)
            .await?;

            match state.ai.adaptive_hint(&clue.body, &clue.answer_value, &[]).await {
                Ok(text) => {
                    logger.log(id, hunt_id, Some(clue_view.id), types::HINT_REQUESTED,
                        json!({ "source": "adaptive" })).await?;
                    Ok(Json(json!({
                        "hint":   { "body": text, "sequence": -1 },
                        "source": "adaptive",
                    })))
                }
                Err(_) => Err(AppError::NotFound("no more hints available".into())),
            }
        }

        Err(e) => Err(e),
    }
}

/// GET /sessions/:id/analysis — AI summary of a completed session (staff only)
pub async fn analyze_session(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    if auth.role != "creator" && auth.role != "observer" {
        return Err(AppError::Forbidden);
    }

    let (hunt_creator_id, hunt_status) = sqlx::query_as::<_, (Uuid, String)>(
        "SELECT h.creator_id, h.status FROM sessions s JOIN hunts h ON h.id = s.hunt_id WHERE s.id = $1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map_err(|_| AppError::NotFound("session not found".into()))?;

    if auth.role == "creator" && hunt_creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    if auth.role == "observer" && hunt_status != "active" {
        return Err(AppError::Forbidden);
    }

    let events = sqlx::query!(
        "SELECT id, event_type, payload, ts FROM events WHERE session_id = $1 ORDER BY ts",
        id,
    )
    .fetch_all(&state.db)
    .await?;

    if events.is_empty() {
        return Err(AppError::NotFound("no events found for this session".into()));
    }

    let events_json: serde_json::Value = events
        .iter()
        .map(|e| json!({
            "id":         e.id,
            "event_type": e.event_type,
            "payload":    e.payload,
            "ts":         e.ts,
        }))
        .collect::<Vec<_>>()
        .into();

    let report = state.ai.analyze_session(id, &events_json).await
        .map_err(|e| AppError::Internal(e))?;

    Ok(Json(json!({ "session_id": id, "report": report })))
}

async fn fetch_hunt_id(state: &AppState, session_id: Uuid, player_id: Uuid) -> Result<Uuid> {
    let row = sqlx::query!(
        "SELECT hunt_id FROM sessions WHERE id = $1 AND player_id = $2",
        session_id,
        player_id,
    )
    .fetch_one(&state.db)
    .await?;
    Ok(row.hunt_id)
}
