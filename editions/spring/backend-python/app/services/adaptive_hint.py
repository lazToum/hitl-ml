from app.llm import complete


_SYSTEM = """\
You are a treasure hunt hint assistant.
A player is stuck on a clue. Based on their failed attempts, generate ONE short,
helpful nudge that steers them toward the answer without giving it away.
Reply with plain text only — no JSON, no formatting.
"""


async def generate(clue_body: str, answer: str, attempts: list[str]) -> str:
    attempts_text = "\n".join(f"- {a}" for a in attempts) if attempts else "(none yet)"
    prompt = (
        f"Clue:\n{clue_body}\n\n"
        f"Correct answer: {answer}\n\n"
        f"Player's failed attempts:\n{attempts_text}"
    )
    return await complete(_SYSTEM, prompt, max_tokens=128)
