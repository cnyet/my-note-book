#!/usr/bin/env python3
"""
Test script for authentication functionality
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import SessionLocal
from api.services.auth_service import AuthService


def test_registration():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    db = SessionLocal()
    auth_service = AuthService(db)

    try:
        # Test successful registration
        user = auth_service.register_user(
            name="大洪",
            email="dahong@example.com",
            password="securepassword123",
        )
        print(f"✓ User registered successfully: {user.name} ({user.email})")

        # Test duplicate email
        try:
            auth_service.register_user(
                name="Another User",
                email="dahong@example.com",
                password="password123",
            )
            print("✗ Duplicate email should have been rejected")
        except ValueError as e:
            print(f"✓ Duplicate email rejected: {e}")

        # Test short password
        try:
            auth_service.register_user(
                name="Test User",
                email="test@example.com",
                password="short",
            )
            print("✗ Short password should have been rejected")
        except ValueError as e:
            print(f"✓ Short password rejected: {e}")

    finally:
        db.close()


def test_authentication():
    """Test user authentication"""
    print("\n=== Testing User Authentication ===")
    db = SessionLocal()
    auth_service = AuthService(db)

    try:
        # Test successful login
        user = auth_service.authenticate_user(
            email="dahong@example.com",
            password="securepassword123",
        )
        if user:
            print(f"✓ Login successful: {user.name}")
        else:
            print("✗ Login failed")

        # Test wrong password
        user = auth_service.authenticate_user(
            email="dahong@example.com",
            password="wrongpassword",
        )
        if user is None:
            print("✓ Wrong password rejected")
        else:
            print("✗ Wrong password should have been rejected")

        # Test non-existent user
        user = auth_service.authenticate_user(
            email="nonexistent@example.com",
            password="password123",
        )
        if user is None:
            print("✓ Non-existent user rejected")
        else:
            print("✗ Non-existent user should have been rejected")

    finally:
        db.close()


def test_token_creation():
    """Test JWT token creation"""
    print("\n=== Testing JWT Token Creation ===")
    db = SessionLocal()
    auth_service = AuthService(db)

    try:
        # Get user
        user = auth_service.authenticate_user(
            email="dahong@example.com",
            password="securepassword123",
        )

        if user:
            # Create regular token
            token = auth_service.create_token_for_user(user)
            print(f"✓ Regular token created: {token[:50]}...")

            # Create remember me token
            remember_token = auth_service.create_token_for_user(user, remember_me=True)
            print(f"✓ Remember me token created: {remember_token[:50]}...")

            # Verify token
            verified_user = auth_service.get_current_user(token)
            if verified_user and verified_user.id == user.id:
                print(f"✓ Token verified successfully: {verified_user.name}")
            else:
                print("✗ Token verification failed")

    finally:
        db.close()


def main():
    """Run all tests"""
    print("=" * 60)
    print("Authentication System Test")
    print("=" * 60)

    test_registration()
    test_authentication()
    test_token_creation()

    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
