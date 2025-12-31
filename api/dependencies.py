"""
FastAPI dependencies for authentication
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from api.database import get_db
from api.services.auth_service import AuthService
from api.models.user import User

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract and validate JWT token from Authorization header
    
    Args:
        credentials: HTTP Bearer credentials from Authorization header
        db: Database session
        
    Returns:
        Current authenticated User object
        
    Raises:
        HTTPException: 401 if token is invalid or user not found
        
    Requirements: 4.1, 4.2
    """
    # Extract token from credentials
    token = credentials.credentials
    
    # Create auth service
    auth_service = AuthService(db)
    
    # Get user from token
    user = auth_service.get_current_user(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user (convenience wrapper)
    
    Args:
        current_user: Current user from get_current_user dependency
        
    Returns:
        Current active User object
        
    Requirements: 4.2
    """
    return current_user


# Optional authentication - returns None if no token provided
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Optional authentication - returns None if no token provided
    
    Args:
        credentials: Optional HTTP Bearer credentials
        db: Database session
        
    Returns:
        User object if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        auth_service = AuthService(db)
        user = auth_service.get_current_user(token)
        return user if user and user.is_active else None
    except Exception:
        return None
