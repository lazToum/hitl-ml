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


async def analyze(session_id: str, events: list[dict]) -> str:
    prompt = f"Session ID: {session_id}\n\nEvents:\n{json.dumps(events, indent=2, default=str)}"
    return await complete(_SYSTEM, prompt, max_tokens=512)
