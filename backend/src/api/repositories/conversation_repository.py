"""
Repository for conversation summary database operations
"""
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from api.models.conversation_summaries import ConversationSummary

class ConversationRepository:
    """Repository for managing conversation summaries"""
    
    def __init__(self, db: Session):
        self.db = db
        
    def create_summary(self, summary_data: dict) -> ConversationSummary:
        """Create a new conversation summary"""
        summary = ConversationSummary(**summary_data)
        self.db.add(summary)
        self.db.commit()
        self.db.refresh(summary)
        return summary
        
    def get_latest_summary(self, agent_type: str) -> Optional[ConversationSummary]:
        """Get the most recent summary for a specific agent"""
        return (
            self.db.query(ConversationSummary)
            .filter(ConversationSummary.agent_type == agent_type)
            .order_by(ConversationSummary.summary_date.desc(), ConversationSummary.created_at.desc())
            .first()
        )
        
    def get_summaries_by_date_range(
        self, agent_type: str, start_date: date, end_date: date
    ) -> List[ConversationSummary]:
        """Get summaries within a date range"""
        return (
            self.db.query(ConversationSummary)
            .filter(
                ConversationSummary.agent_type == agent_type,
                ConversationSummary.summary_date >= start_date,
                ConversationSummary.summary_date <= end_date
            )
            .order_by(ConversationSummary.summary_date.desc())
            .all()
        )
