# backend/src/agents/review/agent.py
"""
ReviewAgent - 每日复盘智能体主类
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


class ReviewAgent:
    """
    复盘智能体

    功能:
    - 每日复盘记录
    - 用户偏好提取
    - 复盘统计分析
    """

    def __init__(self, agent_id: str, session: AsyncSession):
        self.agent_id = agent_id
        self.session = session
        self.manager = AgentManager(session)
        self._is_running = False

    async def start(self) -> None:
        """启动复盘智能体"""
        logger.info(f"ReviewAgent {self.agent_id} starting...")
        self._is_running = True

        try:
            await self.manager.spawn(self.agent_id, {"type": "review"})
            await self.manager.update_status(self.agent_id, AgentStatus.IDLE)
            logger.info(f"ReviewAgent {self.agent_id} registered with AgentManager")
        except Exception as e:
            logger.warning(f"Could not register with AgentManager: {e}")

    async def stop(self) -> None:
        """停止复盘智能体"""
        logger.info(f"ReviewAgent {self.agent_id} stopping...")
        self._is_running = False

        try:
            await self.manager.terminate(self.agent_id, "user request")
        except Exception as e:
            logger.warning(f"Could not terminate with AgentManager: {e}")

    async def create_review(
        self,
        review_date: date,
        tasks_completed: int = 0,
        tasks_failed: int = 0,
        health_data: Optional[dict] = None,
        outfit_data: Optional[dict] = None,
        news_summary: Optional[str] = None,
        ai_summary: Optional[str] = None,
        mood_score: Optional[int] = None,
        highlights: Optional[str] = None,
        improvements: Optional[str] = None
    ) -> Optional[dict]:
        """
        创建每日复盘

        Returns:
            dict: 创建的复盘数据，如果日期已存在则返回 None
        """
        from ..models.review_agent import DailyReview

        # 检查日期是否已存在
        result = await self.session.execute(
            select(DailyReview).where(DailyReview.review_date == review_date)
        )
        if result.scalar_one_or_none():
            return None

        review = DailyReview(
            id=f"dr_{uuid4().hex[:12]}",
            review_date=review_date,
            tasks_completed=tasks_completed,
            tasks_failed=tasks_failed,
            health_data=json.dumps(health_data) if health_data else None,
            outfit_data=json.dumps(outfit_data) if outfit_data else None,
            news_summary=news_summary,
            ai_summary=ai_summary,
            mood_score=mood_score,
            highlights=highlights,
            improvements=improvements
        )

        self.session.add(review)
        await self.session.commit()
        await self.session.refresh(review)

        logger.info(f"Daily review created: {review.id}")

        return self._review_to_dict(review)

    async def get_review(self, review_date: date) -> Optional[dict]:
        """获取指定日期的复盘"""
        from ..models.review_agent import DailyReview

        result = await self.session.execute(
            select(DailyReview).where(DailyReview.review_date == review_date)
        )
        review = result.scalar_one_or_none()

        if not review:
            return None

        return self._review_to_dict(review)

    async def get_review_by_id(self, review_id: str) -> Optional[dict]:
        """通过 ID 获取复盘"""
        from ..models.review_agent import DailyReview

        result = await self.session.execute(
            select(DailyReview).where(DailyReview.id == review_id)
        )
        review = result.scalar_one_or_none()

        if not review:
            return None

        return self._review_to_dict(review)

    async def get_reviews(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> dict:
        """获取复盘列表"""
        from ..models.review_agent import DailyReview

        query = select(DailyReview).order_by(desc(DailyReview.review_date))

        total_result = await self.session.execute(
            select(func.count(DailyReview.id))
        )
        total = total_result.scalar() or 0

        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.session.execute(query)
        reviews = result.scalars().all()

        return {
            "reviews": [self._review_to_dict(r) for r in reviews],
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_more": (page * page_size) < total
        }

    async def update_review(
        self,
        review_id: str,
        tasks_completed: Optional[int] = None,
        tasks_failed: Optional[int] = None,
        health_data: Optional[dict] = None,
        outfit_data: Optional[dict] = None,
        news_summary: Optional[str] = None,
        ai_summary: Optional[str] = None,
        mood_score: Optional[int] = None,
        highlights: Optional[str] = None,
        improvements: Optional[str] = None
    ) -> Optional[dict]:
        """更新复盘"""
        from ..models.review_agent import DailyReview

        result = await self.session.execute(
            select(DailyReview).where(DailyReview.id == review_id)
        )
        review = result.scalar_one_or_none()

        if not review:
            return None

        if tasks_completed is not None:
            review.tasks_completed = tasks_completed
        if tasks_failed is not None:
            review.tasks_failed = tasks_failed
        if health_data is not None:
            review.health_data = json.dumps(health_data)
        if outfit_data is not None:
            review.outfit_data = json.dumps(outfit_data)
        if news_summary is not None:
            review.news_summary = news_summary
        if ai_summary is not None:
            review.ai_summary = ai_summary
        if mood_score is not None:
            review.mood_score = mood_score
        if highlights is not None:
            review.highlights = highlights
        if improvements is not None:
            review.improvements = improvements

        review.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(review)

        return self._review_to_dict(review)

    async def delete_review(self, review_id: str) -> bool:
        """删除复盘"""
        from ..models.review_agent import DailyReview

        result = await self.session.execute(
            select(DailyReview).where(DailyReview.id == review_id)
        )
        review = result.scalar_one_or_none()

        if not review:
            return False

        await self.session.delete(review)
        await self.session.commit()

        logger.info(f"Daily review deleted: {review_id}")
        return True

    async def create_preference(
        self,
        category: str,
        key: str,
        value: dict,
        confidence: float = 1.0
    ) -> dict:
        """
        创建用户偏好

        Args:
            category: 类别 (work/study/health/lifestyle)
            key: 偏好键
            value: 偏好值 (字典)
            confidence: 置信度 0-1

        Returns:
            dict: 创建的偏好数据
        """
        from ..models.review_agent import UserPreference

        preference = UserPreference(
            id=f"up_{uuid4().hex[:12]}",
            category=category,
            key=key,
            value=json.dumps(value),
            confidence=confidence
        )

        self.session.add(preference)
        await self.session.commit()
        await self.session.refresh(preference)

        logger.info(f"User preference created: {preference.id}")

        return self._preference_to_dict(preference)

    async def get_preferences(self, category: Optional[str] = None) -> List[dict]:
        """获取用户偏好列表"""
        from ..models.review_agent import UserPreference

        query = select(UserPreference).order_by(UserPreference.category, UserPreference.key)

        if category:
            query = query.where(UserPreference.category == category)

        result = await self.session.execute(query)
        preferences = result.scalars().all()

        return [self._preference_to_dict(p) for p in preferences]

    async def update_preference(
        self,
        preference_id: str,
        value: Optional[dict] = None,
        confidence: Optional[float] = None
    ) -> Optional[dict]:
        """更新用户偏好"""
        from ..models.review_agent import UserPreference

        result = await self.session.execute(
            select(UserPreference).where(UserPreference.id == preference_id)
        )
        preference = result.scalar_one_or_none()

        if not preference:
            return None

        if value is not None:
            preference.value = json.dumps(value)
        if confidence is not None:
            preference.confidence = confidence

        preference.updated_at = datetime.now(timezone.utc)
        preference.last_verified = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(preference)

        return self._preference_to_dict(preference)

    async def delete_preference(self, preference_id: str) -> bool:
        """删除用户偏好"""
        from ..models.review_agent import UserPreference

        result = await self.session.execute(
            select(UserPreference).where(UserPreference.id == preference_id)
        )
        preference = result.scalar_one_or_none()

        if not preference:
            return False

        await self.session.delete(preference)
        await self.session.commit()

        logger.info(f"User preference deleted: {preference_id}")
        return True

    def _review_to_dict(self, review) -> dict:
        """转换复盘模型为字典"""
        return {
            "id": review.id,
            "review_date": review.review_date,
            "tasks_completed": review.tasks_completed,
            "tasks_failed": review.tasks_failed,
            "health_data": json.loads(review.health_data) if review.health_data else None,
            "outfit_data": json.loads(review.outfit_data) if review.outfit_data else None,
            "news_summary": review.news_summary,
            "ai_summary": review.ai_summary,
            "mood_score": review.mood_score,
            "highlights": review.highlights,
            "improvements": review.improvements,
            "created_at": review.created_at,
            "updated_at": review.updated_at
        }

    def _preference_to_dict(self, preference) -> dict:
        """转换偏好模型为字典"""
        return {
            "id": preference.id,
            "category": preference.category,
            "key": preference.key,
            "value": json.loads(preference.value),
            "confidence": preference.confidence,
            "last_verified": preference.last_verified,
            "created_at": preference.created_at,
            "updated_at": preference.updated_at
        }

    async def get_stats(self) -> dict:
        """获取复盘统计信息"""
        from ..models.review_agent import DailyReview
        from sqlalchemy import func

        # 统计总数
        total_result = await self.session.execute(
            select(func.count(DailyReview.id))
        )
        total = total_result.scalar() or 0

        # 平均任务完成数
        avg_completed_result = await self.session.execute(
            select(func.avg(DailyReview.tasks_completed))
        )
        avg_completed = avg_completed_result.scalar()

        # 平均心情分数
        avg_mood_result = await self.session.execute(
            select(func.avg(DailyReview.mood_score))
        )
        avg_mood = avg_mood_result.scalar()

        return {
            "agent_id": self.agent_id,
            "is_running": self._is_running,
            "total_reviews": total,
            "avg_tasks_completed": round(avg_completed, 2) if avg_completed else None,
            "avg_mood_score": round(avg_mood, 2) if avg_mood else None
        }
