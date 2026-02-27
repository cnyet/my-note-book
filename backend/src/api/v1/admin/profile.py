from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Header, Depends
from pydantic import BaseModel, Field, EmailStr, field_validator, validator
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ....core.database import get_db
from ....core.security import verify_password, hash_password
from ....api.deps import get_current_active_user
from ....models import User, APIToken
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
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user


@router.put("", response_model=UserResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update user profile (display name, email)"""
    update_data = profile_update.model_dump(exclude_unset=True)

    # Email uniqueness check would go here
    # For now, just update
    for field, value in update_data.items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Change user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match",
        )

    # Update password with new one
    current_user.hashed_password = hash_password(password_data.new_password)
    current_user.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(current_user)

    return {"message": "Password changed successfully"}


@router.get("/tokens", response_model=List[TokenInfo])
async def list_tokens(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """List all API tokens for current user"""
    result = await db.execute(
        select(APIToken)
        .where(APIToken.user_id == current_user.id)
        .order_by(APIToken.created_at.desc())
    )
    tokens = result.scalars().all()

    return [
        TokenInfo(
            id=token.id,
            name=token.name,
            created_at=token.created_at,
            expires_at=token.expires_at,
            is_active=token.is_active,
            last_used=token.last_used_at,
        )
        for token in tokens
    ]


@router.post("/tokens", response_model=TokenInfo)
async def create_token(
    token_request: CreateTokenRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new API token"""
    # Create token record
    new_token = APIToken(
        name=token_request.name,
        user_id=current_user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        is_active=True,
    )
    db.add(new_token)
    await db.commit()
    await db.refresh(new_token)

    return TokenInfo(
        id=new_token.id,
        name=new_token.name,
        created_at=new_token.created_at,
        expires_at=new_token.expires_at,
        is_active=new_token.is_active,
        last_used=new_token.last_used_at,
    )


@router.delete("/tokens/{token_id}")
async def revoke_token(
    token_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Revoke (soft delete) an API token"""
    result = await db.execute(
        select(APIToken).where(
            APIToken.id == token_id,
            APIToken.user_id == current_user.id,
        )
    )
    token = result.scalars().first()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found",
        )

    token.is_active = False
    await db.commit()

    return {"message": f"Token {token_id} revoked"}


@router.post("/verify-password")
async def verify_password_for_action(
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
