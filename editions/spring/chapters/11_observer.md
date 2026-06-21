# Watching in Real Time

```{epigraph}
A system you cannot observe is a system you cannot improve. A system you can observe but cannot act on is just surveillance.

-- Chapter 11
```

---

## Think about it

**1.** You are an observer watching a live hunt. You can see that six players are stuck on clue 3 simultaneously. You cannot intervene. What does it feel like? What should the system let you do?

**2.** Real-time monitoring creates the temptation to intervene in every problem. But intervening has costs: it removes challenge, it breaks immersion, it creates unequal experiences. When should an observer act, and when should they watch?

**3.** A WebSocket connection holds server resources for as long as it is open. An observer who leaves their browser tab open for 8 hours ties up a connection. How do you design for this?

**4.** Pausing the live feed does not pause the underlying events — it just stops the UI from rendering them. When the observer resumes, buffered events flood in all at once. Is this the right model? What are the alternatives, and what does each one hide?

**5.** The AI session analysis modal summarises a completed player session. The observer sees an AI interpretation of data the player generated. The player never sees this summary. Is this ethically different from a teacher reading a student's exam paper? Why or why not?

---

## The observer role

The observer is the third human in the loop. They watch live sessions without participating. Possible observers include:

- The creator, monitoring their own hunt during a live run
- A teacher, watching students complete a classroom exercise
- A researcher, studying group behavior in real time
- A game master, able to send nudge messages to struggling players

The observer dashboard is a React page that subscribes to a WebSocket stream of events for a given hunt. Its sidebar shows the current session snapshot: player, current clue, total clues, elapsed time, and completion state. Attempts and hints are visible through event payloads in the live feed rather than as columns in the session cards.

---

## The WebSocket architecture

The `WsBroadcaster` (`services/ws_broadcaster.rs`) is the pub/sub mechanism:

```rust
pub struct WsBroadcaster {
    channels: Mutex<HashMap<Uuid, broadcast::Sender<WsEvent>>>,
}
```

One broadcast channel per hunt. The channel is created lazily on first subscription. When an event occurs — an answer submission, a hint request, a session start — the event logger publishes to the channel. Every observer subscribed to that hunt receives the event.

The channel capacity is 128 events. If a subscriber falls behind (slow network, browser tab backgrounded), it will miss events beyond the buffer. The `tokio::broadcast` channel drops lagged receivers silently. Observers see a live stream, not a guaranteed delivery queue.

---

## The observer endpoint

```rust
// routes/observer.rs

pub async fn observe(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(hunt_id): Path<Uuid>,
    ws: WebSocketUpgrade,
) -> impl IntoResponse {
    if !is_staff(&auth.role) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match can_access_hunt(&state, &auth, hunt_id).await {
        Ok(true) => {}
        Ok(false) => return StatusCode::FORBIDDEN.into_response(),
        Err(e) => return e.into_response(),
    };

    ws.on_upgrade(move |socket| handle_ws(socket, state, hunt_id))
        .into_response()
}
```

The endpoint checks that the caller is staff, checks hunt access, upgrades the HTTP connection to WebSocket, subscribes to the hunt's broadcast channel, and forwards events as they arrive. The broadcaster uses `tokio::broadcast`, so if an observer falls behind they can miss events beyond the channel buffer. The observer might see incomplete data without knowing it.

---

## Session list (REST)

In addition to the live stream, observers can fetch the current snapshot of all sessions for a hunt:

```rust
pub async fn list_sessions(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(hunt_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    // role check
    // fetch player, current clue sequence, total clues, start and completion timestamps
}
```

This is used on dashboard load (before the WebSocket connects) and as a fallback if the WebSocket drops. The observer dashboard combines both: initial state from REST, live updates from WebSocket.

---

## Events and the nudge

The most interactive observer feature is the nudge: an observer can send a short message attached to a specific player session. In the current implementation, that message is logged as an `observer_nudge` event and broadcast to observer dashboards. There is not yet a player-side subscription that displays it as a banner in the mobile app.

```rust
pub async fn nudge(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(session_id): Path<Uuid>,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>> {
    if !is_staff(&auth.role) {
        return Err(AppError::Forbidden);
    }

    let hunt_id = hunt_for_session(&state, session_id).await?;
    if !can_access_hunt(&state, &auth, hunt_id).await? {
        return Err(AppError::Forbidden);
    }

    let message = body["message"].as_str().unwrap_or("").to_owned();
    if message.is_empty() {
        return Err(AppError::BadRequest("message is required".into()));
    }

    let logger = EventLogger::new(&state.db, &state.broadcaster);
    logger.log(
        session_id,
        hunt_id,
        None,
        types::OBSERVER_NUDGE,
        json!({ "message": message, "sent_by": auth.id }),
    ).await?;

    Ok(Json(json!({ "sent": true })))
}
```

The nudge is stored in the event log and broadcast to the hunt channel for observers. It does not change session state, does not count as a hint, and does not currently reach the player's phone. That makes it useful as a monitoring annotation today and a human-to-human intervention only after a player event channel is added.

