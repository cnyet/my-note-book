# backend/src/api/v1/admin/review_agent.py
"""
Review Agent API - 每日复盘相关接口
"""

import logging
import json
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....schemas.review_agent import (
    DailyReviewCreate,
    DailyReviewUpdate,
    DailyReviewResponse,
    DailyReviewListResponse,
    UserPreferenceCreate,
    UserPreferenceUpdate,
    UserPreferenceResponse
)
from ....agents.review.agent import ReviewAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/review", tags=["review"])


async def get_review_agent(db: AsyncSession) -> ReviewAgent:
    """获取 ReviewAgent 实例"""
    agent = ReviewAgent(agent_id="review_agent_001", session=db)
    return agent


@router.get("", response_model=DailyReviewListResponse)
async def get_reviews(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
):
    """获取复盘列表"""
    agent = await get_review_agent(db)
    result = await agent.get_reviews(page=page, page_size=page_size)
    return result


@router.post("", response_model=DailyReviewResponse, status_code=201)
async def create_review(
    review_data: DailyReviewCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建每日复盘"""
    agent = await get_review_agent(db)

    # 解析 JSON 数据
    health_data = json.loads(review_data.health_data) if review_data.health_data else None
    outfit_data = json.loads(review_data.outfit_data) if review_data.outfit_data else None

    result = await agent.create_review(
        review_date=review_data.review_date,
        tasks_completed=review_data.tasks_completed,
        tasks_failed=review_data.tasks_failed,
        health_data=health_data,
        outfit_data=outfit_data,
        news_summary=review_data.news_summary,
        ai_summary=review_data.ai_summary,
        mood_score=review_data.mood_score,
        highlights=review_data.highlights,
        improvements=review_data.improvements
    )

    if not result:
        raise HTTPException(status_code=409, detail="该日期的复盘已存在")

    return result


@router.get("/today", response_model=DailyReviewResponse)
async def get_today_review(
    db: AsyncSession = Depends(get_db),
):
    """获取今日复盘"""
    agent = await get_review_agent(db)
    today = date.today()
    result = await agent.get_review(today)

    if not result:
        raise HTTPException(status_code=404, detail="今日复盘不存在")

    return result


@router.get("/{review_id}", response_model=DailyReviewResponse)
async def get_review(
    review_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取复盘详情"""
    agent = await get_review_agent(db)
    result = await agent.get_review_by_id(review_id)

    if not result:
        raise HTTPException(status_code=404, detail="复盘不存在")

    return result


@router.put("/{review_id}", response_model=DailyReviewResponse)
async def update_review(
    review_id: str,
    review_data: DailyReviewUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新复盘"""
    agent = await get_review_agent(db)

    # 解析 JSON 数据
    health_data = json.loads(review_data.health_data) if review_data.health_data else None
    outfit_data = json.loads(review_data.outfit_data) if review_data.outfit_data else None

    result = await agent.update_review(
        review_id=review_id,
        tasks_completed=review_data.tasks_completed,
        tasks_failed=review_data.tasks_failed,
        health_data=health_data,
        outfit_data=outfit_data,
        news_summary=review_data.news_summary,
        ai_summary=review_data.ai_summary,
        mood_score=review_data.mood_score,
        highlights=review_data.highlights,
        improvements=review_data.improvements
    )

    if not result:
        raise HTTPException(status_code=404, detail="复盘不存在")

    return result


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除复盘"""
    agent = await get_review_agent(db)
    success = await agent.delete_review(review_id)

    if not success:
        raise HTTPException(status_code=404, detail="复盘不存在")

    return {"message": "复盘已删除"}


@router.post("/generate", response_model=DailyReviewResponse)
async def generate_review(
    review_date: date = Query(..., description="生成复盘的日期"),
    db: AsyncSession = Depends(get_db),
):
    """生成每日复盘（汇总当日数据）"""
    agent = await get_review_agent(db)

    # 检查是否已存在
    existing = await agent.get_review(review_date)
    if existing:
        raise HTTPException(status_code=409, detail="该日期的复盘已存在")

    # TODO: 汇总当日 News+Task+Life+Outfit 数据
    # 这里先创建空复盘
    result = await agent.create_review(
        review_date=review_date,
        tasks_completed=0,
        tasks_failed=0,
        ai_summary="待生成"
    )

    return result


@router.get("/preferences", response_model=list[UserPreferenceResponse])
async def get_preferences(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = Query(None, description="类别筛选"),
):
    """获取用户偏好列表"""
    agent = await get_review_agent(db)
    preferences = await agent.get_preferences(category)
    return preferences


@router.post("/preferences", response_model=UserPreferenceResponse, status_code=201)
async def create_preference(
    preference_data: UserPreferenceCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建用户偏好"""
    agent = await get_review_agent(db)

    result = await agent.create_preference(
        category=preference_data.category,
        key=preference_data.key,
        value=json.loads(preference_data.value),
        confidence=preference_data.confidence
    )

    return result


@router.put("/preferences/{preference_id}", response_model=UserPreferenceResponse)
async def update_preference(
    preference_id: str,
    preference_data: UserPreferenceUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新用户偏好"""
    agent = await get_review_agent(db)

    value = json.loads(preference_data.value) if preference_data.value else None

    result = await agent.update_preference(
        preference_id=preference_id,
        value=value,
        confidence=preference_data.confidence
    )

    if not result:
        raise HTTPException(status_code=404, detail="偏好不存在")

    return result


@router.delete("/preferences/{preference_id}")
async def delete_preference(
    preference_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除用户偏好"""
    agent = await get_review_agent(db)
    success = await agent.delete_preference(preference_id)

    if not success:
        raise HTTPException(status_code=404, detail="偏好不存在")

    return {"message": "偏好已删除"}
