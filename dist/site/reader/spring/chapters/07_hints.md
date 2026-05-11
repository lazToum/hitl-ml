# The Hint Engine: When to Help

```{epigraph}
Help that arrives too early prevents learning. Help that arrives too late causes frustration. The gap between them is the entire art of pedagogy.

-- Chapter 7
```

---

## Think about it

**1.** You are designing a hint system for a puzzle. At what point do you release the first hint — after 1 minute? 5 minutes? 3 wrong answers? How did you arrive at that number?

**2.** Hints reduce the player's feeling of accomplishment. They also prevent players from quitting in frustration. How would you measure which effect dominates for a given clue?

**3.** An adaptive hint system could give different hints to different players based on their history — a player who consistently solves quickly might get harder hints; a player who has been struggling all day might get more direct ones. Is that personalization or unfairness?

---

## The hint contract

The hint engine in `services/hint_engine.rs` makes two promises:

1. **It will not give hints too early.** A player who is actively trying deserves time to struggle productively. Hints released immediately remove the challenge.
2. **It will not withhold hints forever.** A player who is genuinely stuck, not just impatient, should be able to get help rather than quit.

These two promises pull in opposite directions. The unlock conditions are the policy that resolves the tension.

---

## Unlock conditions

```rust
fn hint_unlocked(sc: &SessionClue, clue: &ClueMeta, next_sequence: i32) -> bool {
    if next_sequence == 1 {
        let elapsed = Utc::now()
            .signed_duration_since(sc.unlocked_at)
            .num_minutes();
        return elapsed >= clue.hint_unlock_after_minutes as i64
            || sc.attempts >= clue.hint_unlock_after_attempts;
    }
    true
}
```

The first hint unlocks when either:
- Enough time has passed since the clue was unlocked (`hint_unlock_after_minutes`), or
- Enough attempts have been made (`hint_unlock_after_attempts`)

Subsequent hints (`next_sequence > 1`) are always available once the first is unlocked. The logic is: if you needed hint 1, you probably need hint 2; there is no value in making you wait again.

Both thresholds are per-clue parameters set by the creator. The defaults are 5 minutes and 3 attempts. A creator who wants to make their hunt more challenging can increase these. A creator designing an accessible hunt for children or beginners can set them to 0 (always available).

---

## The hint sequence

```rust
pub async fn request_hint(
    db: &PgPool,
    session_id: Uuid,
    clue_id: Uuid,
) -> Result<HintView> {
    let sc = fetch_session_clue(db, session_id, clue_id).await?;
    let clue = fetch_clue_meta(db, clue_id).await?;
    let total_hints = count_hints(db, clue_id).await?;

    if total_hints == 0 {
        return Err(AppError::NotFound("no hints for this clue".into()));
    }

    let next_sequence = sc.hints_used + 1;

    if !hint_unlocked(&sc, &clue, next_sequence) {
        return Err(AppError::BadRequest(
            "hint not yet available — keep trying or wait a bit".into(),
        ));
    }

    if next_sequence > total_hints as i32 {
        return Err(AppError::NotFound("no more hints available".into()));
    }

    let hint = sqlx::query_as!(Hint,
        "SELECT id, clue_id, sequence, body FROM hints
         WHERE clue_id = $1 AND sequence = $2",
        clue_id, next_sequence,
    ).fetch_one(db).await
     .map_err(|_| AppError::NotFound("hint not found".into()))?;

    sqlx::query!(
        "UPDATE session_clues SET hints_used = $1
         WHERE session_id = $2 AND clue_id = $3",
        next_sequence, session_id, clue_id,
    ).execute(db).await?;

    Ok(HintView { sequence: hint.sequence, body: hint.body })
}
```

Hints are numbered by sequence. The system tracks `hints_used` per `session_clue` row. Each call to `request_hint` gives the next hint in sequence — you cannot skip hint 1 to get hint 2. This forces creators to write hints in increasing order of specificity: hint 1 is a nudge, hint 2 is more direct, hint 3 effectively gives the answer.

This ordering is a design choice. An alternative would be to give the player all available hints at once when they first unlock. Or to let them choose which hint to see. The current design reflects a pedagogical preference: graduated assistance, earned incrementally.

---

## Hints as cost

In some game designs, hints are "purchased" with penalty points. This introduces an explicit cost that changes player behavior: players will tolerate more frustration to preserve their score.

This system does not implement scoring, so hints are free. But `hints_used` is tracked. The event log records every hint request. A creator reviewing the data after a hunt can see: clue 3 had 72% hint usage; clue 7 had 8%. This is a signal — clue 3 might be poorly worded, ambiguous, or simply too hard for this audience.

This is the feedback loop for clue improvement. The creator designed clues. Players ran into walls. The data shows where. A better creator (or the same creator next time) uses that signal to write clearer clues.

---

## Viewing unlocked hints

When a player navigates back to a clue they are currently on — common in the mobile app — they should see all hints they have already unlocked, not just the last one:

```rust
pub async fn unlocked_hints(
    db: &PgPool,
    session_id: Uuid,
    clue_id: Uuid,
) -> Result<Vec<HintView>> {
    let sc = fetch_session_clue(db, session_id, clue_id).await?;

    let hints = sqlx::query_as!(Hint,
        "SELECT id, clue_id, sequence, body FROM hints
         WHERE clue_id = $1 AND sequence <= $2
         ORDER BY sequence",
        clue_id, sc.hints_used,
    ).fetch_all(db).await?;

    Ok(hints.into_iter()
       .map(|h| HintView { sequence: h.sequence, body: h.body })
       .collect())
}
```

This is called when building the `ClueView` — the complete view of a clue as a player sees it, including all hints they have earned so far. The hints are ordered by sequence; the most recent hint is last.

---

## What the AI could do

The current hint system is entirely static: hints are written by the creator and served verbatim. The AI sidecar has two methods — `adaptive_hint` and `analyze_session` — that are built but not yet wired into any route.

`adaptive_hint` could generate a personalized hint based on:
- The clue text and correct answer
- The player's previous attempts (what did they guess?)
- The player's session history (are they generally strong or struggling?)
- The number of hints already used

This would require passing wrong answer strings to the AI — which means capturing them in the schema (they are not currently stored). It also requires a judgment call about personalization: is it appropriate to give different hints to different players based on their history?

`analyze_session` could review a completed session and flag clues that seem to have caused unusual difficulty, producing a report for the creator.

Neither is enabled. The infrastructure is there. The decision to enable it — with its implications for data collection, privacy, and fairness — is yours.

---

## Reflection

The hint unlock conditions (time and attempts) are observable to the player — they know roughly when hints become available. But the specific thresholds are not shown. A player does not know if they need to wait 5 minutes or 15.

Should the player know when their next hint will unlock? What does showing that information do to player behavior? What does hiding it do?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
