# backend/src/api/v1/admin/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ....core.config import settings
from ....core.database import get_db
from ....core.security import create_access_token, create_refresh_token
from ....schemas.user import Token, UserLogin, UserResponse
from ....services.user_service import authenticate_user, create_first_admin
from ....api.deps import get_current_active_user
from ....models.user import User

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Admin login endpoint"""
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username, "role": user.role}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "username": user.username, "role": user.role}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/verify", response_model=UserResponse)
def verify_token(current_user: User = Depends(get_current_active_user)):
    """Verify current token and return user info"""
    return current_user

@router.post("/init")
def init_admin_db(db: Session = Depends(get_db)):
    """Initialize first admin user (development only)"""
    from ....core.database import init_db
    init_db()

    admin = create_first_admin(
        db,
        settings.FIRST_ADMIN_USERNAME,
        settings.FIRST_ADMIN_EMAIL,
        settings.FIRST_ADMIN_PASSWORD
    )

    return {"message": "Admin user initialized", "username": admin.username}
