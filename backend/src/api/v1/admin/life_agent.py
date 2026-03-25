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
    GenerateSuggestionRequest,
    DietPlanRequest,
    DietPlanResponse,
    ExercisePlan,
)
from ....agents.life.agent import LifeAgent
from ....services.ai.diet_generator import DietGenerator
from ....services.ai.exercise_generator import ExerciseGenerator

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


@router.post("/generate-plan", response_model=DietPlanResponse)
async def generate_health_plan(
    request: DietPlanRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    AI 饮食健身计划生成

    使用 LLM 根据用户健康数据生成个性化的三餐食谱和健身计划
    """
    # 从环境变量获取 Anthropic API key
    import os

    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY 未配置"
        )

    # 获取健康指标详情
    agent = await get_life_agent(db)
    metrics = await agent.get_metrics(request.metric_id)

    if not metrics:
        raise HTTPException(status_code=404, detail="健康指标不存在")

    result = DietPlanResponse()

    # 生成饮食计划
    if request.plan_type in ["diet", "both"]:
        diet_generator = DietGenerator(api_key=api_key)

        # 构建健康数据
        health_data = {
            "weight": metrics.weight,
            "height": metrics.height,
            "health_status": metrics.health_status,
            "goal": "健康维持",
        }

        try:
            diet_plan = await diet_generator.generate_plan(
                health_data=health_data,
                preferences=request.preferences or {},
            )
            result.diet_plan = diet_plan
        except Exception as e:
            logger.error(f"饮食计划生成失败：{e}")

    # 生成健身计划
    if request.plan_type in ["exercise", "both"]:
        exercise_generator = ExerciseGenerator(api_key=api_key)

        # 构建健康数据
        health_data = {
            "weight": metrics.weight,
            "height": metrics.height,
            "health_status": metrics.health_status,
        }

        # 确定健身水平
        exercise_level = "beginner"
        if metrics.exercise_frequency:
            if "每周" in metrics.exercise_frequency and "3" in metrics.exercise_frequency:
                exercise_level = "intermediate"
            elif "每天" in metrics.exercise_frequency:
                exercise_level = "advanced"

        try:
            exercises = await exercise_generator.generate_plan(
                health_data=health_data,
                exercise_level=exercise_level,
            )
            result.exercise_plan = [
                ExercisePlan(
                    name=ex["name"],
                    sets=ex["sets"],
                    reps=ex.get("reps"),
                    duration=ex.get("duration"),
                    description=ex.get("description", ""),
                    category=ex.get("category", "strength"),
                )
                for ex in exercises
            ]
        except Exception as e:
            logger.error(f"健身计划生成失败：{e}")

    return result
