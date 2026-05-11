use std::{sync::Arc, time::Instant};
use std::collections::HashMap;

use anyhow::Context;
use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts},
    http::{header, request::Parts},
};
use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
use serde::Deserialize;
use sqlx::PgPool;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    state::AppState,
};

// ── Public extractor ──────────────────────────────────────────

pub struct AuthUser {
    pub id: Uuid,
    pub role: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self> {
        let app = AppState::from_ref(state);
        let token = bearer_token(parts)?;
        let claims = app
            .jwks
            .validate(&token)
            .await
            .map_err(|e| { tracing::warn!("JWT validation failed: {e:#}"); AppError::Unauthorized })?;
        let player = resolve_player(&app.db, &claims).await?;
        Ok(AuthUser {
            id: player.id,
            role: player.role,
        })
    }
}

// ── JWKS cache ────────────────────────────────────────────────

#[derive(Clone)]
pub struct JwksCache {
    issuer: String,
    jwks_url: String,
    http: reqwest::Client,
    inner: Arc<RwLock<Inner>>,
}

struct Inner {
    keys: Vec<RawJwk>,
    fetched_at: Option<Instant>,
}

#[derive(Clone, Deserialize)]
struct RawJwk {
    kid: Option<String>,
    kty: String,
    n: Option<String>, // RSA
    e: Option<String>, // RSA
    x: Option<String>, // EC
    y: Option<String>, // EC
}

#[derive(Deserialize)]
struct RawJwks {
    keys: Vec<RawJwk>,
}

#[derive(Deserialize)]
struct OidcDiscovery {
    jwks_uri: String,
}

impl JwksCache {
    pub fn new(issuer: impl Into<String>, jwks_url_override: Option<String>) -> Self {
        let issuer = issuer.into();
        // Allow internal Docker URL override for JWKS fetching while keeping
        // the public issuer for claim validation.
        let jwks_url = jwks_url_override
            .filter(|s| !s.is_empty())
            .unwrap_or_else(|| format!("{issuer}/keys"));
        Self {
            issuer,
            jwks_url,
            http: reqwest::Client::new(),
            inner: Arc::new(RwLock::new(Inner {
                keys: vec![],
                fetched_at: None,
            })),
        }
    }

    async fn refresh(&self) -> anyhow::Result<()> {
        let raw: RawJwks = match self
            .http
            .get(&self.jwks_url)
            .send()
            .await
            .and_then(|r| r.error_for_status())
        {
            Ok(resp) => resp.json().await?,
            Err(_) => {
                // Fall back to OIDC discovery doc
                let disc: OidcDiscovery = self
                    .http
                    .get(format!("{}/.well-known/openid-configuration", self.issuer))
                    .send()
                    .await?
                    .json()
                    .await?;
                self.http.get(&disc.jwks_uri).send().await?.json().await?
            }
        };

        let mut guard = self.inner.write().await;
        guard.keys = raw.keys;
        guard.fetched_at = Some(Instant::now());
        Ok(())
    }

    async fn keys(&self) -> anyhow::Result<Vec<RawJwk>> {
        let stale = {
            let g = self.inner.read().await;
            g.fetched_at.map_or(true, |t| t.elapsed().as_secs() > 300)
        };
        if stale {
            self.refresh().await.context("JWKS refresh failed")?;
        }
        Ok(self.inner.read().await.keys.clone())
    }

    pub async fn validate(&self, token: &str) -> anyhow::Result<OidcClaims> {
        let header = decode_header(token).context("invalid token header")?;
        let kid = header.kid.as_deref().unwrap_or("");

        let keys = self.keys().await?;
        let jwk = keys
            .iter()
            .find(|k| k.kid.as_deref().unwrap_or("") == kid || keys.len() == 1)
            .context("no matching key")?;

        let decoding_key = match jwk.kty.as_str() {
            "RSA" => DecodingKey::from_rsa_components(
                jwk.n.as_deref().context("missing n")?,
                jwk.e.as_deref().context("missing e")?,
            )?,
            "EC" => DecodingKey::from_ec_components(
                jwk.x.as_deref().context("missing x")?,
                jwk.y.as_deref().context("missing y")?,
            )?,
            kty => anyhow::bail!("unsupported key type: {kty}"),
        };

        let algo = match header.alg {
            jsonwebtoken::Algorithm::RS256 => Algorithm::RS256,
            jsonwebtoken::Algorithm::ES256 => Algorithm::ES256,
            other => anyhow::bail!("unsupported algorithm: {:?}", other),
        };

        let mut val = Validation::new(algo);
        val.set_issuer(&[&self.issuer]);
        val.validate_aud = false; // resource server skips aud check

        Ok(decode::<OidcClaims>(token, &decoding_key, &val)?.claims)
    }
}

