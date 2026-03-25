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
    UserPreferenceResponse,
    TaskAnalysisRequest,
    QuadrantAnalysisResponse,
)
from ....agents.review.agent import ReviewAgent
from ....services.ai.quadrant_analyzer import QuadrantAnalyzer

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


@router.post("/analyze-quadrants", response_model=QuadrantAnalysisResponse)
async def analyze_quadrants(
    request: TaskAnalysisRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    分析任务优先级 - Eisenhower Matrix 四象限分析

    使用 AI 分析任务的重要性和紧急性，将任务分类到四个象限：
    - 重要且紧急：立即做
    - 重要不紧急：计划做
    - 不重要紧急：授权做
    - 不重要不紧急：少做
    """
    # 从环境变量获取 Anthropic API key
    import os
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY 未配置"
        )

    # 创建分析服务实例
    analyzer = QuadrantAnalyzer(api_key=api_key)

    # 转换输入格式
    tasks = [{"title": t.title, "description": t.description} for t in request.tasks]

    try:
        # 调用 AI 分析
        result = await analyzer.analyze(tasks)

        # 转换为响应格式
        return QuadrantAnalysisResponse(
            important_urgent=[
                QuadrantTask(title=t["title"], description=t.get("description", ""), reason=t.get("reason", ""))
                for t in result.get("important_urgent", [])
            ],
            important_not_urgent=[
                QuadrantTask(title=t["title"], description=t.get("description", ""), reason=t.get("reason", ""))
                for t in result.get("important_not_urgent", [])
            ],
            not_important_urgent=[
                QuadrantTask(title=t["title"], description=t.get("description", ""), reason=t.get("reason", ""))
                for t in result.get("not_important_urgent", [])
            ],
            not_important_not_urgent=[
                QuadrantTask(title=t["title"], description=t.get("description", ""), reason=t.get("reason", ""))
                for t in result.get("not_important_not_urgent", [])
            ],
        )
    except ValueError as e:
        logger.error(f"四象限分析解析失败：{e}")
        raise HTTPException(status_code=500, detail=f"AI 分析失败：{str(e)}")
    except Exception as e:
        logger.error(f"四象限分析失败：{e}")
        raise HTTPException(status_code=500, detail=f"分析失败：{str(e)}")
