# backend/src/agents/manager.py
"""
AgentManager - 智能体生命周期管理

负责智能体的启动、终止、状态管理和消息发送。
"""

import logging
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.agent_session import AgentSession
from ..models.agent_message import AgentMessage

logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """智能体状态枚举"""
    SPAWNED = "spawned"      # 刚启动
    IDLE = "idle"            # 等待任务
    BUSY = "busy"            # 处理中
    ERROR = "error"          # 异常状态
    TERMINATED = "terminated"  # 已终止


class MessageType(Enum):
    """消息类型枚举"""
    REQUEST = "request"
    RESPONSE = "response"
    EVENT = "event"
    BROADCAST = "broadcast"


class MessageStatus(Enum):
    """消息状态枚举"""
    PENDING = "pending"
    DELIVERED = "delivered"
    PROCESSED = "processed"
    FAILED = "failed"


class AgentManagerError(Exception):
    """智能体管理基础异常"""
    pass


class AgentNotFoundError(AgentManagerError):
    """智能体不存在"""
    pass


class AgentAlreadySpawnedError(AgentManagerError):
    """智能体已启动"""
    pass


class AgentNotSpawnedError(AgentManagerError):
    """智能体未启动"""
    pass


class SessionExpiredError(AgentManagerError):
    """会话已过期"""
    pass


