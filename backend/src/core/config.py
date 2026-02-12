# backend/src/core/config.py
import os
import secrets
from typing import Literal
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyNoteBook Admin"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: Literal["development", "production", "testing"] = "development"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "sqlite:///./data/my_note_book.db"

    # Security
    SECRET_KEY: str = "default_secret_key_for_development_only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin credentials (only for initial setup)
    FIRST_ADMIN_USERNAME: str = "admin"
    FIRST_ADMIN_PASSWORD: str = "Admin123!"
    FIRST_ADMIN_EMAIL: str = "admin@example.com"

    # Allow extra fields from .env
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"
        model_config = {"extra": "allow"}


settings = Settings()

# Log security warnings on startup
if settings.ENVIRONMENT == "production":
    if not settings.SECRET_KEY or settings.SECRET_KEY == "default_secret_key_for_development_only":
        import warnings
        warnings.warn(" SECURITY: SECRET_KEY is not properly configured for production!")
    if settings.FIRST_ADMIN_PASSWORD == "Admin123!":
        import warnings
        warnings.warn(" SECURITY: Default admin credentials detected in production!")
