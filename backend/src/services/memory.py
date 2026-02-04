from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from src.models.memory import AgentMemory
from typing import Optional


class MemoryService:
    @staticmethod
    def store_memory(
        db: Session,
        agent_id: str,
        user_id: int,
        key: str,
        value: str,
        ttl_hours: Optional[int] = None,
    ):
        expires_at = None
        if ttl_hours:
            expires_at = datetime.now(timezone.utc) + timedelta(hours=ttl_hours)

        memory_obj = (
            db.query(AgentMemory)
            .filter(
                AgentMemory.agent_id == agent_id,
                AgentMemory.user_id == user_id,
                AgentMemory.key == key,
            )
            .first()
        )

        if memory_obj:
            memory_obj.value = value
            memory_obj.expires_at = expires_at
        else:
            memory_obj = AgentMemory(
                agent_id=agent_id,
                user_id=user_id,
                key=key,
                value=value,
                expires_at=expires_at,
            )
            db.add(memory_obj)

        db.commit()
        db.refresh(memory_obj)
        return memory_obj

    @staticmethod
    def get_memory(db: Session, agent_id: str, user_id: int, key: str):
        now = datetime.now(timezone.utc)
        return (
            db.query(AgentMemory)
            .filter(
                AgentMemory.agent_id == agent_id,
                AgentMemory.user_id == user_id,
                AgentMemory.key == key,
                (AgentMemory.expires_at.is_(None)) | (AgentMemory.expires_at > now),
            )
            .first()
        )

    @staticmethod
    def clear_expired(db: Session):
        now = datetime.now(timezone.utc)
        db.query(AgentMemory).filter(AgentMemory.expires_at < now).delete()
        db.commit()


memory_service = MemoryService()