class AgentManager:
    """
    智能体生命周期管理器

    管理智能体的全生命周期：Spawn → Idle → Busy/Error → Terminate
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def spawn(
        self,
        agent_id: str,
        metadata: Optional[dict] = None
    ) -> AgentSession:
        """
        启动智能体

        Args:
            agent_id: 智能体 ID
            metadata: 启动参数元数据

        Returns:
            AgentSession: 创建的会话实例

        Raises:
            AgentNotFoundError: 智能体不存在
            AgentAlreadySpawnedError: 智能体已处于活动状态
        """
        from ..models import Agent

        # 验证智能体存在
        result = await self.session.execute(
            select(Agent).where(Agent.id == int(agent_id))
        )
        agent = result.scalar_one_or_none()

        if not agent:
            raise AgentNotFoundError(f"Agent {agent_id} not found")

        # 检查是否已有活动会话
        result = await self.session.execute(
            select(AgentSession).where(
                AgentSession.agent_id == agent_id,
                AgentSession.status.in_([
                    AgentStatus.SPAWNED.value,
                    AgentStatus.IDLE.value,
                    AgentStatus.BUSY.value
                ])
            )
        )
        existing_session = result.scalar_one_or_none()

        if existing_session:
            raise AgentAlreadySpawnedError(
                f"Agent {agent_id} already has active session {existing_session.id}"
            )

        # 创建新会话
        session_id = f"sess_{uuid4().hex[:12]}"
        agent_session = AgentSession(
            id=session_id,
            agent_id=agent_id,
            status=AgentStatus.IDLE.value,
            metadata=metadata or {}
        )

        self.session.add(agent_session)
        await self.session.flush()

        # 更新智能体状态
        agent.status = "idle"
        await self.session.flush()

        logger.info(f"Agent {agent_id} spawned with session {session_id}")
        return agent_session

    async def terminate(
        self,
        agent_id: str,
        reason: Optional[str] = None
    ) -> None:
        """
        终止智能体

        Args:
            agent_id: 智能体 ID
            reason: 终止原因

        Raises:
            AgentNotFoundError: 智能体不存在
            AgentNotSpawnedError: 智能体未启动
        """
        from ..models import Agent

        # 验证智能体存在
        result = await self.session.execute(
            select(Agent).where(Agent.id == int(agent_id))
        )
        agent = result.scalar_one_or_none()

        if not agent:
            raise AgentNotFoundError(f"Agent {agent_id} not found")

        # 查找活动会话
        result = await self.session.execute(
            select(AgentSession).where(
                AgentSession.agent_id == agent_id,
                AgentSession.status.in_([
                    AgentStatus.SPAWNED.value,
                    AgentStatus.IDLE.value,
                    AgentStatus.BUSY.value
                ])
            )
        )
        agent_session = result.scalar_one_or_none()

        if not agent_session:
            raise AgentNotSpawnedError(f"Agent {agent_id} is not active")

        # 终止会话
        agent_session.status = AgentStatus.TERMINATED.value
        agent_session.ended_at = datetime.now(timezone.utc)
        if reason:
            agent_session.error_message = reason

        # 更新智能体状态
        agent.status = "offline"
        await self.session.flush()

        logger.info(f"Agent {agent_id} terminated. Reason: {reason or 'user request'}")

    async def get_status(self, agent_id: str) -> dict:
        """
        获取智能体状态

        Args:
            agent_id: 智能体 ID

        Returns:
            dict: 状态信息

        Raises:
            AgentNotFoundError: 智能体不存在
        """
        from ..models import Agent

        result = await self.session.execute(
            select(Agent).where(Agent.id == int(agent_id))
        )
        agent = result.scalar_one_or_none()

        if not agent:
            raise AgentNotFoundError(f"Agent {agent_id} not found")

        # 获取活动会话
        result = await self.session.execute(
            select(AgentSession).where(
                AgentSession.agent_id == agent_id,
                AgentSession.status.in_([
                    AgentStatus.SPAWNED.value,
                    AgentStatus.IDLE.value,
                    AgentStatus.BUSY.value
                ])
            )
        )
        agent_session = result.scalar_one_or_none()

        return {
            "agent_id": agent_id,
            "agent_status": agent.status,
            "session": {
                "id": agent_session.id if agent_session else None,
                "status": agent_session.status if agent_session else None,
                "started_at": agent_session.started_at.isoformat() if agent_session else None,
            }
        }

    async def update_status(
        self,
        agent_id: str,
        new_status: AgentStatus,
        error_message: Optional[str] = None
    ) -> None:
        """
        更新智能体状态

        Args:
            agent_id: 智能体 ID
            new_status: 新状态
            error_message: 错误信息（如果状态为 ERROR）
        """
        from ..models import Agent

        result = await self.session.execute(
            select(AgentSession).where(
                AgentSession.agent_id == agent_id,
                AgentSession.status.in_([
                    AgentStatus.SPAWNED.value,
                    AgentStatus.IDLE.value,
                    AgentStatus.BUSY.value
                ])
            )
        )
        agent_session = result.scalar_one_or_none()

        if not agent_session:
            raise AgentNotSpawnedError(f"Agent {agent_id} is not active")

        old_status = agent_session.status
        agent_session.status = new_status.value

        if error_message:
            agent_session.error_message = error_message

        # 同步更新 Agent 表状态
        result = await self.session.execute(
            select(Agent).where(Agent.id == int(agent_id))
        )
        agent = result.scalar_one()

        if new_status == AgentStatus.BUSY:
            agent.status = "active"
        elif new_status == AgentStatus.IDLE:
            agent.status = "idle"
        elif new_status == AgentStatus.ERROR:
            agent.status = "offline"

        await self.session.flush()

        logger.info(
            f"Agent {agent_id} status changed: {old_status} -> {new_status.value}"
        )

    async def send_message(
        self,
        from_agent_id: str,
        to_agent_id: str,
        message_type: MessageType,
        payload: dict
    ) -> AgentMessage:
        """
        发送消息到其他智能体

        Args:
            from_agent_id: 发送方智能体 ID
            to_agent_id: 接收方智能体 ID
            message_type: 消息类型
            payload: 消息内容

        Returns:
            AgentMessage: 创建的消息实例
        """
        message_id = f"msg_{uuid4().hex[:12]}"

        message = AgentMessage(
            id=message_id,
            from_agent_id=from_agent_id,
            to_agent_id=to_agent_id,
            message_type=message_type.value,
            payload=payload,
            status=MessageStatus.PENDING.value
        )

        self.session.add(message)
        await self.session.flush()

        logger.info(
            f"Message {message_id} sent from {from_agent_id} to {to_agent_id}"
        )
        return message

    async def get_active_sessions(self) -> list[AgentSession]:
        """
        获取所有活动会话

        Returns:
            list[AgentSession]: 活动会话列表
        """
        result = await self.session.execute(
            select(AgentSession).where(
                AgentSession.status.in_([
                    AgentStatus.SPAWNED.value,
                    AgentStatus.IDLE.value,
                    AgentStatus.BUSY.value
                ])
            )
        )
        return result.scalars().all()

    async def get_session_history(
        self,
        agent_id: str,
        limit: int = 10
    ) -> list[AgentSession]:
        """
        获取智能体会话历史

        Args:
            agent_id: 智能体 ID
            limit: 返回记录数量

        Returns:
            list[AgentSession]: 会话历史列表
        """
        result = await self.session.execute(
            select(AgentSession)
            .where(AgentSession.agent_id == agent_id)
            .order_by(AgentSession.started_at.desc())
            .limit(limit)
        )
        return result.scalars().all()
