# backend/src/models/review_agent.py
"""
Review Agent 数据库模型

包含每日复盘和用户偏好表结构
"""

from datetime import datetime, timezone, date
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class DailyReview(Base):
    """每日复盘表"""
    __tablename__ = "daily_reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    review_date = Column(Date, nullable=False, unique=True, index=True)  # 复盘日期
    tasks_completed = Column(Integer, default=0, nullable=False)  # 完成任务数
    tasks_failed = Column(Integer, default=0, nullable=False)  # 失败任务数
    health_data = Column(Text, nullable=True)  # JSON 健康数据
    outfit_data = Column(Text, nullable=True)  # JSON 穿搭数据
    news_summary = Column(Text, nullable=True)  # 新闻摘要
    ai_summary = Column(Text, nullable=True)  # AI 总结
    mood_score = Column(Integer, nullable=True)  # 心情分数 1-10
    highlights = Column(Text, nullable=True)  # 亮点
    improvements = Column(Text, nullable=True)  # 改进点
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<DailyReview(id={self.id}, review_date={self.review_date})>"


class UserPreference(Base):
    """用户偏好表"""
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    category = Column(String(50), nullable=False, index=True)  # work/study/health/lifestyle
    key = Column(String(100), nullable=False, index=True)  # 偏好键
    value = Column(Text, nullable=False)  # JSON 偏好值
    confidence = Column(Float, default=1.0, nullable=False)  # 置信度 0-1
    last_verified = Column(DateTime, nullable=True)  # 最后验证时间
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<UserPreference(id={self.id}, category={self.category}, key={self.key})>"
