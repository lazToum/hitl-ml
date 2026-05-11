use reqwest::Client;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// HTTP client for the Python AI service.
/// Callers decide how to degrade when the sidecar is unavailable.
#[derive(Clone)]
pub struct AiClient {
    base_url: String,
    client: Client,
}

impl AiClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base_url: base_url.into(),
            client: Client::builder()
                .timeout(std::time::Duration::from_secs(15))
                .build()
                .expect("reqwest client"),
        }
    }

    /// Returns a similarity score 0–1 between expected and submitted answers.
    pub async fn semantic_match(&self, expected: &str, submitted: &str) -> anyhow::Result<f64> {
        #[derive(Serialize)]
        struct Req<'a> {
            expected: &'a str,
            submitted: &'a str,
        }
        #[derive(Deserialize)]
        struct Resp {
            score: f64,
        }

        let resp: Resp = self
            .client
            .post(format!("{}/semantic-match", self.base_url))
            .json(&Req {
                expected,
                submitted,
            })
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(resp.score)
    }

    /// Returns a confidence 0–1 that the photo shows the expected location description.
    pub async fn verify_photo(&self, description: &str, photo_b64: &str) -> anyhow::Result<f64> {
        #[derive(Serialize)]
        struct Req<'a> {
            description: &'a str,
            photo_b64: &'a str,
        }
        #[derive(Deserialize)]
        struct Resp {
            confidence: f64,
        }

        let resp: Resp = self
            .client
            .post(format!("{}/verify-photo", self.base_url))
            .json(&Req {
                description,
                photo_b64,
            })
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(resp.confidence)
    }

    /// Ask the AI to draft a clue from a location / theme description.
    pub async fn generate_clue(&self, req: GenerateClueRequest) -> anyhow::Result<GeneratedClue> {
        self.client
            .post(format!("{}/generate-clue", self.base_url))
            .json(&req)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await
            .map_err(Into::into)
    }

    /// Ask the AI to rate clue difficulty 1–5 with reasoning.
    pub async fn estimate_difficulty(&self, clue_body: &str) -> anyhow::Result<DifficultyEstimate> {
        #[derive(Serialize)]
        struct Req<'a> {
            clue_body: &'a str,
        }

        self.client
            .post(format!("{}/estimate-difficulty", self.base_url))
            .json(&Req { clue_body })
            .send()
            .await?
            .error_for_status()?
            .json()
            .await
            .map_err(Into::into)
    }

    /// Generate a personalised hint from the player's failed attempts.
    pub async fn adaptive_hint(
        &self,
        clue_body: &str,
        answer: &str,
        attempts: &[String],
    ) -> anyhow::Result<String> {
        #[derive(Serialize)]
        struct Req<'a> {
            clue_body: &'a str,
            answer: &'a str,
            attempts: &'a [String],
        }
        #[derive(Deserialize)]
        struct Resp {
            hint: String,
        }

        let resp: Resp = self
            .client
            .post(format!("{}/adaptive-hint", self.base_url))
            .json(&Req {
                clue_body,
                answer,
                attempts,
            })
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(resp.hint)
    }

    /// Post-hunt confusion analysis report.
    pub async fn analyze_session(
        &self,
        session_id: Uuid,
        events: &serde_json::Value,
    ) -> anyhow::Result<String> {
        #[derive(Serialize)]
        struct Req<'a> {
            session_id: Uuid,
            events: &'a serde_json::Value,
        }
        #[derive(Deserialize)]
        struct Resp {
            report: String,
        }

        let resp: Resp = self
            .client
            .post(format!("{}/analyze-session", self.base_url))
            .json(&Req { session_id, events })
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(resp.report)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GenerateClueRequest {
    pub description: String,
    pub answer: String,
    pub difficulty: u8,
    pub num_hints: u8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratedClue {
    pub title: String,
    pub body: String,
    pub hints: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DifficultyEstimate {
    pub score: u8,
    pub reasoning: String,
}
