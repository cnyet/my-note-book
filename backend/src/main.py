# backend/src/main.py
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from .core.config import settings
from .core.database import init_db
from .api.v1.admin import auth, dashboard, agents, tools, labs, blog, profile, settings as admin_settings

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """添加安全响应头。"""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        if "Server" in response.headers:
            del response.headers["Server"]
        return response


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 中间件配置
app.add_middleware(SecurityHeadersMiddleware)

# CORS 配置
allowed_origins = ["http://localhost:3000", "http://localhost:3001"]
if settings.ENVIRONMENT == "production":
    import os
    production_origins = os.getenv("ALLOWED_ORIGINS", "")
    if production_origins:
        allowed_origins = [origin.strip() for origin in production_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """服务器启动时初始化数据库。"""
    try:
        await init_db()
        logger.info("Database initialized successfully on startup.")
    except Exception as e:
        logger.error(f"Failed to initialize database on startup: {e}")


# 包含路由
api_prefix = "/api/v1/admin"
app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["admin-auth"])
app.include_router(dashboard.router, prefix=f"{api_prefix}/dashboard", tags=["admin-dashboard"])
app.include_router(agents.router, prefix=f"{api_prefix}/agents", tags=["admin-agents"])
app.include_router(tools.router, prefix=f"{api_prefix}/tools", tags=["admin-tools"])
app.include_router(labs.router, prefix=f"{api_prefix}/labs", tags=["admin-labs"])
app.include_router(blog.router, prefix=f"{api_prefix}/blog", tags=["admin-blog"])
app.include_router(profile.router, prefix=f"{api_prefix}/profile", tags=["admin-profile"])
app.include_router(admin_settings.router, prefix=f"{api_prefix}/settings", tags=["admin-settings"])


@app.get("/")
def root():
    return {"message": "MyNoteBook API", "version": settings.VERSION}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
