# Design Document - Web Authentication System

## Overview

本设计文档描述AI Life Assistant Web应用的认证系统架构。系统采用JWT（JSON Web Token）进行无状态认证，使用bcrypt进行密码哈希，通过FastAPI后端和Next.js前端实现完整的用户认证流程。

### 核心目标
- 提供安全的用户认证机制
- 支持会话持久化和自动续期
- 保护敏感路由和API端点
- 提供良好的用户体验

### 技术选型
- **后端**: FastAPI + SQLAlchemy + Alembic
- **前端**: Next.js 16 + React 19 + TypeScript
- **认证**: JWT (python-jose)
- **密码哈希**: bcrypt (passlib)
- **数据库**: SQLite (dev) / PostgreSQL (prod)

## Architecture

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (localhost:3000)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Login Page │  │ Register   │  │ Protected  │    │  │
│  │  │            │  │ Page       │  │ Routes     │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │         │              │                │            │  │
│  │         └──────────────┴────────────────┘            │  │
│  │                        │                              │  │
│  │                  AuthContext                          │  │
│  │              (JWT Token Storage)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                    HTTP/HTTPS (API Calls)
                             │
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (localhost:8000)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware                           │  │
│  │  (JWT Token Validation)                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ /auth/     │  │ /auth/     │  │ /auth/me   │    │  │
│  │  │ register   │  │ login      │  │            │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Service Layer                                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Auth       │  │ Password   │  │ JWT        │    │  │
│  │  │ Service    │  │ Hasher     │  │ Manager    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Access Layer (SQLAlchemy)                      │  │
│  │  ┌────────────┐  ┌────────────┐                     │  │
│  │  │ User       │  │ Session    │                     │  │
│  │  │ Repository │  │ Repository │                     │  │
│  │  └────────────┘  └────────────┘                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database (SQLite/PostgreSQL)                        │  │
│  │  ┌────────────┐  ┌────────────┐                     │  │
│  │  │ users      │  │ sessions   │                     │  │
│  │  │ table      │  │ table      │                     │  │
│  │  └────────────┘  └────────────┘                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 认证流程

#### 注册流程
```
User → Register Form → POST /api/auth/register
  → Validate Input
  → Check Email Uniqueness
  → Hash Password (bcrypt)
  → Create User Record
  → Generate JWT Token
  → Return Token + User Info
  → Store Token in Browser
  → Redirect to Dashboard
```

#### 登录流程
```
User → Login Form → POST /api/auth/login
  → Validate Credentials
  → Verify Password Hash
  → Generate JWT Token
  → Return Token + User Info
  → Store Token in Browser
  → Redirect to Dashboard (or original destination)
```

#### 受保护路由访问流程
```
User → Access Protected Route
  → Check JWT Token in Storage
  → If No Token → Redirect to Login
  → If Token Exists → Validate Token
  → If Valid → Allow Access
  → If Invalid/Expired → Clear Token → Redirect to Login
```

## Components and Interfaces

### Backend Components

#### 1. Authentication Service
```python
class AuthService:
    """处理用户认证逻辑"""
    
    def register_user(
        self, 
        name: str, 
        email: str, 
        password: str
    ) -> User:
        """注册新用户"""
        
    def authenticate_user(
        self, 
        email: str, 
        password: str
    ) -> Optional[User]:
        """验证用户凭证"""
        
    def get_current_user(
        self, 
        token: str
    ) -> Optional[User]:
        """从JWT token获取当前用户"""
        
    def update_user_profile(
        self, 
        user_id: int, 
        updates: dict
    ) -> User:
        """更新用户资料"""
```

#### 2. Password Manager
```python
class PasswordManager:
    """处理密码哈希和验证"""
    
    def hash_password(self, password: str) -> str:
        """使用bcrypt哈希密码"""
        
    def verify_password(
        self, 
        plain_password: str, 
        hashed_password: str
    ) -> bool:
        """验证密码"""
```

#### 3. JWT Manager
```python
class JWTManager:
    """处理JWT token生成和验证"""
    
    def create_access_token(
        self, 
        data: dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """创建JWT access token"""
        
    def decode_token(self, token: str) -> dict:
        """解码并验证JWT token"""
```

