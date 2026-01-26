"""
News Secretary Agent - v2.0
Responsible for fetching and summarizing AI/technology news.
Refactored to inherit from BaseAgent with Memory support and DB synchronization.
"""
import logging
from typing import Any, Dict, List, Optional
from agents.base import BaseAgent
from api.database import SessionLocal
from api.repositories.news_repository import NewsRepository
import feedparser
import re
import socket

# Set timeout for socket operations globally to avoid hanging
socket.setdefaulttimeout(15)

logger = logging.getLogger(__name__)

class NewsAgent(BaseAgent):
    """AI-powered news briefing agent focused on AI/tech content."""

    def __init__(self, **kwargs):
        super().__init__(name="News", **kwargs)
        
        # Load specialized news config
        news_config = self.config_dict.get("news", {})
        self.articles_per_summary = int(news_config.get("articles_per_summary", 5))

    def _collect_data(self, **kwargs) -> List[Dict[str, Any]]:
        """Step 1: Collect news from multiple sources."""
        logger.info("Collecting news from various sources...")
        all_articles = []
        
        # Updated and validated sources
        sources = [
            ("TechCrunch", "https://techcrunch.com/category/artificial-intelligence/feed/"),
            ("The Verge", "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml"),
            ("MIT Tech Review", "https://www.technologyreview.com/topic/artificial-intelligence/feed/"),
            ("AI Base", "https://www.aibase.com/rss"), # Alternative fallback
            ("Hugging Face", "https://huggingface.co/blog/feed.xml")
        ]
        
        for name, url in sources:
            try:
                logger.info(f"Fetching from {name}...")
                feed = feedparser.parse(url)
                
                # Check for parsing errors
                if feed.bozo:
                    logger.warning(f"Feed parser bozo alert for {name}: {feed.bozo_exception}")
                
                entries_found = len(feed.entries)
                logger.info(f"Fetched {entries_found} entries from {name}")
                
                for entry in feed.entries[:10]:
                    all_articles.append({
                        "source": name,
                        "title": entry.title,
                        "link": entry.link,
                        "summary": entry.get("summary", ""),
                        "published": entry.get("published", "")
                    })
            except Exception as e:
                logger.error(f"Error fetching from {name}: {e}")
                
        if not all_articles:
            logger.warning("No articles fetched from any source!")
            
        return all_articles

    def _process_with_llm(self, raw_data: List[Dict[str, Any]], historical_context: str = "", **kwargs) -> str:
        """Step 2: Summarize news using LLM and save individual articles to DB."""
        if not raw_data:
            return "⚠️ 今日未能从新闻源获取到有效数据，请检查网络连接或稍后再试。"

        logger.info(f"Generating news briefing with LLM for {len(raw_data)} articles...")
        
        # 1. Format raw data for LLM analysis
        formatted_input = "\n".join([f"Source: {a['source']}\nTitle: {a['title']}\nLink: {a['link']}\n" for a in raw_data])
        
        system_prompt = f"""
        你是专业的 AI 科技新闻编辑。请从以下新闻中筛选出最值得关注的 {self.articles_per_summary} 条，并生成一份中文简报。
        
        {historical_context}
        
        要求：
        1. 必须包含新闻的中文标题、来源、中文摘要和原链接。
        2. 摘要应简明扼要，突出技术重点。
        3. 必须严格遵守以下 Markdown 格式输出每一条：

        ## [中文标题]
        - **Source**: [来源]
        - **Summary**: [2-3 句中文摘要]
        - **Link**: [URL]
        """
        
        try:
            briefing = self.llm.simple_chat(
                user_message=formatted_input,
                system_prompt=system_prompt,
                max_tokens=4000, temperature=0.3
            )
            
            logger.info("LLM generated briefing, parsing for database storage...")
            
            # 2. Parse and save to DB
            db_session = kwargs.get("db_session")
            if db_session:
                repo = NewsRepository(db_session)
                self._save_articles_to_db(briefing, repo)
            else:
                with SessionLocal() as db:
                    repo = NewsRepository(db)
                    self._save_articles_to_db(briefing, repo)
                    db.commit()
            
            return briefing
        except Exception as e:
            logger.error(f"Error in LLM processing or DB saving: {e}")
            return f"Error: {str(e)}"

    def _save_articles_to_db(self, briefing: str, repo: NewsRepository):
        """Parse markdown briefing and save individual articles to database."""
        # Standard pattern matching
        pattern = r"## (.*?)\n- \*\*Source\*\*: (.*?)\n- \*\*Summary\*\*: (.*?)\n- \*\*Link\*\*: (https?://\S+)"
        matches = re.findall(pattern, briefing, re.MULTILINE | re.DOTALL)
        
        if not matches:
            # Fallback patterns
            pattern_alt = r"## (.*?)\n.*?Source: (.*?)\n.*?Summary: (.*?)\n.*?Link: (https?://\S+)"
            matches = re.findall(pattern_alt, briefing, re.IGNORECASE | re.DOTALL)

        saved_count = 0
        for match in matches:
            try:
                title, source, summary, link = match
                clean_link = link.strip().split()[0].rstrip(')') # Clean markdown artifacts
                
                if not repo.get_article_by_link(clean_link):
                    repo.create_article(
                        title=title.strip(),
                        source=source.strip(),
                        summary=summary.strip(),
                        link=clean_link,
                        importance_score=4,
                        category="AI"
                    )
                    saved_count += 1
            except Exception as e:
                logger.error(f"Failed to parse or save news item: {e}")

        logger.info(f"Successfully saved {saved_count} curated articles to database.")

    def execute(self, save_to_file: bool = False, use_memory: bool = True, **kwargs) -> str:
        return super().execute(save_to_file=save_to_file, use_memory=use_memory, **kwargs)

