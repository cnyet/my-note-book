# backend/src/agents/task/agent.py
"""
TaskAgent - 任务管理智能体主类

协调任务创建、更新、删除等流程
"""

import logging
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..manager import AgentManager, AgentStatus

logger = logging.getLogger(__name__)


class TaskAgent:
    """
    任务智能体

    功能:
    - 创建和管理任务
    - AI 分析生成任务
    - 任务状态追踪
    - 任务统计分析
    """

    def __init__(
        self,
        agent_id: str,
        session: AsyncSession,
    ):
        self.agent_id = agent_id
        self.session = session
        self.manager = AgentManager(session)
        self._is_running = False

    async def start(self) -> None:
        """启动任务智能体"""
        logger.info(f"TaskAgent {self.agent_id} starting...")
        self._is_running = True

        # 注册到 AgentManager
        try:
            await self.manager.spawn(self.agent_id, {"type": "task"})
            await self.manager.update_status(self.agent_id, AgentStatus.IDLE)
            logger.info(f"TaskAgent {self.agent_id} registered with AgentManager")
        except Exception as e:
            logger.warning(f"Could not register with AgentManager: {e}")

    async def stop(self) -> None:
        """停止任务智能体"""
        logger.info(f"TaskAgent {self.agent_id} stopping...")
        self._is_running = False

        # 从 AgentManager 注销
        try:
            await self.manager.terminate(self.agent_id, "user request")
        except Exception as e:
            logger.warning(f"Could not terminate with AgentManager: {e}")

    async def create_task(
        self,
        title: str,
        description: Optional[str] = None,
        priority: str = "medium",
        category_id: Optional[str] = None,
        due_date: Optional[datetime] = None,
        raw_input: Optional[str] = None,
        ai_generated: bool = False
    ) -> dict:
        """
        创建任务

        Args:
            title: 任务标题
            description: 任务描述
            priority: 优先级 (low/medium/high)
            category_id: 分类 ID
            due_date: 截止日期
            raw_input: AI 生成任务的原始输入
            ai_generated: 是否 AI 生成

        Returns:
            dict: 创建的任务数据
        """
        from ..models.task_agent import Task

        task = Task(
            id=f"tsk_{uuid4().hex[:12]}",
            category_id=category_id,
            title=title,
            description=description,
            priority=priority,
            status="pending",
            due_date=due_date,
            ai_generated=ai_generated,
            raw_input=raw_input
        )

        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)

        logger.info(f"Task created: {task.id}, title: {title}")

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "category_id": task.category_id,
            "due_date": task.due_date,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
            "ai_generated": task.ai_generated,
            "raw_input": task.raw_input
        }

    async def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        category_id: Optional[str] = None,
        due_date: Optional[datetime] = None
    ) -> Optional[dict]:
        """
        更新任务

        Args:
            task_id: 任务 ID
            **kwargs: 要更新的字段

        Returns:
            dict: 更新后的任务数据，不存在则返回 None
        """
        from ..models.task_agent import Task

        result = await self.session.execute(
            select(Task).where(Task.id == task_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return None

        # 更新字段
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if priority is not None:
            task.priority = priority
        if status is not None:
            task.status = status
            if status == "done" and task.completed_at is None:
                task.completed_at = datetime.now(timezone.utc)
            elif status != "done":
                task.completed_at = None
        if category_id is not None:
            task.category_id = category_id
        if due_date is not None:
            task.due_date = due_date

        task.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(task)

        logger.info(f"Task updated: {task_id}")

        return self._task_to_dict(task)

    async def complete_task(self, task_id: str) -> Optional[dict]:
        """
        标记任务完成

        Args:
            task_id: 任务 ID

        Returns:
            dict: 完成后的任务数据
        """
        return await self.update_task(task_id, status="done")

    async def delete_task(self, task_id: str) -> bool:
        """
        删除任务

        Args:
            task_id: 任务 ID

        Returns:
            bool: 是否删除成功
        """
        from ..models.task_agent import Task

        result = await self.session.execute(
            select(Task).where(Task.id == task_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return False

        await self.session.delete(task)
        await self.session.commit()

        logger.info(f"Task deleted: {task_id}")
        return True

    async def get_task(self, task_id: str) -> Optional[dict]:
        """
        获取单个任务

        Args:
            task_id: 任务 ID

        Returns:
            dict: 任务数据
        """
        from ..models.task_agent import Task

        result = await self.session.execute(
            select(Task).where(Task.id == task_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return None

        return self._task_to_dict(task, with_category=True)

    async def get_tasks(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category_id: Optional[str] = None
    ) -> dict:
        """
        获取任务列表（分页、筛选）

        Args:
            page: 页码
            page_size: 每页数量
            status: 状态筛选
            priority: 优先级筛选
            category_id: 分类筛选

        Returns:
            dict: 任务列表和分页信息
        """
        from ..models.task_agent import Task

        # 构建查询
        query = select(Task).order_by(desc(Task.created_at))

        # 应用筛选
        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)
        if category_id:
            query = query.where(Task.category_id == category_id)

        # 获取总数
        count_query = select(func.count(Task.id))
        if status:
            count_query = count_query.where(Task.status == status)
        if priority:
            count_query = count_query.where(Task.priority == priority)
        if category_id:
            count_query = count_query.where(Task.category_id == category_id)

        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        # 分页
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.session.execute(query)
        tasks = result.scalars().all()

        return {
            "tasks": [self._task_to_dict(t, with_category=True) for t in tasks],
            "total": total,
            "page": page,
            "page_size": page_size,
            "has_more": (page * page_size) < total
        }

    async def get_categories(self) -> List[dict]:
        """
        获取所有任务分类

        Returns:
            List[dict]: 分类列表
        """
        from ..models.task_agent import TaskCategory

        result = await self.session.execute(
            select(TaskCategory).order_by(TaskCategory.sort_order)
        )
        categories = result.scalars().all()

        return [
            {
                "id": c.id,
                "name": c.name,
                "color": c.color,
                "icon": c.icon,
                "sort_order": c.sort_order,
                "created_at": c.created_at,
                "updated_at": c.updated_at
            }
            for c in categories
        ]

    async def create_category(
        self,
        name: str,
        color: str = "#3B82F6",
        icon: Optional[str] = None,
        sort_order: int = 0
    ) -> dict:
        """
        创建任务分类

        Args:
            name: 分类名称
            color: 分类颜色
            icon: 分类图标
            sort_order: 排序顺序

        Returns:
            dict: 创建的分类数据
        """
        from ..models.task_agent import TaskCategory

        category = TaskCategory(
            id=f"cat_{uuid4().hex[:12]}",
            name=name,
            color=color,
            icon=icon,
            sort_order=sort_order
        )

        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)

        logger.info(f"Category created: {category.id}, name: {name}")

        return {
            "id": category.id,
            "name": category.name,
            "color": category.color,
            "icon": category.icon,
            "sort_order": category.sort_order,
            "created_at": category.created_at,
            "updated_at": category.updated_at
        }

    async def delete_category(self, category_id: str) -> bool:
        """
        删除任务分类

        Args:
            category_id: 分类 ID

        Returns:
            bool: 是否删除成功
        """
        from ..models.task_agent import TaskCategory

        result = await self.session.execute(
            select(TaskCategory).where(TaskCategory.id == category_id)
        )
        category = result.scalar_one_or_none()

        if not category:
            return False

        await self.session.delete(category)
        await self.session.commit()

        logger.info(f"Category deleted: {category_id}")
        return True

    def _task_to_dict(self, task, with_category: bool = False) -> dict:
        """转换任务模型为字典"""
        result = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "category_id": task.category_id,
            "due_date": task.due_date,
            "completed_at": task.completed_at,
            "ai_generated": task.ai_generated,
            "raw_input": task.raw_input,
            "created_at": task.created_at,
            "updated_at": task.updated_at
        }

        if with_category and task.category:
            result["category"] = {
                "id": task.category.id,
                "name": task.category.name,
                "color": task.category.color,
                "icon": task.category.icon,
                "sort_order": task.category.sort_order
            }

        return result

    async def get_stats(self) -> dict:
        """获取任务统计信息"""
        from ..models.task_agent import Task
        from sqlalchemy import func

        # 统计总数
        total_result = await self.session.execute(
            select(func.count(Task.id))
        )
        total = total_result.scalar() or 0

        # 按状态统计
        status_counts = {}
        for status in ["pending", "in_progress", "done", "failed"]:
            result = await self.session.execute(
                select(func.count(Task.id)).where(Task.status == status)
            )
            status_counts[status] = result.scalar() or 0

        # 按优先级统计
        priority_counts = {}
        for priority in ["low", "medium", "high"]:
            result = await self.session.execute(
                select(func.count(Task.id)).where(Task.priority == priority)
            )
            priority_counts[priority] = result.scalar() or 0

        # 完成任务数
        completed = status_counts.get("done", 0)
        completion_rate = (completed / total * 100) if total > 0 else 0

        return {
            "agent_id": self.agent_id,
            "is_running": self._is_running,
            "total": total,
            "status_counts": status_counts,
            "priority_counts": priority_counts,
            "completed": completed,
            "completion_rate": round(completion_rate, 2)
        }
