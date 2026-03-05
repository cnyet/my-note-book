# backend/src/schemas/outfit_agent.py
"""
Outfit Agent Pydantic Schemas
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class OutfitRecommendationBase(BaseModel):
    """OutfitRecommendation 基础 Schema"""
    recommend_date: date = Field(..., description="推荐日期")
    schedule_input: Optional[str] = Field(None, description="日程输入")
    outfit_description: str = Field(..., description="穿搭描述")
    ai_notes: Optional[str] = Field(None, description="AI 备注")


class OutfitRecommendationCreate(OutfitRecommendationBase):
    """创建穿搭推荐请求"""
    weather_data: Optional[str] = Field(None, description="天气数据 JSON")
    outfit_image_path: Optional[str] = Field(None, description="图片路径")
    outfit_image_url: Optional[str] = Field(None, description="图片 URL")
    is_generated: bool = Field(default=False, description="是否 AI 生成")


class OutfitRecommendationUpdate(BaseModel):
    """更新穿搭推荐请求"""
    outfit_description: Optional[str] = None
    outfit_image_path: Optional[str] = None
    outfit_image_url: Optional[str] = None
    ai_notes: Optional[str] = None


class OutfitRecommendationResponse(OutfitRecommendationBase):
    """穿搭推荐响应"""
    id: str
    weather_data: Optional[str]
    outfit_image_path: Optional[str]
    outfit_image_url: Optional[str]
    is_generated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OutfitRecommendationListResponse(BaseModel):
    """穿搭推荐列表响应"""
    recommendations: List[OutfitRecommendationResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class GenerateOutfitRequest(BaseModel):
    """生成穿搭请求"""
    recommend_date: date = Field(..., description="推荐日期")
    schedule_input: Optional[str] = Field(None, description="日程输入")
    weather_data: Optional[dict] = Field(None, description="天气数据")
