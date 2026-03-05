# backend/src/schemas/task_agent.py
"""
Task Agent Pydantic Schemas

用于请求/响应验证
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class TaskCategoryBase(BaseModel):
    """TaskCategory 基础 Schema"""
    name: str = Field(..., description="分类名称", min_length=1, max_length=100)
    color: str = Field(default="#3B82F6", description="分类颜色 (HEX)")
    icon: Optional[str] = Field(None, description="分类图标 (emoji)")
    sort_order: int = Field(default=0, description="排序顺序")


class TaskCategoryCreate(TaskCategoryBase):
    """创建任务分类请求"""
    pass


class TaskCategoryResponse(TaskCategoryBase):
    """任务分类响应"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    """Task 基础 Schema"""
    title: str = Field(..., description="任务标题", min_length=1, max_length=200)
    description: Optional[str] = Field(None, description="任务描述")
    priority: str = Field(default="medium", description="优先级：low/medium/high")
    status: str = Field(default="pending", description="状态：pending/in_progress/done/failed")
    due_date: Optional[datetime] = Field(None, description="截止日期")
    category_id: Optional[str] = Field(None, description="分类 ID")


class TaskCreate(TaskBase):
    """创建任务请求"""
    raw_input: Optional[str] = Field(None, description="AI 生成任务的原始输入")
    ai_generated: bool = Field(default=False, description="是否 AI 生成")


class TaskUpdate(BaseModel):
    """更新任务请求"""
    title: Optional[str] = Field(None, description="任务标题", min_length=1, max_length=200)
    description: Optional[str] = Field(None, description="任务描述")
    priority: Optional[str] = Field(None, description="优先级：low/medium/high")
    status: Optional[str] = Field(None, description="状态：pending/in_progress/done/failed")
    due_date: Optional[datetime] = Field(None, description="截止日期")
    category_id: Optional[str] = Field(None, description="分类 ID")


class TaskResponse(TaskBase):
    """任务响应"""
    id: str
    completed_at: Optional[datetime]
    ai_generated: bool
    raw_input: Optional[str]
    created_at: datetime
    updated_at: datetime
    category: Optional[TaskCategoryResponse] = None

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """任务列表响应"""
    tasks: List[TaskResponse]
    total: int
    page: int
    page_size: int
    has_more: bool
