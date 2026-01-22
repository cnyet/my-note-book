"""
News Secretary Agent - v2.0
Responsible for fetching and summarizing AI/technology news.
Refactored to inherit from BaseAgent with Memory support.
"""
import logging
from typing import Any, Dict, List
from agents.base import BaseAgent
import feedparser

logger = logging.getLogger(__name__)

class NewsAgent(BaseAgent):
    """AI-powered news briefing agent focused on AI/tech content."""

    def __init__(self, **kwargs):
        super().__init__(name="News", **kwargs)
        
        # Load specialized news config
        news_config = self.config_dict.get("news", {})
        self.articles_per_summary = int(news_config.get("articles_per_summary", 5))

    def _collect_data(self, **kwargs) -> str:
        """Step 1: Collect news from multiple sources."""
        logger.info("Collecting news from various sources...")
        all_news = []
        
        sources = [
            ("TechCrunch", "https://techcrunch.com/feed/"),
            ("The Verge", "https://www.theverge.com/rss/index.xml"),
            ("MIT Tech Review", "https://www.technologyreview.com/feed/")
        ]
        
        for name, url in sources:
            try:
                feed = feedparser.parse(url)
                source_content = []
                for entry in feed.entries[:10]:
                    source_content.append(f"Source: {name}\nTitle: {entry.title}\nLink: {entry.link}\n")
                all_news.append("\n".join(source_content))
            except Exception as e:
                logger.error(f"Error fetching from {name}: {e}")
                
        return "\n\n".join(all_news)

    def _process_with_llm(self, raw_data: str, historical_context: str = "", **kwargs) -> str:
        """Step 2: Summarize news using LLM with context awareness."""
        logger.info("Generating news briefing with LLM...")
        
        system_prompt = f"""
        You are a professional AI news curator. Create a structured briefing of the Top {self.articles_per_summary} 
        most important AI developments from the provided text.
        
        {historical_context}
        
        If previous news covers similar topics, mention the progression or connection.
        
        Format each article as:
        ## [Title in Chinese]
        - **Source**: [Source]
        - **Summary**: [2-3 sentences in Chinese]
        - **Link**: [URL]
        """
        
        return self.llm.simple_chat(
            user_message=raw_data,
            system_prompt=system_prompt,
            temperature=0.3
        )
