# backend/src/core/database.py
"""
数据库初始化和管理 (异步版)

使用 SQLAlchemy 2.0 异步模式和 aiosqlite。
"""

import logging
from pathlib import Path
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import settings

logger = logging.getLogger(__name__)

# 配置异步引擎
# 对于 SQLite，需要处理目录创建
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL.startswith("sqlite"):
    db_path_str = DATABASE_URL.replace("sqlite+aiosqlite:///", "").replace("sqlite:///./", "")
    db_path = Path(db_path_str)
    db_path.parent.mkdir(parents=True, exist_ok=True)

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=settings.ENVIRONMENT == "development",
)

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """SQLAlchemy 模型基类"""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI 依赖项：提供异步数据库会话
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """初始化数据库表并创建初始数据"""
    from ..models import (
        User, BlogPost, Agent, SystemSettings,
        AgentSession, AgentMemory, AgentMessage, WSConnection
    )  # 延迟导入以避免循环依赖

    logger.info("Initializing database...")
    async with engine.begin() as conn:
        # 在异步环境下创建所有表
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database tables created successfully")

    # 创建初始管理员
    async with AsyncSessionLocal() as session:
        try:
            from sqlalchemy import select
            result = await session.execute(select(User).filter_by(username=settings.FIRST_ADMIN_USERNAME))
            existing_admin = result.scalars().first()

            if not existing_admin:
                from .security import hash_password
                hashed_pw = hash_password(settings.FIRST_ADMIN_PASSWORD)
                admin = User(
                    username=settings.FIRST_ADMIN_USERNAME,
                    email=settings.FIRST_ADMIN_EMAIL,
                    hashed_password=hashed_pw,
                    role="admin",
                    is_active=True,
                )
                session.add(admin)
                await session.commit()
                logger.info(f"Initial admin user created: {admin.username}")
            else:
                logger.info("Admin user already exists")
        except Exception as e:
            logger.error(f"Error during initial data creation: {e}")
            await session.rollback()

    # 创建默认系统设置 (单行记录)
    async with AsyncSessionLocal() as session:
        try:
            from sqlalchemy import select
            result = await session.execute(select(SystemSettings).filter_by(id=1))
            existing_settings = result.scalars().first()

            if not existing_settings:
                default_settings = SystemSettings(id=1)
                session.add(default_settings)
                await session.commit()
                logger.info("Default system settings created")
            else:
                logger.info("System settings already exist")
        except Exception as e:
            logger.error(f"Error creating default settings: {e}")
            await session.rollback()
