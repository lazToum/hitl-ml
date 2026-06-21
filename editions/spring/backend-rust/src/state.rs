use std::sync::Arc;

use redis::aio::ConnectionManager;
use sqlx::PgPool;

use crate::{
    config::Config,
    middleware::JwksCache,
    services::{ai_client::AiClient, ws_broadcaster::WsBroadcaster},
};

#[derive(Clone)]
pub struct AppState {
    pub db:          PgPool,
    pub config:      Arc<Config>,
    pub jwks:        Arc<JwksCache>,
    pub broadcaster: Arc<WsBroadcaster>,
    pub ai:          Arc<AiClient>,
    /// None when Redis is unreachable at startup — rate limiting is skipped.
    pub redis:       Option<ConnectionManager>,
}

impl AppState {
    pub fn new(db: PgPool, config: Config, redis: Option<ConnectionManager>) -> Self {
        let jwks = Arc::new(JwksCache::new(
            config.oidc_issuer.clone(),
            config.oidc_jwks_url.clone(),
        ));
        let ai = Arc::new(AiClient::new(config.ai_service_url.clone()));
        Self {
            db,
            jwks,
            ai,
            redis,
            config:      Arc::new(config),
            broadcaster: Arc::new(WsBroadcaster::new()),
        }
    }
}
