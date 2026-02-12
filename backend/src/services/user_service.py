# backend/src/services/user_service.py
from typing import Optional
from sqlalchemy.orm import Session
from ..models import User
from ..core.security import verify_password, get_password_hash

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_user(db: Session, username: str, email: str, password: str) -> User:
    from ..core.security import hash_password
    password_hash = hash_password(password)
    db_user = User(
        username=username,
        email=email,
        hashed_password=password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_first_admin(db: Session, username: str, email: str, password: str) -> User:
    """Create first admin user if not exists"""
    existing = get_user_by_username(db, username)
    if existing:
        return existing
    return create_user(db, username, email, password)
