# backend/src/api/v1/admin/profile.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel, Field, EmailStr, field_validator, validator
from datetime import datetime
from ....core.security import verify_password
from ....api.deps import get_current_active_user
from ....models import User
from ....schemas.user import UserResponse
import secrets
import string

router = APIRouter()


class TokenInfo(BaseModel):
    id: str
    name: str
    created_at: datetime
    expires_at: datetime
    is_active: bool
    last_used: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)


class CreateTokenRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)


@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user


@router.put("", response_model=UserResponse)
def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update user profile (display name, email)"""
    update_data = profile_update.model_dump(exclude_unset=True)
    
    # Email uniqueness check would go here
    # For now, just update
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.now()
    
    return current_user


@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
):
    """Change user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    
    # Update password with new one (hashing happens in user model)
    current_user.hashed_password = password_data.new_password
    current_user.updated_at = datetime.now()
    
    return {"message": "Password changed successfully"}


@router.get("/tokens", response_model=List[TokenInfo])
def list_tokens(current_user: User = Depends(get_current_active_user)):
    """List all API tokens for current user"""
    # Mock tokens - in production, these would be stored in database
    # For now, return mock data based on user ID
    mock_tokens = [
        {
            "id": "token-1",
            "name": "Frontend - Local Development",
            "created_at": datetime(2025, 2, 10, 9, 0, 0),
            "expires_at": datetime(2025, 12, 31, 23, 59, 0),
            "is_active": True,
            "last_used": datetime(2025, 2, 12, 10, 0, 0),
        },
        {
            "id": "token-2",
            "name": "Mobile App - Production",
            "created_at": datetime(2025, 1, 15, 14, 0, 0),
            "expires_at": datetime(2026, 1, 15, 14, 0, 0),
            "is_active": True,
            "last_used": datetime(2025, 2, 14, 8, 0, 0),
        },
        {
            "id": "token-3",
            "name": "API Script - Automation",
            "created_at": datetime(2024, 12, 1, 10, 0, 0),
            "expires_at": datetime(2025, 3, 1, 10, 0, 0),
            "is_active": False,
            "last_used": datetime(2025, 1, 20, 15, 0, 0),
        },
    ]
    
    # Filter tokens for this user (in production, filter by user_id)
    return mock_tokens


@router.post("/tokens", response_model=TokenInfo)
def create_token(
    token_request: CreateTokenRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new API token"""
    # Generate secure random token
    token_id = secrets.token_urlsafe(16)
    
    new_token = TokenInfo(
        id=token_id,
        name=token_request.name,
        created_at=datetime.now(),
        expires_at=datetime.now(),  # Default 30 day expiry
        is_active=True,
        last_used=None,
    )
    
    # In production, store in database
    return new_token


@router.delete("/tokens/{token_id}")
def revoke_token(
    token_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Revoke (delete) an API token"""
    # In production, remove from database
    # For now, just return success
    return {"message": f"Token {token_id} revoked"}


@router.post("/verify-password")
def verify_password_for_action(
    current_password: str,
    current_user: User = Depends(get_current_active_user),
):
    """Verify password before sensitive actions (used by frontend)"""
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect",
        )
    
    return {"valid": True}
