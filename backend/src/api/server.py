import sys
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import configparser
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Note: These imports are for backward compatibility with old endpoints
# New endpoints should use api.services.secretary_service instead

# Import authentication routes
from api.routes import auth, agent, blog, conversation, news
from api.models.agent_content import NewsArticle  # Ensure NewsArticle table is created
from api.config import settings

app = FastAPI(title="AI Life Assistant API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth.router)
# Include agent content routes
app.include_router(agent.router)

# Include blog routes
app.include_router(blog.router)

# Include conversation routes
app.include_router(conversation.router)

# Include news routes
app.include_router(news.router)


# Initialize database tables on startup
from api.database import init_db

init_db()

# Initialize components
# File manager for legacy endpoints
from api.repositories.file_repository import FileRepository

file_repo = FileRepository()


@app.get("/api/status")
async def get_status():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


# Legacy endpoints removed - all functionality now in api.routes.secretary

if __name__ == "__main__":
    uvicorn.run("api.server:app", host="0.0.0.0", port=8000, reload=True)
