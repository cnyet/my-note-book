import os
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/work_agents.db")

# Synchronous engine (for migrations)
engine = create_engine(DATABASE_URL, echo=True)

# Asynchronous engine (for API)
# Convert sqlite:// → sqlite+aiosqlite:// for async support
if "+aiosqlite" not in DATABASE_URL:
    async_url = DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")
else:
    async_url = DATABASE_URL
async_engine = create_async_engine(async_url, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
AsyncSessionLocal = async_sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()


def get_db():
    """Dependency for getting synchronous database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Dependency for getting asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
