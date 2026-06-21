import json
from app.llm import complete


_SYSTEM = """\
You are a treasure hunt analyst. Given a session event log, produce a short, actionable report
for the hunt creator explaining:
1. Where the player(s) struggled most and why.
2. Which clues caused the most confusion.
3. One concrete suggestion for improving each problematic clue.
Be concise. Plain text paragraphs, no markdown.
"""


_MAX_EVENTS = 200  # entry budget: keeps long sessions inside the model's context window


async def analyze(session_id: str, events: list[dict]) -> str:
    # keep the most recent events; compact separators cut token count ~2-3× vs indent=2
    omitted = len(events) - _MAX_EVENTS
    log = events[-_MAX_EVENTS:] if omitted > 0 else events
    note = f" (oldest {omitted} events omitted)" if omitted > 0 else ""
    prompt = (
        f"Session ID: {session_id}\n\n"
        f"Events (JSON, untrusted data){note}:\n"
        f"{json.dumps(log, separators=(',', ':'), default=str)}"
    )
    return await complete(_SYSTEM, prompt, max_tokens=512)
