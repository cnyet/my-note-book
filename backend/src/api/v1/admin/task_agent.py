# backend/src/api/v1/admin/task_agent.py
"""
Task Agent API - 任务管理相关接口
"""

import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....schemas.task_agent import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    TaskCategoryCreate,
    TaskCategoryResponse
)
from ....agents.task.agent import TaskAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/task", tags=["task"])


async def get_task_agent(db: AsyncSession) -> TaskAgent:
    """获取 TaskAgent 实例"""
    agent = TaskAgent(agent_id="task_agent_001", session=db)
    return agent


@router.get("", response_model=TaskListResponse)
async def get_tasks(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    status: Optional[str] = Query(None, description="状态筛选"),
    priority: Optional[str] = Query(None, description="优先级筛选"),
    category_id: Optional[str] = Query(None, description="分类筛选"),
):
    """获取任务列表"""
    agent = await get_task_agent(db)
    
    result = await agent.get_tasks(
        page=page,
        page_size=page_size,
        status=status,
        priority=priority,
        category_id=category_id
    )
    
    return result


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建任务"""
    agent = await get_task_agent(db)
    
    result = await agent.create_task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        category_id=task_data.category_id,
        due_date=task_data.due_date,
        raw_input=task_data.raw_input,
        ai_generated=task_data.ai_generated
    )
    
    return result


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取任务详情"""
    agent = await get_task_agent(db)
    result = await agent.get_task(task_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return result


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新任务"""
    agent = await get_task_agent(db)
    
    result = await agent.update_task(
        task_id=task_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        status=task_data.status,
        category_id=task_data.category_id,
        due_date=task_data.due_date
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return result


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除任务"""
    agent = await get_task_agent(db)
    success = await agent.delete_task(task_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return {"message": "任务已删除"}


@router.post("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """标记任务完成"""
    agent = await get_task_agent(db)
    result = await agent.complete_task(task_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return result


@router.get("/categories", response_model=List[TaskCategoryResponse])
async def get_categories(
    db: AsyncSession = Depends(get_db),
):
    """获取所有任务分类"""
    agent = await get_task_agent(db)
    categories = await agent.get_categories()
    return categories


@router.post("/categories", response_model=TaskCategoryResponse, status_code=201)
async def create_category(
    category_data: TaskCategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建任务分类"""
    agent = await get_task_agent(db)
    
    result = await agent.create_category(
        name=category_data.name,
        color=category_data.color,
        icon=category_data.icon,
        sort_order=category_data.sort_order
    )
    
    return result


@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除任务分类"""
    agent = await get_task_agent(db)
    success = await agent.delete_category(category_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="分类不存在")
    
    return {"message": "分类已删除"}
