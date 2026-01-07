"""
JWT Manager Unit Tests
Tests for JWT token creation and validation
"""
import pytest
from unittest.mock import patch, Mock
from datetime import datetime, timedelta
import jwt

from src.api.auth.jwt_manager import JWTManager


@pytest.fixture
def jwt_manager():
    """Create JWTManager with test configuration"""
    with patch.dict("os.environ", {
        "JWT_SECRET_KEY": "test_secret_key_for_testing_purposes_only",
        "JWT_ALGORITHM": "HS256",
    }):
        manager = JWTManager()
        manager.secret_key = "test_secret_key_for_testing_purposes_only"
        manager.algorithm = "HS256"
        manager.access_token_expire_minutes = 60 * 24 * 7  # 7 days
        manager.remember_me_expire_days = 30
        return manager


class TestCreateAccessToken:
    """Tests for access token creation"""

    def test_create_access_token_basic(self, jwt_manager):
        """Test creating basic access token"""
        data = {"sub": "1", "email": "test@example.com"}
        
        token = jwt_manager.create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
        
        # Decode and verify
        decoded = jwt.decode(
            token, 
            jwt_manager.secret_key, 
            algorithms=[jwt_manager.algorithm]
        )
        assert decoded["sub"] == "1"
        assert decoded["email"] == "test@example.com"
        assert "exp" in decoded

    def test_create_access_token_with_custom_expiry(self, jwt_manager):
        """Test creating access token with custom expiration"""
        data = {"sub": "1"}
        expires_delta = timedelta(hours=2)
        
        token = jwt_manager.create_access_token(data, expires_delta)
        
        decoded = jwt.decode(
            token,
            jwt_manager.secret_key,
            algorithms=[jwt_manager.algorithm]
        )
        
        # Verify expiration is roughly 2 hours from now
        exp_time = datetime.fromtimestamp(decoded["exp"])
        expected_exp = datetime.utcnow() + expires_delta
        assert abs((exp_time - expected_exp).total_seconds()) < 10


class TestCreateRememberMeToken:
    """Tests for remember me token creation"""

    def test_create_remember_me_token(self, jwt_manager):
        """Test creating remember me token with extended expiration"""
        data = {"sub": "1", "email": "test@example.com"}
        
        token = jwt_manager.create_remember_me_token(data)
        
        decoded = jwt.decode(
            token,
            jwt_manager.secret_key,
            algorithms=[jwt_manager.algorithm]
        )
        
        # Verify expiration is roughly 30 days from now
        exp_time = datetime.fromtimestamp(decoded["exp"])
        expected_exp = datetime.utcnow() + timedelta(days=30)
        # Allow 1 hour tolerance
        assert abs((exp_time - expected_exp).total_seconds()) < 3600


class TestDecodeToken:
    """Tests for token decoding"""

    def test_decode_valid_token(self, jwt_manager):
        """Test decoding a valid token"""
        data = {"sub": "1", "email": "test@example.com"}
        token = jwt_manager.create_access_token(data)
        
        decoded = jwt_manager.decode_token(token)
        
        assert decoded["sub"] == "1"
        assert decoded["email"] == "test@example.com"

    def test_decode_expired_token(self, jwt_manager):
        """Test decoding an expired token raises exception"""
        data = {"sub": "1"}
        # Create token that expired 1 hour ago
        expires_delta = timedelta(hours=-1)
        
        token = jwt_manager.create_access_token(data, expires_delta)
        
        with pytest.raises(Exception):
            jwt_manager.decode_token(token)

    def test_decode_invalid_token(self, jwt_manager):
        """Test decoding invalid token raises exception"""
        with pytest.raises(Exception):
            jwt_manager.decode_token("invalid_token_string")

    def test_decode_token_wrong_secret(self, jwt_manager):
        """Test decoding token with wrong secret raises exception"""
        data = {"sub": "1"}
        
        # Create token with different secret
        token = jwt.encode(
            {**data, "exp": datetime.utcnow() + timedelta(hours=1)},
            "wrong_secret",
            algorithm="HS256"
        )
        
        with pytest.raises(Exception):
            jwt_manager.decode_token(token)


class TestVerifyToken:
    """Tests for token verification"""

    def test_verify_valid_token(self, jwt_manager):
        """Test verifying a valid token returns True"""
        data = {"sub": "1"}
        token = jwt_manager.create_access_token(data)
        
        result = jwt_manager.verify_token(token)
        
        assert result is True

    def test_verify_invalid_token(self, jwt_manager):
        """Test verifying invalid token returns False"""
        result = jwt_manager.verify_token("invalid_token")
        
        assert result is False

    def test_verify_expired_token(self, jwt_manager):
        """Test verifying expired token returns False"""
        data = {"sub": "1"}
        expires_delta = timedelta(hours=-1)
        token = jwt_manager.create_access_token(data, expires_delta)
        
        result = jwt_manager.verify_token(token)
        
        assert result is False

