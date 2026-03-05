# backend/src/models/life_agent.py
"""
Life Agent 数据库模型

包含健康指标和健康建议表结构
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..core.database import Base


class HealthMetrics(Base):
    """健康指标表"""
    __tablename__ = "health_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    height = Column(Integer, nullable=True)  # cm
    weight = Column(Float, nullable=True)  # kg
    health_status = Column(String(50), nullable=True)  # excellent/good/fair/poor
    exercise_frequency = Column(String(20), nullable=True)  # daily/weekly/rarely/never
    diet_preference = Column(String(50), nullable=True)  # normal/vegetarian/vegan/keto/etc.
    sleep_hours = Column(Float, nullable=True)  # hours per day
    water_intake = Column(Integer, nullable=True)  # ml per day
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # 关系
    suggestions = relationship("HealthSuggestion", back_populates="metric", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<HealthMetrics(id={self.id}, weight={self.weight}kg)>"


class HealthSuggestion(Base):
    """健康建议表"""
    __tablename__ = "health_suggestions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    metric_id = Column(String(36), ForeignKey("health_metrics.id"), nullable=False)
    diet_suggestion = Column(Text, nullable=True)
    exercise_suggestion = Column(Text, nullable=True)
    lifestyle_suggestion = Column(Text, nullable=True)
    ai_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # 关系
    metric = relationship("HealthMetrics", back_populates="suggestions")

    def __repr__(self):
        return f"<HealthSuggestion(id={self.id}, metric_id={self.metric_id})>"
