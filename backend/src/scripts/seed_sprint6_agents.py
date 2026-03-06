# backend/src/scripts/seed_sprint6_agents.py
"""
Seed script to add Sprint 6 Agents (Task, Life, Review, Outfit)

Run with:
    cd backend && source .venv/bin/activate
    python -m src.scripts.seed_sprint6_agents
"""

import asyncio
import json
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Agent data for Sprint 6
SPRINT6_AGENTS = [
    {
        "name": "Task Flow",
        "slug": "task",
        "description": "AI-powered task manager. Intelligently generates and manages your daily tasks with priority tracking.",
        "icon_url": "/icons/task-agent.png",
        "link": "/agents/task",
        "category": "Productivity",
        "config": json.dumps({
            "model": "deepseek-r1",
            "system_prompt": "You are Task Flow, an AI task manager. You help users create, organize, and complete their daily tasks with intelligent prioritization.",
        }),
        "status": "idle",
        "sort_order": 2,
    },
    {
        "name": "Life Vital",
        "slug": "life",
        "description": "AI health tracker. Records health metrics and provides personalized wellness recommendations.",
        "icon_url": "/icons/life-agent.png",
        "link": "/agents/life",
        "category": "Health",
        "config": json.dumps({
            "model": "deepseek-r1",
            "system_prompt": "You are Life Vital, an AI health assistant. You track health metrics and provide personalized wellness recommendations.",
        }),
        "status": "idle",
        "sort_order": 3,
    },
    {
        "name": "Review Mate",
        "slug": "review",
        "description": "AI daily review companion. Helps you reflect on your day and track personal growth.",
        "icon_url": "/icons/review-agent.png",
        "link": "/agents/review",
        "category": "Productivity",
        "config": json.dumps({
            "model": "deepseek-r1",
            "system_prompt": "You are Review Mate, an AI daily review companion. You help users reflect on their day, celebrate wins, and identify areas for improvement.",
        }),
        "status": "idle",
        "sort_order": 4,
    },
    {
        "name": "Outfit AI",
        "slug": "outfit",
        "description": "AI outfit recommender. Suggests daily outfits based on weather, schedule, and personal style.",
        "icon_url": "/icons/outfit-agent.png",
        "link": "/agents/outfit",
        "category": "Lifestyle",
        "config": json.dumps({
            "model": "deepseek-r1",
            "system_prompt": "You are Outfit AI, a fashion assistant. You recommend daily outfits based on weather, schedule, and personal style preferences.",
        }),
        "status": "idle",
        "sort_order": 5,
    },
]


async def seed_sprint6_agents():
    """Execute seed script for Sprint 6 agents"""
    from ..core.config import settings
    from ..models import Agent

    DATABASE_URL = settings.DATABASE_URL
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession)

    logger.info("Starting Sprint 6 Agents seed...")

    async with AsyncSessionLocal() as session:
        for agent_data in SPRINT6_AGENTS:
            # Check if agent already exists
            result = await session.execute(
                select(Agent).where(Agent.slug == agent_data["slug"])
            )
            existing = result.scalar_one_or_none()

            if existing:
                logger.info(f"{agent_data['name']} already exists (id={existing.id}) - skipping")
            else:
                # Create agent
                agent = Agent(**agent_data)
                session.add(agent)
                logger.info(f"{agent_data['name']} added")

        await session.commit()
        logger.info("All Sprint 6 agents seeded successfully!")

    logger.info("Seed completed")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_sprint6_agents())
