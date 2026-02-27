# backend/src/websocket/hub.py
"""
ConnectionHub - WebSocket 连接管理

管理所有 WebSocket 连接，支持：
- 连接注册/注销
- 消息广播
- 单客户端发送
- 按 agent_id 发送
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Callable
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


class ConnectionHub:
    """
    WebSocket 连接管理中心

    单例模式，管理所有活跃的 WebSocket 连接
    """

    _instance: Optional["ConnectionHub"] = None
    _lock: asyncio.Lock = asyncio.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        # 存储所有连接: client_id -> WebSocket
        self._connections: Dict[str, WebSocket] = {}

        # 按 agent_id 分组的连接: agent_id -> List[client_id]
        self._agent_subscribers: Dict[str, List[str]] = {}

        # 消息处理器: message_type -> List[handler]
        self._handlers: Dict[str, List[Callable]] = {}

        self._initialized = True
        logger.info("ConnectionHub initialized")

    async def connect(
        self,
        client_id: str,
        websocket: WebSocket,
        agent_id: Optional[str] = None
    ) -> None:
        """
        注册新的 WebSocket 连接

        Args:
            client_id: 唯一客户端标识
            websocket: WebSocket 连接对象
            agent_id: 可选，订阅的 agent_id
        """
        await websocket.accept()
        self._connections[client_id] = websocket

        if agent_id:
            if agent_id not in self._agent_subscribers:
                self._agent_subscribers[agent_id] = []
            self._agent_subscribers[agent_id].append(client_id)

        logger.info(f"Client {client_id} connected. Total: {len(self._connections)}")

    async def disconnect(self, client_id: str) -> None:
        """
        注销 WebSocket 连接

        Args:
            client_id: 客户端标识
        """
        if client_id in self._connections:
            del self._connections[client_id]

        # 从所有 agent 订阅中移除
        for agent_id, subscribers in self._agent_subscribers.items():
            if client_id in subscribers:
                subscribers.remove(client_id)

        logger.info(f"Client {client_id} disconnected. Total: {len(self._connections)}")

    async def send_to(self, client_id: str, message: dict) -> bool:
        """
        发送消息到指定客户端

        Args:
            client_id: 目标客户端
            message: 消息内容

        Returns:
            bool: 是否发送成功
        """
        if client_id not in self._connections:
            return False

        try:
            websocket = self._connections[client_id]
            await websocket.send_json(message)
            return True
        except Exception as e:
            logger.error(f"Failed to send to {client_id}: {e}")
            return False

    async def broadcast(self, message: dict, exclude: Optional[List[str]] = None) -> int:
        """
        广播消息到所有连接

        Args:
            message: 消息内容
            exclude: 排除的客户端列表

        Returns:
            int: 成功发送的数量
        """
        exclude_set = set(exclude or [])
        sent_count = 0

        for client_id, websocket in self._connections.items():
            if client_id in exclude_set:
                continue

            try:
                await websocket.send_json(message)
                sent_count += 1
            except Exception as e:
                logger.error(f"Failed to broadcast to {client_id}: {e}")

        return sent_count

    async def broadcast_to_agent(self, agent_id: str, message: dict) -> int:
        """
        发送消息到订阅指定 agent 的所有客户端

        Args:
            agent_id: 目标 agent
            message: 消息内容

        Returns:
            int: 成功发送的数量
        """
        if agent_id not in self._agent_subscribers:
            return 0

        sent_count = 0
        for client_id in self._agent_subscribers[agent_id]:
            if await self.send_to(client_id, message):
                sent_count += 1

        return sent_count

    async def handle_message(self, client_id: str, raw_message: str) -> None:
        """
        处理收到的消息

        Args:
            client_id: 发送方客户端
            raw_message: 原始消息内容
        """
        try:
            message = json.loads(raw_message)
            message_type = message.get("type", "unknown")

            logger.debug(f"Received {message_type} from {client_id}")

            # 调用注册的消息处理器
            if message_type in self._handlers:
                for handler in self._handlers[message_type]:
                    try:
                        await handler(client_id, message)
                    except Exception as e:
                        logger.error(f"Handler error for {message_type}: {e}")

        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON from {client_id}: {raw_message[:100]}")
        except Exception as e:
            logger.error(f"Message handling error: {e}")

    def register_handler(self, message_type: str, handler: Callable) -> None:
        """
        注册消息处理器

        Args:
            message_type: 消息类型
            handler: 处理函数 async (client_id, message) -> None
        """
        if message_type not in self._handlers:
            self._handlers[message_type] = []
        self._handlers[message_type].append(handler)
        logger.info(f"Handler registered for {message_type}")

    def unregister_handler(self, message_type: str, handler: Callable) -> None:
        """
        注销消息处理器

        Args:
            message_type: 消息类型
            handler: 处理函数
        """
        if message_type in self._handlers:
            self._handlers[message_type].remove(handler)

    def get_connection_count(self) -> int:
        """获取当前连接数"""
        return len(self._connections)

    def get_subscriber_count(self, agent_id: str) -> int:
        """获取指定 agent 的订阅者数"""
        return len(self._agent_subscribers.get(agent_id, []))

    async def send_status_update(
        self,
        agent_id: str,
        old_status: str,
        new_status: str
    ) -> None:
        """
        发送智能体状态更新

        Args:
            agent_id: 智能体 ID
            old_status: 原状态
            new_status: 新状态
        """
        message = {
            "type": "status",
            "agent_id": agent_id,
            "old_status": old_status,
            "new_status": new_status,
            "timestamp": asyncio.get_event_loop().time()
        }

        # 广播给所有订阅该 agent 的客户端
        await self.broadcast_to_agent(agent_id, message)

        # 同时广播给全局监听者
        await self.broadcast(message)


# 全局单例实例
hub = ConnectionHub()
