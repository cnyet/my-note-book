"""Database models for conversation summaries tracking."""
from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func
from api.database import Base

class ConversationSummary(Base):
    """Store summarized dialogue context."""
    __tablename__ = "conversation_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_type = Column(String(50), nullable=False, index=True)
    summary_date = Column(Date, nullable=False, index=True)
    content_summary = Column(Text, nullable=False)
    key_decisions = Column(Text)
    action_items = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
