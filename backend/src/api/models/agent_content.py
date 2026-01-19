"""Database models for agent content tracking."""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, Float
from sqlalchemy.sql import func
from api.database import Base


class UserAction(Base):
    """Track user interactions with agent content."""

    __tablename__ = "user_actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    agent_type = Column(String(20), nullable=False, index=True)
    action_type = Column(
        String(50), nullable=False
    )  # 'read', 'save', 'favorite', 'complete'
    content_id = Column(String(100), nullable=False)
    content_date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContentIndex(Base):
    """Search index for agent content."""

    __tablename__ = "content_index"

    id = Column(Integer, primary_key=True, index=True)
    agent_type = Column(String(20), nullable=False, index=True)
    content_date = Column(Date, nullable=False, index=True)
    content_text = Column(Text, nullable=False)
    keywords = Column(Text)  # Comma-separated keywords
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class HealthMetric(Base):
    """Track health metrics over time."""

    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True, unique=True)
    steps = Column(Integer)
    sleep_hours = Column(Float)
    water_intake = Column(Integer)  # ml
    exercise_minutes = Column(Integer)
    health_score = Column(Integer)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NewsArticle(Base):
    """Store news articles from news agent."""

    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    source = Column(
        String(100), nullable=False
    )  # TechCrunch, MIT Tech Review, The Verge, Reddit, etc.
    link = Column(String(1000), nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)  # Full article content if available
    image_url = Column(String(1000), nullable=True)  # Image URL for Reddit posts
    thumbnail_url = Column(String(1000), nullable=True)  # Thumbnail URL
    importance_score = Column(Integer, default=3)  # 1-5 importance rating
    category = Column(String(50), nullable=True)  # AI, Tech, Research, Startup, etc.
    published_date = Column(DateTime(timezone=True), nullable=True)
    article_date = Column(
        Date, nullable=False, index=True
    )  # Date when article was collected
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    __table_args__ = ({"sqlite_autoincrement": True},)


class WorkTask(Base):
    """Store granular work tasks."""

    __tablename__ = "work_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    priority = Column(String(20), default="medium")  # high, medium, low
    estimated_minutes = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DailyReflection(Base):
    """Store evening reflections and scores."""

    __tablename__ = "daily_reflections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True, unique=True)
    productivity_score = Column(Integer)  # 1-10
    happiness_score = Column(Integer)  # 1-10
    growth_score = Column(Integer)  # 1-10
    key_insight = Column(Text)
    mood_summary = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