That distinction matters. A UI button labeled "Send nudge" suggests communication; the code currently implements durable observer-side signal.

---

## Event types

The `models/event.rs` defines the event taxonomy:

```rust
pub mod types {
    pub const CLUE_VIEWED:       &str = "clue_viewed";
    pub const SESSION_STARTED:    &str = "session_started";
    pub const ANSWER_ATTEMPTED:   &str = "answer_attempted";
    pub const ANSWER_CORRECT:     &str = "answer_correct";
    pub const HINT_REQUESTED:     &str = "hint_requested";
    pub const HINT_VIEWED:        &str = "hint_viewed";
    pub const OBSERVER_NUDGE:     &str = "observer_nudge";
    pub const QR_SCANNED:         &str = "qr_scanned";
    pub const NFC_TAPPED:         &str = "nfc_tapped";
    pub const LOCATION_CHECKED:   &str = "location_checked";
    pub const SESSION_COMPLETED:  &str = "session_completed";
}
```

Not all event types are currently logged. `HINT_VIEWED` and `LOCATION_CHECKED` are defined but unused — they mark the intended scope of the event log, not its current state. There is no separate `answer_wrong` event; wrong answers are represented as `answer_attempted` with a payload containing `passed: false`.

---

## Pause, buffer, and filter

The live event feed has two controls that change the observer's relationship to the real-time stream: a pause button and a filter bar.

When the observer clicks **Pause**, incoming WebSocket events are diverted into a buffer rather than rendered immediately. A yellow badge shows the buffer depth — how many events are waiting. This is useful when the observer is mid-analysis and does not want the feed scrolling away from the event they are examining. When they resume, the buffer flushes into the feed in one operation.

The **filter bar** restricts the rendered feed to a single event type: correct answers, answer attempts, hint requests, session starts, or all events. The filter operates on the in-memory event array, not on the WebSocket subscription — every event type continues to arrive; the filter only affects what is displayed. This means switching filters does not require any server round-trip, but it also means the observer cannot reduce server-side load by filtering.

These two controls interact in a non-obvious way. If the observer pauses with filter set to "Hints," the buffer accumulates all event types. When they resume and switch to "All events," they will see the backlog of hints mixed with all other buffered events. The buffer does not respect the filter that was active when the pause began.

---

## AI session analysis modal

When a player completes a session, their row in the sidebar gains an "Analysis" button. Clicking it opens a modal that calls the Rust API (`GET /sessions/:id/analysis`). The Rust handler checks staff access, gathers the session events, then calls the Python AI sidecar's `/analyze-session` endpoint. The result is a narrative summary of the session: how long each clue took, where the player struggled, which hints were most frequently needed, and an overall difficulty assessment.

The modal is implemented as `AnalysisModal.tsx`. It fetches the analysis on open and renders the returned report line by line with lightweight formatting. It does not stream tokens and does not use a markdown renderer. The analysis is generated fresh each time — it is not cached, which means two observers opening the same session analysis will each trigger a separate AI call.

This is the observer's most powerful tool, and the one with the greatest interpretive risk. The AI summary is a compression of the event log into natural language. It will sound authoritative. It may be wrong. An observer who reads "the player found clue 4 straightforward" is reading a model's inference from timing and attempt data, not a statement the player ever made. The system does not flag this distinction to the observer.

---

## Stat pills

The sidebar header shows three aggregate statistics at all times: **Total** (all sessions for this hunt), **Active** (sessions not yet completed), and **Done %** (completion rate). These are computed client-side from the REST snapshot that refreshes every 10 seconds — they are not derived from the WebSocket stream.

The stat pills are small, but they encode a particular theory of what an observer cares about: throughput, active load, and completion rate. An observer who cares about stuck players, average time per clue, or hint usage rate has no equivalent summary — they must infer it from the event feed.

---

## The observer as HITL actor

The observer occupies an unusual position in the HITL framework. They are not training the model. They are not labeling data. They are watching, and occasionally intervening.

In human factors terms, the observer is performing **supervisory control**: monitoring an automated system and taking manual action only when needed. This is cognitively demanding. Studies of air traffic controllers, nuclear plant operators, and ICU nurses all show that supervisory controllers tend to under-intervene (miss problems) or over-intervene (disrupt functioning systems) because the rhythm of normal operation is hard to distinguish from early-stage problems.

The observer dashboard shows who is where, who has finished, and the live event stream of attempts, hints, starts, completions, and nudges. It does not show whether a player is frustrated or just thinking. It does not show whether they are stuck on the answer or stuck finding the location. The observer makes inferences from incomplete data and decides whether to nudge.

This is a faithful representation of most real monitoring tasks.

---

## Reflection

The observer can see everything. The player can see nothing about the observer. The creator sets the rules. The AI generates suggestions.

Draw the information flows in this system as a directed graph. Who sends information to whom? Where are the feedback loops? Where is information collected but never returned to the person who generated it?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
