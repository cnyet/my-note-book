# backend/src/models/news_source.py
"""
News Source model for News Agent
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..core.database import Base


class NewsSource(Base):
    """新闻源表"""
    __tablename__ = "news_sources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    name = Column(String(100), nullable=False)
    url = Column(String(500), nullable=False)
    source_type = Column(String(20), nullable=False, default="rss")  # rss / http
    category = Column(String(50), nullable=True)  # tech / business / design / etc.
    language = Column(String(10), default="zh", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    crawl_interval = Column(Integer, default=3600, nullable=False)  # 秒
    last_crawled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # 关系
    articles = relationship("NewsArticle", back_populates="source", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<NewsSource(id={self.id}, name='{self.name}')>"
