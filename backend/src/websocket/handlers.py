# backend/src/websocket/handlers.py
"""
WebSocket 端点处理器

提供 WebSocket 连接端点：
- /ws/agents - 全局智能体状态流
- /ws/chat/{agent_id} - 与特定智能体聊天
"""

import json
import logging
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..agents.manager import AgentManager
from .hub import hub

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/agents")
async def agents_websocket(
    websocket: WebSocket,
    db: AsyncSession = Depends(get_db)
):
    """
    全局智能体状态流 WebSocket

    客户端接收：
    - status: 智能体状态更新
    - message: 广播消息
    - error: 错误信息

    客户端发送：
    - subscribe: 订阅特定 agent
    - unsubscribe: 取消订阅
    - ping: 心跳
    """
    client_id = f"client_{id(websocket)}"

    try:
        await hub.connect(client_id, websocket)

        # 发送连接成功消息
        await websocket.send_json({
            "type": "connected",
            "client_id": client_id,
            "message": "Connected to agent status stream"
        })

        # 获取当前活动智能体列表
        agent_manager = AgentManager(db)
        active_sessions = await agent_manager.get_active_sessions()

        await websocket.send_json({
            "type": "initial_state",
            "agents": [
                {
                    "agent_id": session.agent_id,
                    "status": session.status,
                    "session_id": session.id,
                    "started_at": session.started_at.isoformat() if session.started_at else None
                }
                for session in active_sessions
            ]
        })

        # 消息循环
        while True:
            try:
                raw_message = await websocket.receive_text()
                message = json.loads(raw_message)
                message_type = message.get("type")

                if message_type == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": message.get("timestamp")})

                elif message_type == "subscribe":
                    agent_id = message.get("agent_id")
                    if agent_id:
                        # 重新连接并订阅特定 agent
                        await hub.disconnect(client_id)
                        await hub.connect(client_id, websocket, agent_id=agent_id)
                        await websocket.send_json({
                            "type": "subscribed",
                            "agent_id": agent_id
                        })

                elif message_type == "unsubscribe":
                    await hub.disconnect(client_id)
                    await hub.connect(client_id, websocket)
                    await websocket.send_json({"type": "unsubscribed"})

                else:
                    logger.warning(f"Unknown message type from {client_id}: {message_type}")

            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })

    except WebSocketDisconnect:
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
    finally:
        await hub.disconnect(client_id)


@router.websocket("/ws/chat/{agent_id}")
async def chat_websocket(
    websocket: WebSocket,
    agent_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    与特定智能体的聊天 WebSocket

    客户端接收：
    - message: 智能体回复
    - typing: 输入中指示
    - error: 错误信息

    客户端发送：
    - message: 发送消息
    - ping: 心跳
    """
    client_id = f"chat_{agent_id}_{id(websocket)}"

    try:
        await hub.connect(client_id, websocket, agent_id=agent_id)

        # 验证 agent 是否存在
        agent_manager = AgentManager(db)
        status = await agent_manager.get_status(agent_id)

        await websocket.send_json({
            "type": "connected",
            "agent_id": agent_id,
            "agent_status": status.get("agent_status", "unknown"),
            "message": f"Connected to agent {agent_id}"
        })

        # 消息循环
        while True:
            try:
                raw_message = await websocket.receive_text()
                message = json.loads(raw_message)
                message_type = message.get("type")

                if message_type == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": message.get("timestamp")})

                elif message_type == "message":
                    content = message.get("content", "")

                    # 发送"输入中"指示
                    await websocket.send_json({
                        "type": "typing",
                        "agent_id": agent_id
                    })

                    # TODO: 调用 Agent 处理消息 (Phase 3)
                    # 模拟回复
                    await websocket.send_json({
                        "type": "message",
                        "agent_id": agent_id,
                        "content": f"Received: {content}",
                        "timestamp": message.get("timestamp")
                    })

                else:
                    logger.warning(f"Unknown message type from {client_id}: {message_type}")

            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })

    except WebSocketDisconnect:
        logger.info(f"Chat client {client_id} disconnected")
    except Exception as e:
        logger.error(f"Chat WebSocket error for {client_id}: {e}")
    finally:
        await hub.disconnect(client_id)
