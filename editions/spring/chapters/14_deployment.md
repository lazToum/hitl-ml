# Deployment: Shipping the Loop

```{epigraph}
A system that works on your laptop is a prototype. A system that works for strangers is a product.

-- Chapter 14
```

---

## Think about it

**1.** The docker-compose.yml starts the core services: postgres, Zitadel, nginx, rust-api, redis, and python-ai. It can also start the handbook server under the `book` profile. What is the minimum set needed to run a hunt with one player? What could you cut?

**2.** The Zitadel bootstrap creates local dev accounts and OIDC apps. What does a production identity setup look like? What changes, and what stays the same?

**3.** A hunt is scheduled to run at a school next Saturday. The Rust API binary needs to be updated. When do you deploy? What is your rollback plan?

---

## What "deployed" means for this system

Deployment has three scopes for this system:

**Local development.** One developer, one laptop, all services running via `docker compose up`. This is the environment you have been working in throughout this edition. It works for building and testing.

**Classroom/event deployment.** A dedicated server (VPS or on-site machine), all services running via docker compose, accessible over a local network or the internet. This is the likely production scenario for this system. Players access it with their phones. The creator accesses the dashboard from a laptop.

**Internet-facing deployment.** A cloud server with a proper domain, HTTPS, and Zitadel configured with a real identity provider (Google, Apple, Microsoft, university SSO). This is what a long-term or high-stakes deployment looks like.

This chapter focuses on the classroom/event scenario — getting from your laptop to a server.

---

## The docker-compose stack

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB:       treasure_hunt
      POSTGRES_USER:     hunt
      POSTGRES_PASSWORD: hunt_secret
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  zitadel:
    image: ghcr.io/zitadel/zitadel:v4.14.0
    command: start-from-init --masterkeyFromEnv --tlsMode disabled
    environment:
      ZITADEL_MASTERKEY: MasterkeyNeedsToHave32Characters
      ZITADEL_EXTERNALDOMAIN: localhost
      ZITADEL_EXTERNALPORT: 8180
      ZITADEL_EXTERNALSECURE: "false"
      ZITADEL_DATABASE_POSTGRES_HOST: postgres

  rust-api:
    build:
      context: ./backend-rust
    environment:
      DATABASE_URL:   postgres://hunt:hunt_secret@postgres:5432/treasure_hunt
      OIDC_ISSUER:    http://localhost:8180
      OIDC_JWKS_URL:  http://nginx:80/oauth/v2/keys
    depends_on:
      postgres: { condition: service_healthy }
      zitadel:  { condition: service_started }
```

A few things to note for production:

**Passwords are in docker-compose.yml.** For local development, this is fine. For production, use Docker secrets or environment-specific override files (`docker-compose.prod.yml`) that are not committed.

**`hunt_secret` is not a secret.** The postgres password should be changed for production and stored in a `.env` file that is not committed to the repository.

**`OIDC_ISSUER` is localhost.** For production, this must be the public Zitadel URL. The issuer URL is baked into every token Zitadel issues — tokens issued with `localhost` as the issuer will fail validation on any other machine.

---

## Building for production

The Rust API has a multi-stage Dockerfile that produces a small binary image:

```dockerfile
FROM rust:1-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY migrations ./migrations
COPY .sqlx ./.sqlx
ENV SQLX_OFFLINE=true
RUN cargo build --release --bin server

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/server /usr/local/bin/server
EXPOSE 8080
CMD ["server"]
```

The two-stage build means the final image contains only the compiled binary and its runtime dependencies — no Rust toolchain, no build artifacts. The image is typically 30–50 MB.

`SQLX_OFFLINE=true` uses the pre-generated `.sqlx/` cache. This means the Docker build does not need a live database — it uses the cached query metadata from the repository.

---

## Migrations

Running migrations in production requires care:

```bash
# On first deploy:
docker compose exec rust-api \
  DATABASE_URL=postgres://hunt:hunt_secret@postgres:5432/treasure_hunt \
  cargo sqlx migrate run

# Or run migrations as part of startup:
```

An alternative is to run migrations automatically at startup by adding a migration step to `main.rs`:

```rust
sqlx::migrate!().run(&pool).await
    .expect("Failed to run database migrations");
```

Automatic migrations at startup are convenient for development but risky in production — if a migration fails, the service fails to start, and the error may be hard to diagnose. For production, running migrations as a separate step before deploying the new binary gives you control and a clear failure mode.

---

## Zitadel in production

For local development, `zitadel/setup.sh` creates a project, role grants, a web OIDC app, a mobile OIDC app, and three test users. That is enough to prove the platform flow, but it is not a production identity plan.

For a classroom deployment with a small number of known users, create real users in Zitadel and assign project roles (`creator`, `observer`, `player`). For a larger or more open deployment, configure an upstream identity provider in Zitadel:

```text
Zitadel Console -> Organization -> Identity Providers -> Add Provider
```

With this configuration, players authenticate with their Google, Microsoft, Apple, or institutional accounts. Zitadel handles the upstream OAuth flow and issues its own tokens to the Rust API. The Rust API does not know or care where the identity ultimately came from.

Roles should remain project-scoped. The Rust API reads Zitadel's project-role claim first, then falls back to generic `groups` claims and email-prefix conventions for local development.

---

## HTTPS

For any internet-facing deployment, HTTPS is mandatory. The simplest approach is a reverse proxy (Nginx or Caddy) that terminates TLS:

```nginx
server {
    listen 443 ssl;
    server_name your-server.com;

    ssl_certificate     /etc/letsencrypt/live/your-server.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-server.com/privkey.pem;

    # Recommended: serve Zitadel on an auth subdomain such as
    # https://auth.your-server.com and set OIDC_ISSUER to that URL.

    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

The WebSocket upgrade headers (`Upgrade`, `Connection`) are required for the observer dashboard's WebSocket connections.

Let's Encrypt provides free TLS certificates via `certbot`. For a classroom event, a self-signed certificate might work, but mobile browsers will warn players, which breaks trust at a critical moment.

---

## What the deployment does not include

- **Redis scope.** Redis is wired for answer-attempt rate limiting: 10 attempts per player/clue/minute when Redis is reachable. It is not yet used for session caching, queues, or broader anti-abuse controls.
- **Log aggregation.** The services log to stdout, which Docker captures. For production monitoring, logs should flow to a centralized system (Loki, Elasticsearch) or at least be persisted to disk.
- **Health endpoints.** The API has no `/health` endpoint. Docker compose checks postgres and Zitadel exposes `/debug/healthz`, but the Rust API still needs its own healthcheck. Adding one is a one-line change.
- **Backup.** The postgres volume `pg_data` contains all hunt and session data. Without a backup policy, a server failure loses everything.

Each of these is a production concern that development environments can ignore. Naming them is part of deploying responsibly.

---

## Reflection

The system works on localhost. What would need to change for 500 simultaneous players at a conference?

Think through: API throughput, WebSocket connections, database connections, photo verification latency, QR code image generation. Where are the bottlenecks? Which are easy to address and which require architectural changes?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
