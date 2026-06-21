// Auth is handled by the configured OIDC provider. This file only exposes a /me endpoint
// so clients can exchange a token for their local player profile.

use axum::{extract::State, Json};

use crate::{
    error::Result,
    middleware::AuthUser,
    models::player::{Player, PlayerView},
    state::AppState,
};

pub async fn me(auth: AuthUser, State(state): State<AppState>) -> Result<Json<PlayerView>> {
    let player: Player = sqlx::query_as!(Player, "SELECT * FROM players WHERE id = $1", auth.id)
        .fetch_one(&state.db)
        .await?;
    Ok(Json(player.into()))
}
