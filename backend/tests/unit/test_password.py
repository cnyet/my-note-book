"""
Password Manager Unit Tests
Tests for password hashing and verification
"""
import pytest

from src.api.auth.password import PasswordManager, password_manager


@pytest.fixture
def pm():
    """Create PasswordManager instance"""
    return PasswordManager()


class TestPasswordHashing:
    """Tests for password hashing"""

    def test_hash_password_returns_string(self, pm):
        """Test hash_password returns a string"""
        result = pm.hash_password("testpassword123")
        
        assert isinstance(result, str)
        assert len(result) > 0

    def test_hash_password_is_different_from_input(self, pm):
        """Test hashed password is different from plain text"""
        password = "testpassword123"
        hashed = pm.hash_password(password)
        
        assert hashed != password

    def test_hash_password_is_unique(self, pm):
        """Test same password produces different hashes (salt)"""
        password = "testpassword123"
        hash1 = pm.hash_password(password)
        hash2 = pm.hash_password(password)
        
        # bcrypt adds random salt, so hashes should differ
        assert hash1 != hash2

    def test_hash_password_empty_string(self, pm):
        """Test hashing empty password"""
        result = pm.hash_password("")
        
        assert isinstance(result, str)
        assert len(result) > 0


class TestPasswordVerification:
    """Tests for password verification"""

    def test_verify_correct_password(self, pm):
        """Test verification succeeds with correct password"""
        password = "testpassword123"
        hashed = pm.hash_password(password)
        
        result = pm.verify_password(password, hashed)
        
        assert result is True

    def test_verify_wrong_password(self, pm):
        """Test verification fails with wrong password"""
        password = "testpassword123"
        hashed = pm.hash_password(password)
        
        result = pm.verify_password("wrongpassword", hashed)
        
        assert result is False

    def test_verify_similar_password(self, pm):
        """Test verification fails with similar but different password"""
        password = "testpassword123"
        hashed = pm.hash_password(password)
        
        # Test with slight variations
        assert pm.verify_password("testpassword124", hashed) is False
        assert pm.verify_password("Testpassword123", hashed) is False
        assert pm.verify_password("testpassword123 ", hashed) is False

    def test_verify_empty_password(self, pm):
        """Test verification with empty password"""
        hashed = pm.hash_password("testpassword123")
        
        result = pm.verify_password("", hashed)
        
        assert result is False

    def test_verify_unicode_password(self, pm):
        """Test verification with unicode characters"""
        password = "密码测试123"
        hashed = pm.hash_password(password)
        
        assert pm.verify_password(password, hashed) is True
        assert pm.verify_password("密码测试124", hashed) is False


class TestPasswordStrength:
    """Tests for password strength validation"""

    def test_is_password_strong_valid(self, pm):
        """Test strong password validation"""
        # Minimum 8 characters
        assert pm.is_password_strong("password") is True
        assert pm.is_password_strong("12345678") is True
        assert pm.is_password_strong("Pass@123") is True

    def test_is_password_strong_too_short(self, pm):
        """Test weak password (too short) validation"""
        assert pm.is_password_strong("short") is False
        assert pm.is_password_strong("1234567") is False
        assert pm.is_password_strong("") is False

    def test_is_password_strong_edge_cases(self, pm):
        """Test password strength edge cases"""
        # Exactly 8 characters
        assert pm.is_password_strong("12345678") is True
        # 7 characters
        assert pm.is_password_strong("1234567") is False


class TestGlobalPasswordManager:
    """Tests for global password_manager instance"""

    def test_global_instance_exists(self):
        """Test global password_manager is available"""
        assert password_manager is not None
        assert isinstance(password_manager, PasswordManager)

    def test_global_instance_works(self):
        """Test global password_manager functions correctly"""
        password = "testpassword"
        hashed = password_manager.hash_password(password)
        
        assert password_manager.verify_password(password, hashed) is True

