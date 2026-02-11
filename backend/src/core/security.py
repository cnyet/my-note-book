"""
Security module for password hashing and JWT token management.

Provides utilities for:
- Password hashing and verification using bcrypt
- JWT access token creation and verification
- JWT refresh token creation and verification
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings

settings = get_settings()

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: The plain text password to verify
        hashed_password: The hashed password to compare against

    Returns:
        True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: The plain text password to hash

    Returns:
        The hashed password
    """
    return pwd_context.hash(password)


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.

    Args:
        data: The payload data to include in the token (e.g., {"sub": "user_id"})
        expires_delta: Optional custom expiration time

    Returns:
        The encoded JWT access token
    """
    to_encode = data.copy()

    # Set expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )

    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.now(timezone.utc),
    })

    # Encode the token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )

    return encoded_jwt


def create_refresh_token(data: dict[str, Any]) -> str:
    """
    Create a JWT refresh token.

    Args:
        data: The payload data to include in the token (e.g., {"sub": "user_id"})

    Returns:
        The encoded JWT refresh token
    """
    to_encode = data.copy()

    # Set expiration for refresh token (longer than access token)
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.refresh_token_expire_days
    )

    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.now(timezone.utc),
    })

    # Encode the token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )

    return encoded_jwt


def decode_token(token: str) -> dict[str, Any] | None:
    """
    Decode and verify a JWT token.

    Args:
        token: The JWT token to decode

    Returns:
        The decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return payload
    except JWTError:
        return None


def verify_token(token: str, token_type: str = "access") -> dict[str, Any] | None:
    """
    Verify a JWT token and check its type.

    Args:
        token: The JWT token to verify
        token_type: The expected token type ("access" or "refresh")

    Returns:
        The decoded token payload if valid and correct type, None otherwise
    """
    payload = decode_token(token)

    if payload is None:
        return None

    # Check token type
    if payload.get("type") != token_type:
        return None

    return payload


__all__ = [
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "verify_token",
]
