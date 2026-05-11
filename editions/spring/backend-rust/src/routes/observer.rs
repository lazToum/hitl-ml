use axum::{
    extract::{
        ws::{Message, WebSocket},
        Path, State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use futures::{SinkExt, StreamExt};
use serde_json::json;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    middleware::AuthUser,
    models::event::types,
    services::event_logger::EventLogger,
    state::AppState,
};

fn is_staff(role: &str) -> bool {
    role == "observer" || role == "creator"
}

async fn can_access_hunt(state: &AppState, auth: &AuthUser, hunt_id: Uuid) -> Result<bool> {
    let (creator_id, status) = sqlx::query_as::<_, (Uuid, String)>(
        "SELECT creator_id, status FROM hunts WHERE id = $1"
    )
    .bind(hunt_id)
    .fetch_one(&state.db)
    .await
    .map_err(|_| AppError::NotFound("hunt not found".into()))?;

    if auth.role == "observer" {
        // Observers can watch active hunts only; draft/archived are off-limits.
        return Ok(status == "active");
    }

    if auth.role != "creator" {
        return Ok(false);
    }

    Ok(creator_id == auth.id)
}

async fn hunt_for_session(state: &AppState, session_id: Uuid) -> Result<Uuid> {
    sqlx::query_scalar::<_, Uuid>("SELECT hunt_id FROM sessions WHERE id = $1")
        .bind(session_id)
        .fetch_one(&state.db)
        .await
        .map_err(|_| AppError::NotFound("session not found".into()))
}

/// WebSocket: observer subscribes to live events for a hunt.
/// GET /hunts/:id/observe  (Upgrade: websocket)
pub async fn observe(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(hunt_id): Path<Uuid>,
    ws: WebSocketUpgrade,
) -> impl IntoResponse {
    if !is_staff(&auth.role) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match can_access_hunt(&state, &auth, hunt_id).await {
        Ok(true) => {}
        Ok(false) => return StatusCode::FORBIDDEN.into_response(),
        Err(e) => return e.into_response(),
    }
    ws.on_upgrade(move |socket| handle_ws(socket, state, hunt_id))
        .into_response()
}

async fn handle_ws(socket: WebSocket, state: AppState, hunt_id: Uuid) {
    let mut rx = state.broadcaster.subscribe(hunt_id);
    let (mut sender, mut receiver) = socket.split();

    let send_task = tokio::spawn(async move {
        while let Ok(event) = rx.recv().await {
            let msg = match serde_json::to_string(&event) {
                Ok(s) => Message::Text(s),
                Err(_) => continue,
            };
            if sender.send(msg).await.is_err() {
                break;
            }
        }
    });

    let recv_task = tokio::spawn(async move { while let Some(Ok(_)) = receiver.next().await {} });

    tokio::select! { _ = send_task => {} _ = recv_task => {} }
}

/// POST /sessions/:id/nudge — observer pushes a message to a player session
pub async fn nudge(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(session_id): Path<Uuid>,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>> {
    if !is_staff(&auth.role) {
        return Err(AppError::Forbidden);
    }

    let hunt_id = hunt_for_session(&state, session_id).await?;
    if !can_access_hunt(&state, &auth, hunt_id).await? {
        return Err(AppError::Forbidden);
    }

    let message = body["message"].as_str().unwrap_or("").to_owned();
    if message.is_empty() {
        return Err(AppError::BadRequest("message is required".into()));
    }

    let logger = EventLogger::new(&state.db, &state.broadcaster);
    logger
        .log(
            session_id,
            hunt_id,
            None,
            types::OBSERVER_NUDGE,
            json!({ "message": message, "sent_by": auth.id }),
        )
        .await?;

    Ok(Json(json!({ "sent": true })))
}

/// GET /hunts/:id/sessions — all sessions for a hunt (observer/creator only)
pub async fn list_sessions(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(hunt_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    if !is_staff(&auth.role) {
        return Err(AppError::Forbidden);
    }
    if !can_access_hunt(&state, &auth, hunt_id).await? {
        return Err(AppError::Forbidden);
    }

    let sessions = sqlx::query!(
        r#"SELECT s.id, s.player_id, s.team_id, s.current_clue_sequence,
                  s.started_at, s.completed_at, p.display_name,
                  (SELECT COUNT(*) FROM clues WHERE hunt_id = s.hunt_id) AS "total_clues!"
           FROM sessions s
           JOIN players p ON p.id = s.player_id
           WHERE s.hunt_id = $1
           ORDER BY s.started_at"#,
        hunt_id,
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(json!({ "sessions": sessions.iter().map(|s| json!({
        "id":            s.id,
        "player":        s.display_name,
        "current_clue":  s.current_clue_sequence,
        "total_clues":   s.total_clues,
        "started_at":    s.started_at,
        "completed_at":  s.completed_at,
    })).collect::<Vec<_>>() })))
}
