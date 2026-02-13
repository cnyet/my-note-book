# Admin Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modern admin dashboard for MyNoteBook with authentication, blog management, agent configuration, and system settings.

**Architecture:** Frontend (Next.js) + Backend (FastAPI) + SQLite. Frontend handles UI and calls FastAPI APIs for all data operations. Backend manages authentication, CRUD operations, and database interactions via SQLAlchemy.

**Tech Stack:** Next.js 15.5, FastAPI, SQLAlchemy 2.0, SQLite, JWT, TanStack Query, React Hook Form, Zod, Tiptap

---

## Phase 1: Backend Foundation

### Task 1: Initialize Backend Project Structure

**Files:**
- Create: `backend/src/core/config.py`
- Create: `backend/src/core/security.py`
- Create: `backend/src/core/database.py`
- Create: `backend/src/models/__init__.py`
- Create: `backend/src/models/user.py`
- Create: `backend/src/schemas/__init__.py`
- Create: `backend/src/schemas/user.py`
- Create: `backend/src/api/__init__.py`
- Create: `backend/src/api/v1/__init__.py`
- Create: `backend/src/api/v1/admin/__init__.py`

**Step 1: Write core config module**

```python
# backend/src/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyNoteBook Admin"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite:///./data/my_note_book.db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin
    FIRST_ADMIN_USERNAME: str = "admin"
    FIRST_ADMIN_PASSWORD: str = "admin123"
    FIRST_ADMIN_EMAIL: str = "admin@example.com"

    class Config:
        env_file = ".env"

settings = Settings()
```

**Step 2: Write security module (JWT + password hashing)**

```python
# backend/src/core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

**Step 3: Write database module**

```python
# backend/src/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create database tables"""
    import backend.src.models.user  # noqa: import models to register them
    Base.metadata.create_all(bind=engine)
```

**Step 4: Write User model**

```python
# backend/src/models/user.py
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

**Step 5: Write user schemas**

```python
# backend/src/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenPayload(BaseModel):
    sub: int
    username: str
    role: str
    exp: int
    type: str
```

**Step 6: Create empty __init__ files for module structure**

```bash
# backend/src/models/__init__.py
# backend/src/schemas/__init__.py
# backend/src/api/__init__.py
# backend/src/api/v1/__init__.py
# backend/src/api/v1/admin/__init__.py

# Leave all empty or add:
from .user import User
from .user import UserCreate, UserLogin, UserResponse, Token, TokenPayload
```

**Step 7: Run backend to verify no syntax errors**

Run: `cd backend && python -m src.core.config`
Expected: No output (no import errors)

**Step 8: Commit**

```bash
git add backend/src/
git commit -m "feat: initialize backend project structure with config, security, database, and user model"
```

---

### Task 2: Create Admin Authentication API

**Files:**
- Create: `backend/src/api/deps.py`
- Create: `backend/src/api/v1/admin/auth.py`
- Create: `backend/src/services/__init__.py`
- Create: `backend/src/services/user_service.py`
- Modify: `backend/src/main.py`

**Step 1: Write dependencies module (auth middleware)**

