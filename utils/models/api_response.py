"""
API response models
Provides type-safe structures for external API responses
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime


class LLMResponse(BaseModel):
    """LLM API响应模型"""
    content: str = Field(
        ...,
        description="Response content from LLM"
    )
    tokens_used: int = Field(
        default=0,
        ge=0,
        description="Number of tokens used"
    )
    model: str = Field(
        ...,
        description="Model name used for generation"
    )
    finish_reason: Optional[str] = Field(
        default=None,
        description="Reason for completion"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata"
    )
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v: str) -> str:
        """验证内容不为空"""
        if not v:
            raise ValueError('Content cannot be empty')
        return v


class WeatherResponse(BaseModel):
    """天气API响应模型"""
    temperature: float = Field(
        ...,
        description="Temperature in Celsius"
    )
    condition: str = Field(
        ...,
        description="Weather condition description"
    )
    humidity: int = Field(
        ...,
        ge=0,
        le=100,
        description="Humidity percentage"
    )
    wind_speed: Optional[float] = Field(
        default=None,
        ge=0,
        description="Wind speed in km/h"
    )
    wind_direction: Optional[str] = Field(
        default=None,
        description="Wind direction"
    )
    pressure: Optional[float] = Field(
        default=None,
        ge=0,
        description="Atmospheric pressure in hPa"
    )
    visibility: Optional[float] = Field(
        default=None,
        ge=0,
        description="Visibility in km"
    )
    uv_index: Optional[int] = Field(
        default=None,
        ge=0,
        le=15,
        description="UV index"
    )
    location: Optional[str] = Field(
        default=None,
        description="Location name"
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="Timestamp of weather data"
    )
    
    @field_validator('condition')
    @classmethod
    def validate_condition(cls, v: str) -> str:
        """验证天气状况不为空"""
        if not v or v.isspace():
            raise ValueError('Weather condition cannot be empty')
        return v.strip()
    
    @field_validator('timestamp')
    @classmethod
    def validate_timestamp(cls, v: Optional[str]) -> Optional[str]:
        """验证时间戳格式（如果提供）"""
        if v is None:
            return v
        try:
            # 尝试解析ISO格式时间戳
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except (ValueError, AttributeError):
            # 如果不是ISO格式，返回原值（允许其他格式）
            return v


class NewsAPIResponse(BaseModel):
    """新闻API响应模型"""
    articles: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of news articles"
    )
    total_results: int = Field(
        default=0,
        ge=0,
        description="Total number of results"
    )
    status: str = Field(
        default="ok",
        description="API response status"
    )
    source: Optional[str] = Field(
        default=None,
        description="News source"
    )


class APIError(BaseModel):
    """API错误响应模型"""
    error_code: str = Field(
        ...,
        description="Error code"
    )
    error_message: str = Field(
        ...,
        description="Error message"
    )
    status_code: int = Field(
        ...,
        ge=400,
        le=599,
        description="HTTP status code"
    )
    details: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional error details"
    )
    
    @field_validator('error_message')
    @classmethod
    def validate_error_message(cls, v: str) -> str:
        """验证错误消息不为空"""
        if not v or v.isspace():
            raise ValueError('Error message cannot be empty')
        return v.strip()


class HealthAPIResponse(BaseModel):
    """健康数据API响应模型"""
    steps: Optional[int] = Field(
        default=None,
        ge=0,
        description="Steps count"
    )
    calories: Optional[float] = Field(
        default=None,
        ge=0,
        description="Calories burned"
    )
    heart_rate: Optional[int] = Field(
        default=None,
        ge=0,
        le=300,
        description="Heart rate in bpm"
    )
    sleep_quality: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="Sleep quality score"
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="Data timestamp"
    )
