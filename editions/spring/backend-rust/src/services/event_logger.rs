use chrono::Utc;
use serde_json::Value;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{error::Result, models::event::WsEvent, services::ws_broadcaster::WsBroadcaster};

pub struct EventLogger<'a> {
    db: &'a PgPool,
    broadcaster: &'a WsBroadcaster,
}

impl<'a> EventLogger<'a> {
    pub fn new(db: &'a PgPool, broadcaster: &'a WsBroadcaster) -> Self {
        Self { db, broadcaster }
    }

    pub async fn log(
        &self,
        session_id: Uuid,
        hunt_id: Uuid,
        clue_id: Option<Uuid>,
        event_type: &str,
        payload: Value,
    ) -> Result<()> {
        sqlx::query!(
            "INSERT INTO events (session_id, clue_id, event_type, payload)
             VALUES ($1, $2, $3, $4)",
            session_id,
            clue_id,
            event_type,
            payload,
        )
        .execute(self.db)
        .await?;

        self.broadcaster.broadcast(
            hunt_id,
            WsEvent {
                hunt_id,
                session_id,
                event_type: event_type.to_owned(),
                payload: payload.clone(),
                ts: Utc::now(),
            },
        );

        Ok(())
    }
}
