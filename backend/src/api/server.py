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

from utils.file_manager import FileManager
from agents.news_secretary import NewsSecretary
from agents.work_secretary import WorkSecretary
from agents.outfit_secretary import OutfitSecretary
from agents.life_secretary import LifeSecretary
from agents.review_secretary import ReviewSecretary

# Import authentication routes
from api.routes import auth, secretary
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
# Include secretary content routes
app.include_router(secretary.router)

# Initialize components
config = configparser.ConfigParser()
config.read("config/config.ini")
config_dict = {
    'llm': dict(config['llm']) if 'llm' in config else {},
    'data': dict(config['data']) if 'data' in config else {},
    'weather': dict(config['weather']) if 'weather' in config else {}
}
file_manager = FileManager(config_dict.get('data', {}))

@app.get("/api/status")
async def get_status():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

def get_latest_agent_content(agent_type: str):
    """Find the most recent file for a specific agent type and return content + date"""
    logs_dir = file_manager.daily_logs_dir
    if not os.path.exists(logs_dir):
        return None, None
    
    # Sort datesDescending
    dates = sorted([d for d in os.listdir(logs_dir) if os.path.isdir(os.path.join(logs_dir, d))], reverse=True)
    
    for date in dates:
        content = file_manager.read_daily_file(agent_type, os.path.join(logs_dir, date))
        if content:
            return content, date
    return None, None

@app.get("/api/dashboard")
async def get_dashboard():
    """Get aggregated stats and snippets for dashboard"""
    today_dir = file_manager.get_today_dir()
    
    agent_types = {
        "news": "新闻简报.md",
        "outfit": "今日穿搭.md",
        "work": "今日工作.md",
        "life": "今日生活.md",
        "review": "今日复盘.md"
    }
    
    agents_status = {}
    recent_snippets = {}
    
    for key, filename in agent_types.items():
        content, date = get_latest_agent_content(key)
        
        is_today = date == datetime.now().strftime("%Y-%m-%d")
        agents_status[key] = {
            "generated": content is not None,
            "is_today": is_today,
            "last_date": date,
            "snippet": content[:200] + "..." if content else None
        }
        
    # Mock some extra data for UI beautification if not available in files
    stats = {
        "today_dir": today_dir,
        "agents": agents_status,
        "tasks_summary": {
            "total": 8,
            "completed": 5,
            "pending": 3
        },
        "weather_summary": "22°C, Sunny" if agents_status['outfit']['generated'] else "N/A",
        "health_summary": "75% of goals met" if agents_status['life']['generated'] else "N/A"
    }
    
    return stats

@app.get("/api/news")
async def get_news():
    today_dir = file_manager.get_today_dir()
    content = file_manager.read_daily_file("news", today_dir)
    return {"content": content, "generated": content is not None}

@app.post("/api/news/run")
async def run_news():
    try:
        agent = NewsSecretary(config_dict)
        summary = agent.run()
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/outfit")
async def get_outfit():
    today_dir = file_manager.get_today_dir()
    content = file_manager.read_daily_file("outfit", today_dir)
    return {"content": content, "generated": content is not None}

@app.post("/api/outfit/run")
async def run_outfit():
    try:
        agent = OutfitSecretary(config_dict)
        summary = agent.run()
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/work")
async def get_work():
    today_dir = file_manager.get_today_dir()
    content = file_manager.read_daily_file("work", today_dir)
    return {"content": content, "generated": content is not None}

@app.post("/api/work/run")
async def run_work():
    try:
        agent = WorkSecretary(config_dict)
        # Note: Work secretary interactive mode might not work well via API yet
        summary = agent.run() 
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/life")
async def get_life():
    today_dir = file_manager.get_today_dir()
    content = file_manager.read_daily_file("life", today_dir)
    return {"content": content, "generated": content is not None}

@app.post("/api/life/run")
async def run_life():
    try:
        agent = LifeSecretary(config_dict)
        summary = agent.run() 
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/review")
async def get_review():
    today_dir = file_manager.get_today_dir()
    content = file_manager.read_daily_file("review", today_dir)
    return {"content": content, "generated": content is not None}

@app.post("/api/review/run")
async def run_review():
    try:
        agent = ReviewSecretary(config_dict)
        summary = agent.run() 
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api.server:app", host="0.0.0.0", port=8000, reload=True)
