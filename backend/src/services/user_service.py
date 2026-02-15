# backend/src/services/user_service.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import User
from ..core.security import verify_password, hash_password # Adjusted import names to match what I saw or standard.

async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    result = await db.execute(select(User).filter(User.username == username))
    return result.scalars().first()

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()

async def authenticate_user(db: AsyncSession, username: str, password: str) -> Optional[User]:
    user = await get_user_by_username(db, username)
    if not user:
        return None
    # User model uses hashed_password, verify_password is in security.py
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def create_user(db: AsyncSession, username: str, email: str, password: str) -> User:
    hashed_pw = hash_password(password)
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_pw
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def create_first_admin(db: AsyncSession, username: str, email: str, password: str) -> User:
    """Create first admin user if not exists"""
    existing = await get_user_by_username(db, username)
    if existing:
        return existing
    return await create_user(db, username, email, password)