#### 4. User Repository
```python
class UserRepository:
    """数据访问层 - 用户操作"""
    
    def create_user(self, user_data: dict) -> User:
        """创建新用户"""
        
    def get_user_by_email(self, email: str) -> Optional[User]:
        """通过邮箱查找用户"""
        
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """通过ID查找用户"""
        
    def update_user(self, user_id: int, updates: dict) -> User:
        """更新用户信息"""
```

### Frontend Components

#### 1. AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// React Context for global auth state
const AuthContext = createContext<AuthContextType>(undefined);
```

#### 2. ProtectedRoute Component
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check authentication status
  // Redirect to login if not authenticated
  // Render children if authenticated
}
```

#### 3. Login Form Component
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  // Handle form submission
  // Call login API
  // Handle errors
  // Redirect on success
}
```

#### 4. Register Form Component
```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  // Handle form submission
  // Validate input
  // Call register API
  // Handle errors
  // Redirect on success
}
```

### API Endpoints

#### POST /api/auth/register
```typescript
Request:
{
  name: string;
  email: string;
  password: string;
}

Response (200):
{
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  token: string;
}

Response (400):
{
  detail: string; // "Email already registered" | "Password too short"
}
```

#### POST /api/auth/login
```typescript
Request:
{
  email: string;
  password: string;
  remember_me?: boolean;
}

Response (200):
{
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

Response (401):
{
  detail: string; // "Invalid credentials"
}
```

#### GET /api/auth/me
```typescript
Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

Response (401):
{
  detail: string; // "Not authenticated"
}
```

#### POST /api/auth/logout
```typescript
Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  message: string; // "Successfully logged out"
}
```

#### PUT /api/auth/profile
```typescript
Headers:
{
  Authorization: "Bearer <token>"
}

Request:
{
  name?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}

Response (200):
{
  user: {
    id: number;
    name: string;
    email: string;
    updated_at: string;
  };
}

Response (400):
{
  detail: string; // "Email already exists" | "Current password incorrect"
}
```

## Data Models

### User Model (SQLAlchemy)
```python
class User(Base):
    __tablename__ = "users"
    
    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String(100), nullable=False)
    email: str = Column(String(255), unique=True, index=True, nullable=False)
    password_hash: str = Column(String(255), nullable=False)
    is_active: bool = Column(Boolean, default=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions: List["Session"] = relationship("Session", back_populates="user")
```

### Session Model (Optional - for tracking)
```python
class Session(Base):
    __tablename__ = "sessions"
    
    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_jti: str = Column(String(255), unique=True, index=True)  # JWT ID
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    expires_at: datetime = Column(DateTime, nullable=False)
    is_revoked: bool = Column(Boolean, default=False)
    
    # Relationships
    user: User = relationship("User", back_populates="sessions")
```

### Pydantic Schemas

#### UserCreate
```python
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
```

#### UserLogin
```python
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False
```

#### UserResponse
```python
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

#### TokenResponse
```python
class TokenResponse(BaseModel):
    user: UserResponse
    token: str
    token_type: str = "bearer"
```

#### UserUpdate
```python
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=8, max_length=100)
```

### Frontend Types

#### User Type
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
```

#### AuthResponse Type
```typescript
interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}
```

#### LoginCredentials Type
```typescript
interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}
```

#### RegisterData Type
```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Registration creates valid user accounts
*For any* valid registration data (name, email, password ≥8 chars), registering a user should create a new user record in the database with a hashed password.
**Validates: Requirements 1.1, 1.5**

### Property 2: Duplicate email registration is rejected
*For any* email that already exists in the database, attempting to register with that email should return an error and not create a duplicate user.
**Validates: Requirements 1.2**

### Property 3: Password validation enforces minimum length
*For any* password shorter than 8 characters, the registration should be rejected with a validation error.
**Validates: Requirements 1.3**

### Property 4: Successful registration includes authentication
*For any* successful registration, the response should include a valid JWT token that can be used to authenticate subsequent requests.
**Validates: Requirements 1.4**

### Property 5: Valid credentials authenticate successfully
*For any* registered user, providing correct email and password should return a valid JWT token.
**Validates: Requirements 2.1**

### Property 6: Invalid credentials are rejected
*For any* login attempt with incorrect password, the system should return an authentication error without revealing whether the email exists.
**Validates: Requirements 2.2, 7.5**

### Property 7: JWT tokens have correct expiration
*For any* JWT token issued, decoding it should reveal an expiration time of 7 days from issuance (or 30 days if remember_me is true).
**Validates: Requirements 2.4, 3.4**

