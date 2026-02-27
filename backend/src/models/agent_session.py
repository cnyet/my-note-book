# backend/src/models/agent_session.py
"""
智能体会话表 (Agent Sessions)

管理智能体生命周期状态: spawned -> idle -> busy/error -> terminated
"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class AgentSession(Base):
    """智能体会话表"""
    __tablename__ = "agent_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    agent_id = Column(String(36), ForeignKey("agents.id"), nullable=False, index=True)
    status = Column(
        String(20),
        nullable=False,
        default="idle",
        index=True
    )  # spawned, idle, busy, error, terminated
    started_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    ended_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    session_metadata = Column(JSON, nullable=True)  # 会话元数据

    # 关系
    agent = relationship("Agent", back_populates="sessions")
    memories = relationship("AgentMemory", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AgentSession(id={self.id}, agent_id={self.agent_id}, status={self.status})>"

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "agent_id": self.agent_id,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "error_message": self.error_message,
            "metadata": self.session_metadata,
        }
