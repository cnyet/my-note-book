"""Database models for secretary content tracking."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, Float
from sqlalchemy.sql import func
from api.database import Base


class UserAction(Base):
    """Track user interactions with secretary content."""
    __tablename__ = "user_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    secretary_type = Column(String(20), nullable=False, index=True)
    action_type = Column(String(50), nullable=False)  # 'read', 'save', 'favorite', 'complete'
    content_id = Column(String(100), nullable=False)
    content_date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContentIndex(Base):
    """Search index for secretary content."""
    __tablename__ = "content_index"
    
    id = Column(Integer, primary_key=True, index=True)
    secretary_type = Column(String(20), nullable=False, index=True)
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
