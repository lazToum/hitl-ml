use std::{collections::HashMap, sync::Mutex};
use tokio::sync::broadcast;
use uuid::Uuid;

use crate::models::event::WsEvent;

const CHANNEL_CAPACITY: usize = 128;

/// Maintains one broadcast channel per active hunt.
/// Observers subscribe; event logger publishes.
pub struct WsBroadcaster {
    channels: Mutex<HashMap<Uuid, broadcast::Sender<WsEvent>>>,
}

impl WsBroadcaster {
    pub fn new() -> Self {
        Self {
            channels: Mutex::new(HashMap::new()),
        }
    }

    /// Subscribe to events for a hunt. Creates the channel if it doesn't exist yet.
    pub fn subscribe(&self, hunt_id: Uuid) -> broadcast::Receiver<WsEvent> {
        let mut map = self.channels.lock().unwrap();
        map.entry(hunt_id)
            .or_insert_with(|| broadcast::channel(CHANNEL_CAPACITY).0)
            .subscribe()
    }

    /// Publish an event to all observers watching a hunt.
    /// Silently drops if no observers are connected.
    pub fn broadcast(&self, hunt_id: Uuid, event: WsEvent) {
        let map = self.channels.lock().unwrap();
        if let Some(tx) = map.get(&hunt_id) {
            let _ = tx.send(event); // receivers may have lagged — that's fine
        }
    }

    /// Remove a channel when a hunt ends (optional cleanup).
    pub fn close(&self, hunt_id: Uuid) {
        self.channels.lock().unwrap().remove(&hunt_id);
    }
}

impl Default for WsBroadcaster {
    fn default() -> Self {
        Self::new()
    }
}