### Property 8: Password hashing is secure
*For any* password stored in the database, it should be hashed using bcrypt and should not match the plaintext password.
**Validates: Requirements 1.5, 2.5, 7.1**

### Property 9: Token validation protects routes
*For any* protected route, accessing it without a valid JWT token should result in a redirect to the login page or 401 error.
**Validates: Requirements 4.1**

### Property 10: Valid tokens grant access
*For any* protected route, accessing it with a valid JWT token should allow access and return the requested resource.
**Validates: Requirements 4.2**

### Property 11: Logout clears authentication state
*For any* authenticated user, logging out should clear the JWT token from storage and subsequent requests should be unauthenticated.
**Validates: Requirements 3.3**

### Property 12: Tampered tokens are rejected
*For any* JWT token that has been modified, the system should reject it and clear the session.
**Validates: Requirements 3.5**

### Property 13: Profile updates preserve data integrity
*For any* authenticated user, updating profile information should save the changes and return the updated user data.
**Validates: Requirements 5.2**

### Property 14: Password change requires current password
*For any* password change attempt, the system should require and verify the current password before allowing the change.
**Validates: Requirements 5.3**

### Property 15: Email uniqueness is enforced on update
*For any* profile update that changes email to an existing email, the system should reject the update with an error.
**Validates: Requirements 5.4**

### Property 16: Password reset invalidates old sessions
*For any* successful password reset, all existing JWT tokens for that user should become invalid.
**Validates: Requirements 6.4**

### Property 17: Rate limiting prevents brute force
*For any* IP address, after 5 failed login attempts within 15 minutes, subsequent login attempts should be blocked.
**Validates: Requirements 7.3**

### Property 18: Authentication events are logged
*For any* authentication action (login, logout, failed attempt), an audit log entry should be created.
**Validates: Requirements 5.5, 7.4**

### Property 19: Redirect preserves original destination
*For any* unauthenticated access to a protected route, after successful login, the user should be redirected to the originally requested route.
**Validates: Requirements 4.5**

### Property 20: Session persistence across page refresh
*For any* authenticated user, refreshing the page should maintain authentication state by validating the stored JWT token.
**Validates: Requirements 3.1, 9.1**

## Error Handling

### Authentication Errors

#### Invalid Credentials
```python
class InvalidCredentialsError(HTTPException):
    status_code = 401
    detail = "Invalid email or password"
```

#### Token Expired
```python
class TokenExpiredError(HTTPException):
    status_code = 401
    detail = "Token has expired"
```

#### Invalid Token
```python
class InvalidTokenError(HTTPException):
    status_code = 401
    detail = "Invalid authentication token"
```

### Validation Errors

#### Email Already Exists
```python
class EmailExistsError(HTTPException):
    status_code = 400
    detail = "Email already registered"
```

#### Password Too Short
```python
class PasswordTooShortError(HTTPException):
    status_code = 400
    detail = "Password must be at least 8 characters"
```

#### Invalid Email Format
```python
class InvalidEmailError(HTTPException):
    status_code = 400
    detail = "Invalid email format"
```

### Rate Limiting Errors

#### Too Many Requests
```python
class RateLimitError(HTTPException):
    status_code = 429
    detail = "Too many requests. Please try again later."
```

### Error Response Format

All errors follow a consistent format:
```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE",
  "timestamp": "2025-12-30T10:00:00Z"
}
```

### Frontend Error Handling

```typescript
// Error handling in API client
async function handleAuthError(error: any) {
  if (error.status === 401) {
    // Clear token and redirect to login
    clearAuthToken();
    router.push('/login');
  } else if (error.status === 429) {
    // Show rate limit message
    showToast('Too many attempts. Please try again later.');
  } else {
    // Show generic error
    showToast(error.detail || 'An error occurred');
  }
}
```

## Testing Strategy

### Dual Testing Approach

The authentication system will be tested using both **unit tests** and **property-based tests** to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

### Unit Testing

#### Backend Unit Tests
- Test password hashing with known inputs
- Test JWT token generation and validation
- Test database operations (CRUD)
- Test error handling for specific cases
- Test rate limiting logic
- Test email validation

#### Frontend Unit Tests
- Test AuthContext state management
- Test form validation
- Test component rendering
- Test error display
- Test redirect logic

