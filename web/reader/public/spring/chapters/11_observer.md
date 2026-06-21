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

The observer dashboard is a React page that subscribes to a WebSocket stream of events for a given hunt. It shows a live table of sessions: who is on which clue, how many attempts they have made, whether they have used hints.

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
) -> Result<Response> {
    if auth.role != "creator" && auth.role != "observer" {
        return Err(AppError::Forbidden);
    }

    let mut rx = state.broadcaster.subscribe(hunt_id);

    let stream = async_stream::stream! {
        loop {
            match rx.recv().await {
                Ok(event) => {
                    let data = serde_json::to_string(&event).unwrap_or_default();
                    yield Ok::<_, Infallible>(
                        axum::extract::ws::Message::Text(data)
                    );
                }
                Err(RecvError::Closed) => break,
                Err(RecvError::Lagged(n)) => {
                    tracing::warn!("observer lagged by {n} events for hunt {hunt_id}");
                    // continue — observer gets the next event when it arrives
                }
            }
        }
    };

    Ok(axum::extract::ws::WebSocketUpgrade::new()
        .on_upgrade(|ws| async move {
            let (mut sender, _) = ws.split();
            pin_mut!(stream);
            while let Some(msg) = stream.next().await {
                if sender.send(msg.unwrap()).await.is_err() { break; }
            }
        }))
}
```

The endpoint upgrades the HTTP connection to WebSocket, subscribes to the hunt's broadcast channel, and forwards events as they arrive. The lag warning is important: if an observer misses events, they are not re-sent. The observer might see incomplete data without knowing it.

---

## Session list (REST)

In addition to the live stream, observers can fetch the current snapshot of all sessions for a hunt:

```rust
pub async fn list_sessions(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(hunt_id): Path<Uuid>,
) -> Result<Json<Vec<SessionSummary>>> {
    // role check
    // fetch sessions with current clue sequence and attempt counts
}
```

This is used on dashboard load (before the WebSocket connects) and as a fallback if the WebSocket drops. The observer dashboard combines both: initial state from REST, live updates from WebSocket.

---

## Events and the nudge

The most interactive observer feature is the nudge: an observer can send a short message to a specific player session. The player receives it as a hint-like notification in the mobile app.

```rust
pub async fn nudge(
    auth: AuthUser,
    State(state): State<AppState>,
    Path(session_id): Path<Uuid>,
    Json(req): Json<NudgeRequest>,
) -> Result<Json<()>> {
    if auth.role != "creator" && auth.role != "observer" {
        return Err(AppError::Forbidden);
    }

    state.broadcaster.broadcast(
        get_hunt_id_for_session(&state.db, session_id).await?,
        WsEvent::Nudge {
            session_id,
            message: req.message,
        },
    );

    Ok(Json(()))
}
```

The nudge is broadcast to the hunt channel. The player's app subscribes to the session's event stream and displays nudge events as banners. The observer cannot see what the player is doing with their phone — they are sending a message into a void and hoping it arrives at a useful moment.

The nudge is a low-overhead intervention. It does not change any session state, does not log a "hint used," and does not cost the player anything. It is a human-to-human communication channel inside a machine-mediated loop.

---

## Event types

The `models/event.rs` defines the event taxonomy:

```rust
pub mod types {
    pub const SESSION_STARTED:    &str = "session_started";
    pub const ANSWER_CORRECT:     &str = "answer_correct";
    pub const ANSWER_WRONG:       &str = "answer_wrong";
    pub const HINT_REQUESTED:     &str = "hint_requested";
    pub const HINT_VIEWED:        &str = "hint_viewed";
    pub const QR_SCANNED:         &str = "qr_scanned";
    pub const NFC_TAPPED:         &str = "nfc_tapped";
    pub const LOCATION_CHECKED:   &str = "location_checked";
    pub const SESSION_COMPLETED:  &str = "session_completed";
    pub const NUDGE_SENT:         &str = "nudge_sent";
}
```

Not all event types are currently logged. `HINT_VIEWED` and `LOCATION_CHECKED` are defined but unused — they mark the intended scope of the event log, not its current state. A future version might log `HINT_VIEWED` separately from `HINT_REQUESTED` (a hint can be requested and then ignored), and `LOCATION_CHECKED` for passive GPS readings.

---

## Pause, buffer, and filter

The live event feed has two controls that change the observer's relationship to the real-time stream: a pause button and a filter bar.

When the observer clicks **Pause**, incoming WebSocket events are diverted into a buffer rather than rendered immediately. A yellow badge shows the buffer depth — how many events are waiting. This is useful when the observer is mid-analysis and does not want the feed scrolling away from the event they are examining. When they resume, the buffer flushes into the feed in one operation.

The **filter bar** restricts the rendered feed to a single event type: correct answers, wrong answers, hint requests, session starts, or all events. The filter operates on the in-memory event array, not on the WebSocket subscription — every event type continues to arrive; the filter only affects what is displayed. This means switching filters does not require any server round-trip, but it also means the observer cannot reduce server-side load by filtering.

These two controls interact in a non-obvious way. If the observer pauses with filter set to "Hints," the buffer accumulates all event types. When they resume and switch to "All events," they will see the backlog of hints mixed with all other buffered events. The buffer does not respect the filter that was active when the pause began.

---

## AI session analysis modal

When a player completes a session, their row in the sidebar gains an "Analysis" button. Clicking it opens a modal that calls the Python AI service (`/sessions/:id/analyze`) and returns a narrative summary of the session: how long each clue took, where the player struggled, which hints were most frequently needed, and an overall difficulty assessment.

The modal is implemented as `AnalysisModal.tsx`. It fetches the analysis on open and streams the response into a markdown renderer. The analysis is generated fresh each time — it is not cached, which means two observers opening the same session analysis will each trigger a separate AI call.

This is the observer's most powerful tool, and the one with the greatest interpretive risk. The AI summary is a compression of the event log into natural language. It will sound authoritative. It may be wrong. An observer who reads "the player found clue 4 straightforward" is reading a model's inference from timing and attempt data, not a statement the player ever made. The system does not flag this distinction to the observer.

---

## Stat pills

The sidebar header shows three aggregate statistics at all times: **Total** (all sessions for this hunt), **Active** (sessions not yet completed), and **Done %** (completion rate). These are computed client-side from the REST snapshot that refreshes every 10 seconds — they are not derived from the WebSocket stream.

The stat pills are small, but they encode a particular theory of what an observer cares about: throughput, active load, and completion rate. An observer who cares about stuck players, average time per clue, or hint usage rate has no equivalent summary — they must infer it from the event feed.

---

## The observer as HITL actor

The observer occupies an unusual position in the HITL framework. They are not training the model. They are not labeling data. They are watching, and occasionally intervening.

In human factors terms, the observer is performing **supervisory control**: monitoring an automated system and taking manual action only when needed. This is cognitively demanding. Studies of air traffic controllers, nuclear plant operators, and ICU nurses all show that supervisory controllers tend to under-intervene (miss problems) or over-intervene (disrupt functioning systems) because the rhythm of normal operation is hard to distinguish from early-stage problems.

The observer dashboard shows who is where and how many attempts they have made. It does not show whether a player is frustrated or just thinking. It does not show whether they are stuck on the answer or stuck finding the location. The observer makes inferences from incomplete data and decides whether to nudge.

This is a faithful representation of most real monitoring tasks.

---

## Reflection

The observer can see everything. The player can see nothing about the observer. The creator sets the rules. The AI generates suggestions.

Draw the information flows in this system as a directed graph. Who sends information to whom? Where are the feedback loops? Where is information collected but never returned to the person who generated it?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
