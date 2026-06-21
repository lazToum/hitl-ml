use crate::{
    error::Result,
    models::clue::{AnswerSubmission, Clue},
    services::{ai_client::AiClient, hunt_engine},
};
use anyhow::Context;
use sqlx::PgPool;

#[derive(Debug)]
pub struct ValidationResult {
    pub passed: bool,
    pub score: f64,
    pub feedback: Feedback,
}

#[derive(Debug, PartialEq)]
pub enum Feedback {
    Correct,
    VeryClose,
    Incorrect,
    NotAtLocation,
}

impl Feedback {
    pub fn as_str(&self) -> &'static str {
        match self {
            Feedback::Correct => "Correct!",
            Feedback::VeryClose => "You're very close — double-check your answer.",
            Feedback::Incorrect => "Not quite. Try again.",
            Feedback::NotAtLocation => "You don't seem to be at the right location yet.",
        }
    }
}

pub async fn validate(
    db: &PgPool,
    clue: &Clue,
    submission: &AnswerSubmission,
    ai: Option<&AiClient>,
) -> Result<ValidationResult> {
    match clue.answer_type.as_str() {
        "text" => validate_text(clue, submission, ai).await,
        "qr" => validate_token(db, clue, submission).await,
        "nfc" => validate_token(db, clue, submission).await,
        "gps" => Ok(validate_gps(clue, submission)),
        "photo" => validate_photo(clue, submission, ai).await,
        other => Err(crate::error::AppError::BadRequest(format!(
            "unknown answer type: {other}"
        ))),
    }
}

// ── Text ──────────────────────────────────────────────────────

async fn validate_text(
    clue: &Clue,
    submission: &AnswerSubmission,
    ai: Option<&AiClient>,
) -> Result<ValidationResult> {
    let expected = normalize(&clue.answer_value);
    let submitted = normalize(&submission.value);

    // Exact match after normalization
    if expected == submitted {
        return Ok(pass(1.0));
    }

    // Fuzzy string similarity
    let score = strsim::jaro_winkler(&expected, &submitted);

    if score >= clue.answer_tolerance {
        return Ok(pass(score));
    }

    // Semantic fallback via AI if score is plausible and AI is available
    if score >= 0.45 {
        if let Some(ai) = ai {
            if let Ok(semantic_score) = ai.semantic_match(&expected, &submitted).await {
                if semantic_score >= clue.answer_tolerance {
                    return Ok(pass(semantic_score));
                }
            }
        }
    }

    Ok(ValidationResult {
        passed: false,
        score,
        feedback: if score >= 0.6 {
            Feedback::VeryClose
        } else {
            Feedback::Incorrect
        },
    })
}

// ── Token (QR / NFC) ─────────────────────────────────────────

async fn validate_token(
    db: &PgPool,
    clue: &Clue,
    submission: &AnswerSubmission,
) -> Result<ValidationResult> {
    // The printed QR code / programmed NFC tag encodes the clue's token from
    // clue_tokens — that token (not the creator-facing answer_value) is what
    // a scanned submission must match.
    let expected = hunt_engine::token_for_clue(db, clue.id).await?;
    let passed   = token_matches(&expected, &submission.value);
    Ok(ValidationResult {
        passed,
        score: if passed { 1.0 } else { 0.0 },
        feedback: if passed {
            Feedback::Correct
        } else {
            Feedback::Incorrect
        },
    })
}

fn token_matches(expected: &str, submitted: &str) -> bool {
    expected.trim() == submitted.trim()
}

// ── GPS ───────────────────────────────────────────────────────

fn validate_gps(clue: &Clue, submission: &AnswerSubmission) -> ValidationResult {
    let (lat, lon) = match (submission.lat, submission.lon) {
        (Some(la), Some(lo)) => (la, lo),
        _ => {
            return ValidationResult {
                passed: false,
                score: 0.0,
                feedback: Feedback::NotAtLocation,
            }
        }
    };

    let (target_lat, target_lon) = match parse_coords(&clue.answer_value) {
        Some(c) => c,
        None => {
            return ValidationResult {
                passed: false,
                score: 0.0,
                feedback: Feedback::Incorrect,
            }
        }
    };

    let distance_m = haversine_metres(lat, lon, target_lat, target_lon);
    let radius_m = clue.answer_tolerance; // tolerance field repurposed as radius

    if distance_m <= radius_m {
        ValidationResult {
            passed: true,
            score: 1.0,
            feedback: Feedback::Correct,
        }
    } else {
        ValidationResult {
            passed: false,
            score: 0.0,
            feedback: Feedback::NotAtLocation,
        }
    }
}

// ── Photo ─────────────────────────────────────────────────────

async fn validate_photo(
    clue: &Clue,
    submission: &AnswerSubmission,
    ai: Option<&AiClient>,
) -> Result<ValidationResult> {
    let photo = submission.photo_b64.as_deref().unwrap_or("");
    if photo.is_empty() {
        return Ok(ValidationResult {
            passed: false,
            score: 0.0,
            feedback: Feedback::Incorrect,
        });
    }

    if let Some(ai) = ai {
        let score = ai
            .verify_photo(&clue.answer_value, photo)
            .await
            .context("photo verification failed")?;

        return Ok(if score >= clue.answer_tolerance {
            pass(score)
        } else {
            ValidationResult {
                passed: false,
                score,
                feedback: Feedback::NotAtLocation,
            }
        });
    }

    // No AI: cannot validate photos
    Ok(ValidationResult {
        passed: false,
        score: 0.0,
        feedback: Feedback::Incorrect,
    })
}

