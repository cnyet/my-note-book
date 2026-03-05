# backend/src/agents/outfit/agent.py
"""
OutfitAgent - 穿搭推荐智能体主类
"""

import logging
import json
from datetime import datetime, timezone, date
from typing import Optional, List
from uuid import uuid4

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..manager import AgentManager, AgentStatus

logger = logging.getLogger(__name__)


class OutfitAgent:
    """
    穿搭推荐智能体

    功能:
    - 穿搭推荐生成
    - 天气 API 集成
    - 穿搭图片生成
    """

    def __init__(self, agent_id: str, session: AsyncSession):
        self.agent_id = agent_id
        self.session = session
        self.manager = AgentManager(session)
        self._is_running = False

    async def start(self) -> None:
        """启动穿搭推荐智能体"""
        logger.info(f"OutfitAgent {self.agent_id} starting...")
        self._is_running = True

        try:
            await self.manager.spawn(self.agent_id, {"type": "outfit"})
            await self.manager.update_status(self.agent_id, AgentStatus.IDLE)
            logger.info(f"OutfitAgent {self.agent_id} registered with AgentManager")
        except Exception as e:
            logger.warning(f"Could not register with AgentManager: {e}")

    async def stop(self) -> None:
        """停止穿搭推荐智能体"""
        logger.info(f"OutfitAgent {self.agent_id} stopping...")
        self._is_running = False

        try:
            await self.manager.terminate(self.agent_id, "user request")
        except Exception as e:
            logger.warning(f"Could not terminate with AgentManager: {e}")

    async def create_recommendation(
        self,
        recommend_date: date,
        outfit_description: str,
        weather_data: Optional[dict] = None,
        schedule_input: Optional[str] = None,
        outfit_image_path: Optional[str] = None,
        outfit_image_url: Optional[str] = None,
        ai_notes: Optional[str] = None,
        is_generated: bool = False
    ) -> Optional[dict]:
        """
        创建穿搭推荐

        Returns:
            dict: 创建的推荐数据，如果日期已存在则返回 None
        """
        from ..models.outfit_agent import OutfitRecommendation

        # 检查日期是否已存在
        result = await self.session.execute(
            select(OutfitRecommendation).where(OutfitRecommendation.recommend_date == recommend_date)
        )
        if result.scalar_one_or_none():
            return None

        recommendation = OutfitRecommendation(
            id=f"outfit_{uuid4().hex[:12]}",
            recommend_date=recommend_date,
            weather_data=json.dumps(weather_data) if weather_data else None,
            schedule_input=schedule_input,
            outfit_description=outfit_description,
            outfit_image_path=outfit_image_path,
            outfit_image_url=outfit_image_url,
            ai_notes=ai_notes,
            is_generated=is_generated
        )

        self.session.add(recommendation)
        await self.session.commit()
        await self.session.refresh(recommendation)

        logger.info(f"Outfit recommendation created: {recommendation.id}")

        return self._recommendation_to_dict(recommendation)

    async def get_recommendation(self, recommend_date: date) -> Optional[dict]:
        """获取指定日期的穿搭推荐"""
        from ..models.outfit_agent import OutfitRecommendation

        result = await self.session.execute(
            select(OutfitRecommendation).where(OutfitRecommendation.recommend_date == recommend_date)
        )
        recommendation = result.scalar_one_or_none()

        if not recommendation:
            return None

        return self._recommendation_to_dict(recommendation)

    async def get_recommendation_by_id(self, recommendation_id: str) -> Optional[dict]:
        """通过 ID 获取穿搭推荐"""
        from ..models.outfit_agent import OutfitRecommendation

        result = await self.session.execute(
            select(OutfitRecommendation).where(OutfitRecommendation.id == recommendation_id)
        )
        recommendation = result.scalar_one_or_none()

        if not recommendation:
            return None

        return self._recommendation_to_dict(recommendation)

    async def get_recommendations(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> dict:
        """获取穿搭推荐列表"""
        from ..models.outfit_agent import OutfitRecommendation

        query = select(OutfitRecommendation).order_by(desc(OutfitRecommendation.recommend_date))

        total_result = await self.session.execute(
            select(func.count(OutfitRecommendation.id))
        )
        total = total_result.scalar() or 0

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.session.execute(query)
        recommendations = result.scalars().all()

        return {
            "recommendations": [self._recommendation_to_dict(r) for r in recommendations],
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_more": (page * page_size) < total
        }

    async def update_recommendation(
        self,
        recommendation_id: str,
        outfit_description: Optional[str] = None,
        weather_data: Optional[dict] = None,
        schedule_input: Optional[str] = None,
        outfit_image_path: Optional[str] = None,
        outfit_image_url: Optional[str] = None,
        ai_notes: Optional[str] = None
    ) -> Optional[dict]:
        """更新穿搭推荐"""
        from ..models.outfit_agent import OutfitRecommendation

        result = await self.session.execute(
            select(OutfitRecommendation).where(OutfitRecommendation.id == recommendation_id)
        )
        recommendation = result.scalar_one_or_none()

        if not recommendation:
            return None

        if outfit_description is not None:
            recommendation.outfit_description = outfit_description
        if weather_data is not None:
            recommendation.weather_data = json.dumps(weather_data)
        if schedule_input is not None:
            recommendation.schedule_input = schedule_input
        if outfit_image_path is not None:
            recommendation.outfit_image_path = outfit_image_path
        if outfit_image_url is not None:
            recommendation.outfit_image_url = outfit_image_url
        if ai_notes is not None:
            recommendation.ai_notes = ai_notes

        recommendation.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(recommendation)

        return self._recommendation_to_dict(recommendation)

    async def delete_recommendation(self, recommendation_id: str) -> bool:
        """删除穿搭推荐"""
        from ..models.outfit_agent import OutfitRecommendation

        result = await self.session.execute(
            select(OutfitRecommendation).where(OutfitRecommendation.id == recommendation_id)
        )
        recommendation = result.scalar_one_or_none()

        if not recommendation:
            return False

        await self.session.delete(recommendation)
        await self.session.commit()

        logger.info(f"Outfit recommendation deleted: {recommendation_id}")
        return True

    def _recommendation_to_dict(self, recommendation) -> dict:
        """转换推荐模型为字典"""
        return {
            "id": recommendation.id,
            "recommend_date": recommendation.recommend_date,
            "weather_data": json.loads(recommendation.weather_data) if recommendation.weather_data else None,
            "schedule_input": recommendation.schedule_input,
            "outfit_description": recommendation.outfit_description,
            "outfit_image_path": recommendation.outfit_image_path,
            "outfit_image_url": recommendation.outfit_image_url,
            "ai_notes": recommendation.ai_notes,
            "is_generated": recommendation.is_generated,
            "created_at": recommendation.created_at,
            "updated_at": recommendation.updated_at
        }

    async def get_stats(self) -> dict:
        """获取穿搭统计信息"""
        from ..models.outfit_agent import OutfitRecommendation
        from sqlalchemy import func

        # 统计总数
        total_result = await self.session.execute(
            select(func.count(OutfitRecommendation.id))
        )
        total = total_result.scalar() or 0

        # 统计 AI 生成数量
        generated_result = await self.session.execute(
            select(func.count(OutfitRecommendation.id)).where(OutfitRecommendation.is_generated == True)
        )
        generated = generated_result.scalar() or 0

        return {
            "agent_id": self.agent_id,
            "is_running": self._is_running,
            "total_recommendations": total,
            "ai_generated": generated,
            "manual_created": total - generated
        }
