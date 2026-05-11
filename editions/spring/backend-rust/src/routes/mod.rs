pub mod auth;
pub mod hunts;
pub mod observer;
pub mod scan;
pub mod sessions;

use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        // Current player profile
        .route("/me", get(auth::me))
        // Hunts (creator)
        .route("/hunts",               post(hunts::create).get(hunts::list))
        .route("/hunts/:id",           get(hunts::get).patch(hunts::update).delete(hunts::delete))
        .route("/hunts/:id/clues",     get(hunts::list_clues))
        .route("/hunts/:id/clues/:seq",       put(hunts::upsert_clue).delete(hunts::delete_clue))
        .route("/hunts/:id/clues/:seq/hints", get(hunts::list_hints))
        .route("/hunts/:id/qr-sheet",         get(hunts::qr_sheet))
        .route("/hunts/:id/ai/generate-clue", post(hunts::ai_generate_clue))
        .route("/hunts/:id/ai/difficulty",    post(hunts::ai_estimate_difficulty))
        // Observer
        .route("/hunts/:id/observe",   get(observer::observe))
        .route("/hunts/:id/sessions",  get(observer::list_sessions))
        // Sessions (player)
        .route("/sessions",            post(sessions::start))
        .route("/sessions/:id",        get(sessions::status))
        .route("/sessions/:id/clue",   get(sessions::current_clue))
        .route("/sessions/:id/answer", post(sessions::submit_answer))
        .route("/sessions/:id/hint",   post(sessions::request_hint))
        .route("/sessions/:id/nudge",  post(observer::nudge))
        .route("/sessions/:id/analysis", get(sessions::analyze_session))
        // Universal QR/NFC endpoint
        .route("/scan/:token",         get(scan::scan))
        // Public endpoints (no auth)
        .route("/public/hunts",        get(hunts::public_list))
        .route("/public/hunts/:id/clues", get(hunts::public_list_clues))
        .with_state(state)
}