// ── OIDC claims ───────────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct OidcClaims {
    pub sub: String,
    pub email: Option<String>,
    pub name: Option<String>,
    // Groups-based role used by some OIDC providers.
    pub groups: Option<Vec<String>>,
    // Zitadel project roles: { "role-key": { "orgDomain": "..." } }
    #[serde(rename = "urn:zitadel:iam:org:project:roles", default)]
    pub zitadel_roles: Option<HashMap<String, serde_json::Value>>,
}

// ── Player resolution ─────────────────────────────────────────

struct ResolvedPlayer {
    id: Uuid,
    role: String,
}

async fn resolve_player(db: &PgPool, claims: &OidcClaims) -> Result<ResolvedPlayer> {
    // Look up existing player
    if let Some(row) = sqlx::query!(
        "SELECT id, role FROM players WHERE external_id = $1",
        claims.sub,
    )
    .fetch_optional(db)
    .await?
    {
        return Ok(ResolvedPlayer {
            id: row.id,
            role: row.role,
        });
    }

    // First login — create player
    let role = infer_role(&claims);
    let display_name = claims
        .name
        .clone()
        .or_else(|| {
            claims
                .email
                .as_ref()
                .map(|e| e.split('@').next().unwrap_or(e).to_owned())
        })
        .unwrap_or_else(|| "Player".into());

    let row = sqlx::query!(
        "INSERT INTO players (display_name, email, external_id, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, role",
        display_name,
        claims.email,
        claims.sub,
        role,
    )
    .fetch_one(db)
    .await?;

    Ok(ResolvedPlayer {
        id: row.id,
        role: row.role,
    })
}

fn infer_role(claims: &OidcClaims) -> String {
    // 1. Zitadel project roles: { "creator": {...}, "observer": {...} }
    if let Some(roles) = &claims.zitadel_roles {
        if roles.contains_key("creator")  { return "creator".into(); }
        if roles.contains_key("observer") { return "observer".into(); }
        if roles.contains_key("player")   { return "player".into(); }
    }
    // 2. Generic groups claim fallback.
    if let Some(groups) = &claims.groups {
        if groups.iter().any(|g| g == "creators")  { return "creator".into(); }
        if groups.iter().any(|g| g == "observers") { return "observer".into(); }
        return "player".into();
    }
    // 3. Email-based fallback — works for Zitadel dev accounts out of the box
    match claims.email.as_deref() {
        Some(e) if e.starts_with("creator")  => "creator".into(),
        Some(e) if e.starts_with("observer") => "observer".into(),
        _ => "player".into(),
    }
}

// ── Token extraction ──────────────────────────────────────────

// WebSocket upgrades cannot carry an Authorization header (browser limitation),
// so we accept the token as a ?token= query parameter as a fallback.
fn bearer_token(parts: &Parts) -> Result<String> {
    // 1. Standard Authorization header
    if let Some(tok) = parts
        .headers
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "))
    {
        return Ok(tok.to_owned());
    }

    // 2. Query-parameter fallback (?token=<jwt>)
    if let Some(query) = parts.uri.query() {
        for pair in query.split('&') {
            if let Some(val) = pair.strip_prefix("token=") {
                if !val.is_empty() {
                    // Percent-decode the value
                    let decoded = percent_decode(val);
                    return Ok(decoded);
                }
            }
        }
    }

    Err(AppError::Unauthorized)
}

fn percent_decode(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '%' {
            let h1 = chars.next().and_then(|c| c.to_digit(16));
            let h2 = chars.next().and_then(|c| c.to_digit(16));
            if let (Some(h1), Some(h2)) = (h1, h2) {
                out.push(char::from(((h1 << 4) | h2) as u8));
                continue;
            }
        }
        out.push(c);
    }
    out
}
