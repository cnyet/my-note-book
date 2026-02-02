"""Labs API routes."""

from fastapi import APIRouter

router = APIRouter(prefix="/labs", tags=["labs"])

@router.get("/")
async def get_labs():
    """Get all labs."""
    return {"message": "Get all labs"}
