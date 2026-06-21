from app.llm import complete_vision, extract_json


_SYSTEM = """\
You are verifying whether a player photo matches a treasure hunt location description.
Respond ONLY with JSON: {"confidence": <float 0.0-1.0>, "reasoning": "<one sentence>"}
Be strict: only return confidence > 0.8 if the photo clearly shows the described location.
"""


def _confidence(data: dict) -> float:
    """Clamped to [0, 1]; missing or non-numeric confidence counts as failure (0.0)."""
    try:
        value = float(data["confidence"])
    except (KeyError, TypeError, ValueError):
        return 0.0
    return min(1.0, max(0.0, value))


async def verify(description: str, photo_b64: str) -> float:
    """Returns confidence 0–1 that the photo matches the description.

    Requires a vision-capable model — use ollama/llava for a free local option.
    """
    media_type = "image/jpeg"
    if "," in photo_b64:
        # strip a data-URL prefix but keep the real media type for the provider
        prefix, photo_b64 = photo_b64.split(",", 1)
        if prefix.startswith("data:") and ";" in prefix:
            media_type = prefix[5:].split(";", 1)[0] or media_type
    user = f"Location description: {description}"
    text = await complete_vision(_SYSTEM, user, photo_b64, json_mode=True, media_type=media_type)
    try:
        return _confidence(extract_json(text))
    except ValueError:
        # one retry on malformed or truncated model output before giving up
        text = await complete_vision(_SYSTEM, user, photo_b64, json_mode=True, media_type=media_type)
        return _confidence(extract_json(text))
