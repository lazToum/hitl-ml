# Answer Validation: The Judgment Call

```{epigraph}
Every threshold is an argument. The argument is usually implicit.

-- Chapter 6
```

---

## Think about it

**1.** A clue asks "What is the tallest mountain in the world?" A player answers "mount everest." Another answers "Everest." Another answers "Mt. Everest (8,849 m)." Which should be marked correct? Who decides? What about "Chomolungma"?

**2.** Fuzzy string matching gives a similarity score between 0 and 1. You choose a threshold. Above it: correct. Below it: wrong. But the score for "mount everest" vs "everest" is different from the score for "london" vs "longon." Is a single global threshold ever right?

**3.** A GPS clue says "stand at the fountain." The fountain is 8 metres across. You choose a 10-metre radius. Is that generous or strict? What if the fountain is in a city with GPS accuracy of ±15 metres?

---

## Five answer types, five problems

The clue table allows five answer types: `text`, `qr`, `nfc`, `gps`, `photo`. Each requires fundamentally different validation logic. This chapter walks through how each is implemented and where the human judgment is hidden.

The relevant file is `backend-rust/src/services/clue_validator.rs`.

---

## Text: fuzzy matching

Text answers are the most common and the hardest to get right.

```rust
pub async fn validate_text(
    clue: &Clue,
    submission: &AnswerSubmission,
    ai: Option<&AiClient>,
) -> Result<ValidationResult> {
    let a = normalize(&submission.value);
    let c = normalize(&clue.answer_value);
    if a == c { return Ok(pass(1.0)); }

    let score = strsim::jaro_winkler(&c, &a);
    if score >= clue.answer_tolerance {
        return Ok(pass(score));
    }

    if score >= 0.45 {
        if let Some(ai) = ai {
            if let Ok(semantic_score) = ai.semantic_match(&c, &a).await {
                if semantic_score >= clue.answer_tolerance {
                    return Ok(pass(semantic_score));
                }
            }
        }
    }

    Ok(fail(score))
}

fn normalize(s: &str) -> String {
    s.trim()
     .to_lowercase()
     .chars()
     .filter(|c| c.is_alphanumeric() || c.is_whitespace())
     .collect::<String>()
     .split_whitespace()
     .collect::<Vec<_>>()
     .join(" ")
}
```

Three steps: normalize, compare, and optionally ask the AI sidecar for a semantic fallback.

**Normalization** strips case, punctuation, and extra whitespace. "Mount Everest!" and "mount everest" become the same string after normalization. One subtlety: `char::is_alphanumeric()` is Unicode-aware, so the filter keeps accented and non-Latin letters — "Zürich" becomes "zürich", and "Chomolungma" (Tibetan name for Everest) passes through unchanged. That is good news for multilingual hunts, with one caveat: the code does no Unicode normalization, so the same name typed in NFC and NFD forms (precomposed `ü` vs. `u` + combining diaeresis) will not match. Creators designing multilingual hunts should be aware of that limitation; stripping diacritics deliberately would require an explicit transliteration step the code does not have.

**Jaro-Winkler similarity** is a string distance metric that weights prefix matches more heavily. It performs well on place names, which often share prefixes. Note that Jaro-Winkler is not a true distance metric — it violates the triangle inequality — so a threshold of 0.85 does not guarantee transitivity between answers. A threshold of 0.85 (the default) means the strings must be 85% similar after normalization.

**Semantic fallback** handles plausible answers that string matching misses. If the string score is at least 0.45 but still below the clue's tolerance, the Rust validator calls the Python sidecar's `/semantic-match` endpoint. This keeps obvious wrong answers cheap while allowing synonym or paraphrase matches to pass. (The 0.45 gate is a heuristic — it was chosen to pass answers that are "plausibly close" without calling the sidecar for every guess. Like the 0.85 default, it would benefit from calibration against real answer data.)

The creator sets the threshold per clue. A loose clue (creative writing, open-ended) might use 0.70. A strict clue (a specific code, a proper noun) might use 0.95 or even require exact match.

:::{admonition} The 0.85 argument
:class: note
Why 0.85? Because it was the first value tried and it worked on test cases. That is the honest answer. Most thresholds in deployed systems were chosen the same way. Calibrating a threshold properly requires a distribution of actual user answers — which you only have after running the system. The first threshold is always a guess.
:::

---

## QR and NFC: token matching

QR and NFC answers are the simplest to validate:

```rust
async fn validate_token(db: &PgPool, clue: &Clue, submission: &AnswerSubmission) -> Result<ValidationResult> {
    let expected = hunt_engine::token_for_clue(db, clue.id).await?;
    let passed   = submission.value.trim() == expected.trim();
    Ok(ValidationResult {
        passed,
        score:    if passed { 1.0 } else { 0.0 },
        feedback: if passed { Feedback::Correct } else { Feedback::Incorrect },
    })
}
```

Exact match after trimming whitespace. The player scans a physical tag and the app sends the decoded token. The validator looks the token up from `clue_tokens` — the same token the printable QR sheet encodes — and compares the scan against it; the creator never has to copy anything into the answer field. The token is a random string generated when the clue is created (`hunt_engine::generate_token()`). No fuzzy matching, no tolerance — either the player holds the code or they do not. Note that "holds" is literal: a photo of the QR code circulates as easily as the code itself, so a valid token proves possession of the code, not presence at the location.

This is the highest-precision answer type. It is also the least forgiving: a corrupted QR code, a smudged NFC tag, or a phone that cannot scan reliably will produce a wrong answer with no recourse.

