use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    middleware::AuthUser,
    models::event::types,
    services::event_logger::EventLogger,
    state::AppState,
};

#[derive(Deserialize)]
pub struct ScanQuery {
    pub session_id: Option<Uuid>,
    pub source: Option<String>, // "qr" | "nfc"
}

/// Universal endpoint encoded into every QR code and NFC tag.
pub async fn scan(
    _auth: AuthUser,
    State(state): State<AppState>,
    Path(token): Path<String>,
    Query(q): Query<ScanQuery>,
) -> Result<Json<serde_json::Value>> {
    let row = sqlx::query!(
        r#"SELECT ct.clue_id, c.hunt_id, c.sequence, c.title
           FROM clue_tokens ct
           JOIN clues c ON c.id = ct.clue_id
           WHERE ct.token = $1"#,
        token,
    )
    .fetch_one(&state.db)
    .await
    .map_err(|_| AppError::NotFound("unknown token".into()))?;

    if let Some(session_id) = q.session_id {
        let source = q.source.as_deref().unwrap_or("qr");
        let event_type = if source == "nfc" {
            types::NFC_TAPPED
        } else {
            types::QR_SCANNED
        };
        let logger = EventLogger::new(&state.db, &state.broadcaster);
        logger
            .log(
                session_id,
                row.hunt_id,
                Some(row.clue_id),
                event_type,
                json!({ "token": token }),
            )
            .await?;
    }

    Ok(Json(json!({
        "clue_id":  row.clue_id,
        "hunt_id":  row.hunt_id,
        "sequence": row.sequence,
        "title":    row.title,
    })))
}
