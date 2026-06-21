use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::{
    error::{AppError, Result},
    middleware::AuthUser,
    models::{
        clue::{ClueCreatorView, ClueView, CreateClue, HintView},
        hunt::{CreateHunt, Hunt, HuntSummary, UpdateHunt},
    },
    services::{hunt_engine, qr_generator},
    state::AppState,
};

pub async fn create(
    auth: AuthUser,
    State(state): State<AppState>,
    Json(req): Json<CreateHunt>,
) -> Result<Json<Hunt>> {
    if auth.role != "creator" {
        return Err(AppError::Forbidden);
    }
    hunt_engine::create(&state.db, auth.id, req).await.map(Json)
}

pub async fn list(auth: AuthUser, State(state): State<AppState>) -> Result<Json<Vec<HuntSummary>>> {
    hunt_engine::list_by_creator(&state.db, auth.id)
        .await
        .map(Json)
}

pub async fn get(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Hunt>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if auth.role != "creator" || hunt.creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    Ok(Json(hunt))
}

pub async fn update(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateHunt>,
) -> Result<Json<Hunt>> {
    let hunt = hunt_engine::update(&state.db, id, auth.id, req).await?;
    if hunt.status == "archived" {
        state.broadcaster.close(id);
    }
    Ok(Json(hunt))
}

pub async fn upsert_clue(
    auth: AuthUser,
    State(state): State<AppState>,
    Path((hunt_id, _seq)): Path<(Uuid, i32)>,
    Json(req): Json<CreateClue>,
) -> Result<Json<serde_json::Value>> {
    let clue = hunt_engine::upsert_clue(&state.db, hunt_id, auth.id, req).await?;
    Ok(Json(serde_json::json!({ "clue": ClueCreatorView::from(clue) })))
}

pub async fn list_clues(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if auth.role != "creator" || hunt.creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    let clues = hunt_engine::list_clues(&state.db, id).await?;
    let views: Vec<ClueCreatorView> = clues.into_iter().map(ClueCreatorView::from).collect();
    Ok(Json(serde_json::json!({ "clues": views })))
}

pub async fn public_list_clues(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if hunt.status != "active" {
        return Err(AppError::NotFound("hunt not found".into()));
    }

    let clues = hunt_engine::list_clues(&state.db, id).await?;
    let views = clues
        .into_iter()
        .map(|c| ClueView {
            id: c.id,
            sequence: c.sequence,
            title: c.title,
            body: c.body,
            media_url: c.media_url,
            answer_type: c.answer_type,
            hints: Vec::<HintView>::new(),
        })
        .collect::<Vec<_>>();

    Ok(Json(serde_json::json!({ "clues": views })))
}

/// GET /hunts/:id/clues/:seq/hints — all hints for a clue (creator view, not player-gated)
pub async fn list_hints(
    auth: AuthUser,
    State(state): State<AppState>,
    Path((hunt_id, seq)): Path<(Uuid, i32)>,
) -> Result<Json<serde_json::Value>> {
    let hunt = hunt_engine::get(&state.db, hunt_id).await?;
    if hunt.creator_id != auth.id && auth.role != "observer" {
        return Err(AppError::Forbidden);
    }
    let clue  = hunt_engine::get_clue_by_seq(&state.db, hunt_id, seq).await?;
    let hints = hunt_engine::list_hints(&state.db, clue.id).await?;
    Ok(Json(serde_json::json!({ "hints": hints })))
}

pub async fn qr_sheet(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<qr_generator::ClueQr>>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if hunt.creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    let base_url = format!("http://localhost:{}", state.config.port);
    qr_generator::hunt_qr_sheet(&state.db, id, &base_url)
        .await
        .map(Json)
}

pub async fn ai_generate_clue(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<crate::services::ai_client::GenerateClueRequest>,
) -> Result<Json<crate::services::ai_client::GeneratedClue>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if hunt.creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    state.ai.generate_clue(req).await.map(Json).map_err(AppError::Internal)
}

pub async fn ai_estimate_difficulty(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<crate::services::ai_client::DifficultyEstimate>> {
    let hunt = hunt_engine::get(&state.db, id).await?;
    if hunt.creator_id != auth.id {
        return Err(AppError::Forbidden);
    }
    let clue_body = body["clue_body"].as_str().unwrap_or("").to_owned();
    state.ai.estimate_difficulty(&clue_body).await.map(Json).map_err(AppError::Internal)
}

pub async fn delete(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode> {
    hunt_engine::delete(&state.db, id, auth.id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn delete_clue(
    auth: AuthUser,
    State(state): State<AppState>,
    Path((hunt_id, seq)): Path<(Uuid, i32)>,
) -> Result<StatusCode> {
    hunt_engine::delete_clue(&state.db, hunt_id, auth.id, seq).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn public_list(State(state): State<AppState>) -> Result<Json<serde_json::Value>> {
    let hunts = hunt_engine::list_active(&state.db).await?;
    Ok(Json(serde_json::json!({ "hunts": hunts })))
}
