#!/usr/bin/env python3
"""
Test script for authentication API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_register():
    """Test user registration endpoint"""
    print("\n=== Testing POST /api/auth/register ===")

    # Test successful registration
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={
            "name": "测试用户",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    if response.status_code == 201:
        data = response.json()
        print(f"✓ Registration successful")
        print(f"  User: {data['user']['name']} ({data['user']['email']})")
        print(f"  Token: {data['token'][:50]}...")
        return data["token"]
    else:
        print(f"✗ Registration failed: {response.status_code}")
        print(f"  {response.json()}")
        return None


def test_login():
    """Test user login endpoint"""
    print("\n=== Testing POST /api/auth/login ===")

    # Test successful login
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "remember_me": False,
        },
    )

    if response.status_code == 200:
        data = response.json()
        print(f"✓ Login successful")
        print(f"  User: {data['user']['name']}")
        print(f"  Token: {data['token'][:50]}...")
        return data["token"]
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(f"  {response.json()}")
        return None

    # Test wrong password
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )

    if response.status_code == 401:
        print("✓ Wrong password rejected")
    else:
        print(f"✗ Wrong password should be rejected: {response.status_code}")


def test_get_me(token):
    """Test get current user endpoint"""
    print("\n=== Testing GET /api/auth/me ===")

    # Test with valid token
    response = requests.get(
        f"{BASE_URL}/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    if response.status_code == 200:
        data = response.json()
        print(f"✓ Get current user successful")
        print(f"  User: {data['name']} ({data['email']})")
    else:
        print(f"✗ Get current user failed: {response.status_code}")
        print(f"  {response.json()}")

    # Test without token
    response = requests.get(f"{BASE_URL}/api/auth/me")

    if response.status_code == 403:
        print("✓ Request without token rejected")
    else:
        print(f"✗ Request without token should be rejected: {response.status_code}")


def test_update_profile(token):
    """Test update profile endpoint"""
    print("\n=== Testing PUT /api/auth/profile ===")

    # Test update name
    response = requests.put(
        f"{BASE_URL}/api/auth/profile",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "更新后的用户名"},
    )

    if response.status_code == 200:
        data = response.json()
        print(f"✓ Profile update successful")
        print(f"  New name: {data['name']}")
    else:
        print(f"✗ Profile update failed: {response.status_code}")
        print(f"  {response.json()}")


def test_logout():
    """Test logout endpoint"""
    print("\n=== Testing POST /api/auth/logout ===")

    response = requests.post(f"{BASE_URL}/api/auth/logout")

    if response.status_code == 200:
        data = response.json()
        print(f"✓ Logout successful: {data['message']}")
    else:
        print(f"✗ Logout failed: {response.status_code}")


def main():
    """Run all API endpoint tests"""
    print("=" * 60)
    print("Authentication API Endpoints Test")
    print("=" * 60)
    print("\nMake sure the API server is running:")
    print("  python3 api/server.py")
    print("\nOr:")
    print("  uvicorn api.server:app --reload")
    print("=" * 60)

    try:
        # Test if server is running
        response = requests.get(f"{BASE_URL}/api/status")
        if response.status_code != 200:
            print("\n❌ API server is not responding!")
            return
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to API server!")
        print("Please start the server first.")
        return

    # Run tests
    token = test_register()
    if token:
        test_get_me(token)
        test_update_profile(token)

    token = test_login()
    if token:
        test_get_me(token)

    test_logout()

    print("\n" + "=" * 60)
    print("All API tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
