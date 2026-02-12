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
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    posts = relationship("BlogPost", back_populates="author")


class BlogPost(Base):
    """博客文章表"""
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    seo_title = Column(String(70), nullable=True)
    seo_description = Column(String(160), nullable=True)
    status = Column(String(20), nullable=False, default="draft")
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    tags = relationship("PostTag", back_populates="post", cascade="all, delete-orphan")


class Agent(Base):
    """AI 智能体配置表"""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, default="active")
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Tool(Base):
    """工具库表"""
    __tablename__ = "tools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, default="active")
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Lab(Base):
    """实验室功能表"""
    __tablename__ = "labs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="Experimental")
    description = Column(Text, nullable=True)
    demo_url = Column(String(500), nullable=True)
    media_urls = Column(Text, nullable=True)
    online_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PostTag(Base):
    """文章标签关联表"""
    __tablename__ = "post_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    tag_name = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class APIToken(Base):
    """API 令牌表"""
    __tablename__ = "api_tokens"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    last_used = Column(DateTime, nullable=True)
