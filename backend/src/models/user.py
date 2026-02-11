"""
User ORM model for authentication and authorization.

Defines the User table structure and relationships.
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration for RBAC."""

    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class User(Base):
    """
    User model for authentication and authorization.

    Attributes:
        id: Primary key
        username: Unique username
        email: Unique email address
        password_hash: Bcrypt hashed password
        role: User role (admin/editor/viewer)
        is_active: Whether the account is active
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20),
        default=UserRole.ADMIN,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        """Return string representation of the user."""
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"

    def has_permission(self, required_role: UserRole) -> bool:
        """
        Check if user has the required role or higher.

        Role hierarchy: admin > editor > viewer

        Args:
            required_role: The minimum required role

        Returns:
            True if user has sufficient permissions
        """
        role_hierarchy = {
            UserRole.VIEWER: 1,
            UserRole.EDITOR: 2,
            UserRole.ADMIN: 3,
        }

        user_level = role_hierarchy.get(UserRole(self.role), 0)
        required_level = role_hierarchy.get(required_role, 0)

        return user_level >= required_level


__all__ = ["User", "UserRole"]
