# backend/src/models/agent_memory.py
"""
智能体记忆表 (Agent Memory)

存储智能体的短期记忆、长期记忆和上下文信息
支持可选的 AES-256-GCM 加密
"""

from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base


class MemoryType(Enum):
    """记忆类型枚举"""
    SHORT_TERM = "short_term"  # 短期记忆（会话级）
    LONG_TERM = "long_term"    # 长期记忆（跨会话）
    CONTEXT = "context"        # 上下文信息


class AgentMemory(Base):
    """智能体记忆表"""
    __tablename__ = "agent_memory"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey("agent_sessions.id"), nullable=True, index=True)
    memory_type = Column(
        String(20),
        nullable=False,
        index=True
    )  # short_term, long_term, context
    key = Column(String(255), nullable=False, index=True)
    value = Column(Text, nullable=True)  # JSON 或加密数据
    is_encrypted = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    expires_at = Column(DateTime, nullable=True)  # 过期时间 (null = 永不过期)

    # 关系
    session = relationship("AgentSession", back_populates="memories")

    def __repr__(self):
        return f"<AgentMemory(id={self.id}, agent_id={self.agent_id}, type={self.memory_type}, key={self.key})>"

    def to_dict(self):
        """转换为字典 (不包含 value)"""
        return {
            "id": self.id,
            "agent_id": self.agent_id,
            "session_id": self.session_id,
            "memory_type": self.memory_type,
            "key": self.key,
            "is_encrypted": self.is_encrypted,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }
