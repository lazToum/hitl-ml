use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Clue {
    pub id: Uuid,
    pub hunt_id: Uuid,
    pub sequence: i32,
    pub title: String,
    pub body: String,
    pub media_url: Option<String>,
    pub answer_type: String,
    // Never included when Clue is serialized to JSON — use ClueCreatorView for creator endpoints.
    #[serde(skip_serializing)]
    pub answer_value: String,
    pub answer_tolerance: f64,
    pub hint_unlock_after_minutes: i32,
    pub hint_unlock_after_attempts: i32,
    pub created_at: DateTime<Utc>,
}

/// Full clue data for creator-authenticated endpoints — includes answer_value.
#[derive(Debug, Serialize)]
pub struct ClueCreatorView {
    pub id: Uuid,
    pub hunt_id: Uuid,
    pub sequence: i32,
    pub title: String,
    pub body: String,
    pub media_url: Option<String>,
    pub answer_type: String,
    pub answer_value: String,
    pub answer_tolerance: f64,
    pub hint_unlock_after_minutes: i32,
    pub hint_unlock_after_attempts: i32,
    pub created_at: DateTime<Utc>,
}

impl From<Clue> for ClueCreatorView {
    fn from(c: Clue) -> Self {
        Self {
            id: c.id,
            hunt_id: c.hunt_id,
            sequence: c.sequence,
            title: c.title,
            body: c.body,
            media_url: c.media_url,
            answer_type: c.answer_type,
            answer_value: c.answer_value,
            answer_tolerance: c.answer_tolerance,
            hint_unlock_after_minutes: c.hint_unlock_after_minutes,
            hint_unlock_after_attempts: c.hint_unlock_after_attempts,
            created_at: c.created_at,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Hint {
    pub id: Uuid,
    pub clue_id: Uuid,
    pub sequence: i32,
    pub body: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ClueToken {
    pub token: String,
    pub clue_id: Uuid,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateClue {
    pub sequence: i32,
    pub title: String,
    pub body: String,
    pub media_url: Option<String>,
    pub answer_type: String,
    pub answer_value: String,
    pub answer_tolerance: Option<f64>,
    pub hint_unlock_after_minutes: Option<i32>,
    pub hint_unlock_after_attempts: Option<i32>,
    pub hints: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct AnswerSubmission {
    pub value: String,
    pub lat: Option<f64>,
    pub lon: Option<f64>,
    pub photo_b64: Option<String>,
}

/// What the player sees — answer_value is never exposed
#[derive(Debug, Serialize)]
pub struct ClueView {
    pub id: Uuid,
    pub sequence: i32,
    pub title: String,
    pub body: String,
    pub media_url: Option<String>,
    pub answer_type: String,
    pub hints: Vec<HintView>,
}

#[derive(Debug, Serialize)]
pub struct HintView {
    pub sequence: i32,
    pub body: String,
}
