"""
Pydantic schemas for user data validation and serialization.

Defines the request/response models for user-related operations.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from ..models.user import UserRole


# Base user schema with common fields
class UserBase(BaseModel):
    """Base user schema with common fields."""

    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="Email address")


# Schema for user registration
class UserCreate(UserBase):
    """Schema for user registration."""

    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Password (min 8 characters)",
    )
    role: UserRole = Field(default=UserRole.ADMIN, description="User role")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


# Schema for user login
class UserLogin(BaseModel):
    """Schema for user login."""

    username_or_email: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")


# Schema for user update
class UserUpdate(BaseModel):
    """Schema for updating user information."""

    email: EmailStr | None = Field(None, description="New email address")
    role: UserRole | None = Field(None, description="New user role")
    is_active: bool | None = Field(None, description="Active status")


# Schema for password change
class PasswordChange(BaseModel):
    """Schema for changing password."""

    old_password: str = Field(..., description="Current password")
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="New password (min 8 characters)",
    )

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


# Schema for user response (without sensitive data)
class UserResponse(UserBase):
    """Schema for user response (public data)."""

    id: int = Field(..., description="User ID")
    role: UserRole = Field(..., description="User role")
    is_active: bool = Field(..., description="Active status")
    created_at: datetime = Field(..., description="Account creation date")
    updated_at: datetime = Field(..., description="Last update date")

    model_config = {"from_attributes": True}


# Schema for token response
class TokenResponse(BaseModel):
    """Schema for authentication token response."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: Literal["bearer"] = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration in seconds")


# Schema for token refresh
class TokenRefresh(BaseModel):
    """Schema for token refresh request."""

    refresh_token: str = Field(..., description="Valid refresh token")


__all__ = [
    "UserBase",
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "PasswordChange",
    "UserResponse",
    "TokenResponse",
    "TokenRefresh",
    "UserRole",
]
