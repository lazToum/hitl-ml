# Testing HITL Systems

```{epigraph}
A test that passes tells you the code does what you expected. It tells you nothing about whether what you expected was right.

-- Chapter 13
```

---

## Think about it

**1.** You write a unit test for the fuzzy text validator. It passes for every case you wrote. A player later submits "mt. everest" for a clue where the answer is "Mount Everest" and gets rejected. What went wrong with the test?

**2.** Integration tests for a HITL system often require a running database, a running identity server, and sometimes a running AI service. Is a test that requires all three still a unit test? Does the distinction matter?

**3.** How do you test the human part of a HITL system? The creator's judgment, the player's behavior, the observer's decisions — these are not functions you can call with known inputs and check against expected outputs.

---

## What this system has, and what it lacks

This edition includes focused Rust unit tests for `clue_validator.rs` and `hint_engine.rs`. Those cover fuzzy text normalization, token matching, GPS boundaries, haversine distance, and hint unlock thresholds.

What should still exist:

- **Integration tests** for the API routes — start a session, submit answers, verify state transitions
- **Contract tests** between the Rust API and the Python sidecar — verify the JSON schema matches on both sides
- **Behavioral tests** for the HITL loop — given simulated player behavior, does the system produce the right feedback signals?
- **Frontend/mobile smoke tests** for the core routes and player flows

The first three categories are conventional software testing. The last two are harder and more interesting.

---

## Unit testing the validator

The fuzzy text validator is the best candidate for unit tests. It is a pure function (no database, no network), it has edge cases that are easy to enumerate, and failures have direct user impact.

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exact_match_always_passes() {
        assert!(validate_text("Mount Everest", "Mount Everest", 0.85));
    }

    #[test]
    fn case_insensitive() {
        assert!(validate_text("mount everest", "Mount Everest", 0.85));
    }

    #[test]
    fn punctuation_stripped() {
        assert!(validate_text("Mt. Everest!", "Mount Everest", 0.70));
    }

    #[test]
    fn abbreviation_accepted_at_lower_threshold() {
        // "mt everest" vs "mount everest" — depends on threshold
        assert!(validate_text("mt everest", "mount everest", 0.70));
        // but should fail at strict threshold
        assert!(!validate_text("mt everest", "mount everest", 0.95));
    }

    #[test]
    fn completely_wrong_answer_rejected() {
        assert!(!validate_text("Big Ben", "Mount Everest", 0.85));
    }

    #[test]
    fn empty_answer_rejected() {
        assert!(!validate_text("", "Mount Everest", 0.85));
    }
}
```

Tests like these now live in `clue_validator.rs` and catch regressions if the normalization, token validation, GPS logic, or similarity function changes. They would not catch a missing edge case if nobody imagined it. The tests are only as good as the examples the writer chose.

---

## Integration testing the API

Integration tests for the API require a running database. Axum provides a `TestServer` abstraction for in-process testing without binding a real port:

```rust
#[cfg(test)]
mod api_tests {
    use axum::http::StatusCode;
    use axum_test::TestServer;

    async fn test_server() -> TestServer {
        let db = PgPool::connect(&std::env::var("TEST_DATABASE_URL").unwrap())
            .await.unwrap();
        sqlx::migrate!().run(&db).await.unwrap();
        let app = crate::routes::router(AppState::new(db, Config::from_env()));
        TestServer::new(app).unwrap()
    }

    #[tokio::test]
    async fn start_session_requires_active_hunt() {
        let server = test_server().await;

        // Create a hunt in draft status
        let hunt_resp = server.post("/hunts")
            .json(&json!({"title": "Test Hunt"}))
            .add_header("Authorization", "Bearer <creator_token>")
            .await;
        let hunt_id = hunt_resp.json::<serde_json::Value>()["id"].as_str().unwrap();

        // Attempt to start a session — should fail (hunt is draft)
        let session_resp = server.post("/sessions")
            .json(&json!({"hunt_id": hunt_id}))
            .add_header("Authorization", "Bearer <player_token>")
            .await;

        assert_eq!(session_resp.status_code(), StatusCode::BAD_REQUEST);
    }
}
```

Integration tests catch bugs that unit tests cannot: a service function that calls the right validator but forgets to increment attempts, a route that checks the wrong role, a state machine that allows invalid transitions.

They are also slower and require infrastructure. The standard solution is to run integration tests in CI with a disposable test database, not in the local development loop.

---

## Contract testing the Python sidecar

The Rust API calls the Python sidecar with specific JSON request bodies and expects specific response shapes. If either side changes its schema without updating the other, the integration silently breaks.

Contract tests verify the interface:

```python
# backend-python/tests/test_contracts.py

def test_generate_clue_response_shape():
    """Verify that clue generation returns the fields the Rust API expects."""
    result = asyncio.run(generate_clue(
        description="a town square",
        answer="clock tower",
        difficulty=3,
        num_hints=3,
    ))
    assert "title" in result
    assert "body" in result
    assert isinstance(result.get("hints"), list)
    assert len(result["hints"]) == 3
```

```rust
// backend-rust/tests/ai_client_contract.rs

#[tokio::test]
async fn generate_clue_deserializes() {
    let client = AiClient::new("http://localhost:8001".into());
    let result = client.generate_clue(GenerateClueRequest {
        description: "a town square".into(),
        answer: "clock tower".into(),
        difficulty: 3,
        num_hints: 3,
    }).await;
    // If this deserializes without error, the contract is satisfied
    assert!(result.is_ok());
}
```

These tests do not check correctness — whether the AI generated a good clue. They check structure — whether the response is parseable by the consumer.

---

## Testing the HITL loop

The most important test for a HITL system is one that does not exist in most testing frameworks: does the system correctly capture, store, and (eventually) act on human feedback?

A behavioral test for the hint-improvement loop might look like:

1. Create a hunt with one deliberately hard clue (hint threshold: 0 attempts, so hints are always available)
2. Simulate 100 sessions where players all request hints for this clue
3. Verify that `session_clues.hints_used >= 1` for all sessions
4. Query the aggregate hint usage rate
5. Assert it matches expectations from the simulation

This tests not just individual functions but the end-to-end data flow from player action to persistent signal.

These tests are rare in practice because they require test infrastructure for simulation. They are also the tests most likely to catch real HITL bugs — loops that appear to work but silently fail to close.

---

## What tests cannot do

Tests verify that code does what it is specified to do. They cannot verify that the specification is right.

The hint engine might have 100% test coverage while still implementing the wrong policy — releasing hints too early, withholding them too long, or unlocking the wrong hint in sequence. These are business logic errors that tests will not catch unless the tests were written by someone who deeply understood the intended behavior.

In HITL systems specifically, the "intended behavior" often includes human judgment that is hard to encode as test assertions. "Does this clue feel fair to the average player?" is not a function you can call.

Testing a HITL system well requires running it with real humans and studying the results — which is exactly what the session and event logs are for.

---

## Reflection

The system has some unit tests but still lacks the end-to-end tests that would prove the whole loop works. Before writing the next test, make a list of the five most important behaviors to test in this system — the five things that, if broken, would cause the most harm to users or the most loss of trust in the system.

How did you prioritize? What made something more important to test than something else?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
