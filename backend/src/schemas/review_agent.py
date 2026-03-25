# backend/src/schemas/review_agent.py
"""
Review Agent Pydantic Schemas
"""

from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, Field


class DailyReviewBase(BaseModel):
    """DailyReview 基础 Schema"""
    review_date: date = Field(..., description="复盘日期")
    tasks_completed: int = Field(default=0, description="完成任务数")
    tasks_failed: int = Field(default=0, description="失败任务数")
    mood_score: Optional[int] = Field(None, description="心情分数 1-10")
    highlights: Optional[str] = Field(None, description="亮点")
    improvements: Optional[str] = Field(None, description="改进点")
    news_summary: Optional[str] = Field(None, description="新闻摘要")
    ai_summary: Optional[str] = Field(None, description="AI 总结")


class DailyReviewCreate(DailyReviewBase):
    """创建每日复盘请求"""
    health_data: Optional[str] = Field(None, description="健康数据 JSON")
    outfit_data: Optional[str] = Field(None, description="穿搭数据 JSON")


class DailyReviewUpdate(BaseModel):
    """更新每日复盘请求"""
    tasks_completed: Optional[int] = None
    tasks_failed: Optional[int] = None
    health_data: Optional[str] = None
    outfit_data: Optional[str] = None
    news_summary: Optional[str] = None
    ai_summary: Optional[str] = None
    mood_score: Optional[int] = None
    highlights: Optional[str] = None
    improvements: Optional[str] = None


class DailyReviewResponse(DailyReviewBase):
    """每日复盘响应"""
    id: str
    health_data: Optional[str]
    outfit_data: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailyReviewListResponse(BaseModel):
    """每日复盘列表响应"""
    reviews: List[DailyReviewResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class UserPreferenceBase(BaseModel):
    """UserPreference 基础 Schema"""
    category: str = Field(..., description="类别：work/study/health/lifestyle")
    key: str = Field(..., description="偏好键")
    value: str = Field(..., description="偏好值 (JSON)")
    confidence: float = Field(default=1.0, description="置信度 0-1")


class UserPreferenceCreate(UserPreferenceBase):
    """创建用户偏好请求"""
    pass


class UserPreferenceUpdate(BaseModel):
    """更新用户偏好请求"""
    value: Optional[str] = None
    confidence: Optional[float] = None


class UserPreferenceResponse(UserPreferenceBase):
    """用户偏好响应"""
    id: str
    last_verified: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserPreferenceListResponse(BaseModel):
    """用户偏好列表响应"""
    preferences: List[UserPreferenceResponse]
    total: int


# Eisenhower Matrix 四象限分析相关 Schema

class TaskAnalysisInput(BaseModel):
    """任务分析输入"""
    title: str = Field(..., description="任务标题")
    description: str = Field(..., description="任务描述")


class TaskAnalysisRequest(BaseModel):
    """四象限分析请求"""
    tasks: List[TaskAnalysisInput] = Field(..., description="待分析的任务列表")


class QuadrantTask(BaseModel):
    """象限中的任务"""
    title: str
    description: str
    reason: str = Field(..., description="分类理由")


class QuadrantAnalysisResponse(BaseModel):
    """四象限分析响应"""
    important_urgent: List[QuadrantTask] = Field(..., description="重要且紧急")
    important_not_urgent: List[QuadrantTask] = Field(..., description="重要不紧急")
    not_important_urgent: List[QuadrantTask] = Field(..., description="不重要紧急")
    not_important_not_urgent: List[QuadrantTask] = Field(..., description="不重要不紧急")
