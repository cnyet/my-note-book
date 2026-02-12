# backend/src/core/database.py
"""
Database initialization and management using SQLAlchemy Async ORM

提供功能：
- 数据库连接管理
- 表初始化
- 异步 CRUD 操作支持
- 数据库迁移支持
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager
from pathlib import Path
import logging

from .config import settings
from ..models import Base

logger = logging.getLogger(__name__)


class DatabaseManager:
    """异步数据库管理器"""

    def __init__(self, database_url: str = None):
        self.database_url = database_url or settings.DATABASE_URL
        self.engine = None
        self.AsyncSessionLocal = None

    def get_engine(self):
        """获取或创建异步数据库引擎"""
        if not self.engine:
            # 确保数据库目录存在
            db_path = Path(self.database_url.replace("sqlite+aiosqlite:///", "").replace("sqlite:///", ""))
            if db_path.name and db_path.suffix:
                db_path = db_path.parent
            else:
                db_path = Path("data")
            db_path.mkdir(parents=True, exist_ok=True)

            self.engine = create_async_engine(
                self.database_url,
                connect_args={"check_same_thread": False} if "sqlite" in self.database_url else {},
                echo=getattr(settings, 'DEBUG', False),
            )
            logger.info(f"Async database engine created: {self.database_url}")
        return self.engine

    def get_async_session_local(self):
        """获取异步 SessionLocal"""
        if not self.AsyncSessionLocal:
            self.AsyncSessionLocal = async_sessionmaker(
                expire_on_commit=False,
                autocommit=False,
                autoflush=False,
                bind=self.get_engine(),
                class_=AsyncSession
            )
        return self.AsyncSessionLocal

    @asynccontextmanager
    async def get_session(self):
        """获取异步数据库会话上下文管理器"""
        async with self.get_async_session_local()() as session:
            try:
                yield session
                await session.commit()
            except Exception as e:
                await session.rollback()
                logger.error(f"Database session error: {e}")
                raise
            finally:
                await session.close()

    async def init_db(self):
        """初始化数据库表"""
        from ..models import User, BlogPost, Agent, Tool, Lab
        from sqlalchemy import inspect

        engine = self.get_engine()

        # 创建所有表
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")

        # 创建初始管理员（如果不存在）
        async with self.get_async_session_local()() as session:
            try:
                # 检查是否已有管理员
                from sqlalchemy import select
                result = await session.execute(
                    select(User).where(User.username == settings.FIRST_ADMIN_USERNAME)
                )
                existing_admin = result.scalar_one_or_none()

                if not existing_admin:
                    # 从配置创建管理员
                    from ....core.security import hash_password
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
                logger.error(f"Database initialization error: {e}")
                raise

    async def drop_all(self):
        """删除所有表（谨慎使用）"""
        engine = self.get_engine()
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        logger.warning("All database tables dropped")

# 全局数据库管理器实例
db_manager = DatabaseManager()


# 依赖注入的异步数据库会话
async def get_db():
    """依赖注入的异步数据库会话"""
    async with db_manager.get_async_session_local() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_database():
    """初始化数据库"""
    await db_manager.init_db()


async def drop_database():
    """清空数据库（开发用）"""
    await db_manager.drop_all()
