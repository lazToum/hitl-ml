# Human in the Loop: Misunderstood
## Spring Edition — Build the Loop

```{epigraph}
The best way to understand a system is to build one that breaks in interesting ways.

-- Spring Edition
```

---

This edition is different.

The Summer Edition asked you to *think* about human-in-the-loop systems. The Winter Edition asked you to *analyse* them rigorously. This one asks you to *build* one — from a blank directory to a running system that puts real humans in a real loop.

The system we will build is a **Treasure Hunt** game.

That might sound like a detour. It isn't. A treasure hunt is, at its core, a HITL system:

- A **creator** designs clues — labelling the world, deciding what counts as a correct answer, choosing how much help to offer.
- A **player** receives outputs from that design process, acts on them, and generates feedback through their behavior — how long they spent on a clue, how many attempts they made, whether they needed a hint.
- A **developer** builds the machinery that connects those two humans, routes their decisions through an AI layer, and closes the loop.

By the end, you will have:

- A **Rust/Axum** REST API that validates answers, manages game state, and streams live events over WebSockets
- A **Python/FastAPI** AI sidecar that generates clues, estimates difficulty, and provides adaptive hints using a Large Language Model (LLM)
- A **React** creator dashboard where hunt designers can build, preview, and print QR sheets
- A **Flutter** mobile app where players scan codes, submit answers, and receive hints in the field
- a running local stack provisioned with a single `docker compose up`

Each chapter introduces a new piece of the system. Each piece connects back to a HITL concept. The code is real — you can run it.

---

## How to use this edition

Each chapter has three layers:

1. **The build** — concrete implementation, with code you will write or extend
2. **The concept** — the HITL idea this piece of code embodies
3. **The reflection** — questions to sit with, not necessarily to answer

You do not need to read linearly. If you want to jump straight to the AI chapter, jump. If you want to start from deployment and work backwards, work backwards.

But the code *is* linear. Chapter 3's schema is a prerequisite for Chapter 4's queries.

---

## Prerequisites

- Basic familiarity with Rust (you don't need to be expert — the code is explained as it's written)
- Python 3.11+
- Docker + Docker Compose
- A terminal and a text editor

Optionally, for the Flutter chapters: Flutter SDK 3.22+.

---

## Getting started

```bash
cd path/to/repo/editions/spring
cp .env.example .env          # fill in LLM_API_KEY / LLM_MODEL
docker compose up -d --build  # use RUST_API_HOST_PORT / AI_SERVICE_HOST_PORT if needed
cd backend-rust && cargo build
```

If `cargo build` succeeds in your environment and `docker compose ps` shows the services running, you are ready.

```{tableofcontents}
```
