# backend/src/api/v1/admin/outfit_agent.py
"""
Outfit Agent API - 穿搭推荐相关接口
"""

import logging
import json
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....schemas.outfit_agent import (
    OutfitRecommendationCreate,
    OutfitRecommendationUpdate,
    OutfitRecommendationResponse,
    OutfitRecommendationListResponse,
    GenerateOutfitRequest
)
from ....agents.outfit.agent import OutfitAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/outfit", tags=["outfit"])


async def get_outfit_agent(db: AsyncSession) -> OutfitAgent:
    """获取 OutfitAgent 实例"""
    agent = OutfitAgent(agent_id="outfit_agent_001", session=db)
    return agent


@router.get("", response_model=OutfitRecommendationListResponse)
async def get_outfit_recommendations(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
):
    """获取穿搭推荐列表"""
    agent = await get_outfit_agent(db)
    result = await agent.get_recommendations(page=page, page_size=page_size)
    return result


@router.get("/today", response_model=OutfitRecommendationResponse)
async def get_today_outfit(
    db: AsyncSession = Depends(get_db),
):
    """获取今日穿搭推荐"""
    agent = await get_outfit_agent(db)
    today = date.today()
    result = await agent.get_recommendation(today)

    if not result:
        raise HTTPException(status_code=404, detail="今日穿搭推荐不存在")

    return result


@router.post("", response_model=OutfitRecommendationResponse, status_code=201)
async def create_outfit_recommendation(
    outfit_data: OutfitRecommendationCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建穿搭推荐"""
    agent = await get_outfit_agent(db)

    # 解析 JSON 数据
    weather_data = json.loads(outfit_data.weather_data) if outfit_data.weather_data else None

    result = await agent.create_recommendation(
        recommend_date=outfit_data.recommend_date,
        outfit_description=outfit_data.outfit_description,
        weather_data=weather_data,
        schedule_input=outfit_data.schedule_input,
        outfit_image_path=outfit_data.outfit_image_path,
        outfit_image_url=outfit_data.outfit_image_url,
        ai_notes=outfit_data.ai_notes,
        is_generated=outfit_data.is_generated
    )

    if not result:
        raise HTTPException(status_code=409, detail="该日期的穿搭推荐已存在")

    return result


@router.get("/{recommendation_id}", response_model=OutfitRecommendationResponse)
async def get_outfit_recommendation(
    recommendation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取穿搭推荐详情"""
    agent = await get_outfit_agent(db)
    result = await agent.get_recommendation_by_id(recommendation_id)

    if not result:
        raise HTTPException(status_code=404, detail="穿搭推荐不存在")

    return result


@router.put("/{recommendation_id}", response_model=OutfitRecommendationResponse)
async def update_outfit_recommendation(
    recommendation_id: str,
    outfit_data: OutfitRecommendationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新穿搭推荐"""
    agent = await get_outfit_agent(db)

    result = await agent.update_recommendation(
        recommendation_id=recommendation_id,
        outfit_description=outfit_data.outfit_description,
        outfit_image_path=outfit_data.outfit_image_path,
        outfit_image_url=outfit_data.outfit_image_url,
        ai_notes=outfit_data.ai_notes
    )

    if not result:
        raise HTTPException(status_code=404, detail="穿搭推荐不存在")

    return result


@router.delete("/{recommendation_id}")
async def delete_outfit_recommendation(
    recommendation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除穿搭推荐"""
    agent = await get_outfit_agent(db)
    success = await agent.delete_recommendation(recommendation_id)

    if not success:
        raise HTTPException(status_code=404, detail="穿搭推荐不存在")

    return {"message": "穿搭推荐已删除"}


@router.post("/generate", response_model=OutfitRecommendationResponse)
async def generate_outfit_recommendation(
    request: GenerateOutfitRequest,
    db: AsyncSession = Depends(get_db),
):
    """生成穿搭推荐（AI 生成）"""
    agent = await get_outfit_agent(db)

    # 检查是否已存在
    existing = await agent.get_recommendation(request.recommend_date)
    if existing:
        raise HTTPException(status_code=409, detail="该日期的穿搭推荐已存在")

    # TODO: 集成天气 API 和 AI 生成穿搭
    # 这里先创建空推荐
    result = await agent.create_recommendation(
        recommend_date=request.recommend_date,
        outfit_description="待生成",
        weather_data=request.weather_data,
        schedule_input=request.schedule_input,
        is_generated=True,
        ai_notes="待生成"
    )

    return result
