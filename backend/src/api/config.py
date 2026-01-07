"""
Configuration management for API
"""
import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseModel):
    """Application settings"""

    # Database
    # Use absolute path for SQLite database
    _backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    database_url: str = os.getenv(
        "DATABASE_URL", f"sqlite:///{_backend_dir}/data/ai_life_assistant.db"
    )

    # JWT
    jwt_secret_key: str = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret-key-change-in-production",
    )
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_access_token_expire_minutes: int = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "10080")
    )  # 7 days
    jwt_remember_me_expire_minutes: int = int(
        os.getenv("JWT_REMEMBER_ME_EXPIRE_MINUTES", "43200")
    )  # 30 days

    # Security
    bcrypt_cost_factor: int = int(os.getenv("BCRYPT_COST_FACTOR", "12"))

    # API
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_reload: bool = os.getenv("API_RELOAD", "True").lower() == "true"

    # CORS
    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")

    class Config:
        case_sensitive = False


# Create global settings instance
settings = Settings()
