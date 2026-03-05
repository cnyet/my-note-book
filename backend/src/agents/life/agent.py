# backend/src/agents/life/agent.py
"""
LifeAgent - 健康管理智能体主类
"""

import logging
from typing import Optional, List
from uuid import uuid4

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..manager import AgentManager, AgentStatus

logger = logging.getLogger(__name__)


class LifeAgent:
    """
    生命健康智能体

    功能:
    - 健康指标记录
    - AI 健康建议生成
    - 健康数据统计
    """

    def __init__(self, agent_id: str, session: AsyncSession):
        self.agent_id = agent_id
        self.session = session
        self.manager = AgentManager(session)
        self._is_running = False

    async def start(self) -> None:
        """启动生命健康智能体"""
        logger.info(f"LifeAgent {self.agent_id} starting...")
        self._is_running = True

        try:
            await self.manager.spawn(self.agent_id, {"type": "life"})
            await self.manager.update_status(self.agent_id, AgentStatus.IDLE)
            logger.info(f"LifeAgent {self.agent_id} registered with AgentManager")
        except Exception as e:
            logger.warning(f"Could not register with AgentManager: {e}")

    async def stop(self) -> None:
        """停止生命健康智能体"""
        logger.info(f"LifeAgent {self.agent_id} stopping...")
        self._is_running = False

        try:
            await self.manager.terminate(self.agent_id, "user request")
        except Exception as e:
            logger.warning(f"Could not terminate with AgentManager: {e}")

    async def save_metrics(
        self,
        height: Optional[int] = None,
        weight: Optional[float] = None,
        health_status: Optional[str] = None,
        exercise_frequency: Optional[str] = None,
        diet_preference: Optional[str] = None,
        sleep_hours: Optional[float] = None,
        water_intake: Optional[int] = None,
        notes: Optional[str] = None
    ) -> dict:
        """
        保存健康指标

        Returns:
            dict: 保存后的健康指标数据
        """
        from ..models.life_agent import HealthMetrics

        metrics = HealthMetrics(
            id=f"hm_{uuid4().hex[:12]}",
            height=height,
            weight=weight,
            health_status=health_status,
            exercise_frequency=exercise_frequency,
            diet_preference=diet_preference,
            sleep_hours=sleep_hours,
            water_intake=water_intake,
            notes=notes
        )

        self.session.add(metrics)
        await self.session.commit()
        await self.session.refresh(metrics)

        logger.info(f"Health metrics saved: {metrics.id}")

        return self._metrics_to_dict(metrics)

    async def update_metrics(
        self,
        metrics_id: str,
        height: Optional[int] = None,
        weight: Optional[float] = None,
        health_status: Optional[str] = None,
        exercise_frequency: Optional[str] = None,
        diet_preference: Optional[str] = None,
        sleep_hours: Optional[float] = None,
        water_intake: Optional[int] = None,
        notes: Optional[str] = None
    ) -> Optional[dict]:
        """更新健康指标"""
        from ..models.life_agent import HealthMetrics
        from datetime import datetime, timezone

        result = await self.session.execute(
            select(HealthMetrics).where(HealthMetrics.id == metrics_id)
        )
        metrics = result.scalar_one_or_none()

        if not metrics:
            return None

        if height is not None:
            metrics.height = height
        if weight is not None:
            metrics.weight = weight
        if health_status is not None:
            metrics.health_status = health_status
        if exercise_frequency is not None:
            metrics.exercise_frequency = exercise_frequency
        if diet_preference is not None:
            metrics.diet_preference = diet_preference
        if sleep_hours is not None:
            metrics.sleep_hours = sleep_hours
        if water_intake is not None:
            metrics.water_intake = water_intake
        if notes is not None:
            metrics.notes = notes

        metrics.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(metrics)

        return self._metrics_to_dict(metrics)

    async def get_metrics(self, metrics_id: str) -> Optional[dict]:
        """获取健康指标详情"""
        from ..models.life_agent import HealthMetrics

        result = await self.session.execute(
            select(HealthMetrics).where(HealthMetrics.id == metrics_id)
        )
        metrics = result.scalar_one_or_none()

        if not metrics:
            return None

        return self._metrics_to_dict(metrics, with_suggestions=True)

    async def get_metrics_list(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> dict:
        """获取健康指标列表"""
        from ..models.life_agent import HealthMetrics

        query = select(HealthMetrics).order_by(desc(HealthMetrics.created_at))

        total_result = await self.session.execute(
            select(func.count(HealthMetrics.id))
        )
        total = total_result.scalar() or 0

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.session.execute(query)
        metrics_list = result.scalars().all()

        return {
            "metrics": [self._metrics_to_dict(m, with_suggestions=True) for m in metrics_list],
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_more": (page * page_size) < total
        }

    async def delete_metrics(self, metrics_id: str) -> bool:
        """删除健康指标"""
        from ..models.life_agent import HealthMetrics

        result = await self.session.execute(
            select(HealthMetrics).where(HealthMetrics.id == metrics_id)
        )
        metrics = result.scalar_one_or_none()

        if not metrics:
            return False

        await self.session.delete(metrics)
        await self.session.commit()

        logger.info(f"Health metrics deleted: {metrics_id}")
        return True

    async def generate_suggestion(
        self,
        metrics_id: str,
        diet_suggestion: Optional[str] = None,
        exercise_suggestion: Optional[str] = None,
        lifestyle_suggestion: Optional[str] = None,
        ai_notes: Optional[str] = None
    ) -> Optional[dict]:
        """
        生成健康建议

        Args:
            metrics_id: 健康指标 ID
            diet_suggestion: 饮食建议
            exercise_suggestion: 运动建议
            lifestyle_suggestion: 生活方式建议
            ai_notes: AI 备注

        Returns:
            dict: 生成的建议数据
        """
        from ..models.life_agent import HealthMetrics, HealthSuggestion

        # 验证指标存在
        result = await self.session.execute(
            select(HealthMetrics).where(HealthMetrics.id == metrics_id)
        )
        metrics = result.scalar_one_or_none()

        if not metrics:
            return None

        suggestion = HealthSuggestion(
            id=f"hs_{uuid4().hex[:12]}",
            metric_id=metrics_id,
            diet_suggestion=diet_suggestion,
            exercise_suggestion=exercise_suggestion,
            lifestyle_suggestion=lifestyle_suggestion,
            ai_notes=ai_notes
        )

        self.session.add(suggestion)
        await self.session.commit()
        await self.session.refresh(suggestion)

        logger.info(f"Health suggestion generated: {suggestion.id}")

        return self._suggestion_to_dict(suggestion)

    async def get_suggestions(self, metrics_id: str) -> List[dict]:
        """获取某指标的所有建议"""
        from ..models.life_agent import HealthSuggestion

        result = await self.session.execute(
            select(HealthSuggestion)
            .where(HealthSuggestion.metric_id == metrics_id)
            .order_by(desc(HealthSuggestion.created_at))
        )
        suggestions = result.scalars().all()

        return [self._suggestion_to_dict(s) for s in suggestions]

    def _metrics_to_dict(self, metrics, with_suggestions: bool = False) -> dict:
        """转换指标模型为字典"""
        result = {
            "id": metrics.id,
            "height": metrics.height,
            "weight": metrics.weight,
            "health_status": metrics.health_status,
            "exercise_frequency": metrics.exercise_frequency,
            "diet_preference": metrics.diet_preference,
            "sleep_hours": metrics.sleep_hours,
            "water_intake": metrics.water_intake,
            "notes": metrics.notes,
            "created_at": metrics.created_at,
            "updated_at": metrics.updated_at
        }

        if with_suggestions:
            result["suggestions"] = [self._suggestion_to_dict(s) for s in metrics.suggestions]

        return result

    def _suggestion_to_dict(self, suggestion) -> dict:
        """转换建议模型为字典"""
        return {
            "id": suggestion.id,
            "metric_id": suggestion.metric_id,
            "diet_suggestion": suggestion.diet_suggestion,
            "exercise_suggestion": suggestion.exercise_suggestion,
            "lifestyle_suggestion": suggestion.lifestyle_suggestion,
            "ai_notes": suggestion.ai_notes,
            "created_at": suggestion.created_at
        }

    async def get_stats(self) -> dict:
        """获取健康统计信息"""
        from ..models.life_agent import HealthMetrics
        from sqlalchemy import func

        # 统计总数
        total_result = await self.session.execute(
            select(func.count(HealthMetrics.id))
        )
        total = total_result.scalar() or 0

        # 平均 BMI（如果有身高体重数据）
        bmi_result = await self.session.execute(
            select(func.avg(HealthMetrics.weight / ((HealthMetrics.height / 100) ** 2)))
            .where(HealthMetrics.height.isnot(None), HealthMetrics.weight.isnot(None))
        )
        avg_bmi = bmi_result.scalar()

        # 平均睡眠时长
        sleep_result = await self.session.execute(
            select(func.avg(HealthMetrics.sleep_hours))
            .where(HealthMetrics.sleep_hours.isnot(None))
        )
        avg_sleep = sleep_result.scalar()

        # 平均饮水量
        water_result = await self.session.execute(
            select(func.avg(HealthMetrics.water_intake))
            .where(HealthMetrics.water_intake.isnot(None))
        )
        avg_water = water_result.scalar()

        return {
            "agent_id": self.agent_id,
            "is_running": self._is_running,
            "total_records": total,
            "avg_bmi": round(avg_bmi, 2) if avg_bmi else None,
            "avg_sleep_hours": round(avg_sleep, 2) if avg_sleep else None,
            "avg_water_intake_ml": round(avg_water, 0) if avg_water else None
        }
