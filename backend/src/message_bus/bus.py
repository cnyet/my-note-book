# backend/src/message_bus/bus.py
"""
MessageBus - 异步消息总线

实现发布/订阅模式，支持：
- 主题订阅
- 消息持久化
- 异步处理
"""

import asyncio
import logging
from typing import Dict, List, Callable, Any, Optional
from collections import defaultdict

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.agent_message import AgentMessage, MessageType, MessageStatus

logger = logging.getLogger(__name__)


class MessageBus:
    """
    异步消息总线

    管理智能体间的消息传递
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        # 内存中的订阅者: topic -> List[handler]
        self._subscribers: Dict[str, List[Callable]] = defaultdict(list)
        # 消息队列
        self._queue: asyncio.Queue = asyncio.Queue()
        # 处理任务
        self._processing = False
        self._processor_task: Optional[asyncio.Task] = None

    async def publish(
        self,
        topic: str,
        message: dict,
        from_agent_id: Optional[str] = None,
        to_agent_id: Optional[str] = None,
        persist: bool = True
    ) -> Optional[AgentMessage]:
        """
        发布消息到主题

        Args:
            topic: 主题名称
            message: 消息内容
            from_agent_id: 发送方智能体 ID
            to_agent_id: 接收方智能体 ID
            persist: 是否持久化到数据库

        Returns:
            Optional[AgentMessage]: 如果持久化，返回创建的消息实例
        """
        # 持久化到数据库
        agent_message = None
        if persist and from_agent_id and to_agent_id:
            agent_message = await self._persist_message(
                from_agent_id, to_agent_id, topic, message
            )

        # 放入内存队列
        await self._queue.put({
            "topic": topic,
            "message": message,
            "from_agent_id": from_agent_id,
            "to_agent_id": to_agent_id,
            "db_id": agent_message.id if agent_message else None
        })

        logger.debug(f"Message published to {topic}")
        return agent_message

    async def subscribe(self, topic: str, handler: Callable[[dict], Any]) -> None:
        """
        订阅主题

        Args:
            topic: 主题名称
            handler: 处理函数 async (message) -> None
        """
        self._subscribers[topic].append(handler)
        logger.info(f"Handler subscribed to {topic}")

    async def unsubscribe(self, topic: str, handler: Callable) -> None:
        """
        取消订阅

        Args:
            topic: 主题名称
            handler: 处理函数
        """
        if topic in self._subscribers and handler in self._subscribers[topic]:
            self._subscribers[topic].remove(handler)
            logger.info(f"Handler unsubscribed from {topic}")

    async def broadcast(
        self,
        message: dict,
        from_agent_id: str,
        target_agents: List[str],
        persist: bool = True
    ) -> List[AgentMessage]:
        """
        广播消息到多个智能体

        Args:
            message: 消息内容
            from_agent_id: 发送方
            target_agents: 目标智能体列表
            persist: 是否持久化

        Returns:
            List[AgentMessage]: 创建的消息实例列表
        """
        messages = []

        for to_agent_id in target_agents:
            agent_message = await self.publish(
                topic=f"agent.{to_agent_id}",
                message=message,
                from_agent_id=from_agent_id,
                to_agent_id=to_agent_id,
                persist=persist
            )
            if agent_message:
                messages.append(agent_message)

        logger.info(f"Broadcasted message to {len(target_agents)} agents")
        return messages

    async def start_processing(self) -> None:
        """启动消息处理循环"""
        if self._processing:
            return

        self._processing = True
        self._processor_task = asyncio.create_task(self._process_messages())
        logger.info("MessageBus processing started")

    async def stop_processing(self) -> None:
        """停止消息处理循环"""
        self._processing = False
        if self._processor_task:
            self._processor_task.cancel()
            try:
                await self._processor_task
            except asyncio.CancelledError:
                pass
        logger.info("MessageBus processing stopped")

    async def _process_messages(self) -> None:
        """消息处理循环"""
        while self._processing:
            try:
                # 获取消息
                item = await asyncio.wait_for(
                    self._queue.get(),
                    timeout=1.0
                )

                topic = item["topic"]
                message = item["message"]
                db_id = item.get("db_id")

                # 调用订阅者
                handlers = self._subscribers.get(topic, [])
                for handler in handlers:
                    try:
                        await handler(message)
                    except Exception as e:
                        logger.error(f"Handler error for {topic}: {e}")

                # 更新数据库状态
                if db_id:
                    await self._mark_delivered(db_id)

            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Message processing error: {e}")

    async def _persist_message(
        self,
        from_agent_id: str,
        to_agent_id: str,
        topic: str,
        payload: dict
    ) -> AgentMessage:
        """持久化消息到数据库"""
        from uuid import uuid4

        message_id = f"msg_{uuid4().hex[:12]}"

        # 确定消息类型
        msg_type = MessageType.EVENT
        if topic.endswith(".request"):
            msg_type = MessageType.REQUEST
        elif topic.endswith(".response"):
            msg_type = MessageType.RESPONSE

        message = AgentMessage(
            id=message_id,
            from_agent_id=from_agent_id,
            to_agent_id=to_agent_id,
            message_type=msg_type.value,
            payload=payload,
            status=MessageStatus.PENDING.value
        )

        self.session.add(message)
        await self.session.flush()

        return message

    async def _mark_delivered(self, message_id: str) -> None:
        """标记消息为已送达"""
        result = await self.session.execute(
            select(AgentMessage).where(AgentMessage.id == message_id)
        )
        message = result.scalar_one_or_none()

        if message:
            message.status = MessageStatus.DELIVERED.value
            await self.session.flush()

    async def get_pending_messages(
        self,
        agent_id: str,
        limit: int = 50
    ) -> List[AgentMessage]:
        """
        获取待处理消息

        Args:
            agent_id: 智能体 ID
            limit: 数量限制

        Returns:
            List[AgentMessage]: 待处理消息列表
        """
        result = await self.session.execute(
            select(AgentMessage)
            .where(
                and_(
                    AgentMessage.to_agent_id == agent_id,
                    AgentMessage.status.in_([
                        MessageStatus.PENDING.value,
                        MessageStatus.DELIVERED.value
                    ])
                )
            )
            .order_by(AgentMessage.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def mark_processed(self, message_id: str) -> None:
        """
        标记消息为已处理

        Args:
            message_id: 消息 ID
        """
        result = await self.session.execute(
            select(AgentMessage).where(AgentMessage.id == message_id)
        )
        message = result.scalar_one_or_none()

        if message:
            from datetime import datetime, timezone
            message.status = MessageStatus.PROCESSED.value
            message.processed_at = datetime.now(timezone.utc)
            await self.session.flush()


# 全局消息总线实例（每个请求创建新实例）
async def get_message_bus(session: AsyncSession) -> MessageBus:
    """获取消息总线实例"""
    return MessageBus(session)
