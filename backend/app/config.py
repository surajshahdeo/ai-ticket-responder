from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str
    OPENAI_API_KEY: str = ""
    N8N_WEBHOOK_URL: str = "http://localhost:5678/webhook/ticket"
    SECRET_KEY: str
    CORS_ORIGINS: str = "http://localhost:5173"
    APP_NAME: str = "AI Ticket Responder"
    DEBUG: bool = True

    class Config:
        env_file = "../.env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()