### Property-Based Testing

Property-based tests will run with **minimum 100 iterations** per test to ensure comprehensive coverage.

#### Backend Property Tests

**Property Test 1: Registration with valid data**
```python
# Feature: web-authentication, Property 1: Registration creates valid user accounts
@given(st.text(min_size=1, max_size=100), st.emails(), st.text(min_size=8, max_size=100))
def test_registration_creates_user(name, email, password):
    # Register user
    # Verify user exists in database
    # Verify password is hashed
```

**Property Test 2: Duplicate email rejection**
```python
# Feature: web-authentication, Property 2: Duplicate email registration is rejected
@given(st.emails())
def test_duplicate_email_rejected(email):
    # Register first user with email
    # Attempt to register second user with same email
    # Verify error is returned
```

**Property Test 3: Password length validation**
```python
# Feature: web-authentication, Property 3: Password validation enforces minimum length
@given(st.text(max_size=7))
def test_short_password_rejected(password):
    # Attempt registration with short password
    # Verify validation error
```

**Property Test 4: Valid login returns token**
```python
# Feature: web-authentication, Property 5: Valid credentials authenticate successfully
@given(st.emails(), st.text(min_size=8))
def test_valid_login_returns_token(email, password):
    # Register user
    # Login with same credentials
    # Verify JWT token is returned
    # Verify token is valid
```

**Property Test 5: Invalid login rejected**
```python
# Feature: web-authentication, Property 6: Invalid credentials are rejected
@given(st.emails(), st.text(min_size=8), st.text(min_size=8))
def test_invalid_login_rejected(email, correct_password, wrong_password):
    assume(correct_password != wrong_password)
    # Register user with correct_password
    # Login with wrong_password
    # Verify authentication error
```

**Property Test 6: Token expiration**
```python
# Feature: web-authentication, Property 7: JWT tokens have correct expiration
@given(st.booleans())
def test_token_expiration(remember_me):
    # Generate token with remember_me flag
    # Decode token
    # Verify expiration is 7 days (or 30 if remember_me)
```

**Property Test 7: Protected route access**
```python
# Feature: web-authentication, Property 9: Token validation protects routes
@given(st.sampled_from(['/news', '/work', '/outfit', '/life', '/review', '/settings']))
def test_protected_route_requires_auth(route):
    # Access route without token
    # Verify 401 or redirect
```

**Property Test 8: Profile update**
```python
# Feature: web-authentication, Property 13: Profile updates preserve data integrity
@given(st.text(min_size=1, max_size=100))
def test_profile_update(new_name):
    # Register and login user
    # Update profile with new_name
    # Verify changes are saved
```

#### Frontend Property Tests

**Property Test 9: Auth state persistence**
```typescript
// Feature: web-authentication, Property 20: Session persistence across page refresh
test('auth state persists across refresh', async () => {
  // Login user
  // Store token
  // Simulate page refresh
  // Verify user is still authenticated
});
```

**Property Test 10: Logout clears state**
```typescript
// Feature: web-authentication, Property 11: Logout clears authentication state
test('logout clears all auth state', async () => {
  // Login user
  // Logout
  // Verify token is cleared
  // Verify user is null
});
```

### Integration Testing

#### End-to-End Tests
- Complete registration flow
- Complete login flow
- Protected route access flow
- Profile update flow
- Password reset flow
- Logout flow

#### API Integration Tests
- Test all API endpoints
- Test authentication middleware
- Test rate limiting
- Test error responses
- Test CORS configuration

### Test Configuration

```python
# pytest configuration
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--cov=.",
    "--cov-report=html",
    "--cov-report=term-missing",
    "--cov-fail-under=80",
]

# Property-based testing configuration
[tool.hypothesis]
max_examples = 100
deadline = None
```

### Coverage Goals

- **Overall coverage**: ≥80%
- **Authentication service**: ≥90%
- **Password manager**: ≥95%
- **JWT manager**: ≥95%
- **API endpoints**: ≥85%
- **Frontend components**: ≥75%

### Test Execution

```bash
# Run all tests
pytest tests/

# Run unit tests only
pytest tests/unit/

# Run property tests only
pytest tests/property/

# Run integration tests only
pytest tests/integration/

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific property test
pytest tests/property/test_auth_properties.py -k test_registration_creates_user
```
