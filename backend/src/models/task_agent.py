# backend/src/models/task_agent.py
"""
Task Agent 数据库模型

包含任务分类和任务表结构
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..core.database import Base


class TaskCategory(Base):
    """任务分类表"""
    __tablename__ = "task_categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(20), nullable=False, default="#3B82F6")
    icon = Column(String(50), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # 关系
    tasks = relationship("Task", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<TaskCategory(id={self.id}, name='{self.name}')>"


class Task(Base):
    """任务表"""
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    category_id = Column(String(36), ForeignKey("task_categories.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(20), default="medium", nullable=False)  # low / medium / high
    status = Column(String(20), default="pending", nullable=False)  # pending / in_progress / done / failed
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    ai_generated = Column(Boolean, default=False, nullable=False)
    raw_input = Column(Text, nullable=True)  # AI 生成任务的原始输入
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # 关系
    category = relationship("TaskCategory", back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}')>"


# 枚举类型定义（用于类型提示）
TaskPriority = {"low", "medium", "high"}
TaskStatus = {"pending", "in_progress", "done", "failed"}
