# The Five Dimensions in Play

```{epigraph}
A framework is useful not when it answers your questions, but when it helps you ask better ones.

-- Chapter 2
```

---

## Think about it

**1.** A self-driving car can hand control back to the human driver. But studies show that drivers who have been disengaged for twenty minutes are slower to react than drivers who have been driving the whole time. Automation erodes the skills it replaces. Is handing back control the same as *having* control?

**2.** Think of a system you use where you do not know how it decides what to show you. Does not knowing bother you? Would knowing change your behavior?

**3.** "The human is in the loop" is often used to mean "a human approves outputs before they are acted on." But approval is not the same as understanding. When does human approval add value, and when is it theater?

---

## Five dimensions

The earlier editions of this handbook introduced five dimensions along which HITL systems vary. Here we will ground each one concretely in the treasure hunt codebase — in the actual decisions encoded in actual files.

This chapter is both a conceptual map and a code tour. Every dimension points to a real file you will read or write later.

---

## Dimension 1: Control

*Who can override whom, and when?*

Control in HITL systems is rarely binary. It is a spectrum of authority distributed across roles, time, and stakes.

In the treasure hunt, control appears in at least three places:

**Answer validation.** When a player submits "Eiffel Tower" and the correct answer is "eiffel tower," the fuzzy matching algorithm decides whether they are equivalent. The creator set the threshold (default: 0.85 similarity). The developer wrote the algorithm. The player has no voice in this decision — they just see "Correct" or "Try again." Control sits entirely with the creator and developer.

The relevant code is in `backend-rust/src/services/clue_validator.rs`. Notice the `answer_tolerance` field in the schema: it is a per-clue parameter the creator sets, but it has a default they may never touch. A default is a decision someone made once, propagated silently to everyone.

**Hint unlock.** The hint engine (`services/hint_engine.rs`) will not release a hint until either enough time has passed or enough attempts have been made. A player who figures something out after one second cannot get a hint to confirm their thinking. Control sits with the creator who set the thresholds.

**Hunt status.** A creator can change a hunt from `draft` to `active` to `archived`. They can edit clues before a hunt starts. After it starts, their changes affect in-progress sessions immediately. There is no version lock. A player halfway through a hunt could, in principle, find that a clue changed under them. The code does not prevent this — it is a design decision left open.

:::{admonition} Build prompt
:class: tip
Later, you will implement a `PATCH /hunts/:id` endpoint. When you do: should editing a clue on an active hunt be allowed? If yes, what should happen to sessions already past that clue? If no, what does the UI show when a creator tries?
:::

---

## Dimension 2: Transparency

*What can each role see about the system's behavior?*

Transparency is not a single thing. There is transparency about *what* the system decided, *why* it decided it, *what data it used*, and *what the alternatives were*. These are four distinct things that HITL systems routinely conflate.

In the treasure hunt:

**For the player:** When they receive a hint, they see the hint text. They do not see why the system decided to offer it now — whether it was because of elapsed time or attempt count. They do not see the hint sequence (is this hint 1 of 3 or hint 3 of 3?). The `HintView` model in `models/clue.rs` exposes `sequence` and `body` — so the information exists, the question is whether the UI surfaces it.

**For the creator:** The observer dashboard (`routes/observer.rs`) streams live session events over WebSocket. A creator watching a live hunt can see which clue each player is on, how many attempts they have made, whether they have used hints. This is high transparency — arguably more than a creator designing a physical hunt would have.

**For the developer:** The event log table (`events` in `db/schema.sql`) captures every significant action with a JSONB payload. In principle, any query is possible. In practice, this edition does not build a query UI over it — that is left as an exercise.

:::{admonition} The transparency gap
:class: note
Players cannot see how the hint unlock threshold was set. Creators cannot see how other creators set theirs. Developers can see everything. This asymmetry is common in HITL systems — the people with the least power often have the least visibility into why the system behaves as it does.
:::

---

## Dimension 3: Feedback

*How does human behavior change the system over time?*

Feedback is the dimension most associated with "machine learning" in HITL. The loop only closes if information from human behavior re-enters the system and changes something.

In the treasure hunt, feedback exists at two levels:

**Session-level feedback.** Every attempt, hint request, and solve time is captured in `session_clues`. This is raw behavioral signal. It tells us: this clue had a 78% first-attempt success rate; that clue had an average of 4.2 attempts and 1.8 hints used. The schema records it. Nothing yet reads it systematically.

