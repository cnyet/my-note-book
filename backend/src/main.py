import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import API routers
from .api.v1.auth import router as auth_router
from .api.v1.home import router as home_router
from .api.v1.agents import router as agents_router
from .api.v1.blog import router as blog_router
from .api.v1.tools import router as tools_router
from .api.v1.labs import router as labs_router
from .api.v1.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database
    # TODO: Initialize database tables
    yield
    # Shutdown: cleanup


app = FastAPI(
    title="work-agents API",
    description="AI Agent Tools Aggregation Platform API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(home_router, prefix="/api/v1")
app.include_router(agents_router, prefix="/api/v1")
app.include_router(blog_router, prefix="/api/v1")
app.include_router(tools_router, prefix="/api/v1")
app.include_router(labs_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "0.1.0"}


@app.get("/api/v1")
async def root():
    """API root endpoint."""
    return {
        "name": "work-agents API",
        "version": "0.1.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
