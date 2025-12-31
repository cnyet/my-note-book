"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from api.database import get_db
from api.services.auth_service import AuthService
from api.schemas.auth import (
    UserCreate,
    UserLogin,
    TokenResponse,
    UserResponse,
    UserUpdate,
)
from api.dependencies import get_current_user
from api.models.user import User
from api.middleware.rate_limit import rate_limiter, get_client_ip
from api.middleware.auth_logger import auth_logger

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Register a new user

    Requirements: 8.1, 1.1, 1.2, 1.3, 1.4, 5.5, 7.4
    """
    client_ip = get_client_ip(request)
    auth_service = AuthService(db)

    try:
        # Register user
        user = auth_service.register_user(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password,
        )

        # Log successful registration
        auth_logger.log_registration(
            email=user_data.email,
            ip_address=client_ip,
            success=True,
            user_id=user.id,
        )

        # Create token for automatic login
        token = auth_service.create_token_for_user(user)

        # Return user and token
        return TokenResponse(
            user=UserResponse.from_orm(user),
            token=token,
        )

    except ValueError as e:
        # Log failed registration
        auth_logger.log_registration(
            email=user_data.email,
            ip_address=client_ip,
            success=False,
            details=str(e),
        )
        
        # Handle validation errors (email exists, password too short)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        # Log failed registration
        auth_logger.log_registration(
            email=user_data.email,
            ip_address=client_ip,
            success=False,
            details="Unexpected error",
        )
        
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Login with email and password

    Requirements: 8.2, 2.1, 2.2, 2.4, 3.4, 7.3, 5.5, 7.4
    """
    # Get client IP
    client_ip = get_client_ip(request)
    
    # Check rate limit before attempting authentication
    rate_limiter.check_rate_limit(client_ip)
    
    auth_service = AuthService(db)

    # Authenticate user
    user = auth_service.authenticate_user(
        email=credentials.email,
        password=credentials.password,
    )

    if not user:
        # Record failed attempt
        rate_limiter.record_failed_attempt(client_ip, credentials.email)
        
        # Log failed login
        auth_logger.log_login_attempt(
            email=credentials.email,
            ip_address=client_ip,
            success=False,
            details="Invalid credentials",
        )
        
        # Return generic error to avoid revealing if email exists
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Clear failed attempts on successful login
    rate_limiter.clear_failed_attempts(client_ip)
    
    # Log successful login
    auth_logger.log_login_attempt(
        email=credentials.email,
        ip_address=client_ip,
        success=True,
        user_id=user.id,
    )
    
    # Create token
    token = auth_service.create_token_for_user(user, credentials.remember_me)

    return TokenResponse(
        user=UserResponse.from_orm(user),
        token=token,
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """
    Get current user information

    Requirements: 8.4, 5.1
    """
    return UserResponse.from_orm(current_user)


@router.post("/logout")
async def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    """
    Logout user (client-side token clearing)

    Requirements: 8.3, 3.3, 5.5, 7.4
    """
    client_ip = get_client_ip(request)
    
    # Log logout event
    auth_logger.log_logout(
        user_id=current_user.id,
        email=current_user.email,
        ip_address=client_ip,
    )
    
    # JWT tokens are stateless, so logout is handled client-side
    # by clearing the token from storage
    return {"message": "Successfully logged out"}


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    updates: UserUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update user profile

    Requirements: 8.5, 5.2, 5.3, 5.4, 5.5, 7.4
    """
    client_ip = get_client_ip(request)
    auth_service = AuthService(db)

    # Prepare updates dictionary
    update_data = {}
    changes = []

    if updates.name is not None:
        update_data["name"] = updates.name
        changes.append("name")

    if updates.email is not None:
        update_data["email"] = updates.email
        changes.append("email")

    # Handle password change
    if updates.new_password is not None:
        # Verify current password is provided
        if not updates.current_password:
            auth_logger.log_password_change(
                user_id=current_user.id,
                email=current_user.email,
                ip_address=client_ip,
                success=False,
                details="Current password not provided",
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to change password",
            )

        # Verify current password
        if not auth_service.authenticate_user(
            current_user.email, updates.current_password
        ):
            auth_logger.log_password_change(
                user_id=current_user.id,
                email=current_user.email,
                ip_address=client_ip,
                success=False,
                details="Incorrect current password",
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        # Add new password to updates
        update_data["password"] = updates.new_password
        changes.append("password")

    try:
        # Update user profile
        updated_user = auth_service.update_user_profile(current_user.id, update_data)

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # Log successful update
        if "password" in changes:
            auth_logger.log_password_change(
                user_id=current_user.id,
                email=current_user.email,
                ip_address=client_ip,
                success=True,
            )
        
        if any(c in changes for c in ["name", "email"]):
            auth_logger.log_profile_update(
                user_id=current_user.id,
                email=current_user.email,
                ip_address=client_ip,
                changes=", ".join([c for c in changes if c != "password"]),
                success=True,
            )

        return UserResponse.from_orm(updated_user)

    except ValueError as e:
        # Log failed update
        auth_logger.log_profile_update(
            user_id=current_user.id,
            email=current_user.email,
            ip_address=client_ip,
            changes=", ".join(changes),
            success=False,
            details=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
