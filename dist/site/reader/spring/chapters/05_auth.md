# Identity in the Loop: OIDC and Roles

```{epigraph}
Identity is not a property of a person. It is a claim made by a system about a person, which other systems choose to trust.

-- Chapter 5
```

---

## Think about it

**1.** A system that stores passwords is responsible for the security of those passwords. A system that delegates login to an identity provider is responsible for choosing the right identity provider and trusting it correctly. Which responsibility is heavier?

**2.** In a HITL system, the "human" in the loop has an identity. Does the system need to know that identity? Could a HITL system work with anonymous participants? What do you lose?

**3.** A JWT contains claims about a user — their name, email, group memberships. The API trusts those claims because they are signed by the issuer. What happens if the issuer is compromised?

---

## The problem with rolling your own auth

Earlier versions of this system used a `JWT_SECRET` environment variable. The server minted tokens, stored hashed passwords, and verified signatures using a shared secret.

This is the most common approach in tutorials. It is also the approach that leads to the most security incidents.

Password storage, reset flows, token expiry, refresh tokens, account linking, multi-factor auth — each of these is a solved problem with well-maintained open source solutions. Rolling your own means reinventing them, usually worse, with less time for other features.

More importantly for this system: we have three distinct roles (player, creator, observer) and potentially many deployment contexts (classroom, event, online). A proper identity system can handle group-based role assignment, external identity providers (Google, university SSO), and audit logging out of the box.

