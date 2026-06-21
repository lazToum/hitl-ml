"""
Thin litellm wrapper — provider is selected by the LLM_MODEL prefix, e.g.:
  anthropic/claude-opus-4-7   → Anthropic (needs LLM_API_KEY)
  openai/gpt-4o               → OpenAI    (needs LLM_API_KEY)
  ollama/llama3               → Ollama local, text only (free, needs OLLAMA_BASE_URL)
  ollama/llava                → Ollama local, vision    (free, needs OLLAMA_BASE_URL)
"""
import litellm
from app.config import settings

litellm.drop_params = True  # ignore unsupported params per provider silently


def _kwargs(max_tokens: int) -> dict:
    kw: dict = {"model": settings.llm_model, "max_tokens": max_tokens}
    if settings.llm_api_key:
        kw["api_key"] = settings.llm_api_key
    if settings.ollama_base_url:
        kw["api_base"] = settings.ollama_base_url
    return kw


async def complete(system: str, user: str, max_tokens: int = 512) -> str:
    resp = await litellm.acompletion(
        **_kwargs(max_tokens),
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
    )
    return resp.choices[0].message.content.strip()


async def complete_vision(system: str, user_text: str, photo_b64: str, max_tokens: int = 128) -> str:
    """Vision call — requires a vision-capable model (e.g. ollama/llava, anthropic/*, openai/gpt-4o)."""
    resp = await litellm.acompletion(
        **_kwargs(max_tokens),
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{photo_b64}"}},
                    {"type": "text",      "text": user_text},
                ],
            },
        ],
    )
    return resp.choices[0].message.content.strip()
