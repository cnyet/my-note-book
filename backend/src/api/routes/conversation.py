"""
API routes for conversation summary management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from api.database import get_db
from api.services.conversation_service import ConversationService
from api.schemas.conversation import ConversationSummaryCreate, ConversationSummaryResponse
from api.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/api/conversation", tags=["conversation"])

@router.post("/summaries", response_model=ConversationSummaryResponse, status_code=status.HTTP_201_CREATED)
async def create_summary(
    summary_data: ConversationSummaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Save a new conversation summary for a specific agent.
    
    Adheres to the conversation-accuracy-skill by prioritizing decisions and facts.
    """
    service = ConversationService(db)
    return service.save_summary(summary_data)

@router.get("/summaries/latest/{agent_type}", response_model=Optional[ConversationSummaryResponse])
async def get_latest_summary(
    agent_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch the most recent summary for context reconstruction.
    """
    service = ConversationService(db)
    summary = service.repo.get_latest_summary(agent_type)
    if not summary:
        return None
    return summary
