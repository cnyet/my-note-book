# backend/src/api/v1/admin/life_agent.py
"""
Life Agent API - 健康管理相关接口
"""

import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....schemas.life_agent import (
    HealthMetricsCreate,
    HealthMetricsUpdate,
    HealthMetricsResponse,
    HealthMetricsListResponse,
    HealthSuggestionCreate,
    HealthSuggestionResponse,
    GenerateSuggestionRequest
)
from ....agents.life.agent import LifeAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/life", tags=["life"])


async def get_life_agent(db: AsyncSession) -> LifeAgent:
    """获取 LifeAgent 实例"""
    agent = LifeAgent(agent_id="life_agent_001", session=db)
    return agent


@router.get("", response_model=HealthMetricsListResponse)
async def get_health_metrics(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
):
    """获取健康指标列表"""
    agent = await get_life_agent(db)
    result = await agent.get_metrics_list(page=page, page_size=page_size)
    return result


@router.post("/metrics", response_model=HealthMetricsResponse, status_code=201)
async def save_health_metrics(
    metrics_data: HealthMetricsCreate,
    db: AsyncSession = Depends(get_db),
):
    """保存健康指标"""
    agent = await get_life_agent(db)

    result = await agent.save_metrics(
        height=metrics_data.height,
        weight=metrics_data.weight,
        health_status=metrics_data.health_status,
        exercise_frequency=metrics_data.exercise_frequency,
        diet_preference=metrics_data.diet_preference,
        sleep_hours=metrics_data.sleep_hours,
        water_intake=metrics_data.water_intake,
        notes=metrics_data.notes
    )

    return result


@router.get("/metrics/{metrics_id}", response_model=HealthMetricsResponse)
async def get_health_metrics_detail(
    metrics_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取健康指标详情"""
    agent = await get_life_agent(db)
    result = await agent.get_metrics(metrics_id)

    if not result:
        raise HTTPException(status_code=404, detail="健康指标不存在")

    return result


@router.put("/metrics/{metrics_id}", response_model=HealthMetricsResponse)
async def update_health_metrics(
    metrics_id: str,
    metrics_data: HealthMetricsUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新健康指标"""
    agent = await get_life_agent(db)

    result = await agent.update_metrics(
        metrics_id=metrics_id,
        height=metrics_data.height,
        weight=metrics_data.weight,
        health_status=metrics_data.health_status,
        exercise_frequency=metrics_data.exercise_frequency,
        diet_preference=metrics_data.diet_preference,
        sleep_hours=metrics_data.sleep_hours,
        water_intake=metrics_data.water_intake,
        notes=metrics_data.notes
    )

    if not result:
        raise HTTPException(status_code=404, detail="健康指标不存在")

    return result


@router.delete("/metrics/{metrics_id}")
async def delete_health_metrics(
    metrics_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除健康指标"""
    agent = await get_life_agent(db)
    success = await agent.delete_metrics(metrics_id)

    if not success:
        raise HTTPException(status_code=404, detail="健康指标不存在")

    return {"message": "健康指标已删除"}


@router.post("/suggestions", response_model=HealthSuggestionResponse, status_code=201)
async def generate_health_suggestion(
    request: GenerateSuggestionRequest,
    db: AsyncSession = Depends(get_db),
):
    """生成健康建议"""
    agent = await get_life_agent(db)

    # 这里可以集成 AI 生成建议
    # 目前先创建空建议，由前端传入建议内容
    result = await agent.generate_suggestion(
        metrics_id=request.metric_id,
        diet_suggestion=None,
        exercise_suggestion=None,
        lifestyle_suggestion=None,
        ai_notes=None
    )

    if not result:
        raise HTTPException(status_code=404, detail="健康指标不存在")

    return result


@router.get("/metrics/{metrics_id}/suggestions", response_model=list[HealthSuggestionResponse])
async def get_health_suggestions(
    metrics_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取某健康指标的所有建议"""
    agent = await get_life_agent(db)
    suggestions = await agent.get_suggestions(metrics_id)
    return suggestions
