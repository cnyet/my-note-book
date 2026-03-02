# backend/src/scripts/init_and_seed.py
"""
Initialize database and run all seed scripts

Run with:
    cd backend && source .venv/bin/activate
    python -m src.scripts.init_and_seed
"""

import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    """Initialize database and run seeds"""
    from ..core.database import init_db
    from .seed_news_agent import seed_news_agent
    from .seed_news_sources import seed_news_sources

    # Initialize database
    logger.info("Initializing database...")
    await init_db()

    # Run news agent seed
    logger.info("Running news agent seed...")
    await seed_news_agent()

    # Run news sources seed
    logger.info("Running news sources seed...")
    await seed_news_sources()

    logger.info("All seeds completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())
