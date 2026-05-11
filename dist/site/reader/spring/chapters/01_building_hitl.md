# Building HITL: Why a Game?

```{epigraph}
A system that only works when no one is using it is not a system. It is a sketch.

-- Chapter 1
```

---

## Think about it

**1.** You have probably used a HITL system today. A spam filter that learned from the mail you marked as junk. A search engine that updated its model when you ignored the top result and clicked the third. A music app that noted when you skipped after three seconds. In each case, where was the human? Where was the loop?

**2.** Most HITL textbooks show you diagrams of the loop — annotation feeds training, training produces predictions, predictions go to humans, humans annotate. But when you've seen real systems, does the loop actually close? Or does it stop somewhere?

**3.** What would it mean to *feel* the loop rather than observe it? To be the annotator, not just the analyst?

---

## The premise

Most treatments of human-in-the-loop machine learning describe it from the outside.

You learn what active learning is. You learn what RLHF stands for. You learn that annotators disagree and that crowdsourced labels are noisy. You read about systems where humans are involved — but you are not the human, and you are not building the system.

This edition flips that. We will build a system where the loop is tangible because it runs on a computer you control, where the humans are people you can observe because they are playing a game you designed.

The game is a treasure hunt. Players follow a sequence of clues through a physical space, scanning QR codes or tapping NFC tags at each location, submitting answers, and earning hints when they are stuck. A creator — a human — designed those clues. An AI — fed by another human's API key — can help generate them and estimate how hard they will be. And you, the developer, built all of it.

Three humans. One loop. Thousands of lines of code connecting them.

---

## Why a game?

Because games have properties that make HITL legible:

**Defined tasks.** A clue has a correct answer. That means we can measure how humans perform — attempts, time, hints used — without ambiguity about what we are measuring.

**Motivated participants.** Players want to win. They will actually engage with the system rather than click through it. Their behavior is signal, not noise.

**Visible feedback.** When a player answers incorrectly three times and then asks for a hint, that is explicit feedback about clue difficulty. When they solve it in thirty seconds, that is also feedback. The system captures both.

**Low stakes.** A wrong prediction in a medical AI system harms a patient. A wrong prediction in a treasure hunt means the player gets a nudge and tries again. We can iterate freely, break things deliberately, and learn from failures without consequence.

Games, in other words, are a HITL sandbox.

---

## The three roles

The treasure hunt has three human roles, and each embodies a different HITL relationship to the system.

**The creator** is the annotator. They design each clue: write the text, pick the location, choose what counts as a correct answer and how similar an answer must be to count. They are encoding their judgment into data that the system will act on. Every parameter they set — fuzzy match threshold, hint unlock time, GPS radius — is a decision that will shape the experience of every player who runs that hunt.

Creators are also the *hardest* humans to study, because they are often invisible. Their decisions are baked into training data or game logic long before any player sees them. One goal of this system is to make creator decisions auditable — logged, versioned, reviewable.

**The player** is the oracle. They receive outputs (clues) and produce feedback (attempts, timing, hints requested, answers given). They do not know they are providing training signal. They are just trying to win. This is the normal condition of the human in the loop: unaware, consequential.

**The developer** — you — is the architect of the loop itself. You decide what feedback gets captured, how it is stored, whether it gets used. You are responsible for closing the loop or leaving it open. Most of this edition is about the decisions you will make in that role.

---

## The five dimensions, briefly

The Summer and Winter editions introduced five dimensions along which HITL systems vary. The treasure hunt system will express each of them. We will revisit each dimension in detail in Chapter 2, but here is the map:

| Dimension | In the treasure hunt |
|-----------|----------------------|
| **Control** | Who can override the AI's hint suggestions? Who can change a clue after the hunt has started? |
| **Transparency** | Can the player see why they got a hint? Can the creator see how players performed? |
| **Feedback** | How does player behavior change what the AI recommends next time? |
| **Autonomy** | When does the system act without asking a human? When does it always ask? |
| **Trust** | Under what conditions will a player follow the AI's hint rather than their own judgment? |

None of these questions have obvious answers. The code we write will make implicit choices about all of them. One aim of this edition is to make those choices explicit.

---

## The architecture, briefly

The full architecture is documented in `editions/spring/architecture.md`. Here is the sketch:

```
Flutter app (player)          React dashboard (creator/observer)
      │                                  │
      └────────────── HTTPS ─────────────┘
                           │
                    Rust/Axum API  ←──── JWKS ───→  Dex (OIDC)
                           │
              ┌────────────┼────────────┐
              │            │            │
          PostgreSQL    Python AI    WebSocket
                        sidecar     broadcaster
```

Each piece will be built in a dedicated chapter. The system is intentionally simple — simple enough to hold in your head, complex enough to be real.

---

## Before you write a line

Three questions to keep in mind throughout this semester:

**Where is the human?** Every chapter introduces new code. Before you finish reading it, ask: at which point in this code does a human decision matter? Where does the system depend on something a human chose?

**What happens when the human is wrong?** Creators make bad clues. Players misunderstand instructions. Annotators disagree. What does the system do?

**What data are you throwing away?** Every interaction produces signal. Not all of it is captured. The decision about what to log and what to discard is as consequential as any model training decision.

Keep a notebook. Not for code. For these.

---

## Reflection

The chapter description says this is about building HITL systems. But there is an argument that building a game is not the same as building a HITL system — that a game is entertainment, not infrastructure, and that real HITL systems are medical, judicial, financial.

What do you think? Is the distinction meaningful? Does it change what you should build, or how you should evaluate it?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
