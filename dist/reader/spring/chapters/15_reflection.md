# What the Game Taught Us

```{epigraph}
You do not understand a system by reading about it. You understand it by breaking it.

-- Chapter 15
```

---

## Think about it

**1.** You have spent a semester building this system. What is the most important thing you learned that you could not have learned from a textbook?

**2.** The HITL framework describes five dimensions. After building the system, which dimension feels most important? Which feels like an abstraction that doesn't quite fit the reality you saw?

**3.** If you were asked to give advice to someone building the next HITL system — not this game, but a medical AI, an annotation platform, a content moderation tool — what are the three things you would tell them?

---

## The loop, closed

Let us trace the feedback loop one more time, now that all the pieces exist.

A creator sits at the web dashboard. They write a clue — or ask the AI to draft one — about a local landmark. They set a fuzzy threshold of 0.80, write three progressive hints, estimate difficulty at "medium." They print the QR sheet and place codes around the city. They activate the hunt.

A player opens the Flutter app, authenticates, starts a session. They walk to the first location, scan the code, read the clue. They submit an answer. It is rejected. They try again. After the third attempt, the hint button becomes active. They request hint 1. They solve it. They move to the next location.

An observer watches the session stream. They see that three players are simultaneously stuck on clue 2. They send a nudge to the most-stuck player. The player receives a banner message, smiles, moves.

At the end of the day, the creator reviews the session data. Clue 2: 4.7 average attempts, 89% hint usage, 23% abandonment. Clue 5: 1.1 average attempts, 0% hint usage, 0% abandonment. Clue 2 was too hard, or badly written, or placed at an inaccessible location. The creator does not know which without looking at the wrong answers — which the system does not store.

The loop is partially closed. The creator learned something. The system does not learn anything automatically.

This is HITL in practice.

---

## What we built (and what we left out)

Built:
- A Rust API that compiles, passes type checking, and handles the core game state machine
- A Python AI sidecar that generates clues and estimates difficulty using Claude
- A Flutter mobile app with QR scanning, NFC tapping, GPS submission, and OIDC auth
- A React web dashboard for creators and observers
- A PostgreSQL schema that captures the feedback signals of the loop
- A Zitadel OIDC server that manages identity without storing passwords
- A docker-compose environment that starts everything with one command

Left out (honestly):
- Redis integration (rate limiting, session cache) — declared but not wired
- Adaptive hints — built in the AI sidecar but not exposed through any route
- Wrong-answer capture — the schema does not store what players guessed, only that they guessed
- Tests — described in Chapter 13 but not implemented
- The calibration loop — session data accumulates but nothing reads it to improve estimates
- A health endpoint for the Rust API
- Backup policy for postgres

These omissions are not failures. They are the normal state of a real system in progress. Every production HITL system you will ever encounter has a list like this. The important thing is to know the list, name it, and prioritize it honestly.

---

## The five dimensions, revisited

**Control.** We gave creators fine-grained control (per-clue thresholds) but limited player control (cannot appeal an AI photo rejection, cannot see why a hint is not yet available). We gave developers unlimited control (can see the event log, can change the schema). The distribution of control followed the distribution of trust — which followed the distribution of technical access.

The lesson: control is rarely designed explicitly. It falls out of who has access to what. If you want to give users more control, you have to build it deliberately; it will not happen by default.

**Transparency.** Players can see their clue, their hints, and their progress. They cannot see attempt counts, elapsed time, or hint unlock conditions. Creators can see everything through the observer dashboard. The event log is comprehensive but unqueried.

The lesson: transparency is not binary. It is a set of discrete choices about what to expose to whom. Each choice has a cost (implementation) and a benefit (trust, feedback, accountability). Most systems are less transparent than their designers intended because the implementation cost was deferred.

**Feedback.** Player behavior is captured faithfully: attempts, hints used, timing, event sequence. None of it is used automatically to improve the system. The feedback loop requires a human (the creator) to review data, draw conclusions, and make changes. The loop is closed by human effort, not by mechanism.

The lesson: data collection is not feedback. Data collection is the prerequisite for feedback. The loop closes when someone acts on the data. Building collection infrastructure without building the path from data to action is common and expensive.

**Autonomy.** The system acts autonomously in well-defined situations: validates answers against explicit rules, unlocks hints when thresholds are met, creates player accounts on first login, rejects invalid tokens. It defers to humans in ambiguous situations: AI photo verification results are logged as events, not acted on automatically; adaptive hints require creator configuration that does not exist yet.

The lesson: the boundary of autonomy should be drawn at cases where incorrect automatic action would be harmful or hard to reverse. Automatic account creation is low-stakes — a wrong inference is corrected at login. Automatically marking a photo clue complete could let a player bypass a clue they did not actually solve, which is hard to undo.

**Trust.** Creators trust the AI suggestions to the extent they read them carefully before approving. Players trust the hint engine to release hints when they are actually stuck, not just when a timer expires. Observers trust the event stream to be complete, even though they cannot tell when it is lagged.

The lesson: trust in a system is calibrated over time by experience. A system that releases hints prematurely erodes trust in the hint engine. A system that sometimes rejects correct answers erodes trust in the validator. Building trust requires getting the defaults right for the most common cases — the edge cases can be addressed later, but the first impression sets expectations.

---

## What the game taught you

The game is a HITL system. You built it. You made choices — explicit ones (the threshold defaults, the role model) and implicit ones (what not to log, what to leave unimplemented). You are now the creator of a system that, if deployed, will shape the experience of every player who runs it.

Three questions for you to carry out of this edition:

**What did you get wrong?** Not in the sense of bugs (though those too), but in the sense of design decisions that seemed fine during implementation and feel wrong in retrospect. The schema, the API contract, the UI, the AI integration — somewhere in here there is a decision you would make differently now.

**What feedback would change your design?** If you ran this system with 100 real players and collected all the data, what would you look at first? What would cause you to redesign something significant?

**What is the human in your loop doing that no one is watching?** In every system, there is a human whose actions are consequential but unmonitored — an annotator whose disagreements are averaged away, a creator whose defaults were never reviewed, a developer whose SQL query returns slightly wrong results. Where is that human in this system?

---

## One last thing

The title of this handbook is "Human in the Loop: Misunderstood."

The misunderstanding is not that HITL is overcomplicated. It is that HITL is underestimated.

Putting a human in the loop sounds like a safety net — a fallback for when the AI is not sure. In practice, the human is doing the hardest parts of the whole system: defining what counts as correct, noticing when the system is wrong in ways the metrics do not capture, making decisions in the edge cases that no training data anticipated.

The game you built is a small system. The humans in it — the creator, the player, the observer — are doing hard things with imperfect tools.

That is the normal condition of HITL work. Build tools worthy of it.

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
