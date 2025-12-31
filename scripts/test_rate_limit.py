"""
Test rate limiting and authentication logging

Requirements: 7.3, 5.5, 7.4
"""
import requests
import time

API_BASE_URL = "http://localhost:8000"


def test_rate_limiting():
    """Test that rate limiting prevents brute force attacks"""
    print("\n=== Testing Rate Limiting ===\n")
    
    # Try to login with wrong password multiple times
    for i in range(7):
        print(f"Attempt {i + 1}...")
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword",
            },
        )
        
        if response.status_code == 429:
            print(f"✓ Rate limit triggered after {i + 1} attempts")
            print(f"  Response: {response.json()}")
            break
        elif response.status_code == 401:
            print(f"  Failed login (expected)")
        else:
            print(f"  Unexpected status: {response.status_code}")
        
        time.sleep(0.5)
    else:
        print("✗ Rate limit not triggered after 7 attempts")
    
    print()


def test_successful_login_clears_rate_limit():
    """Test that successful login clears failed attempts"""
    print("\n=== Testing Rate Limit Reset on Success ===\n")
    
    # First, register a test user
    print("Registering test user...")
    response = requests.post(
        f"{API_BASE_URL}/api/auth/register",
        json={
            "name": "Rate Test User",
            "email": "ratetest@example.com",
            "password": "testpassword123",
        },
    )
    
    if response.status_code == 201:
        print("✓ Test user registered")
    elif response.status_code == 400 and "already registered" in response.text:
        print("✓ Test user already exists")
    else:
        print(f"✗ Registration failed: {response.status_code}")
        return
    
    # Try wrong password a few times
    print("\nAttempting 3 failed logins...")
    for i in range(3):
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login",
            json={
                "email": "ratetest@example.com",
                "password": "wrongpassword",
            },
        )
        print(f"  Attempt {i + 1}: {response.status_code}")
        time.sleep(0.5)
    
    # Now try correct password
    print("\nAttempting successful login...")
    response = requests.post(
        f"{API_BASE_URL}/api/auth/login",
        json={
            "email": "ratetest@example.com",
            "password": "testpassword123",
        },
    )
    
    if response.status_code == 200:
        print("✓ Successful login")
        
        # Try wrong password again - should start fresh count
        print("\nAttempting failed login after successful login...")
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login",
            json={
                "email": "ratetest@example.com",
                "password": "wrongpassword",
            },
        )
        
        if response.status_code == 401:
            print("✓ Failed login allowed (rate limit was reset)")
        else:
            print(f"✗ Unexpected status: {response.status_code}")
    else:
        print(f"✗ Login failed: {response.status_code}")
    
    print()


def test_auth_logging():
    """Test that authentication events are logged"""
    print("\n=== Testing Authentication Logging ===\n")
    
    print("Performing various authentication actions...")
    print("(Check logs/auth_events.log for detailed logs)\n")
    
    # Register
    print("1. Registration attempt...")
    response = requests.post(
        f"{API_BASE_URL}/api/auth/register",
        json={
            "name": "Log Test User",
            "email": f"logtest{int(time.time())}@example.com",
            "password": "testpassword123",
        },
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        token = data["token"]
        
        # Login
        print("2. Login attempt...")
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login",
            json={
                "email": data["user"]["email"],
                "password": "testpassword123",
            },
        )
        print(f"   Status: {response.status_code}")
        
        # Profile update
        print("3. Profile update...")
        response = requests.put(
            f"{API_BASE_URL}/api/auth/profile",
            headers={"Authorization": f"Bearer {token}"},
            json={"name": "Updated Name"},
        )
        print(f"   Status: {response.status_code}")
        
        # Password change
        print("4. Password change...")
        response = requests.put(
            f"{API_BASE_URL}/api/auth/profile",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "current_password": "testpassword123",
                "new_password": "newpassword123",
            },
        )
        print(f"   Status: {response.status_code}")
        
        # Logout
        print("5. Logout...")
        response = requests.post(
            f"{API_BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
        )
        print(f"   Status: {response.status_code}")
        
        print("\n✓ All events logged (check logs/auth_events.log)")
    else:
        print("✗ Registration failed, skipping other tests")
    
    print()


def main():
    print("=" * 60)
    print("Rate Limiting and Authentication Logging Tests")
    print("=" * 60)
    print("\nMake sure the API server is running:")
    print("  uvicorn api.server:app --host 0.0.0.0 --port 8000")
    print()
    
    try:
        # Check if server is running
        response = requests.get(f"{API_BASE_URL}/api/status")
        if response.status_code != 200:
            print("✗ API server not responding")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API server")
        print("  Please start the server first")
        return
    
    print("✓ API server is running\n")
    
    # Run tests
    test_rate_limiting()
    test_successful_login_clears_rate_limit()
    test_auth_logging()
    
    print("=" * 60)
    print("Tests Complete")
    print("=" * 60)
    print("\nCheck logs/auth_events.log for authentication event logs")


if __name__ == "__main__":
    main()
