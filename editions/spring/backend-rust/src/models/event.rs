use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Event {
    pub id: Uuid,
    pub session_id: Uuid,
    pub clue_id: Option<Uuid>,
    pub event_type: String,
    pub payload: Option<Value>,
    pub ts: DateTime<Utc>,
}

/// All event type strings — kept as constants so they're never mistyped
pub mod types {
    pub const CLUE_VIEWED: &str = "clue_viewed";
    pub const ANSWER_ATTEMPTED: &str = "answer_attempted";
    pub const ANSWER_CORRECT: &str = "answer_correct";
    pub const HINT_REQUESTED: &str = "hint_requested";
    pub const HINT_VIEWED: &str = "hint_viewed";
    pub const OBSERVER_NUDGE: &str = "observer_nudge";
    pub const LOCATION_CHECKED: &str = "location_checked";
    pub const QR_SCANNED: &str = "qr_scanned";
    pub const NFC_TAPPED: &str = "nfc_tapped";
    pub const SESSION_STARTED: &str = "session_started";
    pub const SESSION_COMPLETED: &str = "session_completed";
}

/// Observer WebSocket broadcast envelope
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsEvent {
    pub hunt_id: Uuid,
    pub session_id: Uuid,
    pub event_type: String,
    pub payload: Value,
    pub ts: DateTime<Utc>,
}
