# backend/src/agents/memory.py
"""
MemoryStore - 智能体记忆存储

支持短期记忆、长期记忆和上下文管理。
Phase 4 实现加密存储。
"""

import json
import logging
import os
from base64 import b64encode, b64decode
from datetime import datetime, timezone
from typing import Optional, Any
from uuid import uuid4

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.agent_memory import AgentMemory, MemoryType

logger = logging.getLogger(__name__)


class MemoryStore:
    """
    智能体记忆存储

    支持：
    - 短期记忆（会话级）
    - 长期记忆（跨会话）
    - 上下文管理
    - 过期自动清理
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        # Phase 4: 添加加密支持
        self._encryption_enabled = False
        self._cipher = None

    async def store(
        self,
        agent_id: str,
        key: str,
        value: Any,
        memory_type: MemoryType = MemoryType.SHORT_TERM,
        session_id: Optional[str] = None,
        expires_at: Optional[datetime] = None,
        encrypt: bool = False
    ) -> AgentMemory:
        """
        存储记忆

        Args:
            agent_id: 智能体 ID
            key: 记忆键
            value: 记忆值（任意类型）
            memory_type: 记忆类型
            session_id: 关联会话 ID
            expires_at: 过期时间
            encrypt: 是否加密（Phase 4 实现）

        Returns:
            AgentMemory: 创建的记忆实例
        """
        memory_id = f"mem_{uuid4().hex[:12]}"

        # 序列化值
        if isinstance(value, (dict, list)):
            value_str = json.dumps(value)
        else:
            value_str = str(value)

        # Phase 4: 加密敏感数据
        if encrypt and self._encryption_enabled:
            # TODO: 实现 AES-256-GCM 加密
            pass

        memory = AgentMemory(
            id=memory_id,
            agent_id=agent_id,
            session_id=session_id,
            memory_type=memory_type.value,
            key=key,
            value=value_str,
            expires_at=expires_at
        )

        self.session.add(memory)
        await self.session.flush()

        logger.debug(f"Memory stored: {agent_id}/{key} ({memory_type.value})")
        return memory

    async def retrieve(
        self,
        agent_id: str,
        key: str,
        session_id: Optional[str] = None
    ) -> Optional[Any]:
        """
        检索记忆

        Args:
            agent_id: 智能体 ID
            key: 记忆键
            session_id: 可选会话 ID（用于短期记忆）

        Returns:
            Optional[Any]: 记忆值，不存在则返回 None
        """
        # 构建查询条件
        conditions = [
            AgentMemory.agent_id == agent_id,
            AgentMemory.key == key
        ]

        if session_id:
            conditions.append(
                and_(
                    AgentMemory.session_id == session_id,
                    AgentMemory.memory_type == MemoryType.SHORT_TERM.value
                )
            )

        result = await self.session.execute(
            select(AgentMemory)
            .where(and_(*conditions))
            .order_by(AgentMemory.created_at.desc())
        )
        memory = result.scalar_one_or_none()

        if not memory:
            return None

        # 检查是否过期
        if memory.expires_at and memory.expires_at < datetime.now(timezone.utc):
            logger.debug(f"Memory expired: {agent_id}/{key}")
            return None

        # 尝试解析 JSON
        try:
            return json.loads(memory.value)
        except json.JSONDecodeError:
            return memory.value

    async def retrieve_all(
        self,
        agent_id: str,
        memory_type: Optional[MemoryType] = None,
        session_id: Optional[str] = None,
        limit: int = 100
    ) -> list[AgentMemory]:
        """
        检索所有记忆

        Args:
            agent_id: 智能体 ID
            memory_type: 记忆类型过滤
            session_id: 会话 ID 过滤
            limit: 返回数量限制

        Returns:
            list[AgentMemory]: 记忆列表
        """
        query = select(AgentMemory).where(AgentMemory.agent_id == agent_id)

        if memory_type:
            query = query.where(AgentMemory.memory_type == memory_type.value)

        if session_id:
            query = query.where(AgentMemory.session_id == session_id)

        # 过滤过期数据 - 保留未过期或永不过期的
        query = query.where(
            or_(
                AgentMemory.expires_at.is_(None),
                AgentMemory.expires_at > datetime.now(timezone.utc)
            )
        )

        query = query.order_by(AgentMemory.created_at.desc()).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def delete(
        self,
        agent_id: str,
        key: str,
        session_id: Optional[str] = None
    ) -> bool:
        """
        删除记忆

        Args:
            agent_id: 智能体 ID
            key: 记忆键
            session_id: 可选会话 ID

        Returns:
            bool: 是否成功删除
        """
        query = select(AgentMemory).where(
            and_(
                AgentMemory.agent_id == agent_id,
                AgentMemory.key == key
            )
        )

        if session_id:
            query = query.where(AgentMemory.session_id == session_id)

        result = await self.session.execute(query)
        memory = result.scalar_one_or_none()

        if memory:
            await self.session.delete(memory)
            await self.session.flush()
            logger.debug(f"Memory deleted: {agent_id}/{key}")
            return True

        return False

    async def clear_session_memory(self, session_id: str) -> int:
        """
        清理会话的所有短期记忆

        Args:
            session_id: 会话 ID

        Returns:
            int: 删除的记忆数量
        """
        result = await self.session.execute(
            select(AgentMemory).where(
                and_(
                    AgentMemory.session_id == session_id,
                    AgentMemory.memory_type == MemoryType.SHORT_TERM.value
                )
            )
        )
        memories = result.scalars().all()

        for memory in memories:
            await self.session.delete(memory)

        await self.session.flush()

        logger.info(f"Cleared {len(memories)} memories for session {session_id}")
        return len(memories)

    async def cleanup_expired(self) -> int:
        """
        清理过期记忆

        Returns:
            int: 删除的记忆数量
        """
        result = await self.session.execute(
            select(AgentMemory).where(
                and_(
                    AgentMemory.expires_at.isnot(None),
                    AgentMemory.expires_at < datetime.now(timezone.utc)
                )
            )
        )
        expired = result.scalars().all()

        for memory in expired:
            await self.session.delete(memory)

        await self.session.flush()

        logger.info(f"Cleaned up {len(expired)} expired memories")
        return len(expired)

    # Phase 4: 加密支持
    def enable_encryption(self, encryption_key: bytes) -> None:
        """
        启用记忆加密

        Args:
            encryption_key: AES-256 密钥 (32 字节)
        """
        if len(encryption_key) != 32:
            raise ValueError("Encryption key must be 32 bytes for AES-256")

        self._cipher = AESGCM(encryption_key)
        self._encryption_enabled = True
        logger.info("Memory encryption enabled")

    def _encrypt_value(self, value: str) -> str:
        """
        使用 AES-256-GCM 加密值

        Args:
            value: 原始值

        Returns:
            str: base64 编码的加密值 (nonce:ciphertext:tag)
        """
        if not self._encryption_enabled or self._cipher is None:
            return value

        try:
            nonce = os.urandom(12)  # 96-bit nonce for GCM
            ciphertext = self._cipher.encrypt(
                nonce,
                value.encode('utf-8'),
                None  # no additional authenticated data
            )
            # Combine nonce + ciphertext and encode
            encrypted = b64encode(nonce + ciphertext).decode('utf-8')
            return f"ENC:{encrypted}"
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            return value

    def _decrypt_value(self, value: str) -> str:
        """
        使用 AES-256-GCM 解密值

        Args:
            value: 加密值 (格式: ENC:base64(nonce+ciphertext))

        Returns:
            str: 解密后的值
        """
        if not self._encryption_enabled or self._cipher is None:
            return value

        if not value.startswith("ENC:"):
            return value  # Not encrypted

        try:
            encrypted_data = b64decode(value[4:])  # Remove "ENC:" prefix
            nonce = encrypted_data[:12]
            ciphertext = encrypted_data[12:]

            plaintext = self._cipher.decrypt(nonce, ciphertext, None)
            return plaintext.decode('utf-8')
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            return value
