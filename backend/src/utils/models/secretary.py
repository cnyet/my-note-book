"""
Secretary business data models
Provides type-safe data structures for secretary operations
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime


class TaskSummary(BaseModel):
    """任务摘要模型
    
    用于工作秘书的任务管理
    """
    tasks_completed: List[str] = Field(
        default_factory=list,
        description="List of completed tasks"
    )
    tasks_pending: List[str] = Field(
        default_factory=list,
        description="List of pending tasks"
    )
    highlights: List[str] = Field(
        default_factory=list,
        description="Key highlights or achievements"
    )
    priorities: List[str] = Field(
        default_factory=list,
        description="Priority tasks for today"
    )
    
    @field_validator('tasks_completed', 'tasks_pending', 
                     'highlights', 'priorities')
    @classmethod
    def validate_list_items(cls, v: List[str]) -> List[str]:
        """验证列表项不为空字符串"""
        return [item.strip() for item in v if item and not item.isspace()]


class NewsArticle(BaseModel):
    """新闻文章模型"""
    title: str = Field(
        ...,
        min_length=1,
        description="Article title"
    )
    summary: str = Field(
        default="",
        description="Article summary"
    )
    url: Optional[str] = Field(
        default=None,
        description="Article URL"
    )
    source: Optional[str] = Field(
        default=None,
        description="News source"
    )
    importance: int = Field(
        default=3,
        ge=1,
        le=5,
        description="Importance score (1-5)"
    )
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        """验证标题不为空"""
        if not v or v.isspace():
            raise ValueError('Title cannot be empty')
        return v.strip()


class OutfitSuggestion(BaseModel):
    """穿搭建议模型"""
    weather_condition: str = Field(
        ...,
        description="Weather condition"
    )
    temperature: float = Field(
        ...,
        description="Temperature in Celsius"
    )
    top: str = Field(
        default="",
        description="Top clothing suggestion"
    )
    bottom: str = Field(
        default="",
        description="Bottom clothing suggestion"
    )
    shoes: str = Field(
        default="",
        description="Shoes suggestion"
    )
    accessories: List[str] = Field(
        default_factory=list,
        description="Accessories suggestions"
    )
    notes: str = Field(
        default="",
        description="Additional notes"
    )


class HealthData(BaseModel):
    """健康数据模型"""
    water_intake: int = Field(
        default=0,
        ge=0,
        description="Water intake in ml"
    )
    exercise_minutes: int = Field(
        default=0,
        ge=0,
        description="Exercise duration in minutes"
    )
    sleep_hours: Optional[float] = Field(
        default=None,
        ge=0,
        le=24,
        description="Sleep duration in hours"
    )
    mood: Optional[str] = Field(
        default=None,
        description="Mood description"
    )
    notes: str = Field(
        default="",
        description="Additional health notes"
    )


class ReviewData(BaseModel):
    """复盘数据模型"""
    date: str = Field(
        ...,
        description="Review date in YYYY-MM-DD format"
    )
    achievements: List[str] = Field(
        default_factory=list,
        description="Today's achievements"
    )
    challenges: List[str] = Field(
        default_factory=list,
        description="Challenges faced"
    )
    learnings: List[str] = Field(
        default_factory=list,
        description="Key learnings"
    )
    gratitude: List[str] = Field(
        default_factory=list,
        description="Things to be grateful for"
    )
    tomorrow_plan: List[str] = Field(
        default_factory=list,
        description="Plan for tomorrow"
    )
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        """验证日期格式"""
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError(
                f'Invalid date format: {v}. Expected YYYY-MM-DD'
            )


class DailyData(BaseModel):
    """每日数据模型
    
    整合所有秘书的每日数据
    """
    date: str = Field(
        ...,
        description="Date in YYYY-MM-DD format"
    )
    news_summary: Optional[List[NewsArticle]] = Field(
        default=None,
        description="News articles summary"
    )
    work_summary: Optional[TaskSummary] = Field(
        default=None,
        description="Work tasks summary"
    )
    outfit_suggestion: Optional[OutfitSuggestion] = Field(
        default=None,
        description="Outfit suggestion"
    )
    health_data: Optional[HealthData] = Field(
        default=None,
        description="Health tracking data"
    )
    review_data: Optional[ReviewData] = Field(
        default=None,
        description="Evening review data"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata"
    )
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        """验证日期格式"""
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError(
                f'Invalid date format: {v}. Expected YYYY-MM-DD'
            )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "date": "2024-12-30",
                    "work_summary": {
                        "tasks_completed": ["完成项目文档", "代码审查"],
                        "tasks_pending": ["准备演示", "修复bug"],
                        "highlights": ["成功部署新功能"]
                    }
                }
            ]
        }
    }
