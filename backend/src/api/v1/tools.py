"""Tools API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="/tools", tags=["tools"])

@router.get("/")
async def get_tools():
    """Get all tools."""
    return {"message": "Get all tools"}