// ── Helpers ───────────────────────────────────────────────────

fn normalize(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .filter(|c| c.is_alphanumeric() || c.is_whitespace())
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

fn pass(score: f64) -> ValidationResult {
    ValidationResult {
        passed: true,
        score,
        feedback: Feedback::Correct,
    }
}

fn parse_coords(s: &str) -> Option<(f64, f64)> {
    let parts: Vec<&str> = s.splitn(2, ',').collect();
    if parts.len() != 2 {
        return None;
    }
    let lat = parts[0].trim().parse().ok()?;
    let lon = parts[1].trim().parse().ok()?;
    Some((lat, lon))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::clue::AnswerSubmission;

    fn text_clue(answer: &str, tolerance: f64) -> Clue {
        Clue {
            id:                         uuid::Uuid::nil(),
            hunt_id:                    uuid::Uuid::nil(),
            sequence:                   1,
            title:                      "Test".into(),
            body:                       "Test clue".into(),
            media_url:                  None,
            answer_type:                "text".into(),
            answer_value:               answer.into(),
            answer_tolerance:           tolerance,
            hint_unlock_after_minutes:  5,
            hint_unlock_after_attempts: 3,
            created_at:                 chrono::Utc::now(),
        }
    }

    fn gps_clue(coords: &str, radius_m: f64) -> Clue {
        Clue {
            answer_type:      "gps".into(),
            answer_value:     coords.into(),
            answer_tolerance: radius_m,
            ..text_clue("", 0.0)
        }
    }

    fn sub(value: &str) -> AnswerSubmission {
        AnswerSubmission { value: value.into(), lat: None, lon: None, photo_b64: None }
    }

    fn sub_gps(lat: f64, lon: f64) -> AnswerSubmission {
        AnswerSubmission { value: String::new(), lat: Some(lat), lon: Some(lon), photo_b64: None }
    }

    // ── Text ──────────────────────────────────────────────────────

    #[test]
    fn text_exact_match() {
        assert!(token_matches("Mount Everest", "Mount Everest"));
    }

    #[test]
    fn text_case_insensitive() {
        let c = text_clue("Mount Everest", 0.85);
        assert!(normalize(&c.answer_value) == normalize("mount everest"));
    }

    #[test]
    fn text_punctuation_stripped() {
        // Normalization should strip punctuation
        assert_eq!(normalize("Mt. Everest!"), "mt everest");
    }

    #[test]
    fn text_close_but_below_threshold() {
        // "Big Ben" vs "Mount Everest" is clearly wrong
        assert!(!token_matches("Mount Everest", "Big Ben"));
    }

    #[test]
    fn text_empty_answer_fails() {
        assert!(!token_matches("Mount Everest", ""));
    }

    #[test]
    fn text_strict_threshold_rejects_abbreviation() {
        // "mt everest" vs "mount everest" is not an exact match
        assert!(!token_matches("mount everest", "mt everest"));
    }

    // ── Token (QR / NFC) ──────────────────────────────────────────

    #[test]
    fn token_exact_match_passes() {
        assert!(token_matches("ABC123xyz456", "ABC123xyz456"));
    }

    #[test]
    fn token_mismatch_fails() {
        assert!(!token_matches("ABC123xyz456", "XYZ999"));
    }

    #[test]
    fn token_whitespace_trimmed() {
        // token_matches trims both sides
        assert!(token_matches("ABC123", "  ABC123  "));
    }

    // ── GPS ───────────────────────────────────────────────────────

    #[test]
    fn gps_within_radius_passes() {
        // Target: 51.5074, -0.1278 (London). Player: 5m away.
        let clue   = gps_clue("51.5074,-0.1278", 20.0);
        let result = validate_gps(&clue, &sub_gps(51.50744, -0.1278));
        assert!(result.passed);
    }

    #[test]
    fn gps_outside_radius_fails() {
        let clue   = gps_clue("51.5074,-0.1278", 10.0);
        // Move ~500m away
        let result = validate_gps(&clue, &sub_gps(51.5120, -0.1278));
        assert!(!result.passed);
    }

    #[test]
    fn gps_missing_coords_fails() {
        let clue   = gps_clue("51.5074,-0.1278", 20.0);
        let result = validate_gps(&clue, &sub(""));
        assert!(!result.passed);
        assert_eq!(result.feedback, Feedback::NotAtLocation);
    }

    #[test]
    fn gps_malformed_answer_value_fails() {
        let clue   = gps_clue("not,valid,coords", 20.0);
        let result = validate_gps(&clue, &sub_gps(51.5074, -0.1278));
        assert!(!result.passed);
    }

    // ── Haversine ─────────────────────────────────────────────────

    #[test]
    fn haversine_same_point_is_zero() {
        assert!(haversine_metres(51.5074, -0.1278, 51.5074, -0.1278) < 0.01);
    }

    #[test]
    fn haversine_known_distance() {
        // London to Paris is roughly 340 km
        let d = haversine_metres(51.5074, -0.1278, 48.8566, 2.3522);
        assert!((d - 340_000.0).abs() < 10_000.0, "got {d}");
    }
}

fn haversine_metres(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    use std::f64::consts::PI;
    let r = 6_371_000.0_f64; // Earth radius in metres
    let d_lat = (lat2 - lat1) * PI / 180.0;
    let d_lon = (lon2 - lon1) * PI / 180.0;
    let a = (d_lat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lon / 2.0).sin().powi(2);
    r * 2.0 * a.sqrt().asin()
}
