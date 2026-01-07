"""
Authentication Service Unit Tests
Tests for user registration, login, and token management
"""
import pytest
from unittest.mock import Mock, MagicMock, patch
from sqlalchemy.exc import IntegrityError

from src.api.services.auth_service import AuthService
from src.api.models.user import User


@pytest.fixture
def mock_db():
    """Create mock database session"""
    return Mock()


@pytest.fixture
def auth_service(mock_db):
    """Create AuthService with mocked dependencies"""
    with patch("src.api.services.auth_service.UserRepository") as MockRepo:
        mock_repo = Mock()
        MockRepo.return_value = mock_repo
        service = AuthService(mock_db)
        service.user_repo = mock_repo
        yield service


@pytest.fixture
def sample_user():
    """Create sample user for testing"""
    user = Mock(spec=User)
    user.id = 1
    user.name = "Test User"
    user.email = "test@example.com"
    user.password_hash = "hashed_password"
    user.is_active = True
    return user


class TestRegisterUser:
    """Tests for user registration"""

    def test_register_user_success(self, auth_service, sample_user):
        """Test successful user registration"""
        auth_service.user_repo.get_user_by_email.return_value = None
        auth_service.user_repo.create_user.return_value = sample_user

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.hash_password.return_value = "hashed_password"
            
            result = auth_service.register_user(
                name="Test User",
                email="test@example.com",
                password="password123"
            )

        assert result == sample_user
        auth_service.user_repo.create_user.assert_called_once()

    def test_register_user_password_too_short(self, auth_service):
        """Test registration fails with short password"""
        with pytest.raises(ValueError) as exc_info:
            auth_service.register_user(
                name="Test User",
                email="test@example.com",
                password="short"
            )
        
        assert "at least 8 characters" in str(exc_info.value)

    def test_register_user_email_exists(self, auth_service, sample_user):
        """Test registration fails when email already exists"""
        auth_service.user_repo.get_user_by_email.return_value = sample_user

        with pytest.raises(ValueError) as exc_info:
            auth_service.register_user(
                name="Test User",
                email="test@example.com",
                password="password123"
            )
        
        assert "already registered" in str(exc_info.value)

    def test_register_user_integrity_error(self, auth_service):
        """Test registration handles database integrity error"""
        auth_service.user_repo.get_user_by_email.return_value = None
        auth_service.user_repo.create_user.side_effect = IntegrityError(
            "duplicate", {}, None
        )

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.hash_password.return_value = "hashed_password"
            
            with pytest.raises(ValueError) as exc_info:
                auth_service.register_user(
                    name="Test User",
                    email="test@example.com",
                    password="password123"
                )
        
        assert "already registered" in str(exc_info.value)


class TestAuthenticateUser:
    """Tests for user authentication"""

    def test_authenticate_user_success(self, auth_service, sample_user):
        """Test successful authentication"""
        auth_service.user_repo.get_user_by_email.return_value = sample_user

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.verify_password.return_value = True
            
            result = auth_service.authenticate_user(
                email="test@example.com",
                password="password123"
            )

        assert result == sample_user

    def test_authenticate_user_not_found(self, auth_service):
        """Test authentication fails when user not found"""
        auth_service.user_repo.get_user_by_email.return_value = None

        result = auth_service.authenticate_user(
            email="nonexistent@example.com",
            password="password123"
        )

        assert result is None

    def test_authenticate_user_wrong_password(self, auth_service, sample_user):
        """Test authentication fails with wrong password"""
        auth_service.user_repo.get_user_by_email.return_value = sample_user

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.verify_password.return_value = False
            
            result = auth_service.authenticate_user(
                email="test@example.com",
                password="wrongpassword"
            )

        assert result is None

    def test_authenticate_inactive_user(self, auth_service, sample_user):
        """Test authentication fails for inactive user"""
        sample_user.is_active = False
        auth_service.user_repo.get_user_by_email.return_value = sample_user

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.verify_password.return_value = True
            
            result = auth_service.authenticate_user(
                email="test@example.com",
                password="password123"
            )

        assert result is None


