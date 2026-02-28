# backend/src/agents/news/crawler.py
"""
NewsCrawler - 新闻爬虫引擎

支持 RSS feed 和普通 HTTP 网页爬取
"""

import logging
from datetime import datetime, timezone
from typing import Any, Optional
from html.parser import HTMLParser
from uuid import uuid4

import httpx
import feedparser

logger = logging.getLogger(__name__)


class HTMLContentParser(HTMLParser):
    """简单的 HTML 内容解析器，提取文章主要内容"""

    def __init__(self):
        super().__init__()
        self.title = ""
        self.content = ""
        self._in_title = False
        self._in_content = False
        self._title_tags = {"h1", "h2", "h3"}
        self._content_tags = {"p", "article", "section"}

    def handle_starttag(self, tag: str, attrs: list):
        tag_lower = tag.lower()
        if tag_lower in self._title_tags and not self.title:
            self._in_title = True
        if tag_lower in self._content_tags:
            self._in_content = True

    def handle_endtag(self, tag: str):
        if tag.lower() in self._title_tags:
            self._in_title = False
        if tag.lower() in self._content_tags:
            self._in_content = False

    def handle_data(self, data: str):
        if self._in_title and not self.title:
            self.title = data.strip()
        elif self._in_content:
            self.content += data + " "


class NewsCrawler:
    """
    新闻爬虫引擎

    功能:
    - RSS feed 解析
    - HTTP 网页爬取
    - 内容提取
    """

    def __init__(self, timeout: int = 30, max_concurrent: int = 5):
        self.timeout = timeout
        self.max_concurrent = max_concurrent
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """获取或创建 HTTP 客户端"""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(self.timeout),
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; NewsAgent/1.0)",
                    "Accept": "application/rss+xml, application/xml, text/html",
                },
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        """关闭 HTTP 客户端"""
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def fetch(self, url: str, source_type: str = "rss") -> list[dict]:
        """
        爬取新闻源

        Args:
            url: 新闻源 URL
            source_type: 类型 (rss / http)

        Returns:
            list[dict]: 文章列表
        """
        if source_type == "rss":
            return await self._fetch_rss(url)
        else:
            return await self._fetch_http(url)

    async def _fetch_rss(self, url: str) -> list[dict]:
        """
        获取 RSS feed

        Args:
            url: RSS feed URL

        Returns:
            list[dict]: 解析后的文章列表
        """
        logger.info(f"Fetching RSS feed: {url}")

        try:
            client = await self._get_client()
            response = await client.get(url)
            response.raise_for_status()

            # 解析 RSS feed
            feed = feedparser.parse(response.content)

            articles = []
            for entry in feed.entries:
                article = self._parse_rss_entry(entry)
                if article:
                    articles.append(article)

            logger.info(f"Parsed {len(articles)} entries from RSS feed")
            return articles

        except Exception as e:
            logger.error(f"Failed to fetch RSS feed: {e}")
            return []

    def _parse_rss_entry(self, entry: Any) -> Optional[dict]:
        """
        解析 RSS 条目

        Args:
            entry: RSS 条目

        Returns:
            dict: 解析后的文章数据
        """
        try:
            # 提取标题
            title = getattr(entry, "title", "")
            if not title:
                return None

            # 提取链接
            link = getattr(entry, "link", "")
            if not link:
                return None

            # 提取作者
            author = getattr(entry, "author", getattr(entry, "dc_creator", None))

            # 提取发布时间
            published_at = None
            published = getattr(entry, "published", None)
            if published:
                try:
                    # 尝试解析常见日期格式
                    published_at = datetime.fromisoformat(published.replace("Z", "+00:00"))
                except Exception:
                    pass

            # 提取内容/摘要
            content = ""
            for attr in ["content", "summary", "description"]:
                if hasattr(entry, attr):
                    value = getattr(entry, attr)
                    if isinstance(value, list):
                        value = value[0].get("value", "") if value else ""
                    content = value
                    if content:
                        break

            # 提取图片
            image_url = None
            if hasattr(entry, "media_thumbnail"):
                media = entry.media_thumbnail
                if isinstance(media, list) and len(media) > 0:
                    image_url = media[0].get("url")
            elif hasattr(entry, "enclosures"):
                for enclosure in entry.enclosures:
                    href = enclosure.get("href", "")
                    if any(href.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                        image_url = href
                        break

            # 提取标签
            tags = []
            if hasattr(entry, "tags"):
                tags = [tag["term"] for tag in entry.tags if "term" in tag]

            return {
                "id": f"rss_{uuid4().hex[:8]}",
                "title": title.strip(),
                "url": link,
                "author": author,
                "published_at": published_at,
                "content": self._strip_html(content) if content else "",
                "image_url": image_url,
                "tags": tags if tags else None,
            }

        except Exception as e:
            logger.warning(f"Failed to parse RSS entry: {e}")
            return None

    async def _fetch_http(self, url: str) -> list[dict]:
        """
        爬取 HTTP 网页

        Args:
            url: 网页 URL

        Returns:
            list[dict]: 单篇文章列表
        """
        logger.info(f"Fetching HTTP page: {url}")

        try:
            client = await self._get_client()
            response = await client.get(url)
            response.raise_for_status()

            # 解析 HTML 内容
            parser = HTMLContentParser()
            parser.feed(response.text)

            article = {
                "id": f"http_{uuid4().hex[:8]}",
                "title": parser.title or url.split("/")[-1],
                "url": url,
                "author": None,
                "published_at": datetime.now(timezone.utc),
                "content": parser.content.strip()[:10000],  # 限制长度
                "image_url": None,
                "tags": None,
            }

            return [article]

        except Exception as e:
            logger.error(f"Failed to fetch HTTP page: {e}")
            return []

    def _strip_html(self, html: str) -> str:
        """移除 HTML 标签，提取纯文本"""
        if not html:
            return ""

        # 简单实现：移除 HTML 标签
        import re
        text = re.sub(r"<[^>]+>", "", html)
        # 解码常见 HTML 实体
        text = text.replace("&nbsp;", " ")
        text = text.replace("&amp;", "&")
        text = text.replace("&lt;", "<")
        text = text.replace("&gt;", ">")
        text = text.replace("&quot;", '"')
        text = text.replace("&#39;", "'")
        # 移除多余空白
        text = " ".join(text.split())

        return text
