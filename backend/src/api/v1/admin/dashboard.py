# backend/src/api/v1/admin/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from ....core.database import get_db
from ....models.user import User
from ....schemas.user import UserResponse

router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get dashboard statistics"""
    users_count = db.query(User).count()

    return {
        "usersCount": users_count,
        "agentsCount": 0,
        "toolsCount": 0,
        "labsCount": 0,
        "blogPostsCount": 0,
    }
