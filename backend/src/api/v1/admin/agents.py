# backend/src/api/v1/admin/agents.py
"""
Agents API with real database operations using SQLAlchemy ORM

重构自 agents_old.py，使用统一的 CRUD 服务和数据库模型。
保持 API 接口不变，向后兼容。
"""

from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session # Should probably remove if not used elsewhere, but keeping just in case.
from pydantic import BaseModel, Field

from ....core.database import get_db
from ....models import Agent
from ....services.crud import get_crud_service
from ....schemas.user import UserResponse

router = APIRouter()


class AgentCreate(BaseModel):
    """创建智能体的请求模型"""
    name: str = Field(..., min_length=1, max_length=100, description="智能体名称")
    slug: str = Field(..., min_length=1, max_length=50, pattern="^[a-z0-9-]+$", description="URL 标识（英文小写字母、数字、短横线）")
    description: str = Field(..., min_length=1, max_length=500, description="智能体描述")
    icon_url: Optional[str] = Field(None, max_length=500, description="图标 URL")
    link: Optional[str] = Field(None, max_length=500, description="相关链接")
    category: str = Field(..., description="智能体类别", pattern="^(Dev|Auto|Intel|Creative)$")
    system_prompt: Optional[str] = Field(None, max_length=2000, description="系统提示词")
    model: str = Field(default="gpt-4", description="使用的 AI 模型")
    is_active: bool = Field(default=True, description="是否启用")


