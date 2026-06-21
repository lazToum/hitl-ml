"""
Thin litellm wrapper — provider is selected by the LLM_MODEL prefix, e.g.:
  anthropic/claude-opus-4-7   → Anthropic (needs LLM_API_KEY)
  openai/gpt-4o               → OpenAI    (needs LLM_API_KEY)
  ollama/llama3               → Ollama local, text only (free, needs OLLAMA_BASE_URL)
  ollama/llava                → Ollama local, vision    (free, needs OLLAMA_BASE_URL)
"""
import json

import litellm
from app.config import settings

litellm.drop_params = True  # ignore unsupported params per provider silently


def _kwargs(max_tokens: int, json_mode: bool = False) -> dict:
    kw: dict = {
        "model": settings.llm_model,
        "max_tokens": max_tokens,
        "timeout": settings.llm_timeout,
    }
    if settings.llm_api_key:
        kw["api_key"] = settings.llm_api_key
    if settings.ollama_base_url and settings.llm_model.startswith("ollama/"):
        kw["api_base"] = settings.ollama_base_url
    if json_mode:
        kw["response_format"] = {"type": "json_object"}  # dropped where unsupported
    return kw


def extract_json(text: str) -> dict:
    """Parse the first JSON object in model output, tolerating code fences and prose."""
    start = text.find("{")
    if start == -1:
        raise json.JSONDecodeError("no JSON object in model output", text, 0)
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return json.loads(text[start : i + 1])
    raise json.JSONDecodeError("truncated JSON object in model output", text, start)


async def complete(system: str, user: str, max_tokens: int = 512, json_mode: bool = False) -> str:
    resp = await litellm.acompletion(
        **_kwargs(max_tokens, json_mode),
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
    )
    return resp.choices[0].message.content.strip()


async def complete_vision(system: str, user_text: str, photo_b64: str, max_tokens: int = 128, json_mode: bool = False, media_type: str = "image/jpeg") -> str:
    """Vision call — requires a vision-capable model (e.g. ollama/llava, anthropic/*, openai/gpt-4o)."""
    resp = await litellm.acompletion(
        **_kwargs(max_tokens, json_mode),
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{photo_b64}"}},
                    {"type": "text",      "text": user_text},
                ],
            },
        ],
    )
    return resp.choices[0].message.content.strip()
