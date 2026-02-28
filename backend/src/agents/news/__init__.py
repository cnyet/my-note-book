# backend/src/agents/news/__init__.py
"""
News Agent - 新闻爬取和摘要智能体

核心组件:
- NewsAgent: 主协调类
- NewsCrawler: 爬虫引擎
- Summarizer: AI 摘要生成器
- NewsScheduler: 定时调度器
"""

from .agent import NewsAgent
from .crawler import NewsCrawler
from .summarizer import Summarizer
from .scheduler import NewsScheduler

__all__ = ["NewsAgent", "NewsCrawler", "Summarizer", "NewsScheduler"]
