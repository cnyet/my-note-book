"""
Pydantic schemas for conversation summaries
"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field

class ConversationSummaryBase(BaseModel):
    """Base schema for conversation summary"""
    agent_type: str = Field(..., max_length=50)
    summary_date: date
    content_summary: str = Field(..., max_length=1000)
    key_decisions: Optional[str] = None
    action_items: Optional[str] = None

class ConversationSummaryCreate(ConversationSummaryBase):
    """Schema for creating a conversation summary"""
    pass

class ConversationSummaryResponse(ConversationSummaryBase):
    """Schema for conversation summary response"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
