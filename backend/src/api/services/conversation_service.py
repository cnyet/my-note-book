"""
Service for conversation summary business logic
"""
from datetime import date, datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from api.repositories.conversation_repository import ConversationRepository
from api.schemas.conversation import ConversationSummaryCreate
from api.models.conversation_summaries import ConversationSummary

class ConversationService:
    """Service for handling conversation summaries and context optimization"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = ConversationRepository(db)
        
    def save_summary(self, summary_data: ConversationSummaryCreate) -> ConversationSummary:
        """
        Save a new conversation summary.
        Follows conversation-accuracy-skill: Extract key decisions and action items.
        """
        return self.repo.create_summary(summary_data.dict())
        
    def get_latest_context_summary(self, agent_type: str) -> Optional[str]:
        """
        Get the most recent summary formatted for context.
        Used for the 'Mid-term Summary' layer of the four-layer architecture.
        """
        summary = self.repo.get_latest_summary(agent_type)
        if not summary:
            return None
            
        context = f"Mid-term Summary ({summary.summary_date}):\n{summary.content_summary}"
        if summary.key_decisions:
            context += f"\nKey Decisions: {summary.key_decisions}"
        if summary.action_items:
            context += f"\nAction Items: {summary.action_items}"
            
        return context

    def get_recent_history_context(self, agent_type: str, days: int = 7) -> str:
        """
        Assemble summaries from the last few days into a historical context string.
        """
        import datetime
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=days)
        
        summaries = self.repo.get_summaries_by_date_range(agent_type, start_date, end_date)
        if not summaries:
            return ""
            
        history_parts = []
        for s in reversed(summaries): # Oldest first for chronological context
            history_parts.append(f"--- {s.summary_date} ---\n{s.content_summary}")
            
        return "\n\n".join(history_parts)
