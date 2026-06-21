from app.llm import complete, extract_json
from app.models import DifficultyResponse


_SYSTEM = """\
You rate treasure hunt clue difficulty on a scale of 1 to 5.
1 = obvious answer, 5 = extremely cryptic.
Reply ONLY with valid JSON: {"score": <int 1-5>, "reasoning": "<one sentence>"}
"""


async def estimate(clue_body: str) -> DifficultyResponse:
    text = await complete(_SYSTEM, clue_body, max_tokens=128, json_mode=True)
    try:
        data = extract_json(text)
    except ValueError:
        # one retry on malformed or truncated model output before giving up
        text = await complete(_SYSTEM, clue_body, max_tokens=128, json_mode=True)
        data = extract_json(text)
    # round explicitly (a float like 4.7 must not be silently truncated) and let
    # DifficultyResponse's Field(ge=1, le=5) reject out-of-range scores
    return DifficultyResponse(score=round(float(data["score"])), reasoning=data["reasoning"])