class AgentUpdate(BaseModel):
    """更新智能体的请求模型"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=50, pattern="^[a-z0-9-]+$")
    description: Optional[str] = Field(None, max_length=500)
    icon_url: Optional[str] = Field(None, max_length=500)
    link: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = None
    system_prompt: Optional[str] = Field(None, max_length=2000)
    model: Optional[str] = None
    is_active: Optional[bool] = None


class AgentResponse(BaseModel):
    """智能体响应模型"""
    id: int
    name: str
    slug: str
    description: str
    icon_url: Optional[str]
    link: Optional[str]
    category: str
    system_prompt: Optional[str]
    model: str
    is_active: bool
    created_at: str
    updated_at: Optional[str]
    sort_order: int


# 获取 CRUD 服务
agent_service = get_crud_service(Agent)


@router.get("", response_model=List[AgentResponse])
async def list_agents(
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(100, ge=1, le=100, description="每页记录数"),
    db: AsyncSession = Depends(get_db)
):
    """
    获取所有智能体列表（支持分页和过滤）

    参数：
        category: 按类别过滤 (Dev/Auto/Intel/Creative)
        status: 按状态过滤 (offline/spawning/idle/active)
        skip: 跳过记录数
        limit: 每页记录数
        db: 数据库会话
    """
    # 构建过滤条件
    filters = {}
    if category:
        filters["category"] = category
    if status:
        filters["is_active"] = (status == "active")

    # 获取数据
    result = await agent_service.get_all(db, filters=filters, skip=skip, limit=limit)

    # 转换为响应模型
    response_data = []
    for agent in result:
        response_data.append({
            "id": agent.id,
            "name": agent.name,
            "slug": agent.slug,
            "description": agent.description or "",
            "icon_url": agent.icon_url or "",
            "link": agent.link or "",
            "category": agent.category,
            "system_prompt": agent.system_prompt or "",
            "model": agent.model,
            "is_active": agent.is_active,
            "created_at": agent.created_at.isoformat(),
            "updated_at": agent.updated_at.isoformat() if agent.updated_at else None,
            "sort_order": agent.sort_order,
        })

    return response_data


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    """获取所有智能体类别"""
    result = await db.execute(select(Agent.category).distinct())
    categories = result.all()
    return [cat[0] for cat in categories]


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """根据 ID 获取智能体详情"""
    agent = await agent_service.get_by_id(db, agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="智能体不存在"
        )

    return {
        "id": agent.id,
        "name": agent.name,
        "slug": agent.slug,
        "description": agent.description or "",
        "icon_url": agent.icon_url or "",
        "link": agent.link or "",
        "category": agent.category,
        "system_prompt": agent.system_prompt or "",
        "model": agent.model,
        "is_active": agent.is_active,
        "created_at": agent.created_at.isoformat(),
        "updated_at": agent.updated_at.isoformat() if agent.updated_at else None,
        "sort_order": agent.sort_order,
    }


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_data: AgentCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    创建新智能体

    参数:
        agent_data: 智能体数据
        db: 数据库会话
    """
    # 检查 slug 唯一性
    result = await db.execute(select(Agent).filter(Agent.slug == agent_data.slug))
    existing = result.scalars().first()
    if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"智能体 slug '{agent_data.slug}' 已存在"
            )

    # 创建新智能体
    new_agent = await agent_service.create(db, {
        "name": agent_data.name,
        "slug": agent_data.slug,
        "description": agent_data.description,
        "icon_url": agent_data.icon_url,
        "link": agent_data.link,
        "category": agent_data.category,
        "system_prompt": agent_data.system_prompt,
        "model": agent_data.model,
        "is_active": True,
        "sort_order": 0,  # 默认排序
    })

    return new_agent


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: int,
    agent_data: AgentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    更新智能体

    参数:
        agent_id: 智能 体 ID
        agent_data: 更新数据
        db: 数据库会话
    """
    # 获取现有智能体
    agent = await agent_service.get_by_id(db, agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="智能体不存在"
        )

    # 检查 slug 唯一性
    update_dict = agent_data.model_dump(exclude_unset=True)
    if agent_data.slug:
        result = await db.execute(select(Agent).filter(Agent.slug == agent_data.slug))
        existing = result.scalars().first()
        if existing and existing.id != agent_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"智能体 slug '{agent_data.slug}' 已被其他智能体使用"
            )

    # 更新字段
    for field, value in update_dict.items():
        setattr(agent, field, value)

    agent.updated_at = datetime.utcnow()

    try:
        await db.commit()
        await db.refresh(agent)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新智能体失败: {e}"
        )

    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    删除智能体

    参数:
        agent_id: 智能 体 ID
        db: 数据库会话
    """
    # 获取智能体
    agent = await agent_service.get_by_id(db, agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="智能体不存在"
        )

    try:
        await agent_service.delete(db, agent_id) # Using agent_id instead of agent object for service call
        return {"message": "智能体删除成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除智能体失败: {e}"
        )


@router.post("/{agent_id}/status", response_model=AgentResponse)
async def toggle_agent_status(
    agent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    切换智能体状态（offline/spawning/idle/active）

    参数:
        agent_id: 智能 体 ID
        db: 数据库会话
    """
    # 获取现有智能体
    agent = await agent_service.get_by_id(db, agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="智能体不存在"
        )

    # 切换状态
    if agent.is_active:
        new_status = "offline"
        agent.is_active = False
    else:
        new_status = "active"
        agent.is_active = (new_status == "active")

    try:
        await db.commit()
        await db.refresh(agent)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"切换智能体状态失败: {e}"
        )

    return agent


@router.get("/stats/summary")
async def get_agents_summary(
    db: AsyncSession = Depends(get_db)
):
    """获取智能体统计摘要"""
    total = await db.scalar(select(func.count(Agent.id)))
    active = await db.scalar(select(func.count(Agent.id)).filter(Agent.is_active == True))
    offline = await db.scalar(select(func.count(Agent.id)).filter(Agent.is_active == False))

    # 按类别统计
    category_stats_result = await db.execute(
        select(Agent.category, func.count(Agent.id))
        .where(Agent.is_active == True)
        .group_by(Agent.category)
    )
    category_stats = category_stats_result.all()

    return {
        "total": total,
        "active": active,
        "offline": offline,
        "by_category": {row[0]: row[1] for row in category_stats},
    }
