"""
Configuration models using Pydantic
Provides type-safe configuration with validation
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class LLMConfig(BaseModel):
    """LLM配置模型
    
    用于验证和管理LLM提供商配置
    """
    provider: str = Field(
        ...,
        description="LLM provider: glm, anthropic, or claude"
    )
    api_key: str = Field(
        ...,
        min_length=10,
        description="API key for the LLM provider"
    )
    model: str = Field(
        default="glm-4",
        description="Model name to use"
    )
    base_url: Optional[str] = Field(
        default=None,
        description="Base URL for API (optional)"
    )
    main_model: Optional[str] = Field(
        default=None,
        description="Main model for complex tasks"
    )
    lightweight_model: Optional[str] = Field(
        default=None,
        description="Lightweight model for simple tasks"
    )
    
    @field_validator('provider')
    @classmethod
    def validate_provider(cls, v: str) -> str:
        """验证provider是否为支持的值"""
        allowed = ['glm', 'anthropic', 'claude']
        if v.lower() not in allowed:
            raise ValueError(
                f'Invalid provider: {v}. Must be one of {allowed}'
            )
        return v.lower()
    
    @field_validator('api_key')
    @classmethod
    def validate_api_key(cls, v: str) -> str:
        """验证API key格式"""
        if not v or v.isspace():
            raise ValueError('API key cannot be empty or whitespace')
        return v.strip()


class DataConfig(BaseModel):
    """数据配置模型
    
    用于管理数据存储路径配置
    """
    base_dir: str = Field(
        default=".",
        description="Base directory for the application"
    )
    logs_dir: str = Field(
        default="data/daily_logs",
        description="Directory for daily log files"
    )
    vector_db_dir: str = Field(
        default="data/vector_db",
        description="Directory for vector database"
    )
    knowledge_base_dir: str = Field(
        default="data/knowledge_base",
        description="Directory for knowledge base"
    )
    templates_dir: str = Field(
        default="templates",
        description="Directory for templates"
    )
    
    @field_validator('base_dir', 'logs_dir', 'vector_db_dir', 
                     'knowledge_base_dir', 'templates_dir')
    @classmethod
    def validate_path(cls, v: str) -> str:
        """验证路径不为空"""
        if not v or v.isspace():
            raise ValueError('Path cannot be empty or whitespace')
        return v.strip()


class WeatherConfig(BaseModel):
    """天气API配置模型"""
    provider: str = Field(
        default="qweather",
        description="Weather provider: qweather, seniverse, openweathermap"
    )
    api_key: str = Field(
        ...,
        min_length=10,
        description="API key for weather service"
    )
    location: str = Field(
        default="上海",
        description="Default location for weather queries"
    )
    
    @field_validator('provider')
    @classmethod
    def validate_provider(cls, v: str) -> str:
        """验证weather provider"""
        allowed = ['qweather', 'seniverse', 'openweathermap']
        if v.lower() not in allowed:
            raise ValueError(
                f'Invalid weather provider: {v}. Must be one of {allowed}'
            )
        return v.lower()


class UserConfig(BaseModel):
    """用户配置模型"""
    name: str = Field(
        default="用户",
        description="User name"
    )
    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=150,
        description="User age"
    )
    location: str = Field(
        default="上海",
        description="User location"
    )
    preferences: dict = Field(
        default_factory=dict,
        description="User preferences"
    )


class AppConfig(BaseModel):
    """应用配置模型
    
    整合所有配置子模块
    """
    llm: LLMConfig = Field(
        ...,
        description="LLM configuration"
    )
    data: DataConfig = Field(
        default_factory=DataConfig,
        description="Data storage configuration"
    )
    weather: Optional[WeatherConfig] = Field(
        default=None,
        description="Weather API configuration"
    )
    user: Optional[UserConfig] = Field(
        default=None,
        description="User configuration"
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "llm": {
                        "provider": "glm",
                        "api_key": "your-api-key-here",
                        "model": "glm-4"
                    },
                    "data": {
                        "base_dir": ".",
                        "logs_dir": "data/daily_logs"
                    }
                }
            ]
        }
    }
