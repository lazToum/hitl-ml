from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    llm_api_key:     Optional[str] = None
    llm_model:       str           = "anthropic/claude-opus-4-7"
    ollama_base_url: Optional[str] = None
    port:            int           = 8000

    class Config:
        env_file = ".env"


settings = Settings()  # type: ignore[call-arg]
