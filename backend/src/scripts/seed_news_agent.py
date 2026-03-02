# backend/src/scripts/seed_news_agent.py
"""
Seed script to add News Agent to the agents table

Run with:
    cd backend && source .venv/bin/activate
    python -m src.scripts.seed_news_agent
"""

import asyncio
import json
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NEWS_AGENT_DATA = {
    "name": "News Hub",
    "slug": "news",
    "description": "AI-powered news curator. Aggregates and summarizes tech, AI, and innovation news from 26+ authoritative sources.",
    "icon_url": "/icons/news-agent.png",
    "link": "/agents/news",
    "category": "Dev",
    "config": json.dumps({
        "model": "deepseek-r1",
        "system_prompt": "You are News Hub, an AI news curator. You aggregate, summarize, and present the latest tech, AI, and innovation news from authoritative sources.",
    }),
    "status": "idle",
    "sort_order": 1,  # First agent
}


async def seed_news_agent():
    """Execute seed script"""
    from ..core.config import settings
    from ..models import Agent

    DATABASE_URL = settings.DATABASE_URL
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession)

    logger.info("Starting News Agent seed...")

    async with AsyncSessionLocal() as session:
        # Check if News Agent already exists
        result = await session.execute(
            select(Agent).where(Agent.slug == NEWS_AGENT_DATA["slug"])
        )
        existing = result.scalar_one_or_none()

        if existing:
            logger.info(f"News Agent already exists (id={existing.id})")
            # Update if needed
            existing.name = NEWS_AGENT_DATA["name"]
            existing.description = NEWS_AGENT_DATA["description"]
            existing.link = NEWS_AGENT_DATA["link"]
            existing.config = NEWS_AGENT_DATA["config"]
            existing.status = NEWS_AGENT_DATA["status"]
            existing.sort_order = NEWS_AGENT_DATA["sort_order"]
            await session.commit()
            logger.info("News Agent updated")
        else:
            # Create News Agent
            agent = Agent(**NEWS_AGENT_DATA)
            session.add(agent)
            await session.commit()
            await session.refresh(agent)
            logger.info(f"News Agent added (id={agent.id})")

    logger.info("Seed completed")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_news_agent())
