# backend/src/api/v1/admin/dashboard.py
"""Dashboard API - 使用真实数据库统计"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from ....core.database import get_db
from ....models import User, Agent, Tool, Lab, BlogPost
from ....services.crud import get_crud_service

router = APIRouter()

# 创建 CRUD 服务实例
user_service = get_crud_service(User)
agent_service = get_crud_service(Agent)
tool_service = get_crud_service(Tool)
lab_service = get_crud_service(Lab)
blog_service = get_crud_service(BlogPost)


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    获取仪表板统计数据

    返回系统中各类实体的数量统计
    """
    # 获取各类实体的总数
    users_count = user_service.count(db)
    agents_count = agent_service.count(db)
    tools_count = tool_service.count(db)
    labs_count = lab_service.count(db)
    blog_posts_count = blog_service.count(db)

    # 获取活跃状态的统计
    active_agents = len([a for a in agent_service.get_all(db, limit=1000) if a.status == "active"])
    active_tools = len([t for t in tool_service.get_all(db, limit=1000) if t.status == "active"])
    published_posts = len([p for p in blog_service.get_all(db, limit=1000) if p.status == "published"])

    return {
        "usersCount": users_count,
        "agentsCount": agents_count,
        "toolsCount": tools_count,
        "labsCount": labs_count,
        "blogPostsCount": blog_posts_count,
        # 新增：活跃状态统计
        "activeAgentsCount": active_agents,
        "activeToolsCount": active_tools,
        "publishedPostsCount": published_posts,
    }


@router.get("/recent-activity")
async def get_recent_activity(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    获取最近活动摘要

    返回最近创建/更新的实体
    """
    # 获取最近的实体（各取最近 5 条）
    recent_agents = agent_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_tools = tool_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_labs = lab_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_posts = blog_service.get_all(db, limit=5, order_by="created_at", order_desc=True)

    # 合并并按时间排序
    all_activity = []

    for agent in recent_agents:
        all_activity.append({
            "type": "agent",
            "title": agent.name,
            "timestamp": agent.created_at,
            "id": agent.id,
        })

    for tool in recent_tools:
        all_activity.append({
            "type": "tool",
            "title": tool.name,
            "timestamp": tool.created_at,
            "id": tool.id,
        })

    for lab in recent_labs:
        all_activity.append({
            "type": "lab",
            "title": lab.name,
            "timestamp": lab.created_at,
            "id": lab.id,
        })

    for post in recent_posts:
        all_activity.append({
            "type": "blog",
            "title": post.title,
            "timestamp": post.created_at,
            "id": post.id,
        })

    # 按时间戳排序（最新的在前）
    all_activity.sort(key=lambda x: x["timestamp"], reverse=True)

    # 只返回最近的 10 条
    return {
        "activities": all_activity[:10]
    }


@router.get("/overview")
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    获取仪表板概览

    返回系统概览信息，包括统计和最近活动
    """
    stats = await get_dashboard_stats(db)
    activity = await get_recent_activity(db)

    return {
        **stats,
        **activity
    }