**AI-level feedback.** The Python sidecar (`backend-python/app/services/difficulty.py`) can estimate how hard a clue will be before a hunt runs. After the hunt, the actual difficulty (from session data) could be compared to the estimate and used to calibrate the model. This calibration loop is described but not implemented.

This is honest. Most real HITL systems have loops that are planned but never closed. The data is collected, but the retraining pipeline is "coming soon," and soon never comes. Naming this gap is part of understanding HITL in practice.

:::{admonition} The open loop
:class: warning
An open loop is not a failed loop. Sometimes you collect data first and decide what to do with it later. The danger is forgetting to close it — building infrastructure that accumulates signal forever without anyone acting on it. The `events` table in this system is at risk of becoming exactly that.
:::

---

## Dimension 4: Autonomy

*When does the system act without asking?*

Autonomy is not just about what the AI does — it is about what the whole system does without requiring human confirmation.

In the treasure hunt, high-autonomy behaviors include:

- **Answer validation**: The system accepts or rejects answers without human review. If your fuzzy matcher says 0.84 and the threshold is 0.85, the answer is rejected. No human ever sees it.
- **Hint dispatch**: When the unlock conditions are met, a hint is available. The system does not ask the creator whether to release it.
- **Player creation**: On first login, the middleware (`middleware/auth.rs`) creates a new player row automatically, inferring their role from their Dex group. No human approves the account.

Low-autonomy behaviors (requiring human action):

- **Hunt activation**: A creator must explicitly set `status = 'active'`. The system will not start a hunt on its own, even if `start_time` has passed.
- **Clue content**: The AI can *suggest* a clue, but a human must submit it via the creator dashboard. The AI has no write access to the clues table.

This boundary — AI suggests, human commits — is a common pattern in responsible HITL design. It is also a performance tax. Every AI suggestion that requires human confirmation is a friction point that determines whether the AI will actually be used.

---

## Dimension 5: Trust

*Under what conditions will a human follow the system's output?*

Trust is the dimension that is hardest to engineer and easiest to destroy.

In the treasure hunt, trust manifests differently for each role:

**Player trust.** A player who has tried four times and received a hint from the system — do they follow it? Or do they assume the hint is wrong because the system has been unhelpful before? Player trust in hint quality depends on actual hint quality, which depends on creator effort, which depends on whether creators believe the hints matter.

**Creator trust in the AI.** The clue generator (`backend-python/app/services/clue_generator.py`) can produce clue text from a theme and a location. If a creator uses it, they are trusting that the output is good enough to use — or they are reviewing it critically and editing heavily. Either behavior is reasonable. The question for the system designer is: do you want the AI to be a starting point or a finishing point?

**Observer trust in the live view.** An observer watching the WebSocket stream sees events as they happen. If there is a bug in the event logger, they may see nothing — or wrong data — and not know. Trust in a monitoring tool depends on calibration: being told when the tool is unreliable, not just when it is working.

:::{admonition} Trust and defaults
:class: note
Every default in the system encodes an assumption about trust. The default fuzzy threshold of 0.85 implies the system trusts that answers within 15% of the correct string are probably correct. The default hint unlock of 5 minutes implies the system trusts that 5 minutes is long enough for a genuine attempt. These defaults will be wrong for some hunts. The question is: who do you trust to change them?
:::

---

## The map

With the five dimensions in hand, here is a map of the chapters ahead:

| Chapter | Builds | Primary dimension |
|---------|--------|-------------------|
| 3 | Schema | Transparency (what is visible), Control (who can change what) |
| 4 | Rust API | Autonomy (what runs without asking) |
| 5 | Auth/OIDC | Control (roles), Trust (identity) |
| 6 | Validation | Autonomy, Control |
| 7 | Hints | Autonomy, Feedback |
| 8 | AI sidecar | Feedback, Trust |
| 9 | Creator UI | Transparency, Control |
| 10 | Player app | Trust, Transparency |
| 11 | Observer | Transparency, Feedback |
| 12 | Physical | Trust (physical vs. digital) |
| 13 | Testing | All five |
| 14 | Deployment | Autonomy |
| 15 | Reflection | All five |

Use this as a compass, not a syllabus. The dimensions bleed into each other.

---

## Reflection

The five-dimension framework is a tool for analysis, not a truth. It was constructed to be useful, not to be correct.

Where does it feel like it fits badly? Is there a dimension missing? Is there a dimension that collapses into another when you look at a real system?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
