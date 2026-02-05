from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.api.v1 import auth as auth_v1
from src.api.v1 import content as content_v1
from src.api.v1 import media as media_v1
from src.core.logging import StructuredLoggingMiddleware, setup_logging
from src.core.websocket import manager

load_dotenv()
setup_logging()


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
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(StructuredLoggingMiddleware)

# Include API routers
app.include_router(auth_v1.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(content_v1.router, prefix="/api/v1", tags=["content"])
app.include_router(media_v1.router, prefix="/api/v1/media", tags=["media"])


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast_online_count()


# Mount static files
app.mount("/uploads", StaticFiles(directory="public/uploads"), name="uploads")


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

    uvicorn.run(app, host="0.0.0.0", port=8001)
