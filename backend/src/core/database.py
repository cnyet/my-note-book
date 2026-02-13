# backend/src/core/database.py
"""
Database initialization and management using SQLAlchemy ORM

提供功能：
- 数据库连接管理
- 表初始化
- 基础 CRUD 操作
- 数据库迁移支持
"""
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from contextlib import contextmanager
from pathlib import Path
import logging

from .config import settings
from ..models import Base

logger = logging.getLogger(__name__)


class DatabaseManager:
    """数据库管理器"""
    
    def __init__(self, database_url: str = None):
        self.database_url = database_url or settings.DATABASE_URL
        self.engine = None
        self.SessionLocal = None
    
    def get_engine(self):
        """获取或创建数据库引擎"""
        if not self.engine:
            # 确保数据库目录存在
            db_path = Path(self.database_url.replace("sqlite:///", "").replace("sqlite:///./", ""))
            db_path.parent.mkdir(parents=True, exist_ok=True)
            
            self.engine = create_engine(
                self.database_url,
                connect_args={"check_same_thread": False} if "sqlite" in self.database_url else {},
                echo=True,
            )
            logger.info(f"Database engine created: {self.database_url}")
        return self.engine
    
    def get_session_local(self):
        """获取 SessionLocal"""
        if not self.SessionLocal:
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.get_engine()
            )
        return self.SessionLocal
    
    @contextmanager
    def get_session(self):
        """获取数据库会话上下文管理器"""
        session = self.get_session_local()()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            session.close()
    
    def init_db(self):
        """初始化数据库表"""
        from ..models import User, BlogPost, Agent, Tool, Lab
        from sqlalchemy import inspect
        
        engine = self.get_engine()
        
        # 创建所有表
        Base.metadata.create_all(engine)
        logger.info("Database tables created successfully")
        
        # 创建初始管理员（如果不存在）
        session = self.get_session_local()
        try:
            # 检查是否已有管理员
            existing_admin = session.query(User).filter_by(username="admin").first()
            
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
                session.commit()
                logger.info(f"Initial admin user created: {admin.username}")
            else:
                logger.info("Admin user already exists")
                
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            raise
        finally:
            session.close()
    
    def drop_all(self):
        """删除所有表（谨慎使用）"""
        engine = self.get_engine()
        Base.metadata.drop_all(engine)
        logger.warning("All database tables dropped")


# 全局数据库管理器实例
db_manager = DatabaseManager()

# 获取数据库会话的便捷函数
def get_db():
    """依赖注入的数据库会话"""
    return db_manager.get_session()

def init_database():
    """初始化数据库"""
    db_manager.init_db()

def drop_database():
    """清空数据库（开发用）"""
    db_manager.drop_all()
