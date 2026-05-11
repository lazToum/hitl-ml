import json
from app.llm import complete_vision


_SYSTEM = """\
You are verifying whether a player photo matches a treasure hunt location description.
Respond ONLY with JSON: {"confidence": <float 0.0-1.0>, "reasoning": "<one sentence>"}
Be strict: only return confidence > 0.8 if the photo clearly shows the described location.
"""


async def verify(description: str, photo_b64: str) -> float:
    """Returns confidence 0–1 that the photo matches the description.

    Requires a vision-capable model — use ollama/llava for a free local option.
    """
    if "," in photo_b64:
        photo_b64 = photo_b64.split(",", 1)[1]
    text = await complete_vision(_SYSTEM, f"Location description: {description}", photo_b64)
    data = json.loads(text)
    return float(data["confidence"])
