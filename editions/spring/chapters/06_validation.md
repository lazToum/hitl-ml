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

    let score = strsim::jaro_winkler(&a, &c);
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

**Normalization** strips case, punctuation, and extra whitespace. "Mount Everest!" and "mount everest" become the same string after normalization. This handles the most common sources of incorrect rejections.

**Jaro-Winkler similarity** is a string distance metric that weights prefix matches more heavily. It performs well on place names, which often share prefixes. A threshold of 0.85 (the default) means the strings must be 85% similar after normalization.

**Semantic fallback** handles plausible answers that string matching misses. If the string score is at least 0.45 but still below the clue's tolerance, the Rust validator calls the Python sidecar's `/semantic-match` endpoint. This keeps obvious wrong answers cheap while allowing synonym or paraphrase matches to pass.

The creator sets the threshold per clue. A loose clue (creative writing, open-ended) might use 0.70. A strict clue (a specific code, a proper noun) might use 0.95 or even require exact match.

:::{admonition} The 0.85 argument
:class: note
Why 0.85? Because it was the first value tried and it worked on test cases. That is the honest answer. Most thresholds in deployed systems were chosen the same way. Calibrating a threshold properly requires a distribution of actual user answers — which you only have after running the system. The first threshold is always a guess.
:::

---

## QR and NFC: token matching

QR and NFC answers are the simplest to validate:

```rust
pub fn validate_qr_nfc(submitted_token: &str, correct_token: &str) -> bool {
    submitted_token.trim() == correct_token.trim()
}
```

Exact match after trimming whitespace. The player scans a physical tag and the app sends the decoded token. The token is a 12-character random string generated when the clue is created (`hunt_engine::generate_token()`). No fuzzy matching, no tolerance — either the player is physically at the right location or they are not.

This is the highest-precision answer type. It is also the least forgiving: a corrupted QR code, a smudged NFC tag, or a phone that cannot scan reliably will produce a wrong answer with no recourse.

The tokens are stored in `clue_tokens`, one per clue, generated once and stable. They encode no information about the hunt or clue — a 12-character alphanumeric string from a carefully chosen charset that avoids ambiguous characters (`0/O`, `1/l`).

---

## GPS: proximity

GPS answers check whether the player is within a configured radius of a target location:

```rust
pub fn validate_gps(lat: f64, lon: f64, target: &str, radius_metres: f64) -> bool {
    let (tlat, tlon) = parse_latlon(target).unwrap_or((0.0, 0.0));
    let d = haversine::distance(
        &haversine::Location { latitude: lat, longitude: lon },
        &haversine::Location { latitude: tlat, longitude: tlon },
        haversine::Units::Meters,
    );
    d <= radius_metres
}
```

The `answer_value` for a GPS clue is a `"lat,lon"` string (e.g., `"51.5074,-0.1278"`). The `answer_tolerance` is the radius in metres. The app sends the player's current GPS coordinates.

The hidden complexity: GPS accuracy varies by device, conditions, and location. Indoor GPS can be off by 30 metres. Urban canyons with tall buildings can be worse. A 10-metre radius that works in an open park will fail in a city centre.

This is where the creator's judgment matters most. They set the radius. They do not have a good way to test whether their radius is too tight until players fail. The event log will show GPS validation failures (with coordinates), but only if someone looks at it.

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

The Python sidecar (`backend-python/app/services/photo_verifier.py`) uses the Claude Vision API to check whether the image matches the expected description. The description is the `answer_value` of the clue (e.g., "a red front door with a brass knocker").

This is the most powerful answer type and the least deterministic. The same photo can get different results on different calls. The clue's `answer_tolerance` becomes the required confidence threshold, but the AI's judgment is still opaque. A creator who uses photo answers has delegated the validation decision to a language model, and the player has no way to appeal.

:::{admonition} Delegation and accountability
:class: warning
When the AI rejects a photo answer, who is responsible? The creator, who wrote the description? The developer, who built the photo validator? The API provider, whose model made the call? The player has nowhere to escalate. This is a general problem with AI-in-the-loop systems: accountability becomes diffuse when decisions are delegated.
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
├─ call validate(answer, clue.answer_value, clue.answer_type, clue.answer_tolerance)
│  ├─ text  → normalize + jaro_winkler, then semantic fallback if plausible
│  ├─ qr    → exact trimmed token match
│  ├─ nfc   → exact trimmed token match
│  ├─ gps   → haversine distance <= tolerance (metres)
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

For text answers, the player can try a different phrasing. For GPS answers, the player can move. For photo answers, the player has to take a different photo and hope the AI decides differently.

What would a "graceful degradation" policy look like for each answer type? Should the system behave differently after the 5th failed GPS attempt vs. the 5th failed text attempt?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
