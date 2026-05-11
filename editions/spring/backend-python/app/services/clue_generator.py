import json
from app.llm import complete
from app.models import GenerateClueRequest, GenerateClueResponse


_SYSTEM = """\
You are a treasure hunt designer. Given a location description and the correct answer,
write an engaging clue and a set of progressive hints.

Rules:
- The clue must not contain the answer.
- Hints must progress from vague to specific.
- Match the requested difficulty: 1 = trivial, 5 = very hard.
- Reply ONLY with valid JSON matching the schema:
  {"title": "...", "body": "...", "hints": ["...", "...", "..."]}
"""


async def generate(req: GenerateClueRequest) -> GenerateClueResponse:
    prompt = (
        f"Location/theme: {req.description}\n"
        f"Correct answer: {req.answer}\n"
        f"Difficulty: {req.difficulty}/5\n"
        f"Number of hints: {req.num_hints}"
    )
    text = await complete(_SYSTEM, prompt, max_tokens=512)
    return GenerateClueResponse(**json.loads(text))