```python
# backend/src/api/deps.py
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import decode_token
from ..models.user import User
from ..schemas.user import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/admin/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    if payload.get("type") != "access":
        raise credentials_exception

    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

**Step 2: Write user service**

```python
# backend/src/services/user_service.py
from typing import Optional
from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import verify_password, get_password_hash

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_user(db: Session, username: str, email: str, password: str) -> User:
    password_hash = get_password_hash(password)
    db_user = User(
        username=username,
        email=email,
        password_hash=password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_first_admin(db: Session, username: str, email: str, password: str) -> User:
    """Create first admin user if not exists"""
    existing = get_user_by_username(db, username)
    if existing:
        return existing
    return create_user(db, username, email, password)
```

**Step 3: Write auth API routes**

```python
# backend/src/api/v1/admin/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ....core.config import settings
from ....core.database import get_db
from ....core.security import create_access_token, create_refresh_token
from ....schemas.user import Token, UserLogin, UserResponse
from ....services.user_service import authenticate_user, create_first_admin
from ....api.deps import get_current_active_user
from ....models.user import User

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Admin login endpoint"""
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": user.id, "username": user.username, "role": user.role}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.id, "username": user.username, "role": user.role}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/verify", response_model=UserResponse)
def verify_token(current_user: User = Depends(get_current_active_user)):
    """Verify current token and return user info"""
    return current_user

@router.post("/init")
def init_admin_db(db: Session = Depends(get_db)):
    """Initialize first admin user (development only)"""
    from ....core.database import init_db
    init_db()

    admin = create_first_admin(
        db,
        settings.FIRST_ADMIN_USERNAME,
        settings.FIRST_ADMIN_EMAIL,
        settings.FIRST_ADMIN_PASSWORD
    )

    return {"message": "Admin user initialized", "username": admin.username}
```

**Step 4: Update main.py to include auth routes**

```python
# backend/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.admin import auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/admin/auth", tags=["admin-auth"])

@app.get("/")
def root():
    return {"message": "MyNoteBook API", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

**Step 5: Test the API**

```bash
# Terminal 1: Start the server
cd backend
python -m uvicorn src.main:app --reload --port 8001

# Terminal 2: Test endpoints
curl http://localhost:8001/health
# Expected: {"status": "healthy"}

curl -X POST http://localhost:8001/api/v1/admin/auth/init
# Expected: {"message": "Admin user initialized", "username": "admin"}

curl -X POST http://localhost:8001/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
# Expected: {"access_token": "...", "refresh_token": "...", "token_type": "bearer", "expires_in": 3600}
```

**Step 6: Commit**

```bash
git add backend/src/
git commit -m "feat: add admin authentication API with JWT"
```

---

## Phase 2: Frontend Admin Foundation

### Task 3: Create Admin Layout and Login Page

**Files:**
- Create: `frontend/app/admin/layout.tsx`
- Create: `frontend/app/admin/login/page.tsx`
- Create: `frontend/app/admin/middleware.ts`
- Create: `frontend/lib/admin-api.ts`
- Create: `frontend/lib/admin-auth.ts`

**Step 1: Write admin API client**

```typescript
// frontend/lib/admin-api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

interface AdminResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

export async function adminRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AdminResponse<T>> {
  const token = localStorage.getItem('admin_access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: {
        code: response.status.toString(),
        message: data.detail || 'Request failed',
      },
    };
  }

  return {
    success: true,
    data,
  };
}

// Auth API
export const adminAuthApi = {
  login: (username: string, password: string) =>
    adminRequest('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verify: () =>
    adminRequest('/api/v1/admin/auth/verify'),

  init: () =>
    adminRequest('/api/v1/admin/auth/init', { method: 'POST' }),
};
```

**Step 2: Write admin auth utilities**

```typescript
// frontend/lib/admin-auth.ts
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

const TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_KEY = 'admin_user';

export function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setAdminUser(user: AdminUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAdminUser(): AdminUser | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
```

**Step 3: Write admin middleware**

```typescript
// frontend/app/admin/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check authentication for other admin pages
  if (!isAuthenticated()) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

**Step 4: Write admin login page**

```typescript
// frontend/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/lib/admin-api';
import { setAuthTokens, setAdminUser } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await adminAuthApi.login(username, password);

    if (!response.success) {
      setError(response.error?.message || 'Login failed');
      setLoading(false);
      return;
    }

    const { access_token, refresh_token } = response.data!;
    setAuthTokens(access_token, refresh_token);

    // Get user info
    const userResponse = await adminAuthApi.verify();
    if (userResponse.success) {
      setAdminUser(userResponse.data!);
      router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-abyss">
      <div className="w-full max-w-md p-8 bg-surface rounded-lg border border-white/10">
        <h1 className="text-2xl font-heading font-bold text-center mb-6 text-text-primary">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-error/20 border border-error text-error rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-void border border-white/20 rounded text-text-primary focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-void border border-white/20 rounded text-text-primary focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-void font-medium rounded hover:glow-primary transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Step 5: Write admin layout**

```typescript
// frontend/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/lib/admin-api';
import { clearAuth, getAdminUser } from '@/lib/admin-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const user = getAdminUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      const response = await adminAuthApi.verify();
      if (!response.success) {
        clearAuth();
        router.push('/admin/login');
      }
    };

    verifyAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar will be added in next task */}
      <main className="p-6">{children}</main>
    </div>
  );
}
```

**Step 6: Test the login flow**

```bash
# Start backend server
cd backend && python -m uvicorn src.main:app --reload --port 8001

# Start frontend server
cd frontend && npm run dev

# In browser:
# 1. Visit http://localhost:3000/admin
# 2. Should redirect to /admin/login
# 3. Login with admin/admin123
# 4. Should redirect to /admin
```

**Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: add admin login page and auth middleware"
```

---

### Task 4: Create Admin Dashboard Sidebar and Layout

**Files:**
- Modify: `frontend/app/admin/layout.tsx`
- Create: `frontend/components/admin/Sidebar.tsx`
- Create: `frontend/components/admin/TopNav.tsx`
- Create: `frontend/app/admin/page.tsx`

**Step 1: Create sidebar component**

```typescript
// frontend/components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const menuItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/agents', icon: '🤖', label: '智能体' },
  { href: '/admin/tools', icon: '🔧', label: '工具库' },
  { href: '/admin/labs', icon: '🧪', label: '实验室' },
  { href: '/admin/blog', icon: '📝', label: '博客管理' },
  { href: '/admin/profile', icon: '👤', label: '个人中心' },
  { href: '/admin/settings', icon: '⚙️', label: '系统设置' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-abyss border-r border-white/10 min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-heading font-bold text-primary">
          MyNoteBook
        </h1>
        <p className="text-xs text-text-muted mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 transition"
        >
          <span>←</span>
          <span>返回前台</span>
        </Link>
      </div>
    </aside>
  );
}
```

**Step 2: Create top nav component**

```typescript
// frontend/components/admin/TopNav.tsx
'use client';

import { getAdminUser, clearAuth } from '@/lib/admin-auth';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const user = getAdminUser();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
```

**Step 3: Update admin layout with sidebar and top nav**

```typescript
// frontend/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/lib/admin-api';
import { clearAuth } from '@/lib/admin-auth';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNav } from '@/components/admin/TopNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const response = await adminAuthApi.verify();
      if (!response.success) {
        clearAuth();
        router.push('/admin/login');
      }
    };

    verifyAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 4: Create dashboard placeholder page**

```typescript
// frontend/app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome to the admin dashboard. Content coming soon.
      </p>
    </div>
  );
}
```

**Step 5: Test the layout**

```bash
# In browser, login and verify:
# - Sidebar shows all menu items
# - Active menu is highlighted
# - Top nav shows username and logout button
# - Logout redirects to login page
```

**Step 6: Commit**

```bash
git add frontend/
git commit -m "feat: add admin sidebar, top nav, and dashboard layout"
```

---

## Phase 3: Dashboard Statistics (MVP)

### Task 5: Create Dashboard Stats API

**Files:**
- Create: `backend/src/api/v1/admin/dashboard.py`
- Modify: `backend/src/main.py`

**Step 1: Write dashboard API**

```python
# backend/src/api/v1/admin/dashboard.py
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats() -> Dict[str, Any]:
    """
    Get dashboard statistics.
    Note: This is mock data for MVP.
    TODO: Implement real statistics from database.
    """
    return {
        "visitors": {
            "total": 12458,
            "change": 12,
            "trend": [120, 132, 125, 145, 138, 152, 148]
        },
        "posts": {
            "total": 48,
            "change": 3,
            "published": 42,
            "drafts": 6
        },
        "agents": {
            "total": 5,
            "online": 5,
            "status": "all_online"
        },
        "system": {
            "status": "healthy",
            "uptime": "99.9%",
            "response_time": "45ms"
        },
        "charts": {
            "visitor_trend": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "data": [120, 132, 125, 145, 138, 152, 148]
            },
            "agent_calls": {
                "labels": ["News", "Outfit", "Task", "Life", "Review"],
                "data": [245, 189, 312, 156, 223]
            },
            "post_categories": {
                "labels": ["AI", "Development", "Design", "Tutorial"],
                "data": [12, 18, 8, 10]
            }
        }
    }
```

**Step 2: Add dashboard router to main.py**

```python
# In backend/src/main.py
from .api.v1.admin import auth, dashboard

app.include_router(auth.router, prefix="/api/v1/admin/auth", tags=["admin-auth"])
app.include_router(dashboard.router, prefix="/api/v1/admin/dashboard", tags=["admin-dashboard"])
```

**Step 3: Test the endpoint**

```bash
curl http://localhost:8001/api/v1/admin/dashboard/stats
# Expected: JSON with all stats data
```

**Step 4: Commit**

```bash
git add backend/src/
git commit -m "feat: add dashboard stats API with mock data"
```

---

### Task 6: Create Dashboard Frontend

**Files:**
- Modify: `frontend/app/admin/page.tsx`
- Create: `frontend/components/admin/StatCard.tsx`

**Step 1: Create stat card component**

```typescript
// frontend/components/admin/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: string;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {change !== undefined && (
            <p className={clsx(
              "text-sm mt-2",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Update dashboard page**

```typescript
// frontend/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminRequest } from '@/lib/admin-api';
import { StatCard } from '@/components/admin/StatCard';

interface DashboardStats {
  visitors: { total: number; change: number };
  posts: { total: number; change: number; published: number; drafts: number };
  agents: { total: number; online: number; status: string };
  system: { status: string; uptime: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await adminRequest('/api/v1/admin/dashboard/stats');
      if (response.success) {
        setStats(response.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!stats) {
    return <div>Failed to load statistics</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总访客量"
          value={stats.visitors.total.toLocaleString()}
          change={stats.visitors.change}
          icon="👥"
        />
        <StatCard
          title="文章总数"
          value={stats.posts.total}
          change={stats.posts.change}
          icon="📝"
        />
        <StatCard
          title="智能体活跃度"
          value={`${stats.agents.online}/${stats.agents.total} 在线`}
          icon="🤖"
        />
        <StatCard
          title="系统状态"
          value={stats.system.status === 'healthy' ? '运行正常' : '异常'}
          icon="✓"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">7日访客趋势</h3>
          <p className="text-gray-500">图表组件将在后续任务中实现</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
          <div className="space-y-2">
            <a
              href="/admin/blog/new"
              className="block px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
            >
              新建文章
            </a>
            <a
              href="/admin/agents"
              className="block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-90 transition"
            >
              智能体配置
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Test dashboard**

```bash
# In browser, visit /admin
# Should see stat cards with mock data
```

**Step 4: Commit**

```bash
git add frontend/
git commit -m "feat: add dashboard page with stat cards"
```

---

## Summary

This implementation plan covers the foundation of the admin dashboard system:

**Phase 1: Backend Foundation**
- ✅ Core config, security, database modules
- ✅ User model and schemas
- ✅ Admin authentication API

**Phase 2: Frontend Admin Foundation**
- ✅ Admin login page
- ✅ Auth middleware
- ✅ Admin API client

**Phase 3: Dashboard (MVP)**
- ✅ Sidebar navigation
- ✅ Top nav with user info
- ✅ Dashboard stats API
- ✅ Dashboard page with stat cards

**Next Phases** (to be added in separate plans):
- Phase 4: Blog Management (CRUD + Editor)
- Phase 5: Agents, Tools, Labs Management
- Phase 6: Profile & Settings
- Phase 7: Theme Switching
- Phase 8: File Upload & Media Management

---

**Plan created:** 2026-02-11
**Status:** Ready for implementation
