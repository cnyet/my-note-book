"""Home API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="/home", tags=["home"])

@router.get("/")
async def get_home():
    """Get home page aggregator data."""
    return {"message": "Welcome to Work-Agents API"}