The tokens are stored in `clue_tokens`, one per clue, generated once and stable. They encode no information about the hunt or clue — a 12-character alphanumeric string from a carefully chosen charset that avoids ambiguous characters (`0/O`, `1/l`).

---

## GPS: proximity

GPS answers check whether the player is within a configured radius of a target location:

```rust
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

fn haversine_metres(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    use std::f64::consts::PI;
    let r = 6_371_000.0_f64; // Earth radius in metres
    let d_lat = (lat2 - lat1) * PI / 180.0;
    let d_lon = (lon2 - lon1) * PI / 180.0;
    let a = (d_lat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lon / 2.0).sin().powi(2);
    r * 2.0 * a.sqrt().asin()
}
```

The `answer_value` for a GPS clue is a `"lat,lon"` string (e.g., `"51.5074,-0.1278"`), parsed by `parse_coords`. The `answer_tolerance` is the radius in metres. The app sends the player's current GPS coordinates. Note the failure modes: a submission without coordinates returns `NotAtLocation`, and an unparseable target string fails validation outright — the validator never guesses a default location. The distance itself is a hand-rolled haversine, small enough that no external crate was worth the dependency.

The hidden complexity: GPS accuracy varies by device, conditions, and location. Indoor GPS can be off by 30 metres. Urban canyons with tall buildings can be worse. A 10-metre radius that works in an open park will fail in a city centre.

This is where the creator's judgment matters most. They set the radius. They do not have a good way to test whether their radius is too tight until players fail — and the event log is blunter than you might hope: a failed GPS attempt is recorded with only its score and attempt count, not the player's coordinates, so the data to calibrate a radius against does not exist unless the logging is extended.

---

## Photo: AI verification

Photo answers are the most experimental. The player takes a photo of a subject (a landmark, an object, a piece of graffiti) and submits it. The system sends the image to the Python AI sidecar for verification.

```rust
pub async fn validate_photo(
    ai: &AiClient,
    photo_b64: &str,
    description: &str,
    tolerance: f64,
) -> Result<bool> {
    let confidence = ai.verify_photo(description, photo_b64).await?;
    Ok(confidence >= tolerance)
}
```

The Python sidecar (`backend-python/app/services/photo_verifier.py`) sends the image to a vision-capable model (via litellm — a paid API or a free local `ollama/llava`) to check whether it matches the expected description. The description is the `answer_value` of the clue (e.g., "a red front door with a brass knocker").

This is the most powerful answer type and the least deterministic. The same photo can get different results on different calls. The clue's `answer_tolerance` becomes the required confidence threshold, but the AI's judgment is still opaque. A creator who uses photo answers has delegated the validation decision to a language model, and the player has no way to appeal.

:::{admonition} Delegation and accountability
:class: warning
When the AI rejects a photo answer, who is responsible? The creator, who wrote the description? The developer, who built the photo validator? The API provider, whose model made the call? The player has nowhere to escalate. This is a general problem with AI-in-the-loop systems: accountability becomes diffuse when decisions are delegated.

Note also a practical concern: phone cameras produce multi-megabyte images that can exceed vision API payload limits. The Flutter app already downsizes on pick (`image_picker` with `maxWidth: 1280`, `imageQuality: 70`), and even those JPEGs routinely exceed 1 MB — a tighter bound (e.g., 1024px on the longest edge) is worth considering, and the web player path should adopt the same client-side resize before submitting.
:::

---

## Where validation happens

Validation is called from `routes/sessions.rs` in the `submit_answer` handler. The handler fetches the current clue, rate-limits attempts through Redis if available, increments the attempt counter, and calls `clue_validator.rs`. The result is:

- `Correct`: advance to next clue (or complete the hunt)
- `Wrong`: increment attempt counter, return feedback

The attempt counter is important: it feeds the hint unlock logic. A player who has attempted three times is eligible for hints regardless of elapsed time. The validation function does not know about hints — that is the hint engine's concern. But the attempt counter is the link between them.

---

## The full decision tree

```
submit_answer(session_id, answer)
│
├─ fetch current clue for session
├─ rate-limit with Redis if available
├─ increment attempts for this session/clue
├─ call validate(clue, submission)
│  ├─ text  → normalize + jaro_winkler against answer_value, then semantic fallback if plausible
│  ├─ qr    → exact trimmed match against the clue's token in clue_tokens
│  ├─ nfc   → exact trimmed match against the clue's token in clue_tokens
│  ├─ gps   → haversine distance to answer_value coordinates <= tolerance (metres)
│  └─ photo → ai_client.verify_photo(description, photo_b64) >= tolerance
├─ event_logger::log(ANSWER_ATTEMPTED)
│
├─ if correct:
│  ├─ session_manager::advance(session_id, clue_id)
│  │  ├─ mark session_clue solved
│  │  ├─ unlock next clue
│  │  └─ if no next: mark session completed
│  └─ event_logger::log(ANSWER_CORRECT)
│
└─ if wrong:
   └─ return feedback without advancing
```

---

## Reflection

The validation logic treats all answer types as equivalent decision points — either the answer passes the threshold or it does not. But the consequences of a false negative (incorrectly rejecting a correct answer) differ by type.

For text answers, the player can try a different phrasing. For GPS answers, the player can move. For photo answers, the player has to take a different photo and hope the AI decides differently. This system would not be classified as high-risk under the EU AI Act — it is a game, not employment screening or border control — but the Act's high-risk requirements (human oversight, contestability) show what "accountable by design" looks like, and a player with no appeals process for an AI-rejected photo has none of it.

What would a "graceful degradation" policy look like for each answer type? Should the system behave differently after the 5th failed GPS attempt vs. the 5th failed text attempt?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
