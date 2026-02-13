# backend/src/api/v1/admin/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ....core.config import settings
from ....core.database import get_db
from ....core.security import create_access_token, create_refresh_token
from ....core.audit import audit_logger
from ....schemas.user import Token, UserLogin, UserResponse
from ....services.user_service import authenticate_user, create_first_admin
from ....api.deps import get_current_active_user
from ....models import User
from .rate_limit import rate_limit

router = APIRouter()


@router.post("/login", response_model=Token)
@rate_limit(max_requests=5, window_seconds=300)  # 5 attempts per 5 minutes
async def login(
    user_credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint with rate limiting.

    Rate limit: 5 attempts per 5 minutes per IP address.
    """
    # Get client IP
    forwarded = request.headers.get("X-Forwarded-For")
    ip_address = (forwarded.split(",")[0].strip() if forwarded
                  else request.client.host if request.client else "unknown")
    user_agent = request.headers.get("User-Agent")

    # Authenticate user
    user = authenticate_user(db, user_credentials.username, user_credentials.password)

    if not user:
        # Log failed attempt
        audit_logger.log_login_failed(
            username=user_credentials.username,
            ip_address=ip_address,
            user_agent=user_agent
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "X-RateLimit-Limit": "5",
                "X-RateLimit-Window": "300",
            }
        )

    # Log successful login
    audit_logger.log_login_success(
        username=user.username,
        ip_address=ip_address,
        user_agent=user_agent
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
