import json
from app.llm import complete
from app.models import DifficultyResponse


_SYSTEM = """\
You rate treasure hunt clue difficulty on a scale of 1 to 5.
1 = obvious answer, 5 = extremely cryptic.
Reply ONLY with valid JSON: {"score": <int 1-5>, "reasoning": "<one sentence>"}
"""


async def estimate(clue_body: str) -> DifficultyResponse:
    text = await complete(_SYSTEM, clue_body, max_tokens=128)
    data = json.loads(text)
    return DifficultyResponse(score=int(data["score"]), reasoning=data["reasoning"])
