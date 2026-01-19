"""
Database configuration and session management
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get absolute path to backend directory
BACKEND_DIR = Path(__file__).parent.parent.parent
DB_PATH = BACKEND_DIR / "data" / "ai_life_assistant.db"

# Ensure data directory exists
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# Database URL - use SQLite for development, PostgreSQL for production
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Create engine
# For SQLite, we need check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables"""
    # Import all models to ensure they are registered with Base.metadata
    from api.models.user import User, Session
    from api.models.agent_content import (
        UserAction,
        ContentIndex,
        HealthMetric,
        NewsArticle,
        WorkTask,
        DailyReflection,
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)
