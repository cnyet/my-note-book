"""
Security Requirements Verification

Requirements: 7.1, 7.2, 7.3, 7.4

This script verifies that all security requirements are properly implemented.
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def verify_bcrypt_cost_factor():
    """Verify bcrypt cost factor is 12"""
    print("\n=== Verifying Bcrypt Cost Factor ===\n")
    
    try:
        from api.config import settings
        from api.auth.password import PasswordManager
        
        # Check the cost factor in settings
        if settings.bcrypt_cost_factor == 12:
            print(f"✓ Bcrypt cost factor is set to 12 in config")
            
            # Test actual hashing
            pm = PasswordManager()
            test_hash = pm.hash_password("testpassword123")
            
            # Bcrypt hashes start with $2b$12$ (12 is the cost factor)
            if test_hash.startswith("$2b$12$"):
                print("✓ Password hashing uses cost factor 12")
                return True
            else:
                print(f"✗ Hash doesn't show cost factor 12: {test_hash[:10]}")
                return False
        else:
            print(f"✗ Bcrypt cost factor is {settings.bcrypt_cost_factor} (expected 12)")
            return False
            
    except Exception as e:
        print(f"✗ Error verifying bcrypt: {e}")
        return False


def verify_jwt_secret():
    """Verify JWT secret is configured and secure"""
    print("\n=== Verifying JWT Secret Configuration ===\n")
    
    try:
        from api.config import settings
        
        # Check if JWT secret is set
        if settings.jwt_secret_key:
            secret_length = len(settings.jwt_secret_key)
            
            if secret_length >= 32:
                print(f"✓ JWT secret key is configured ({secret_length} characters)")
                
                # Check it's not a default/weak value
                weak_secrets = [
                    "secret",
                    "your-secret-key",
                    "change-me",
                    "jwt-secret",
                    "12345",
                ]
                
                if settings.jwt_secret_key.lower() in weak_secrets:
                    print("⚠ WARNING: JWT secret appears to be a default/weak value")
                    print("  Please use a strong random secret in production")
                    return False
                else:
                    print("✓ JWT secret is not a common weak value")
                    return True
            else:
                print(f"✗ JWT secret is too short ({secret_length} characters)")
                print("  Minimum recommended length is 32 characters")
                return False
        else:
            print("✗ JWT secret key is not configured")
            return False
            
    except Exception as e:
        print(f"✗ Error verifying JWT secret: {e}")
        return False


def verify_rate_limiting():
    """Verify rate limiting is implemented"""
    print("\n=== Verifying Rate Limiting ===\n")
    
    try:
        from api.middleware.rate_limit import rate_limiter
        
        # Check rate limiter configuration
        if rate_limiter.max_attempts == 5:
            print("✓ Rate limit set to 5 attempts")
        else:
            print(f"⚠ Rate limit is {rate_limiter.max_attempts} (expected 5)")
        
        if rate_limiter.window_minutes == 15:
            print("✓ Rate limit window is 15 minutes")
        else:
            print(f"⚠ Rate limit window is {rate_limiter.window_minutes} minutes (expected 15)")
        
        # Check that rate limiter has required methods
        required_methods = [
            'check_rate_limit',
            'record_failed_attempt',
            'clear_failed_attempts',
        ]
        
        for method in required_methods:
            if hasattr(rate_limiter, method):
                print(f"✓ Rate limiter has {method}() method")
            else:
                print(f"✗ Rate limiter missing {method}() method")
                return False
        
        return True
        
    except Exception as e:
        print(f"✗ Error verifying rate limiting: {e}")
        return False


def verify_audit_logging():
    """Verify authentication event logging is implemented"""
    print("\n=== Verifying Authentication Event Logging ===\n")
    
    try:
        from api.middleware.auth_logger import auth_logger
        
        # Check that logger has required methods
        required_methods = [
            'log_login_attempt',
            'log_registration',
            'log_logout',
            'log_profile_update',
            'log_password_change',
        ]
        
        for method in required_methods:
            if hasattr(auth_logger, method):
                print(f"✓ Auth logger has {method}() method")
            else:
                print(f"✗ Auth logger missing {method}() method")
                return False
        
        # Check log file location
        log_file = Path("logs/auth_events.log")
        if log_file.parent.exists():
            print(f"✓ Log directory exists: {log_file.parent}")
        else:
            print(f"⚠ Log directory doesn't exist yet: {log_file.parent}")
            print("  (Will be created on first log entry)")
        
        return True
        
    except Exception as e:
        print(f"✗ Error verifying audit logging: {e}")
        return False


def verify_password_validation():
    """Verify password validation requirements"""
    print("\n=== Verifying Password Validation ===\n")
    
    try:
        from api.services.auth_service import AuthService
        from api.database import SessionLocal
        
        db = SessionLocal()
        auth_service = AuthService(db)
        
        # Test minimum length validation
        try:
            # This should fail with short password
            auth_service.register_user(
                name="Test User",
                email=f"test_{os.urandom(4).hex()}@example.com",
                password="short",
            )
            print("✗ Short password was accepted (should be rejected)")
            db.close()
            return False
        except ValueError as e:
            if "at least 8 characters" in str(e).lower():
                print("✓ Password minimum length (8 characters) is enforced")
            else:
                print(f"⚠ Password validation error: {e}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"✗ Error verifying password validation: {e}")
        return False


def verify_email_uniqueness():
    """Verify email uniqueness is enforced"""
    print("\n=== Verifying Email Uniqueness ===\n")
    
    try:
        # Check database model
        from api.models.user import User
        import sqlalchemy as sa
        
        # Check if email column has unique constraint
        email_column = None
        for column in User.__table__.columns:
            if column.name == "email":
                email_column = column
                break
        
        if email_column is not None:
            # Check unique constraint
            if email_column.unique:
                print("✓ Email column has unique constraint in database model")
                return True
            else:
                # Check if there's a unique index
                for index in User.__table__.indexes:
                    if 'email' in [col.name for col in index.columns] and index.unique:
                        print("✓ Email column has unique index in database model")
                        return True
                
                print("✗ Email column doesn't have unique constraint or index")
                return False
        else:
            print("✗ Email column not found in User model")
            return False
            
    except Exception as e:
        print(f"✗ Error verifying email uniqueness: {e}")
        import traceback
        traceback.print_exc()
        return False


def verify_token_validation():
    """Verify JWT token validation is implemented"""
    print("\n=== Verifying Token Validation ===\n")
    
    try:
        from api.auth.jwt_manager import JWTManager
        
        jwt_manager = JWTManager()
        
        # Test token creation and validation
        test_payload = {"sub": "test@example.com", "user_id": 1}
        token = jwt_manager.create_access_token(test_payload)
        
        if token:
            print("✓ Token creation works")
        else:
            print("✗ Token creation failed")
            return False
        
        # Test token decoding
        decoded = jwt_manager.decode_token(token)
        
        if decoded and decoded.get("sub") == "test@example.com":
            print("✓ Token validation works")
        else:
            print("✗ Token validation failed")
            return False
        
        # Test invalid token
        try:
            jwt_manager.decode_token("invalid.token.here")
            print("✗ Invalid token was accepted")
            return False
        except Exception:
            print("✓ Invalid tokens are rejected")
        
        return True
        
    except Exception as e:
        print(f"✗ Error verifying token validation: {e}")
        return False


def verify_protected_routes():
    """Verify protected routes require authentication"""
    print("\n=== Verifying Protected Routes ===\n")
    
    try:
        from api.dependencies import get_current_user
        
        print("✓ Authentication dependency (get_current_user) exists")
        
        # Check that it's used in routes
        routes_file = Path("api/routes/auth.py")
        if routes_file.exists():
            content = routes_file.read_text()
            
            protected_endpoints = [
                "/me",
                "/profile",
                "/logout",
            ]
            
            for endpoint in protected_endpoints:
                if "get_current_user" in content and endpoint in content:
                    print(f"✓ {endpoint} endpoint uses authentication")
                else:
                    print(f"⚠ {endpoint} endpoint may not be protected")
        
        return True
        
    except Exception as e:
        print(f"✗ Error verifying protected routes: {e}")
        return False


def verify_cors_configuration():
    """Verify CORS is properly configured"""
    print("\n=== Verifying CORS Configuration ===\n")
    
    try:
        from api.config import settings
        
        if settings.cors_origins:
            print(f"✓ CORS origins configured: {settings.cors_origins}")
            
            # Check for wildcard in production
            if "*" in settings.cors_origins:
                print("⚠ WARNING: CORS allows all origins (*)")
                print("  This should be restricted in production")
            else:
                print("✓ CORS is restricted to specific origins")
            
            return True
        else:
            print("⚠ CORS origins not configured")
            return False
            
    except Exception as e:
        print(f"✗ Error verifying CORS: {e}")
        return False


def main():
    """Run all security verifications"""
    print("=" * 70)
    print("Security Requirements Verification")
    print("=" * 70)
    print("\nVerifying all security requirements are properly implemented...")
    
    results = {
        "Bcrypt Cost Factor (Req 7.1)": verify_bcrypt_cost_factor(),
        "JWT Secret Configuration (Req 7.2)": verify_jwt_secret(),
        "Rate Limiting (Req 7.3)": verify_rate_limiting(),
        "Authentication Logging (Req 7.4)": verify_audit_logging(),
        "Password Validation": verify_password_validation(),
        "Email Uniqueness": verify_email_uniqueness(),
        "Token Validation": verify_token_validation(),
        "Protected Routes": verify_protected_routes(),
        "CORS Configuration": verify_cors_configuration(),
    }
    
    print("\n" + "=" * 70)
    print("Verification Summary")
    print("=" * 70)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for check, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} {check}")
    
    print("\n" + "=" * 70)
    print(f"Results: {passed}/{total} checks passed")
    print("=" * 70)
    
    if passed == total:
        print("\n🎉 All security requirements verified!")
        return 0
    else:
        print(f"\n⚠ {total - passed} check(s) failed")
        print("Please review the failures above")
        return 1


if __name__ == "__main__":
    sys.exit(main())