We replaced the homebrew JWT system with [Zitadel](https://zitadel.com/): a modern, self-hosted identity platform built in Go. It ships a polished login UI, project-level role management, and a full admin console — without requiring a JVM or a heavyweight runtime.

---

## What OIDC provides

OpenID Connect (OIDC) is a thin identity layer on top of OAuth2. From the perspective of our API:

- **Zitadel** is the **authorization server** — it issues tokens and owns credentials
- Our **Rust API** is the **resource server** — it validates tokens and grants access to resources
- The **Flutter app** and **web dashboard** are **clients** — they obtain tokens and present them

The API never sees passwords. It never mints tokens. It only validates them — by fetching the public keys from Zitadel's JWKS endpoint and verifying the token's cryptographic signature.

This is the correct role for a resource server. It is also a much smaller attack surface.

---

## Zitadel setup

### First-time bootstrap

Zitadel starts from Docker Compose alongside Postgres. On the first run, it creates the database schema, the default organization, and the admin account:

```bash
docker compose up -d
# Zitadel is available at http://localhost:8180
# Admin: admin@localhost:8180 / Admin1234! (or ZITADEL_ADMIN_PASSWORD)
```

### OIDC clients and dev users

After the first startup, run the setup script once:

```bash
# 1. Log in at http://localhost:8180
# 2. Avatar → Personal Access Tokens → New (copy the token)
ZITADEL_SA_PAT=<token> bash zitadel/setup.sh
```

The script creates:
- A **TreasureHunt** project with `creator`, `observer`, and `player` roles
- A **web-dashboard** OIDC app (PKCE, public client)
- A **mobile-app** OIDC app (native, PKCE)
- Three dev users: `creator@example.com`, `observer@example.com`, `player@example.com` (password: `password`)

It prints the `VITE_OIDC_CLIENT_ID` to add to `.env`.

### Production connectors

To switch from local accounts to Google, GitHub, or institutional SSO: navigate to Zitadel's admin console at `http://localhost:8180/ui/console`, choose your organization, and add an Identity Provider under **Identity Providers**. The rest of the system does not change — Zitadel handles the federation, and the Rust API only sees Zitadel-issued tokens.

---

## The JWKS cache

The API cannot trust tokens without verifying their signatures. Verifying requires the issuer's public key. Fetching that key on every request would be slow and would make the API dependent on Zitadel being available for every request.

The `JwksCache` in `middleware/auth.rs` solves this:

```rust
pub struct JwksCache {
    issuer:   String,
    jwks_url: String,
    http:     reqwest::Client,
    inner:    Arc<RwLock<Inner>>,
}

struct Inner {
    keys:       Vec<RawJwk>,
    fetched_at: Option<Instant>,
}
```

Keys are fetched once and cached for 5 minutes (the TTL is `elapsed.as_secs() > 300`). On cache miss or expiry, the cache refreshes from the JWKS endpoint. If the primary endpoint fails, it falls back to OIDC discovery to find the correct JWKS URI.

The `RwLock<Inner>` pattern allows concurrent reads (many requests validating tokens simultaneously) and exclusive writes (one refresh at a time). This is safe in async Rust because `tokio::sync::RwLock` is designed for async contexts — it does not block the thread while waiting for the lock.

---

## Token validation

```rust
pub async fn validate(&self, token: &str) -> anyhow::Result<OidcClaims> {
    let header = decode_header(token)?;
    let kid = header.kid.as_deref().unwrap_or("");

    let keys = self.keys().await?;
    let jwk = keys.iter()
        .find(|k| k.kid.as_deref().unwrap_or("") == kid || keys.len() == 1)
        .context("no matching key")?;

    let decoding_key = match jwk.kty.as_str() {
        "RSA" => DecodingKey::from_rsa_components(jwk.n.as_deref()?, jwk.e.as_deref()?)?,
        "EC"  => DecodingKey::from_ec_components(jwk.x.as_deref()?, jwk.y.as_deref()?)?,
        kty   => anyhow::bail!("unsupported key type: {kty}"),
    };

    let mut val = Validation::new(algo);
    val.set_issuer(&[&self.issuer]);
    val.validate_aud = false;

    Ok(decode::<OidcClaims>(token, &decoding_key, &val)?.claims)
}
```

A few deliberate choices here:

**`validate_aud = false`.** The resource server does not check the audience claim. In a multi-service architecture, the audience would identify which service the token was issued for. In a single-service setup, checking it adds friction without security benefit. This could be changed.

**Key ID matching with fallback.** If the JWKS has only one key (common in development), the validation uses it regardless of the `kid` header. This handles misconfigured provider setups gracefully.

**Issuer validation.** The `issuer` field is checked against `iss` in the token. This prevents tokens issued by a different instance from being accepted.

---

## Role inference

Zitadel carries role information in a project-scoped claim:

```json
{
  "urn:zitadel:iam:org:project:roles": {
    "creator": { "orgDomain": "treasurehunt" }
  }
}
```

The `infer_role()` function checks this first, then falls back to a `groups` array (compatible with Dex, Authentik, Keycloak), then to email-prefix convention — which handles the three dev accounts out of the box without any role grant setup:

```rust
fn infer_role(claims: &OidcClaims) -> String {
    // 1. Zitadel project roles
    if let Some(roles) = &claims.zitadel_roles {
        if roles.contains_key("creator")  { return "creator".into(); }
        if roles.contains_key("observer") { return "observer".into(); }
        if roles.contains_key("player")   { return "player".into(); }
    }
    // 2. Groups claim (Dex / Authentik / Keycloak)
    if let Some(groups) = &claims.groups {
        if groups.iter().any(|g| g == "creators")  { return "creator".into(); }
        if groups.iter().any(|g| g == "observers") { return "observer".into(); }
        return "player".into();
    }
    // 3. Email-based fallback — dev accounts work without role grants
    match claims.email.as_deref() {
        Some(e) if e.starts_with("creator")  => "creator".into(),
        Some(e) if e.starts_with("observer") => "observer".into(),
        _ => "player".into(),
    }
}
```

---

## Player resolution

Validating the token tells us who issued the identity claim. Resolving the player converts that claim into a local database record:

```rust
async fn resolve_player(db: &PgPool, claims: &OidcClaims) -> Result<ResolvedPlayer> {
    if let Some(row) = sqlx::query!(
        "SELECT id, role FROM players WHERE external_id = $1",
        claims.sub
    ).fetch_optional(db).await? {
        return Ok(ResolvedPlayer { id: row.id, role: row.role });
    }

    // First login — create player
    let role = infer_role(&claims);
    let display_name = /* from name or email prefix */;

    let row = sqlx::query!(
        "INSERT INTO players (display_name, email, external_id, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, role",
        display_name, claims.email, claims.sub, role,
    ).fetch_one(db).await?;

    Ok(ResolvedPlayer { id: row.id, role: row.role })
}
```

Every token validation that reaches a valid Zitadel token will either find or create a player row. This is "just-in-time provisioning" — accounts are created on first use rather than pre-created by an administrator.

---

## Docker networking note

There is a subtle Docker networking issue worth understanding. In `docker-compose.yml`:

```yaml
rust-api:
  environment:
    OIDC_ISSUER:   http://localhost:8180              # public URL (for iss claim)
    OIDC_JWKS_URL: http://zitadel:8080/oauth/v2/keys  # internal URL (for key fetching)
```

The `iss` claim in tokens issued by Zitadel contains `http://localhost:8180` — the public URL the client used when obtaining the token. The Rust API must validate `iss` against this same URL. But when running inside Docker, `localhost:8180` does not resolve to the Zitadel container — it resolves to the Rust container's own loopback.

The solution: the API fetches keys from the internal Docker DNS name (`zitadel:8080`) but validates the issuer against the public URL (`localhost:8180`). These two environment variables exist precisely to support this split.

This is a common deployment nuance that OIDC tutorials often skip.

---

## Reflection

The system creates a player row on first login, inferring the role from Zitadel's project-role claims or the email address. The player never consents to this — they authenticate with Zitadel and then the API creates a record about them.

Is this a problem? What would you change if this system were used in a real classroom with real students? What would you keep?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
