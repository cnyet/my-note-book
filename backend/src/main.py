# backend/src/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from .core.config import settings
from .api.v1.admin import auth
from .api.v1.admin import dashboard
from .api.v1.admin import agents
from .api.v1.admin import tools
from .api.v1.admin import labs
from .api.v1.admin import blog
from .api.v1.admin import profile


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    """Redirect HTTP to HTTPS in production."""

    async def dispatch(self, request: Request, call_next):
        # Only enforce in production
        if (
            settings.ENVIRONMENT == "production"
            and request.url.scheme != "https"
            and request.headers.get("X-Forwarded-Proto") != "https"
        ):
            https_url = request.url.replace(scheme="https")
            return JSONResponse(
                status_code=status.HTTP_301_MOVED_PERMANENTLY,
                headers={"Location": str(https_url)},
                content={"detail": "Please use HTTPS"}
            )
        return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Remove server info
        if "Server" in response.headers:
            del response.headers["Server"]

        return response


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Apply security middleware
app.add_middleware(SecurityHeadersMiddleware)
if settings.ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Configure CORS
allowed_origins = ["http://localhost:3000"]
if settings.ENVIRONMENT == "production":
    # Get production origins from env or use specific list
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

# Include routers
app.include_router(auth.router, prefix="/api/v1/admin/auth", tags=["admin-auth"])
from .api.v1.admin import agents
app.include_router(agents.router, prefix="/api/v1/admin/agents", tags=["admin-agents"])
app.include_router(tools.router, prefix="/api/v1/admin/tools", tags=["admin-tools"])
app.include_router(labs.router, prefix="/api/v1/admin/labs", tags=["admin-labs"])
app.include_router(blog.router, prefix="/api/v1/admin/blog", tags=["admin-blog"])
app.include_router(profile.router, prefix="/api/v1/admin/profile", tags=["admin-profile"])
app.include_router(settings.router, prefix="/api/v1/admin/settings", tags=["admin-settings"])
app.include_router(dashboard.router, prefix="/api/v1/admin/dashboard", tags=["admin-dashboard"])

@app.get("/")
def root():
    return {"message": "MyNoteBook API", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
