# backend/src/api/v1/admin/dashboard.py
"""Dashboard API - 使用真实数据库统计 (异步版)"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
from datetime import datetime

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


@router.get("/stats", response_model=Dict[str, Any])
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """获取仪表板统计数据"""
    users_count = await user_service.count(db)
    agents_count = await agent_service.count(db)
    tools_count = await tool_service.count(db)
    labs_count = await lab_service.count(db)
    blog_posts_count = await blog_service.count(db)

    # 获取活跃统计
    active_agents = await agent_service.get_all(db, filters={"is_active": True}, limit=1000)
    active_tools = await tool_service.get_all(db, filters={"status": "active"}, limit=1000)
    published_posts = await blog_service.get_all(db, filters={"status": "published"}, limit=1000)

    return {
        "usersCount": users_count,
        "agentsCount": agents_count,
        "toolsCount": tools_count,
        "labsCount": labs_count,
        "blogPostsCount": blog_posts_count,
        "activeAgentsCount": len(active_agents),
        "activeToolsCount": len(active_tools),
        "publishedPostsCount": len(published_posts),
    }


@router.get("/recent-activity", response_model=Dict[str, Any])
async def get_recent_activity(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """获取最近活动摘要"""
    recent_agents = await agent_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_tools = await tool_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_labs = await lab_service.get_all(db, limit=5, order_by="created_at", order_desc=True)
    recent_posts = await blog_service.get_all(db, limit=5, order_by="created_at", order_desc=True)

    all_activity = []

    def format_activity(item, type_name, title_attr):
        return {
            "type": type_name,
            "title": getattr(item, title_attr),
            "timestamp": item.created_at.isoformat() if hasattr(item, 'created_at') and item.created_at else None,
            "id": item.id,
        }

    for item in recent_agents: all_activity.append(format_activity(item, "agent", "name"))
    for item in recent_tools: all_activity.append(format_activity(item, "tool", "name"))
    for item in recent_labs: all_activity.append(format_activity(item, "lab", "name"))
    for item in recent_posts: all_activity.append(format_activity(item, "blog", "title"))

    # 按时间戳排序
    all_activity.sort(key=lambda x: x["timestamp"] or "", reverse=True)

    return {"activities": all_activity[:10]}


@router.get("/overview", response_model=Dict[str, Any])
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """获取仪表板概览 (合并统计与活动)"""
    stats = await get_dashboard_stats(db)
    activity = await get_recent_activity(db)
    return {**stats, **activity}


@router.get("", response_model=Dict[str, Any])
async def get_dashboard_default(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """默认主路由指向 overview"""
    return await get_dashboard_overview(db)
