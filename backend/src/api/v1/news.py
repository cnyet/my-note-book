# backend/src/api/v1/news.py
"""
News API - 新闻相关接口

提供新闻查询、源管理、刷新等功能
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...models import NewsSource, NewsArticle
from ...agents.news.agent import NewsAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/news", tags=["news"])


# ==================== Schemas ====================


class NewsSourceCreate(BaseModel):
    """创建新闻源请求"""
    name: str = Field(..., description="新闻源名称")
    url: str = Field(..., description="新闻源 URL")
    source_type: str = Field(default="rss", description="类型：rss 或 http")
    category: Optional[str] = Field(None, description="分类")
    language: str = Field(default="zh", description="语言")
    crawl_interval: int = Field(default=3600, description="爬取间隔（秒）")


class NewsSourceResponse(BaseModel):
    """新闻源响应"""
    id: str
    name: str
    url: str
    source_type: str
    category: Optional[str]
    language: str
    is_active: bool
    crawl_interval: int
    last_crawled_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class NewsArticleResponse(BaseModel):
    """新闻文章响应"""
    id: str
    source_id: str
    source_name: Optional[str]
    title: str
    url: str
    author: Optional[str]
    published_at: Optional[datetime]
    crawled_at: datetime
    summary: Optional[str]
    category: Optional[str]
    tags: Optional[List[str]]
    image_url: Optional[str]
    is_featured: bool
    view_count: int


class NewsListResponse(BaseModel):
    """新闻列表响应"""
    articles: List[NewsArticleResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class RefreshRequest(BaseModel):
    """手动刷新请求"""
    source_ids: Optional[List[str]] = Field(None, description="指定新闻源 ID 列表，不传则刷新所有")


class NewsStatsResponse(BaseModel):
    """新闻统计响应"""
    active_sources: int
    total_sources: int
    total_articles: int
    summarized_articles: int
    featured_articles: int
    last_crawl_time: Optional[datetime]


# ==================== Helper Functions ====================


async def get_news_agent(db: AsyncSession) -> NewsAgent:
    """获取 NewsAgent 实例"""
    # 使用默认的 agent_id
    agent = NewsAgent(agent_id="news_agent_001", session=db)
    return agent


def article_to_response(article: NewsArticle, source_name: Optional[str] = None) -> NewsArticleResponse:
    """转换文章模型为响应对象"""
    return NewsArticleResponse(
        id=article.id,
        source_id=article.source_id,
        source_name=source_name,
        title=article.title,
        url=article.url,
        author=article.author,
        published_at=article.published_at,
        crawled_at=article.crawled_at,
        summary=article.summary,
        category=article.category,
        tags=article.tags or [],
        image_url=article.image_url,
        is_featured=article.is_featured,
        view_count=article.view_count,
    )


# ==================== Source Endpoints ====================
# NOTE: /sources must be registered BEFORE /{article_id} to avoid route conflicts


@router.get("/sources", response_model=List[NewsSourceResponse])
async def get_sources(
    db: AsyncSession = Depends(get_db),
    active_only: bool = Query(True, description="是否只看活跃源"),
):
    """获取所有新闻源"""
    query = select(NewsSource).order_by(desc(NewsSource.created_at))
    if active_only:
        query = query.where(NewsSource.is_active == True)

    result = await db.execute(query)
    sources = result.scalars().all()

    return [
        NewsSourceResponse(
            id=s.id,
            name=s.name,
            url=s.url,
            source_type=s.source_type,
            category=s.category,
            language=s.language,
            is_active=s.is_active,
            crawl_interval=s.crawl_interval,
            last_crawled_at=s.last_crawled_at,
            created_at=s.created_at,
            updated_at=s.updated_at,
        )
        for s in sources
    ]


@router.post("/sources", response_model=NewsSourceResponse)
async def create_source(
    source_data: NewsSourceCreate,
    db: AsyncSession = Depends(get_db),
):
    """添加新闻源"""
    from uuid import uuid4

    source = NewsSource(
        id=f"src_{uuid4().hex[:12]}",
        name=source_data.name,
        url=source_data.url,
        source_type=source_data.source_type,
        category=source_data.category,
        language=source_data.language,
        crawl_interval=source_data.crawl_interval,
        is_active=True,
    )

    db.add(source)
    await db.commit()
    await db.refresh(source)

    return NewsSourceResponse(
        id=source.id,
        name=source.name,
        url=source.url,
        source_type=source.source_type,
        category=source.category,
        language=source.language,
        is_active=source.is_active,
        crawl_interval=source.crawl_interval,
        last_crawled_at=source.last_crawled_at,
        created_at=source.created_at,
        updated_at=source.updated_at,
    )


@router.delete("/sources/{source_id}")
async def delete_source(
    source_id: str,
    db: AsyncSession = Depends(get_db),
):
    """删除新闻源"""
    result = await db.execute(
        select(NewsSource).where(NewsSource.id == source_id)
    )
    source = result.scalar_one_or_none()

    if not source:
        raise HTTPException(status_code=404, detail="新闻源不存在")

    await db.delete(source)
    await db.commit()

    return {"message": "新闻源已删除"}


@router.post("/sources/{source_id}/toggle")
async def toggle_source(
    source_id: str,
    db: AsyncSession = Depends(get_db),
):
    """切换新闻源状态"""
    result = await db.execute(
        select(NewsSource).where(NewsSource.id == source_id)
    )
    source = result.scalar_one_or_none()

    if not source:
        raise HTTPException(status_code=404, detail="新闻源不存在")

    source.is_active = not source.is_active
    await db.commit()

    return {"is_active": source.is_active}


# ==================== Stats Endpoint ====================
# NOTE: /stats must be registered BEFORE /{article_id}


@router.get("/stats", response_model=NewsStatsResponse)
async def get_news_stats(
    db: AsyncSession = Depends(get_db),
):
    """获取新闻统计信息"""
    # 统计源
    active_sources_result = await db.execute(
        select(func.count(NewsSource.id)).where(NewsSource.is_active == True)
    )
    active_sources = active_sources_result.scalar() or 0

    total_sources_result = await db.execute(select(func.count(NewsSource.id)))
    total_sources = total_sources_result.scalar() or 0

    # 统计文章
    total_articles_result = await db.execute(select(func.count(NewsArticle.id)))
    total_articles = total_articles_result.scalar() or 0

    summarized_result = await db.execute(
        select(func.count(NewsArticle.id)).where(NewsArticle.summary.isnot(None))
    )
    summarized = summarized_result.scalar() or 0

    featured_result = await db.execute(
        select(func.count(NewsArticle.id)).where(NewsArticle.is_featured == True)
    )
    featured = featured_result.scalar() or 0

    # 最后爬取时间
    last_crawl_result = await db.execute(
        select(func.max(NewsSource.last_crawled_at)).where(NewsSource.is_active == True)
    )
    last_crawl = last_crawl_result.scalar()

    return NewsStatsResponse(
        active_sources=active_sources,
        total_sources=total_sources,
        total_articles=total_articles,
        summarized_articles=summarized,
        featured_articles=featured,
        last_crawl_time=last_crawl,
    )


# ==================== Refresh Endpoint ====================


@router.post("/refresh")
async def refresh_news(
    request: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """手动刷新新闻"""
    news_agent = await get_news_agent(db)

    try:
        if request.source_ids:
            # 刷新指定源
            total_added = 0
            for source_id in request.source_ids:
                added = await news_agent.crawl_and_summarize(source_id)
                total_added += added
            added_count = total_added
        else:
            # 刷新所有
            added_count = await news_agent.crawl_and_summarize()

        return {
            "status": "success",
            "message": f"Added {added_count} new articles",
            "added_count": added_count,
        }

    except Exception as e:
        logger.error(f"Refresh failed: {e}")
        raise HTTPException(status_code=500, detail=f"刷新失败：{str(e)}")


# ==================== News Endpoints ====================
# Dynamic routes registered LAST


@router.get("", response_model=NewsListResponse)
async def get_news_list(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    category: Optional[str] = Query(None, description="分类筛选"),
    source_id: Optional[str] = Query(None, description="新闻源筛选"),
    featured: Optional[bool] = Query(None, description="只看精选"),
):
    """获取新闻列表"""
    # 构建查询
    query = select(NewsArticle).order_by(desc(NewsArticle.published_at))

    # 应用筛选
    if category:
        query = query.where(NewsArticle.category == category)
    if source_id:
        query = query.where(NewsArticle.source_id == source_id)
    if featured is not None:
        query = query.where(NewsArticle.is_featured == featured)

    # 分页
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    # 执行查询
    result = await db.execute(query)
    articles = result.scalars().all()

    # 获取总数
    count_query = select(func.count(NewsArticle.id))
    if category:
        count_query = count_query.where(NewsArticle.category == category)
    if source_id:
        count_query = count_query.where(NewsArticle.source_id == source_id)
    if featured is not None:
        count_query = count_query.where(NewsArticle.is_featured == featured)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 获取源名称
    source_ids = list(set(a.source_id for a in articles))
    sources_map = {}
    if source_ids:
        sources_result = await db.execute(
            select(NewsSource.id, NewsSource.name).where(NewsSource.id.in_(source_ids))
        )
        sources_map = {row[0]: row[1] for row in sources_result.all()}

    return NewsListResponse(
        articles=[
            article_to_response(article, sources_map.get(article.source_id))
            for article in articles
        ],
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total,
    )


@router.get("/{article_id}", response_model=NewsArticleResponse)
async def get_article(
    article_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取单篇文章详情"""
    result = await db.execute(
        select(NewsArticle).where(NewsArticle.id == article_id)
    )
    article = result.scalar_one_or_none()

    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 增加阅读量
    article.view_count += 1
    await db.commit()

    # 获取源名称
    source_result = await db.execute(
        select(NewsSource.name).where(NewsSource.id == article.source_id)
    )
    source_name = source_result.scalar_one_or_none()

    return article_to_response(article, source_name)
