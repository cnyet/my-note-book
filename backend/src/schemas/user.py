# backend/src/schemas/user.py
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
import re


def validate_password_strength(password: str) -> str:
    """Validate password meets minimum security requirements."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if len(password) > 128:
        raise ValueError("Password must not exceed 128 characters")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one digit")
    # Check for common weak passwords
    weak_passwords = {"password", "12345678", "qwerty", "abc123", "admin123"}
    if password.lower() in weak_passwords:
        raise ValueError("Password is too common. Choose a stronger password.")
    return password

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_password_strength(v)


class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator("password")
    @classmethod
    def validate_login_password(cls, v: str) -> str:
        # Allow any password for login (actual validation happens in auth)
        # Just check it's not empty
        if not v or not v.strip():
            raise ValueError("Password cannot be empty")
        return v

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenPayload(BaseModel):
    sub: int
    username: str
    role: str
    exp: int
    type: str
