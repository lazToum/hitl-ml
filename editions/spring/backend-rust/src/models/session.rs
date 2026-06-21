use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Session {
    pub id: Uuid,
    pub hunt_id: Uuid,
    pub player_id: Uuid,
    pub team_id: Option<Uuid>,
    pub current_clue_sequence: i32,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct SessionClue {
    pub id: Uuid,
    pub session_id: Uuid,
    pub clue_id: Uuid,
    pub unlocked_at: DateTime<Utc>,
    pub solved_at: Option<DateTime<Utc>>,
    pub attempts: i32,
    pub hints_used: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Team {
    pub id: Uuid,
    pub hunt_id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct StartSession {
    pub hunt_id: Uuid,
    pub team_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct ValidationResponse {
    pub passed: bool,
    pub score: f64,
    pub feedback: String,
    pub next_clue: Option<ClueProgress>,
    pub hunt_complete: bool,
}

#[derive(Debug, Serialize)]
pub struct ClueProgress {
    pub sequence: i32,
    pub title: String,
}

#[derive(Debug, Serialize)]
pub struct SessionStatus {
    pub session: Session,
    pub current_clue_index: i32,
    pub total_clues: i64,
    pub hints_available: i32,
    pub elapsed_minutes: i64,
}
