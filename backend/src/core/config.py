"""
Core configuration module for the backend application.

Uses pydantic-settings for type-safe configuration management with environment variables.
"""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = Field(default="my-note-book", description="Application name")
    app_version: str = Field(default="0.1.0", description="Application version")
    app_env: Literal["development", "staging", "production"] = Field(
        default="development", description="Application environment"
    )
    debug: bool = Field(default=False, description="Debug mode")

    # Database
    database_url: str = Field(
        default="sqlite:///./data/work_agents.db",
        description="Database connection URL",
    )

    # JWT Authentication
    secret_key: str = Field(
        default="your-super-secret-key-change-this-in-production",
        description="Secret key for JWT token signing",
    )
    algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(
        default=30, description="Access token expiration time in minutes"
    )
    refresh_token_expire_days: int = Field(
        default=7, description="Refresh token expiration time in days"
    )

    # CORS
    allowed_origins: list[str] = Field(
        default=["http://localhost:3001", "http://127.0.0.1:3001"],
        description="Allowed CORS origins",
    )

    # Logging
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO", description="Logging level"
    )

    # File Upload
    upload_dir: str = Field(default="./uploads", description="Upload directory")
    max_upload_size: int = Field(
        default=10485760, description="Max upload size in bytes (10MB)"
    )

    # Project paths
    project_root: Path = Field(default_factory=get_project_root)
    backend_root: Path = Field(default_factory=lambda: get_project_root() / "backend")
    data_dir: Path = Field(default_factory=lambda: get_project_root() / "backend" / "data")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: str | list[str]) -> list[str]:
        """Parse allowed origins from comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.app_env == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.app_env == "production"

    def ensure_directories(self) -> None:
        """Ensure required directories exist."""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        Path(self.upload_dir).mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.

    This function is cached to avoid re-reading environment variables on every call.
    Call .model_rebuild() on the Settings class if you need to reload settings.
    """
    settings = Settings()
    settings.ensure_directories()
    return settings


# Export the settings getter
__all__ = ["Settings", "get_settings"]
