from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    llm_api_key:     Optional[str] = None
    llm_model:       str           = "anthropic/claude-opus-4-7"
    llm_timeout:     float         = 30.0
    ollama_base_url: Optional[str] = None
    sidecar_token:   Optional[str] = None


settings = Settings()
