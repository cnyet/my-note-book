# backend/src/websocket/__init__.py
"""
WebSocket 模块

提供实时双向通信能力：
- ConnectionHub: 连接管理中心
- WebSocket 端点处理
"""

from .hub import ConnectionHub, hub

__all__ = ["ConnectionHub", "hub"]
