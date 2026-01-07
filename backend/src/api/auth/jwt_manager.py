"""
JWT token generation and validation
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from api.config import settings


class JWTManager:
    """
    Handles JWT token creation and validation
    """

    def __init__(self):
        """Initialize JWT manager with settings"""
        self.secret_key = settings.jwt_secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.jwt_access_token_expire_minutes
        self.remember_me_expire_minutes = settings.jwt_remember_me_expire_minutes

    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token

        Args:
            data: Dictionary of data to encode in the token
            expires_delta: Optional custom expiration time

        Returns:
            Encoded JWT token string

        Requirements: 2.1, 2.4, 3.4
        """
        to_encode = data.copy()

        # Set expiration time
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=self.access_token_expire_minutes
            )

        to_encode.update({"exp": expire})

        # Encode the token
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_remember_me_token(self, data: Dict[str, Any]) -> str:
        """
        Create a JWT token with extended expiration for "remember me"

        Args:
            data: Dictionary of data to encode in the token

        Returns:
            Encoded JWT token string with extended expiration

        Requirements: 3.4
        """
        expires_delta = timedelta(minutes=self.remember_me_expire_minutes)
        return self.create_access_token(data, expires_delta)

    def decode_token(self, token: str) -> Dict[str, Any]:
        """
        Decode and validate a JWT token

        Args:
            token: JWT token string to decode

        Returns:
            Dictionary of decoded token data

        Raises:
            JWTError: If token is invalid, expired, or tampered with

        Requirements: 3.5
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError as e:
            raise JWTError(f"Invalid token: {str(e)}")

    def verify_token(self, token: str) -> bool:
        """
        Verify if a token is valid

        Args:
            token: JWT token string to verify

        Returns:
            True if token is valid, False otherwise
        """
        try:
            self.decode_token(token)
            return True
        except Exception:
            return False


# Create global instance
jwt_manager = JWTManager()
