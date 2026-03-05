# backend/src/schemas/life_agent.py
"""
Life Agent Pydantic Schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class HealthMetricsBase(BaseModel):
    """HealthMetrics 基础 Schema"""
    height: Optional[int] = Field(None, description="身高 (cm)")
    weight: Optional[float] = Field(None, description="体重 (kg)")
    health_status: Optional[str] = Field(None, description="健康状况")
    exercise_frequency: Optional[str] = Field(None, description="运动频率")
    diet_preference: Optional[str] = Field(None, description="饮食偏好")
    sleep_hours: Optional[float] = Field(None, description="睡眠时长 (小时)")
    water_intake: Optional[int] = Field(None, description="饮水量 (ml)")
    notes: Optional[str] = Field(None, description="备注")


class HealthMetricsCreate(HealthMetricsBase):
    """创建健康指标请求"""
    pass


class HealthMetricsUpdate(HealthMetricsBase):
    """更新健康指标请求"""
    pass


class HealthSuggestionBase(BaseModel):
    """HealthSuggestion 基础 Schema"""
    diet_suggestion: Optional[str] = Field(None, description="饮食建议")
    exercise_suggestion: Optional[str] = Field(None, description="运动建议")
    lifestyle_suggestion: Optional[str] = Field(None, description="生活方式建议")
    ai_notes: Optional[str] = Field(None, description="AI 备注")


class HealthSuggestionCreate(HealthSuggestionBase):
    """创建健康建议请求"""
    metric_id: str = Field(..., description="关联的健康指标 ID")


class HealthSuggestionResponse(HealthSuggestionBase):
    """健康建议响应"""
    id: str
    metric_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class HealthMetricsResponse(HealthMetricsBase):
    """健康指标响应"""
    id: str
    created_at: datetime
    updated_at: datetime
    suggestions: Optional[List[HealthSuggestionResponse]] = None

    class Config:
        from_attributes = True


class HealthMetricsListResponse(BaseModel):
    """健康指标列表响应"""
    metrics: List[HealthMetricsResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class GenerateSuggestionRequest(BaseModel):
    """生成 AI 建议请求"""
    metric_id: str = Field(..., description="健康指标 ID")
