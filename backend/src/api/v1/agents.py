"""Agents API routes."""

from fastapi import APIRouter


router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/")
async def get_agents():
    """Get all agents."""
    return {"message": "Get all agents"}


@router.get("/{agent_id}")
async def get_agent(agent_id: int):
    """Get agent by ID."""
    return {"message": f"Get agent {agent_id}"}


@router.post("/")
async def create_agent():
    """Create a new agent."""
    return {"message": "Create agent"}
