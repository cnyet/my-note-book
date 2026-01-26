"""API routes for news briefing."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional

from api.database import get_db
from api.repositories.news_repository import NewsRepository
from api.models.agent_content import NewsArticle

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("", response_model=dict)
async def get_news(
    target_date: Optional[date] = None,
    latest: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Get news briefing from database.
    """
    news_repo = NewsRepository(db)

    # If latest parameter is provided, get latest articles
    if latest:
        articles = news_repo.get_latest_articles(limit=latest)
    else:
        if target_date is None:
            target_date = date.today()
        articles = news_repo.get_articles_by_date(target_date)

    # Convert to dict
    articles_data = []
    for article in articles:
        articles_data.append({
            "id": article.id,
            "title": article.title,
            "source": article.source,
            "link": article.link,
            "summary": article.summary,
            "importance_score": article.importance_score,
            "article_date": str(article.article_date),
        })

    return {
        "articles": articles_data,
        "count": len(articles_data),
        "generated": len(articles_data) > 0
    }
