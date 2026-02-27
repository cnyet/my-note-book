# backend/src/message_bus/__init__.py
"""
MessageBus - 异步消息总线

提供智能体间的消息传递机制
"""

from .bus import MessageBus, get_message_bus

__all__ = ["MessageBus", "get_message_bus"]
