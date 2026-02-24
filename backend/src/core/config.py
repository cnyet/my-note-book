# backend/src/core/config.py
import secrets
from typing import Literal
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "MyNoteBook Admin"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: Literal["development", "production", "testing"] = "development"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/my_note_book.db"

    # Security - SECRET_KEY must be set in production
    SECRET_KEY: str = Field(
        default="",
        description="JWT signing key - MUST be changed in production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin credentials (only for initial setup)
    FIRST_ADMIN_USERNAME: str = Field(
        default="admin",
        description="Default admin username - change after first login"
    )
    FIRST_ADMIN_PASSWORD: str = Field(
        default="",
        description="Default admin password - MUST be set in production"
    )
    FIRST_ADMIN_EMAIL: str = "admin@example.com"

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        """Validate SECRET_KEY is set for production environments."""
        environment = info.data.get("ENVIRONMENT", "development")
        if environment == "production" and (not v or v.startswith("CHANGE_THIS")):
            raise ValueError(
                "SECRET_KEY must be set to a secure value in production. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        if environment == "development" and not v:
            # Generate a temporary key for development only
            import warnings
            temp_key = secrets.token_urlsafe(32)
            warnings.warn(
                f"Using auto-generated SECRET_KEY for development: {temp_key[:8]}... "
                "Set SECRET_KEY in .env for persistence."
            )
            return temp_key
        return v

    @field_validator("FIRST_ADMIN_PASSWORD")
    @classmethod
    def validate_admin_password(cls, v: str, info) -> str:
        """Validate admin password is set for production."""
        environment = info.data.get("ENVIRONMENT", "development")
        if environment == "production" and not v:
            raise ValueError(
                "FIRST_ADMIN_PASSWORD must be set in production. "
                "Use a strong password (minimum 12 characters)."
            )
        if environment == "development" and not v:
            import warnings
            warnings.warn(
                "Using default weak password for development. "
                "Set FIRST_ADMIN_PASSWORD in .env for security."
            )
            # Generate a temporary secure password for development
            return secrets.token_urlsafe(16)
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Log security warnings on startup
if settings.ENVIRONMENT == "production":
    if settings.SECRET_KEY.startswith("CHANGE_THIS") or not settings.SECRET_KEY:
        import warnings
        warnings.warn("⚠️ SECURITY: SECRET_KEY is not properly configured for production!")
    if not settings.FIRST_ADMIN_PASSWORD or settings.FIRST_ADMIN_PASSWORD.startswith("CHANGE_THIS"):
        import warnings
        warnings.warn("⚠️ SECURITY: Default admin credentials detected in production!")
