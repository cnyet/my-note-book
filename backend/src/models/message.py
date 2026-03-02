"""
Message model for the AI Assistant.

This module defines the Message SQLAlchemy model.
"""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from sqlalchemy.sql import func
from ..core.database import Base
import uuid


class Message(Base):
    """
    Represents a message in a conversation with the AI Assistant.

    Attributes:
        id: Unique identifier for the message
        conversation_id: Foreign key linking to the conversation
        role: Role of the message sender (user, assistant, system)
        content: The content of the message
        token_count: Number of tokens in the message (for cost tracking)
        created_at: Timestamp when the message was created
    """
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    token_count = Column(Integer, nullable=True)  # Optional token count
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, role={self.role})>"