class TestGetCurrentUser:
    """Tests for getting current user from token"""

    def test_get_current_user_success(self, auth_service, sample_user):
        """Test getting current user from valid token"""
        auth_service.user_repo.get_user_by_id.return_value = sample_user

        with patch("src.api.services.auth_service.jwt_manager") as mock_jwt:
            mock_jwt.decode_token.return_value = {"sub": "1", "email": "test@example.com"}
            
            result = auth_service.get_current_user("valid_token")

        assert result == sample_user

    def test_get_current_user_invalid_token(self, auth_service):
        """Test getting current user with invalid token"""
        with patch("src.api.services.auth_service.jwt_manager") as mock_jwt:
            mock_jwt.decode_token.side_effect = Exception("Invalid token")
            
            result = auth_service.get_current_user("invalid_token")

        assert result is None

    def test_get_current_user_no_sub_in_payload(self, auth_service):
        """Test getting current user when token has no sub claim"""
        with patch("src.api.services.auth_service.jwt_manager") as mock_jwt:
            mock_jwt.decode_token.return_value = {"email": "test@example.com"}
            
            result = auth_service.get_current_user("token_without_sub")

        assert result is None


class TestUpdateUserProfile:
    """Tests for updating user profile"""

    def test_update_profile_success(self, auth_service, sample_user):
        """Test successful profile update"""
        auth_service.user_repo.get_user_by_email.return_value = None
        auth_service.user_repo.update_user.return_value = sample_user

        result = auth_service.update_user_profile(1, {"name": "New Name"})

        assert result == sample_user
        auth_service.user_repo.update_user.assert_called_once_with(
            1, {"name": "New Name"}
        )

    def test_update_profile_email_exists(self, auth_service, sample_user):
        """Test update fails when new email already exists"""
        other_user = Mock(spec=User)
        other_user.id = 2
        auth_service.user_repo.get_user_by_email.return_value = other_user

        with pytest.raises(ValueError) as exc_info:
            auth_service.update_user_profile(1, {"email": "existing@example.com"})
        
        assert "already exists" in str(exc_info.value)

    def test_update_profile_password_too_short(self, auth_service):
        """Test update fails with short password"""
        auth_service.user_repo.get_user_by_email.return_value = None

        with pytest.raises(ValueError) as exc_info:
            auth_service.update_user_profile(1, {"password": "short"})
        
        assert "at least 8 characters" in str(exc_info.value)

    def test_update_profile_password_hashed(self, auth_service, sample_user):
        """Test password is hashed when updating"""
        auth_service.user_repo.get_user_by_email.return_value = None
        auth_service.user_repo.update_user.return_value = sample_user

        with patch("src.api.services.auth_service.password_manager") as mock_pm:
            mock_pm.hash_password.return_value = "new_hashed_password"
            
            auth_service.update_user_profile(1, {"password": "newpassword123"})

        # Verify password was hashed and password_hash was set
        call_args = auth_service.user_repo.update_user.call_args[0]
        assert "password_hash" in call_args[1]
        assert "password" not in call_args[1]


class TestCreateTokenForUser:
    """Tests for token creation"""

    def test_create_token_normal(self, auth_service, sample_user):
        """Test creating normal access token"""
        with patch("src.api.services.auth_service.jwt_manager") as mock_jwt:
            mock_jwt.create_access_token.return_value = "access_token"
            
            result = auth_service.create_token_for_user(sample_user)

        assert result == "access_token"
        mock_jwt.create_access_token.assert_called_once()

    def test_create_token_remember_me(self, auth_service, sample_user):
        """Test creating remember me token with extended expiration"""
        with patch("src.api.services.auth_service.jwt_manager") as mock_jwt:
            mock_jwt.create_remember_me_token.return_value = "remember_me_token"
            
            result = auth_service.create_token_for_user(sample_user, remember_me=True)

        assert result == "remember_me_token"
        mock_jwt.create_remember_me_token.assert_called_once()

