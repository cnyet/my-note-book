"""
Password hashing and verification using bcrypt
"""
import bcrypt
from api.config import settings


class PasswordManager:
    """
    Handles password hashing and verification using bcrypt
    """

    def __init__(self):
        """Initialize password manager with cost factor"""
        self.cost_factor = settings.bcrypt_cost_factor

    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt

        Args:
            password: Plain text password to hash

        Returns:
            Hashed password string

        Requirements: 1.5, 2.5, 7.1
        """
        # Convert password to bytes
        password_bytes = password.encode('utf-8')
        
        # Generate salt and hash
        salt = bcrypt.gensalt(rounds=self.cost_factor)
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Return as string
        return hashed.decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash

        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against

        Returns:
            True if password matches, False otherwise

        Requirements: 2.5
        """
        # Convert to bytes
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        
        # Verify
        return bcrypt.checkpw(password_bytes, hashed_bytes)


# Create global instance
password_manager = PasswordManager()
