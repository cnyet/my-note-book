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

# Import routes
from api.routes import auth, agent, blog, conversation, news, chat, plugins
from api.models.agent_content import NewsArticle
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

# Register routes
app.include_router(auth.router)
app.include_router(agent.router)
app.include_router(blog.router)
app.include_router(conversation.router)
app.include_router(news.router)
app.include_router(chat.router)
app.include_router(plugins.router)

# Initialize database tables on startup
from api.database import init_db

init_db()


@app.get("/api/status")
async def get_status():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    uvicorn.run("api.server:app", host="0.0.0.0", port=8000, reload=True)
