# backend/src/agents/news/agent.py
"""
NewsAgent - 新闻智能体主类

协调新闻爬取和摘要流程
"""

import logging
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from .crawler import NewsCrawler
from .summarizer import Summarizer
from ..manager import AgentManager, AgentStatus

logger = logging.getLogger(__name__)


class NewsAgent:
    """
    新闻智能体 - 协调爬取和摘要流程

    功能:
    - 管理新闻源
    - 定时爬取新闻
    - AI 生成摘要
    - 数据存储
    """

    def __init__(
        self,
        agent_id: str,
        session: AsyncSession,
        ollama_base_url: str = "http://localhost:11434",
        llm_model: str = "deepseek-r1"
    ):
        self.agent_id = agent_id
        self.session = session
        self.crawler = NewsCrawler()
        self.summarizer = Summarizer(ollama_base_url=ollama_base_url, model=llm_model, provider="ollama")
        self.manager = AgentManager(session)
        self._is_running = False

    async def start(self) -> None:
        """启动新闻智能体"""
        logger.info(f"NewsAgent {self.agent_id} starting...")
        self._is_running = True

        # 注册到 AgentManager
        try:
            await self.manager.spawn(self.agent_id, {"type": "news"})
            logger.info(f"NewsAgent {self.agent_id} registered with AgentManager")
        except Exception as e:
            logger.warning(f"Could not register with AgentManager: {e}")

    async def stop(self) -> None:
        """停止新闻智能体"""
        logger.info(f"NewsAgent {self.agent_id} stopping...")
        self._is_running = False

        # 从 AgentManager 注销
        try:
            await self.manager.terminate(self.agent_id, "user request")
        except Exception as e:
            logger.warning(f"Could not terminate with AgentManager: {e}")

    async def crawl_and_summarize(
        self,
        source_id: Optional[str] = None,
        daily_limit: int = 10
    ) -> int:
        """
        爬取并摘要新闻

        Args:
            source_id: 可选的新闻源 ID，如果不指定则爬取所有活跃源
            daily_limit: 每日爬取限制，默认 10 条

        Returns:
            int: 新增文章数量
        """
        from ..models import NewsSource, NewsArticle

        logger.info(f"Starting crawl job, source_id={source_id}, daily_limit={daily_limit}")

        # 更新状态为 BUSY
        try:
            await self.manager.update_status(self.agent_id, AgentStatus.BUSY)
        except Exception as e:
            logger.warning(f"Could not update agent status: {e}")

        articles_added = 0

        try:
            # 检查今日已爬取数量
            today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
            result = await self.session.execute(
                select(func.count(NewsArticle.id)).where(
                    NewsArticle.crawled_at >= today_start
                )
            )
            today_count = result.scalar() or 0

            if today_count >= daily_limit:
                logger.info(f"Daily limit reached ({daily_limit}), skipping crawl")
                return 0

            # 获取新闻源
            if source_id:
                result = await self.session.execute(
                    select(NewsSource).where(
                        NewsSource.id == source_id,
                        NewsSource.is_active == True
                    )
                )
                sources = [result.scalar_one_or_none()]
                sources = [s for s in sources if s]  # 过滤 None
            else:
                result = await self.session.execute(
                    select(NewsSource).where(NewsSource.is_active == True)
                )
                sources = result.scalars().all()

            if not sources:
                logger.warning("No active news sources found")
                return 0

            for source in sources:
                if not self._is_running:
                    logger.info("NewsAgent stopped, aborting crawl")
                    break

                # 检查是否达到每日限制
                if articles_added >= daily_limit:
                    logger.info(f"Daily limit ({daily_limit}) reached during crawl")
                    break

                try:
                    # 爬取新闻
                    raw_articles = await self.crawler.fetch(source.url, source.source_type)
                    logger.info(f"Fetched {len(raw_articles)} articles from {source.name}")

                    # 计算剩余可添加数量
                    remaining = daily_limit - articles_added

                    for raw_article in raw_articles[:remaining]:
                        # 检查文章是否已存在
                        existing = await self.session.execute(
                            select(NewsArticle).where(NewsArticle.url == raw_article["url"])
                        )
                        if existing.scalar_one_or_none():
                            continue

                        # 生成摘要
                        content = raw_article.get("content", "")
                        if content and self.summarizer.is_available():
                            try:
                                summary = await self.summarizer.summarize(content)
                                raw_article["summary"] = summary
                                raw_article["summary_model"] = self.summarizer.model
                            except Exception as e:
                                logger.error(f"Failed to summarize: {e}")
                                raw_article["summary"] = None
                        else:
                            raw_article["summary"] = None

                        # 创建文章记录
                        article = NewsArticle(
                            id=f"art_{uuid4().hex[:12]}",
                            source_id=source.id,
                            title=raw_article["title"],
                            url=raw_article["url"],
                            author=raw_article.get("author"),
                            published_at=raw_article.get("published_at"),
                            content=content[:10000] if content else None,
                            summary=raw_article.get("summary"),
                            summary_model=raw_article.get("summary_model"),
                            category=source.category,
                            tags=raw_article.get("tags"),
                            image_url=raw_article.get("image_url"),
                        )

                        self.session.add(article)
                        articles_added += 1

                        # 再次检查是否达到限制
                        if articles_added >= daily_limit:
                            logger.info(f"Daily limit ({daily_limit}) reached")
                            break

                    # 更新源的最后爬取时间
                    source.last_crawled_at = datetime.now(timezone.utc)

                except Exception as e:
                    logger.error(f"Error crawling {source.name}: {e}")
                    continue

            await self.session.commit()
            logger.info(f"Crawl complete. Added {articles_added} new articles (limit: {daily_limit})")

        except Exception as e:
            logger.error(f"Crawl job failed: {e}")
            await self.session.rollback()
            try:
                await self.manager.update_status(
                    self.agent_id,
                    AgentStatus.ERROR,
                    str(e)
                )
            except Exception:
                pass
            raise

        # 恢复 IDLE 状态
        try:
            await self.manager.update_status(self.agent_id, AgentStatus.IDLE)
        except Exception as e:
            logger.warning(f"Could not update agent status: {e}")

        return articles_added

    async def get_stats(self) -> dict:
        """获取统计信息"""
        from ..models import NewsSource, NewsArticle
        from sqlalchemy import func

        # 统计源数量
        result = await self.session.execute(
            select(func.count(NewsSource.id)).where(NewsSource.is_active == True)
        )
        active_sources = result.scalar() or 0

        # 统计文章数量
        result = await self.session.execute(
            select(func.count(NewsArticle.id))
        )
        total_articles = result.scalar() or 0

        # 统计有摘要的文章
        result = await self.session.execute(
            select(func.count(NewsArticle.id)).where(NewsArticle.summary.isnot(None))
        )
        summarized_articles = result.scalar() or 0

        return {
            "agent_id": self.agent_id,
            "is_running": self._is_running,
            "active_sources": active_sources,
            "total_articles": total_articles,
            "summarized_articles": summarized_articles,
        }
