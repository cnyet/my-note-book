# backend/src/api/v1/admin/agents.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel

from ....core.database import get_db
from ....models.user import User

router = APIRouter()


class AgentCreate(BaseModel):
    name: str
    description: str
    system_prompt: str
    model: str


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    system_prompt: str | None = None
    model: str | None = None
    is_active: bool = True


class AgentResponse(BaseModel):
    id: int
    name: str
    description: str
    system_prompt: str
    model: str
    is_active: bool


@router.get("")
def list_agents(
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """Get all agents"""
    # Mock data for MVP
    return [
        {
            "id": 1,
            "name": "News Summarizer",
            "description": "Summarize news articles",
            "system_prompt": "You are a news summarization agent...",
            "model": "gpt-4",
            "is_active": True
        },
        {
            "id": 2,
            "name": "Code Reviewer",
            "description": "Review code for best practices",
            "system_prompt": "Check code quality...",
            "model": "gpt-4",
            "is_active": True
        },
        {
            "id": 3,
            "name": "Data Processor",
            "description": "Process and format data",
            "system_prompt": "Process incoming data...",
            "model": "gpt-3.5-turbo",
            "is_active": True
        },
    ]


@router.post("")
def create_agent(
    agent: AgentCreate,
    db: Session = Depends(get_db)
) -> AgentResponse:
    """Create a new agent"""
    # Generate a new ID (in real implementation, this would be auto-increment)
    new_id = max([agent.get("id", default=0) for agent in [1, 2, 3]] or []) + 1

    new_agent = {
        "id": new_id,
        "name": agent.name,
        "description": agent.description,
        "system_prompt": agent.system_prompt,
        "model": agent.model,
        "is_active": agent.is_active,
    }

    db.add(new_agent)
    db.commit()

    return new_agent


@router.put("/{agent_id}")
def update_agent(
    agent_id: int,
    agent: AgentUpdate,
    db: Session = Depends(get_db)
) -> AgentResponse:
    """Update an existing agent"""
    # Get the agent
    agent_obj = db.query(User).filter(User.id == agent_id).first()
    if not agent_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    # Update fields
    update_data = agent.model_dump(exclude_unset=True)
    if agent.name is not None:
        update_data["name"] = agent.name
    if agent.description is not None:
        update_data["description"] = agent.description
    if agent.system_prompt is not None:
        update_data["system_prompt"] = agent.system_prompt
    if agent.model is not None:
        update_data["model"] = agent.model
    update_data["is_active"] = agent.is_active

    db.query(User).filter(User.id == agent_id).update(update_data)
    db.commit()

    return agent_obj


@router.delete("/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Delete an agent"""
    agent_obj = db.query(User).filter(User.id == agent_id).first()
    if not agent_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    db.delete(agent_obj)

    return {"message": "Agent deleted successfully"}
