"""
Conversation model for the AI Assistant.

This module defines the Conversation SQLAlchemy model.
"""
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base
import uuid


class Conversation(Base):
    """
    Represents a conversation with the AI Assistant.

    Attributes:
        id: Unique identifier for the conversation
        user_id: Identifier for the user who owns the conversation
        title: Auto-generated title/summary of the conversation
        model: The AI model used in this conversation
        created_at: Timestamp when the conversation was created
        updated_at: Timestamp when the conversation was last updated
    """
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)  # Index for faster queries
    title = Column(String, nullable=True)  # Auto-generated from first message or summary
    model = Column(String, nullable=False)  # The AI model used
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id}, title={self.title})>"