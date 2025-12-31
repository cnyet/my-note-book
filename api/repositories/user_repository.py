"""
User repository for database operations
"""
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from api.models.user import User


class UserRepository:
    """
    Data access layer for User operations
    """

    def __init__(self, db: Session):
        """
        Initialize repository with database session

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def create_user(self, user_data: Dict[str, Any]) -> User:
        """
        Create a new user in the database

        Args:
            user_data: Dictionary containing user fields
                      (name, email, password_hash)

        Returns:
            Created User object

        Raises:
            IntegrityError: If email already exists

        Requirements: 10.1, 10.2
        """
        user = User(**user_data)
        self.db.add(user)
        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Find a user by email address

        Args:
            email: User's email address

        Returns:
            User object if found, None otherwise

        Requirements: 10.2, 10.3
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Find a user by ID

        Args:
            user_id: User's ID

        Returns:
            User object if found, None otherwise

        Requirements: 10.2
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def update_user(self, user_id: int, updates: Dict[str, Any]) -> Optional[User]:
        """
        Update user information

        Args:
            user_id: User's ID
            updates: Dictionary of fields to update

        Returns:
            Updated User object if found, None otherwise

        Raises:
            IntegrityError: If email update conflicts with existing user

        Requirements: 10.1, 10.2
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return None

        for key, value in updates.items():
            if hasattr(user, key):
                setattr(user, key, value)

        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise
