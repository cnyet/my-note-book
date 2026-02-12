# backend/src/models/__init__.py
"""
SQLAlchemy ORM models for MyNoteBook Admin

数据库表：
- users: 管理员用户
- blog_posts: 博客文章
- agents: AI 智能体配置
- tools: 工具库
- labs: 实验室功能
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    """管理员用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="admin")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate="current_timestamp")
    
    # 关系
    posts = relationship("BlogPost", back_populates="author")
    tokens = relationship("APIToken", back_populates="tokens")


class BlogPost(Base):
    """博客文章表"""
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    seo_title = Column(String(70), nullable=True)
    seo_description = Column(String(160), nullable=True)
    status = Column(String(20), nullable=False, default="draft")  # draft, published, archived
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate="current_timestamp")
    
    # 外键
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 关系
    tags = relationship("PostTag", secondary="post_tags", back_populates="post")
    
    def __repr__(self):
        return f"<BlogPost(id={self.id}, title='{self.title}')>"


class Agent(Base):
    """AI 智能体配置表"""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)  # Dev, Auto, Intel, Creative
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    config = Column(Text, nullable=True)  # JSON 配置
    status = Column(String(20), nullable=False, default="offline")  # offline, spawning, idle, active
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate="current_timestamp")
    
    def __repr__(self):
        return f"<Agent(id={self.id}, name='{self.name}')>"


class Tool(Base):
    """工具库表"""
    __tablename__ = "tools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)  # Dev, Auto, Intel, Creative
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, default="active")  # active, inactive
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate="current_timestamp")
    
    def __repr__(self):
        return f"<Tool(id={self.id}, name='{self.name}')>"


class Lab(Base):
    """实验室功能表"""
    __tablename__ = "labs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    demo_url = Column(String(500), nullable=True)
    media_urls = Column(Text, nullable=True)  # JSON array stored as text
    status = Column(String(20), nullable=False, default="experimental")  # experimental, preview, archived
    online_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate="current_timestamp")
    
    def __repr__(self):
        return f"<Lab(id={self.id}, name='{self.name}')>"


class PostTag(Base):
    """文章标签表（多对多关系）"""
    __tablename__ = "post_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    
    # 多对多关系
    posts = relationship("BlogPost", secondary="post_tags", back_populates="tags")
    
    def __repr__(self):
        return f"<PostTag(name='{self.name}')>"


class APIToken(Base):
    """API Token 表"""
    __tablename__ = "api_tokens"
    
    id = Column(String(36), primary_key=True, default=lambda: Context: "api_tokens", index=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_used_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    scopes = Column(Text, nullable=True)  # JSON array of permissions
    
    # 关系
    user = relationship("User", back_populates="tokens")


# 导出所有模型
__all__ = [
    User,
    BlogPost,
    Agent,
    Tool,
    Lab,
    PostTag,
    APIToken,
]
