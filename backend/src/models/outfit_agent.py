# backend/src/models/outfit_agent.py
"""
Outfit Agent 数据库模型

包含穿搭推荐表结构
"""

from datetime import datetime, timezone, date
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Date, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base


class OutfitRecommendation(Base):
    """穿搭推荐表"""
    __tablename__ = "outfit_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    recommend_date = Column(Date, nullable=False, index=True)  # 推荐日期
    weather_data = Column(Text, nullable=True)  # JSON 天气数据 (temperature, humidity, condition)
    schedule_input = Column(String(200), nullable=True)  # 日程输入
    outfit_description = Column(Text, nullable=False)  # 穿搭描述
    outfit_image_path = Column(String(500), nullable=True)  # 生成的图片路径
    outfit_image_url = Column(String(500), nullable=True)  # 图片 URL
    ai_notes = Column(Text, nullable=True)  # AI 备注
    is_generated = Column(Boolean, default=False, nullable=False)  # 是否 AI 生成
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<OutfitRecommendation(id={self.id}, recommend_date={self.recommend_date})>"
