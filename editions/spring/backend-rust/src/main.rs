mod config;
mod db;
mod error;
mod middleware;
mod models;
mod routes;
mod services;
mod state;

use std::net::SocketAddr;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "treasure_hunt=debug,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = config::Config::from_env()?;
    let pool   = db::connect(&config.database_url).await?;

    let redis = match redis::Client::open(config.redis_url.clone()) {
        Ok(client) => match redis::aio::ConnectionManager::new(client).await {
            Ok(mgr) => {
                tracing::info!("Redis connected at {}", config.redis_url);
                Some(mgr)
            }
            Err(e) => {
                tracing::warn!("Redis unavailable ({e}) — rate limiting disabled");
                None
            }
        },
        Err(e) => {
            tracing::warn!("Invalid Redis URL ({e}) — rate limiting disabled");
            None
        }
    };

    let port  = config.port;
    let state = state::AppState::new(pool, config, redis);

    let app = routes::router(state)
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
