"""
Pydantic schemas for authentication
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration"""

    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str
    remember_me: bool = False


class UserResponse(BaseModel):
    """Schema for user response"""

    id: int
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""

    user: UserResponse
    token: str
    token_type: str = "bearer"


class UserUpdate(BaseModel):
    """Schema for user profile update"""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=8, max_length=100)
