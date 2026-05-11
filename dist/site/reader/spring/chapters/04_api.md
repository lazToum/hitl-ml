# The API Layer: Rust and Axum

```{epigraph}
A type error at compile time is a design conversation. A type error at runtime is an incident.

-- Chapter 4
```

---

## Think about it

**1.** Why would you choose Rust for a web API that mostly queries a database? What does Rust give you that Python or Go don't? What does it cost?

**2.** A web framework that makes "impossible states unrepresentable" is a different class of tool than one that makes them "unlikely." Can you think of an invariant in the treasure hunt system that the Rust type system enforces for free?

**3.** Compile-time SQL query checking sounds appealing. But it means your code can only build if a database is running — or you have pre-cached the schema. What does that tradeoff look like in CI? In a laptop without internet?

---

## Why Rust

Rust is not the obvious choice for a web API. Python, Go, or Node would compile faster, require less ceremony, and be familiar to more readers.

We chose Rust for three reasons relevant to this edition:

**Memory safety without garbage collection.** The Axum server can handle thousands of concurrent WebSocket connections without pausing for GC. For the observer dashboard — which holds open connections for every live session — this matters.

**Fearless concurrency.** The `WsBroadcaster` holds a `Mutex<HashMap>` of broadcast channels. In Rust, the compiler ensures this is used correctly: you cannot forget to lock, cannot hold the lock across an await point, cannot accidentally share a `!Send` type across threads. These guarantees are enforced at compile time.

**`sqlx` compile-time query validation.** When you write `sqlx::query_as!(Player, "SELECT * FROM players WHERE id = $1", id)`, the compiler verifies at build time that the query is valid SQL, that `$1` has the right type, and that the returned columns match the `Player` struct. This is a remarkable property: your SQL cannot drift from your schema without a build failure.

The cost is real: longer compile times, a steeper learning curve, and more ceremony around ownership. For a book example, that is a reasonable tradeoff — readers who work through the Rust chapters learn something they cannot learn from a FastAPI tutorial.

---

## Project structure

```
backend-rust/src/
├── main.rs               # Server startup, router mounting
├── config.rs             # Env-var driven Config struct
├── state.rs              # AppState: shared handles
├── error.rs              # AppError enum → HTTP responses
├── db/mod.rs             # Pool initialization
├── middleware/
│   ├── mod.rs
│   └── auth.rs           # JwksCache + AuthUser extractor
├── models/               # Plain data types (no DB logic)
│   ├── clue.rs
│   ├── hunt.rs
│   ├── player.rs
│   ├── session.rs
│   └── event.rs
├── routes/               # HTTP handlers (thin, delegate to services)
│   ├── mod.rs            # Router wiring
│   ├── auth.rs
│   ├── hunts.rs
│   ├── sessions.rs
│   ├── observer.rs
│   └── scan.rs
└── services/             # Business logic
    ├── hunt_engine.rs
    ├── session_manager.rs
    ├── clue_validator.rs
    ├── hint_engine.rs
    ├── event_logger.rs
    ├── ai_client.rs
    ├── qr_generator.rs
    └── ws_broadcaster.rs
```

The split between `routes/` and `services/` is intentional. Handlers parse HTTP — extract path params, deserialize bodies, check auth, return JSON. Services contain logic — database queries, business rules, side effects. A handler for submitting an answer looks like:

```rust
pub async fn submit_answer(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(session_id): Path<Uuid>,
    Json(req): Json<SubmitAnswer>,
) -> Result<Json<AnswerResult>> {
    sessions::submit(&state, auth.id, session_id, req).await
}
```

The handler does three things: authenticate, extract, delegate. All real work happens in `sessions::submit`.

---

## AppState

```rust
#[derive(Clone)]
pub struct AppState {
    pub db:          PgPool,
    pub config:      Arc<Config>,
    pub jwks:        Arc<JwksCache>,
    pub broadcaster: Arc<WsBroadcaster>,
    pub ai:          Arc<AiClient>,
}
```

`AppState` is the shared context injected into every handler via Axum's `State` extractor. It is `Clone` because Axum clones it for each request. The expensive things — database pool, JWKS cache, WebSocket broadcaster — are behind `Arc`, so cloning is cheap.

Notice what is not in `AppState`: Redis. Redis is declared in `Config` and `docker-compose.yml` but never connected. This is an honest artifact — rate limiting and session caching were planned but not implemented. The `redis_url` field exists as a placeholder and produces a dead_code warning. Rather than deleting it (and losing the intent), it stays as a named gap.

---

## Error handling

```rust
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error("bad request: {0}")]
    BadRequest(String),
    #[error("unauthorized")]
    Unauthorized,
    #[error("forbidden")]
    Forbidden,
    #[error("internal error")]
    Internal(#[from] anyhow::Error),
    #[error("database error")]
    Db(#[from] sqlx::Error),
}
```

