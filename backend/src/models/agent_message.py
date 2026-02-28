# backend/src/models/agent_message.py
"""
跨智能体消息表 (Agent Messages)

存储智能体之间的消息传递记录
支持 request/response/event/broadcast 类型
"""

from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class MessageType(Enum):
    """消息类型枚举"""
    REQUEST = "request"      # 请求
    RESPONSE = "response"    # 响应
    EVENT = "event"          # 事件
    BROADCAST = "broadcast"  # 广播


class MessageStatus(Enum):
    """消息状态枚举"""
    PENDING = "pending"       # 待处理
    DELIVERED = "delivered"   # 已送达
    PROCESSED = "processed"   # 已处理
    FAILED = "failed"         # 失败


class AgentMessage(Base):
    """跨智能体消息表"""
    __tablename__ = "agent_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    from_agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False, index=True)
    to_agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False, index=True)
    message_type = Column(
        String(20),
        nullable=False
    )  # request, response, event, broadcast
    payload = Column(JSON, nullable=False)  # 消息内容
    status = Column(
        String(20),
        nullable=False,
        default="pending",
        index=True
    )  # pending, delivered, processed, failed
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    processed_at = Column(DateTime, nullable=True)

    # 关系
    from_agent = relationship("Agent", foreign_keys=[from_agent_id], back_populates="sent_messages")
    to_agent = relationship("Agent", foreign_keys=[to_agent_id], back_populates="received_messages")

    def __repr__(self):
        return (
            f"<AgentMessage(id={self.id}, "
            f"from={self.from_agent_id}, to={self.to_agent_id}, "
            f"type={self.message_type}, status={self.status})>"
        )

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "from_agent_id": self.from_agent_id,
            "to_agent_id": self.to_agent_id,
            "message_type": self.message_type,
            "payload": self.payload,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "processed_at": self.processed_at.isoformat() if self.processed_at else None,
        }
