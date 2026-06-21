use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub redis_url: String,
    pub ai_service_url: String,
    pub oidc_issuer: String,
    /// Internal override for JWKS URL (Docker networking).
    /// Defaults to `{oidc_issuer}/keys` when empty.
    pub oidc_jwks_url: Option<String>,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        dotenvy::dotenv().ok();
        Ok(Self {
            database_url: require("DATABASE_URL")?,
            redis_url: require("REDIS_URL")?,
            ai_service_url: env::var("AI_SERVICE_URL")
                .unwrap_or_else(|_| "http://localhost:8001".into()),
            oidc_issuer: require("OIDC_ISSUER")?,
            oidc_jwks_url: env::var("OIDC_JWKS_URL").ok().filter(|s| !s.is_empty()),
            port: env::var("PORT").unwrap_or_else(|_| "8080".into()).parse()?,
        })
    }
}

fn require(key: &str) -> anyhow::Result<String> {
    env::var(key).map_err(|_| anyhow::anyhow!("missing env var: {key}"))
}
