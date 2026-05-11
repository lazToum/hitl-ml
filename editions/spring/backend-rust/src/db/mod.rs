use sqlx::{postgres::PgPoolOptions, PgPool};

pub async fn connect(database_url: &str) -> anyhow::Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(database_url)
        .await?;

    // Run embedded migrations (files in migrations/)
    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}
