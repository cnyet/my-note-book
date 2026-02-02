"""Authentication schemas for user registration and login."""

from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    """Base user schema."""

    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation request."""

    password: str


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: str
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for JWT token data."""

    email: Optional[str] = None
