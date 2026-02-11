"""
Database configuration and session management.

Provides SQLAlchemy engine and session factory for database operations.
"""

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, declarative_base

from .config import get_settings

settings = get_settings()


# Base class for all ORM models
Base = declarative_base()


# Create sync engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

# Create sync session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function that yields database sessions.

    This is typically used with FastAPI's Depends:
        db: Session = Depends(get_db)

    Yields:
        Session: A database session
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Context manager for database sessions.

    Usage:
        with get_db_context() as db:
            # Use db here

    Yields:
        Session: A database session
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize the database by creating all tables.

    This should be called on application startup.
    For production, use Alembic migrations instead.
    """
    Base.metadata.create_all(bind=engine)


def close_db() -> None:
    """
    Close the database connection.

    This should be called on application shutdown.
    """
    engine.dispose()


__all__ = [
    "Base",
    "engine",
    "SessionLocal",
    "get_db",
    "get_db_context",
    "init_db",
    "close_db",
]
