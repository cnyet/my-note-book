# backend/src/models/news_article.py
"""
News Article model for News Agent
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class NewsArticle(Base):
    """新闻文章表"""
    __tablename__ = "news_articles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    source_id = Column(String(36), ForeignKey("news_sources.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    url = Column(String(500), nullable=False, unique=True, index=True)
    author = Column(String(100), nullable=True)
    published_at = Column(DateTime, nullable=True)
    crawled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    content = Column(Text, nullable=True)  # 原始内容
    summary = Column(Text, nullable=True)  # AI 摘要
    summary_model = Column(String(50), nullable=True)  # 使用的 LLM 模型
    category = Column(String(50), nullable=True)
    tags = Column(JSON, nullable=True)  # 标签数组
    image_url = Column(String(500), nullable=True)  # 封面图
    is_featured = Column(Boolean, default=False, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)

    # 关系
    source = relationship("NewsSource", back_populates="articles")

    def __repr__(self):
        return f"<NewsArticle(id={self.id}, title='{self.title[:50]}...')>"