Every service function returns `Result<T>` where the error is `AppError`. The `IntoResponse` implementation on `AppError` maps each variant to an HTTP status code and a JSON body:

```rust
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::NotFound(m)   => (StatusCode::NOT_FOUND, m.clone()),
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m.clone()),
            AppError::Unauthorized  => (StatusCode::UNAUTHORIZED, "unauthorized".into()),
            AppError::Forbidden     => (StatusCode::FORBIDDEN, "forbidden".into()),
            AppError::Internal(_) | AppError::Db(_) =>
                (StatusCode::INTERNAL_SERVER_ERROR, "internal server error".into()),
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}
```

Database errors and internal errors both become 500s with a generic message — the specific error is logged but not returned to clients. This is a security decision: internal error details can leak schema information or stack traces.

---

## sqlx and compile-time safety

The most distinctive feature of the Rust backend is `sqlx`'s compile-time query checking.

```rust
pub async fn get(db: &PgPool, hunt_id: Uuid) -> Result<Hunt> {
    sqlx::query_as!(Hunt, "SELECT * FROM hunts WHERE id = $1", hunt_id)
        .fetch_one(db)
        .await
        .map_err(|_| AppError::NotFound("hunt not found".into()))
}
```

When this compiles, `sqlx` has verified:
- The `hunts` table exists
- `$1` is a UUID-compatible type
- Every column in `hunts` has a corresponding field in the `Hunt` struct with a compatible type

If you rename a column in the schema and forget to update the Rust model, the build fails. If you write invalid SQL, the build fails. This is not runtime type checking with descriptive error messages — it is compile-time prevention.

The mechanism requires either a live database at build time, or a pre-generated cache in `.sqlx/`. This project ships the cache. After any schema change, regenerate it:

```bash
docker compose up postgres -d
DATABASE_URL=postgres://hunt:hunt_secret@localhost:5432/treasure_hunt \
  cargo sqlx prepare
```

Then set `SQLX_OFFLINE=true` in `.env` and commit the updated `.sqlx/` directory. The cache is safe to commit — it contains type metadata, not data.

---

## The route tree

```rust
Router::new()
    // Auth
    .route("/me",                              get(auth::me))
    // Hunts (creator)
    .route("/hunts",                           post(hunts::create).get(hunts::list))
    .route("/hunts/:id",                       get(hunts::get).patch(hunts::update).delete(hunts::delete))
    .route("/hunts/:id/clues",                 get(hunts::list_clues))
    .route("/hunts/:id/clues/:seq",            put(hunts::upsert_clue))
    .route("/hunts/:id/clues/:seq/hints",      get(hunts::list_hints))
    .route("/hunts/:id/qr-sheet",              get(hunts::qr_sheet))
    .route("/hunts/:id/ai/generate-clue",      post(hunts::ai_generate_clue))
    .route("/hunts/:id/ai/difficulty",         post(hunts::ai_estimate_difficulty))
    // Observer
    .route("/hunts/:id/observe",               get(observer::observe))
    .route("/hunts/:id/sessions",              get(observer::list_sessions))
    // Sessions (player)
    .route("/sessions",                        post(sessions::start))
    .route("/sessions/:id",                    get(sessions::status))
    .route("/sessions/:id/clue",               get(sessions::current_clue))
    .route("/sessions/:id/answer",             post(sessions::submit_answer))
    .route("/sessions/:id/hint",               post(sessions::request_hint))
    .route("/sessions/:id/nudge",              post(observer::nudge))
    .route("/sessions/:id/analysis",           get(sessions::analyze_session))
    // Universal QR/NFC scan
    .route("/scan/:token",                     get(scan::scan))
    // Public (no auth)
    .route("/public/hunts",                    get(hunts::public_list))
    .with_state(state)
```

All routes require authentication (every handler takes `auth: AuthUser`). Route-level authorization — checking that the authenticated user has the right role — happens in the handler or service, not at the router level. A player who calls `POST /hunts` will get through the auth middleware but be rejected by the hunt creation handler once it checks their role.

:::{admonition} Authorization is not authentication
:class: note
The `AuthUser` extractor only checks "is this a valid token from a user we know?" It does not check "is this user allowed to do what they are trying to do?" Authorization — role checks, ownership checks — is the handler's responsibility. This separation is deliberate: it keeps the middleware simple and puts authorization logic where the domain context is available.
:::

---

## Reflection

Rust's type system prevents certain classes of bugs. But there is a class of bugs it does not prevent: wrong business logic that is type-correct.

A function that decrements `attempts` instead of incrementing it compiles fine. A query that fetches sessions from the wrong hunt compiles fine. A hint unlock condition that uses `>=` instead of `>` compiles fine.

What would prevent those bugs? What would it take to test them? And is the confidence that compile-time checking gives you a useful property, or does it create a false sense of security about the things it does not check?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
