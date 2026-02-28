# backend/src/scripts/seed_news_sources.py
"""
Seed script to populate news sources table with default values

Run with:
    cd backend && source .venv/bin/activate
    python -m src.scripts.seed_news_sources
"""

import asyncio
import logging
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 默认新闻源列表 - 聚焦科技、AI、创新领域
DEFAULT_NEWS_SOURCES = [
    # ==================== 学术界/研究机构 ====================
    {
        "name": "arXiv CS.AI",
        "url": "https://arxiv.org/list/cs.AI/recent",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,  # 每天
    },
    {
        "name": "arXiv AI",
        "url": "https://arxiv.org/list/cs.CL/recent",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "Google AI Blog",
        "url": "https://ai.google/blog/",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "OpenAI Blog",
        "url": "https://openai.com/blog",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "DeepMind Blog",
        "url": "https://deepmind.google/discover/blog/",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "MIT CSAIL",
        "url": "https://www.csail.mit.edu/news",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "Stanford HAI",
        "url": "https://hai.stanford.edu/news",
        "source_type": "http",
        "category": "research",
        "language": "en",
        "crawl_interval": 86400,
    },

    # ==================== 科技媒体 ====================
    {
        "name": "Hacker News",
        "url": "https://news.ycombinator.com/rss",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,  # 每小时
    },
    {
        "name": "The Verge AI",
        "url": "https://www.theverge.com/ai-artificial-intelligence/rss",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "Wired AI",
        "url": "https://www.wired.com/feed/category/artificial-intelligence/latest/rss",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "MIT Technology Review",
        "url": "https://www.technologyreview.com/feed/",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "Ars Technica AI",
        "url": "https://arstechnica.com/ai/feed/",
        "source_type": "rss",
        "category": "tech",
        "language": "en",
        "crawl_interval": 3600,
    },

    # ==================== 国内媒体 ====================
    {
        "name": "机器之心",
        "url": "https://www.jiqizhixin.com/rss",
        "source_type": "rss",
        "category": "tech",
        "language": "zh",
        "crawl_interval": 3600,
    },
    {
        "name": "36 氪 AI",
        "url": "https://36kr.com/topics/ai/feed",
        "source_type": "rss",
        "category": "tech",
        "language": "zh",
        "crawl_interval": 3600,
    },
    {
        "name": "量子位",
        "url": "https://www.qbitai.com/feed",
        "source_type": "rss",
        "category": "tech",
        "language": "zh",
        "crawl_interval": 3600,
    },
    {
        "name": "新智元",
        "url": "https://www.neweekly.com.cn/feed",
        "source_type": "rss",
        "category": "tech",
        "language": "zh",
        "crawl_interval": 3600,
    },
    {
        "name": "AI 科技评论",
        "url": "https://www.aitechtalk.com/feed",
        "source_type": "rss",
        "category": "tech",
        "language": "zh",
        "crawl_interval": 3600,
    },

    # ==================== 社区/论坛 ====================
    {
        "name": "Reddit ML",
        "url": "https://www.reddit.com/r/MachineLearning.rss",
        "source_type": "rss",
        "category": "community",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "Reddit AI",
        "url": "https://www.reddit.com/r/ArtificialIntelligence.rss",
        "source_type": "rss",
        "category": "community",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "Reddit LocalLLaMA",
        "url": "https://www.reddit.com/r/LocalLLaMA.rss",
        "source_type": "rss",
        "category": "community",
        "language": "en",
        "crawl_interval": 3600,
    },
    {
        "name": "Lobsters AI",
        "url": "https://lobste.rs/t/ai.rss",
        "source_type": "rss",
        "category": "community",
        "language": "en",
        "crawl_interval": 3600,
    },

    # ==================== 企业/产品 ====================
    {
        "name": "Anthropic Blog",
        "url": "https://www.anthropic.com/news",
        "source_type": "http",
        "category": "company",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "Cohere Blog",
        "url": "https://cohere.com/blog",
        "source_type": "http",
        "category": "company",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "Hugging Face Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "source_type": "rss",
        "category": "company",
        "language": "en",
        "crawl_interval": 86400,
    },
    {
        "name": "Lambda Lab",
        "url": "https://lambdalabs.com/blog/feed",
        "source_type": "rss",
        "category": "company",
        "language": "en",
        "crawl_interval": 86400,
    },
]


async def seed_news_sources():
    """执行种子脚本"""
    from ..core.config import settings
    from ..models import NewsSource

    # 创建数据库引擎
    DATABASE_URL = settings.DATABASE_URL
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession)

    logger.info("Starting news sources seed...")

    async with AsyncSessionLocal() as session:
        added_count = 0
        skipped_count = 0

        for source_data in DEFAULT_NEWS_SOURCES:
            # 检查是否已存在
            result = await session.execute(
                select(NewsSource).where(NewsSource.url == source_data["url"])
            )
            existing = result.scalar_one_or_none()

            if existing:
                logger.info(f"Skipping '{source_data['name']}' (already exists)")
                skipped_count += 1
                continue

            # 创建新源
            from uuid import uuid4
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name=source_data["name"],
                url=source_data["url"],
                source_type=source_data["source_type"],
                category=source_data["category"],
                language=source_data["language"],
                crawl_interval=source_data["crawl_interval"],
                is_active=True,
            )

            session.add(source)
            added_count += 1
            logger.info(f"Added '{source_data['name']}' ({source_data['category']})")

        await session.commit()

    logger.info(f"Seed completed: {added_count} added, {skipped_count} skipped")

    # 关闭引擎
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_news_sources())
