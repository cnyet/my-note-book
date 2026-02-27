# backend/src/models/ws_connection.py
"""
WebSocket 连接表 (WebSocket Connections)

跟踪活跃的 WebSocket 连接状态
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from ..core.database import Base


class WSConnection(Base):
    """WebSocket 连接表"""
    __tablename__ = "ws_connections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    client_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=True, index=True)
    connected_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    last_ping = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    def __repr__(self):
        return f"<WSConnection(id={self.id}, client_id={self.client_id}, is_active={self.is_active})>"

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "client_id": self.client_id,
            "user_id": self.user_id,
            "agent_id": self.agent_id,
            "connected_at": self.connected_at.isoformat() if self.connected_at else None,
            "last_ping": self.last_ping.isoformat() if self.last_ping else None,
            "is_active": self.is_active,
        }
