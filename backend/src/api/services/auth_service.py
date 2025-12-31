"""
Authentication service - business logic for user authentication
"""
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from api.models.user import User
from api.repositories.user_repository import UserRepository
from api.auth.password import password_manager
from api.auth.jwt_manager import jwt_manager


class AuthService:
    """
    Handles user authentication business logic
    """

    def __init__(self, db: Session):
        """
        Initialize auth service with database session

        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, name: str, email: str, password: str) -> User:
        """
        Register a new user

        Args:
            name: User's full name
            email: User's email address
            password: Plain text password (will be hashed)

        Returns:
            Created User object

        Raises:
            ValueError: If email already exists or password is too short
            IntegrityError: If database constraint is violated

        Requirements: 1.1, 1.2, 1.3, 1.5
        """
        # Validate password length
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")

        # Check if email already exists
        existing_user = self.user_repo.get_user_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        # Hash password
        password_hash = password_manager.hash_password(password)

        # Create user
        user_data = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
        }

        try:
            user = self.user_repo.create_user(user_data)
            return user
        except IntegrityError:
            raise ValueError("Email already registered")

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password

        Args:
            email: User's email address
            password: Plain text password

        Returns:
            User object if authentication successful, None otherwise

        Requirements: 2.1, 2.2, 2.5
        """
        # Find user by email
        user = self.user_repo.get_user_by_email(email)
        if not user:
            return None

        # Verify password
        if not password_manager.verify_password(password, user.password_hash):
            return None

        # Check if user is active
        if not user.is_active:
            return None

        return user

    def get_current_user(self, token: str) -> Optional[User]:
        """
        Get current user from JWT token

        Args:
            token: JWT token string

        Returns:
            User object if token is valid, None otherwise

        Requirements: 5.1
        """
        try:
            # Decode token
            payload = jwt_manager.decode_token(token)

            # Extract user ID from payload
            user_id = payload.get("sub")
            if user_id is None:
                return None

            # Get user from database
            user = self.user_repo.get_user_by_id(int(user_id))
            return user

        except Exception:
            return None

    def update_user_profile(
        self, user_id: int, updates: Dict[str, Any]
    ) -> Optional[User]:
        """
        Update user profile information

        Args:
            user_id: User's ID
            updates: Dictionary of fields to update
                    Can include: name, email, password_hash

        Returns:
            Updated User object if successful, None if user not found

        Raises:
            ValueError: If email already exists or validation fails
            IntegrityError: If database constraint is violated

        Requirements: 5.2, 5.3, 5.4
        """
        # If updating email, check if it already exists
        if "email" in updates:
            existing_user = self.user_repo.get_user_by_email(updates["email"])
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already exists")

        # If updating password, hash it first
        if "password" in updates:
            if len(updates["password"]) < 8:
                raise ValueError("Password must be at least 8 characters")
            updates["password_hash"] = password_manager.hash_password(
                updates["password"]
            )
            del updates["password"]

        try:
            user = self.user_repo.update_user(user_id, updates)
            return user
        except IntegrityError:
            raise ValueError("Email already exists")

    def create_token_for_user(self, user: User, remember_me: bool = False) -> str:
        """
        Create JWT token for a user

        Args:
            user: User object
            remember_me: If True, create token with extended expiration

        Returns:
            JWT token string

        Requirements: 1.4, 2.1, 2.4, 3.4
        """
        token_data = {"sub": str(user.id), "email": user.email}

        if remember_me:
            token = jwt_manager.create_remember_me_token(token_data)
        else:
            token = jwt_manager.create_access_token(token_data)

        return token
