use anyhow::Context;
use qrcode::{render::unicode, QrCode};
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::Result;

/// Returns a PNG image as raw bytes for a given clue token URL.
pub fn clue_qr_png(base_url: &str, token: &str) -> anyhow::Result<Vec<u8>> {
    let url = format!("{base_url}/scan/{token}");
    let code = QrCode::new(url.as_bytes()).context("QR encode failed")?;

    let img = code
        .render::<image::Luma<u8>>()
        .min_dimensions(200, 200)
        .build();

    let mut buf = Vec::new();
    img.write_to(&mut std::io::Cursor::new(&mut buf), image::ImageFormat::Png)
        .context("PNG encode failed")?;

    Ok(buf)
}

/// Builds a printable QR sheet for an entire hunt.
/// Returns a JSON array of { sequence, title, token, png_b64 }.
pub async fn hunt_qr_sheet(db: &PgPool, hunt_id: Uuid, base_url: &str) -> Result<Vec<ClueQr>> {
    let rows = sqlx::query!(
        r#"SELECT c.sequence, c.title, ct.token
           FROM clues c
           JOIN clue_tokens ct ON ct.clue_id = c.id
           WHERE c.hunt_id = $1
           ORDER BY c.sequence"#,
        hunt_id,
    )
    .fetch_all(db)
    .await?;

    let mut out = Vec::with_capacity(rows.len());
    for row in rows {
        let png =
            clue_qr_png(base_url, &row.token).map_err(|e| crate::error::AppError::Internal(e))?;
        out.push(ClueQr {
            sequence: row.sequence,
            title: row.title,
            token: row.token.clone(),
            png_b64: base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &png),
        });
    }

    Ok(out)
}

/// Terminal-friendly ASCII QR (useful for development / server logs)
pub fn clue_qr_ascii(base_url: &str, token: &str) -> anyhow::Result<String> {
    let url = format!("{base_url}/scan/{token}");
    let code = QrCode::new(url.as_bytes()).context("QR encode failed")?;
    Ok(code.render::<unicode::Dense1x2>().build())
}

#[derive(Debug, serde::Serialize)]
pub struct ClueQr {
    pub sequence: i32,
    pub title: String,
    pub token: String,
    pub png_b64: String,
}
