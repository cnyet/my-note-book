"""News API routes for AI Life Assistant."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

from api.database import get_db
from api.models.agent_content import NewsArticle
from agents.news_agent import NewsAgent

router = APIRouter(prefix="/api/v1/news", tags=["news"])


# Pydantic schemas
class NewsArticleResponse(BaseModel):
    """News article response schema."""
    id: int
    title: str
    source: str
    link: str
    summary: Optional[str] = None
    importance_score: int
    category: Optional[str] = None
    published_date: Optional[datetime] = None
    article_date: date

    class Config:
        from_attributes = True


class NewsBriefingResponse(BaseModel):
    """News briefing response schema."""
    date: date
    briefing: Optional[str] = None
   
    articles_count: int
    generated_at: Optional[datetime] = None


class GenerateNewsRequest(BaseModel):
    """Request to generate new news briefing."""
    regenerate: bool = False  # Force regenerate even if exists


class GenerateNewsResponse(BaseModel):
    """Response for news generation."""
    success: bool
    articles_count: int
    briefing: Optional[str] = None
    message: str


@router.get("/", response_model=List[NewsArticleResponse])
async def get_today_news(
    limit: int = 20,
    min_importance: int = 1,
    db: Session = Depends(get_db)
):
    """Get today's news articles."""
    today = date.today()
    
    articles = db.query(NewsArticle).filter(
        NewsArticle.article_date == today,
        NewsArticle.importance_score >= min_importance
    ).order_by(
        NewsArticle.importance_score.desc()
    ).limit(limit).all()
    
    return articles


@router.get("/briefing", response_model=NewsBriefingResponse)
async def get_today_briefing(
    db: Session = Depends(get_db)
):
    """Get today's news briefing from file."""
    today = date.today()
    
    # Try to get from file
    try:
        from utils.file_manager import FileManager
        file_manager = FileManager({})
        briefing_file = file_manager.get_today_file('news')
        
        if briefing_file and briefing_file.exists():
            content = briefing_file.read_text(encoding='utf-8')
            return {
                "date": today,
                "briefing": content,
                "articles_count": db.query(NewsArticle).filter(
                    NewsArticle.article_date == today
                ).count(),
                "generated_at": datetime.now()
            }
    except Exception as e:
        print(f"Error reading briefing file: {e}")
    
    # Return empty if no briefing
    return {
        "date": today,
        "briefing": None,
        "articles_count": db.query(NewsArticle).filter(
            NewsArticle.article_date == today
        ).count(),
        "generated_at": None
    }


@router.get("/history", response_model=List[NewsBriefingResponse])
async def get_news_history(
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get news history for past days."""
    from datetime import timedelta
    
    today = date.today()
    dates = []
    for i in range(days):
        d = today - timedelta(days=i)
        dates.append(d)
    
    history = []
    for d in dates:
        count = db.query(NewsArticle).filter(
            NewsArticle.article_date == d
        ).count()
        
        history.append({
            "date": d,
            "briefing": None,  # Would need to read files
            "articles_count": count,
            "generated_at": None
        })
    
    return history


@router.post("/generate", response_model=GenerateNewsResponse)
async def generate_news_briefing(
    request: GenerateNewsRequest = GenerateNewsRequest(),
    db: Session = Depends(get_db)
):
    """Trigger news collection and briefing generation."""
    try:
        agent = NewsAgent()
        briefing = agent.execute(
            save_to_file=True,
            use_memory=True
        )
        
        if briefing:
            today = date.today()
            articles_count = db.query(NewsArticle).filter(
                NewsArticle.article_date == today
            ).count()
            
            return {
                "success": True,
                "articles_count": articles_count,
                "briefing": briefing,
                "message": f"Successfully generated briefing with {articles_count} articles"
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate news briefing"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sources")
async def get_news_sources():
    """Get available news sources."""
    return {
        "sources": [
            {
                "name": "TechCrunch",
                "url": "https://techcrunch.com/category/artificial-intelligence/",
                "type": "RSS"
            },
            {
                "name": "The Verge",
                "url": "https://www.theverge.com/ai-artificial-intelligence",
                "type": "RSS"
            },
            {
                "name": "MIT Technology Review",
                "url": "https://www.technologyreview.com/topic/artificial-intelligence/",
                "type": "RSS"
            },
            {
                "name": "Reddit r/ArtificialIntelligence",
                "url": "https://www.reddit.com/r/ArtificialInteligence/",
                "type": "API"
            }
        ]
    }


@router.get("/stats")
async def get_news_stats(db: Session = Depends(get_db)):
    """Get news statistics."""
    today = date.today()
    
    # Today's stats
    today_count = db.query(NewsArticle).filter(
        NewsArticle.article_date == today
    ).count()
    
    today_important = db.query(NewsArticle).filter(
        NewsArticle.article_date == today,
        NewsArticle.importance_score >= 4
    ).count()
    
    # This week's stats
    from datetime import timedelta
    week_ago = today - timedelta(days=7)
    week_count = db.query(NewsArticle).filter(
        NewsArticle.article_date >= week_ago
    ).count()
    
    # Source breakdown
    source_counts = db.query(
        NewsArticle.source,
        func.count(NewsArticle.id)
    ).filter(
        NewsArticle.article_date == today
    ).group_by(NewsArticle.source).all()
    
    sources = {s[0]: s[1] for s in source_counts}
    
    return {
        "today": {
            "total_articles": today_count,
            "important_articles": today_important,
            "sources": sources
        },
        "this_week": {
            "total_articles": week_count
        }
    }
