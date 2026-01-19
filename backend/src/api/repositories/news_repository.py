"""Repository for news articles."""

from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from datetime import date, datetime
from typing import List, Optional
import re

from api.models.agent_content import NewsArticle


class NewsRepository:
    """Repository for managing news articles in database."""

    def __init__(self, db: Session):
        self.db = db

    def create_article(
        self,
        title: str,
        source: str,
        link: str,
        summary: Optional[str] = None,
        content: Optional[str] = None,
        image_url: Optional[str] = None,
        thumbnail_url: Optional[str] = None,
        importance_score: int = 3,
        category: Optional[str] = None,
        published_date: Optional[datetime] = None,
        article_date: Optional[date] = None,
    ) -> NewsArticle:
        """Create a new news article."""
        if article_date is None:
            article_date = date.today()

        article = NewsArticle(
            title=title,
            source=source,
            link=link,
            summary=summary,
            content=content,
            image_url=image_url,
            thumbnail_url=thumbnail_url,
            importance_score=importance_score,
            category=category,
            published_date=published_date,
            article_date=article_date,
        )
        self.db.add(article)
        self.db.commit()
        self.db.refresh(article)
        return article

    def get_articles_by_date(
        self, target_date: Optional[date] = None, limit: Optional[int] = None
    ) -> List[NewsArticle]:
        """Get articles for a specific date (defaults to today)."""
        if target_date is None:
            target_date = date.today()

        query = (
            self.db.query(NewsArticle)
            .filter(NewsArticle.article_date == target_date)
            .order_by(desc(NewsArticle.importance_score), desc(NewsArticle.created_at))
        )

        if limit:
            query = query.limit(limit)

        return query.all()

    def get_latest_articles(self, limit: int = 10) -> List[NewsArticle]:
        """Get latest articles regardless of date, ordered by creation time."""
        return (
            self.db.query(NewsArticle)
            .order_by(desc(NewsArticle.created_at))
            .limit(limit)
            .all()
        )

    def get_article_by_link(
        self, link: str, article_date: Optional[date] = None
    ) -> Optional[NewsArticle]:
        """Check if an article with this link already exists."""
        query = self.db.query(NewsArticle).filter(NewsArticle.link == link)

        if article_date:
            query = query.filter(NewsArticle.article_date == article_date)

        return query.first()

    def has_articles_for_date(self, target_date: Optional[date] = None) -> bool:
        """Check if articles exist for a specific date."""
        if target_date is None:
            target_date = date.today()

        count = (
            self.db.query(NewsArticle)
            .filter(NewsArticle.article_date == target_date)
            .count()
        )

        return count > 0

    def delete_articles_by_date(self, target_date: date) -> int:
        """Delete all articles for a specific date."""
        deleted = (
            self.db.query(NewsArticle)
            .filter(NewsArticle.article_date == target_date)
            .delete()
        )
        self.db.commit()
        return deleted
