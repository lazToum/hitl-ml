use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Player {
    pub id: Uuid,
    pub display_name: String,
    pub email: Option<String>,
    pub anon_token: Option<String>,
    pub external_id: Option<String>, // OIDC subject ID
    pub role: String,
    pub created_at: DateTime<Utc>,
}

/// Public-facing player view (no internal tokens)
#[derive(Debug, Serialize)]
pub struct PlayerView {
    pub id: Uuid,
    pub display_name: String,
    pub role: String,
}

impl From<Player> for PlayerView {
    fn from(p: Player) -> Self {
        Self {
            id: p.id,
            display_name: p.display_name,
            role: p.role,
        }
    }
}
