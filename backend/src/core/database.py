"""
Database configuration and session management.

Provides SQLAlchemy engine and session factory for async database operations.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from .config import get_settings

settings = get_settings()


class Base(DeclarativeBase):
    """Base class for all ORM models."""

    pass


# Create async engine
engine = create_async_engine(
    settings.database_url.replace("sqlite:///", "sqlite+aiosqlite:///"),
    echo=settings.debug,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

# Create async session factory
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function that yields database sessions.

    This is typically used with FastAPI's Depends:
        db: AsyncSession = Depends(get_db)

    Yields:
        AsyncSession: An async database session
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for database sessions.

    Usage:
        async with get_db_context() as db:
            # Use db here

    Yields:
        AsyncSession: An async database session
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """
    Initialize the database by creating all tables.

    This should be called on application startup.
    For production, use Alembic migrations instead.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """
    Close the database connection.

    This should be called on application shutdown.
    """
    await engine.dispose()


__all__ = [
    "Base",
    "engine",
    "async_session_factory",
    "get_db",
    "get_db_context",
    "init_db",
    "close_db",
]
