"""
NewsCrawler 单元测试
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from backend.src.agents.news.crawler import NewsCrawler, HTMLContentParser


@pytest.mark.unit
class TestHTMLContentParser:
    """HTML 内容解析器测试"""

    def test_extract_title_from_h1(self):
        """测试从 H1 标签提取标题"""
        parser = HTMLContentParser()
        parser.feed("<html><body><h1>Test Title</h1></body></html>")
        assert parser.title == "Test Title"

    def test_extract_title_from_h2(self):
        """测试从 H2 标签提取标题"""
        parser = HTMLContentParser()
        parser.feed("<html><body><h2>Test Title H2</h2></body></html>")
        assert parser.title == "Test Title H2"

    def test_extract_paragraph_content(self):
        """测试提取段落内容"""
        parser = HTMLContentParser()
        parser.feed("<html><body><p>This is test content.</p></body></html>")
        assert "This is test content." in parser.content

    def test_extract_multiple_paragraphs(self):
        """测试提取多个段落"""
        parser = HTMLContentParser()
        html = """
        <html>
            <body>
                <h1>Article Title</h1>
                <p>First paragraph.</p>
                <p>Second paragraph.</p>
            </body>
        </html>
        """
        parser.feed(html)
        assert parser.title == "Article Title"
        assert "First paragraph." in parser.content
        assert "Second paragraph." in parser.content

    def test_empty_html(self):
        """测试空 HTML"""
        parser = HTMLContentParser()
        parser.feed("")
        assert parser.title == ""
        assert parser.content == ""


@pytest.mark.unit
class TestNewsCrawler:
    """新闻爬虫测试"""

    @pytest.fixture
    def crawler(self):
        """创建爬虫实例"""
        return NewsCrawler(timeout=5, max_concurrent=2)

    @pytest.mark.asyncio
    async def test_parse_rss_entry_with_all_fields(self):
        """测试解析完整的 RSS 条目"""
        crawler = NewsCrawler()

        # 模拟 RSS 条目
        mock_entry = MagicMock()
        mock_entry.title = "Test Article"
        mock_entry.link = "https://example.com/article"
        mock_entry.author = "Test Author"
        mock_entry.published = "2024-01-01T12:00:00Z"
        mock_entry.content = [{"value": "Full article content here."}]
        mock_entry.summary = "Article summary"
        mock_entry.media_thumbnail = [{"url": "https://example.com/image.jpg"}]
        mock_entry.tags = [{"term": "AI"}, {"term": "Tech"}]

        result = crawler._parse_rss_entry(mock_entry)

        assert result is not None
        assert result["title"] == "Test Article"
        assert result["url"] == "https://example.com/article"
        assert result["author"] == "Test Author"
        assert result["content"] == "Full article content here."
        assert result["image_url"] == "https://example.com/image.jpg"
        assert result["tags"] == ["AI", "Tech"]

    @pytest.mark.asyncio
    async def test_parse_rss_entry_missing_title(self):
        """测试解析缺少标题的 RSS 条目"""
        crawler = NewsCrawler()

        mock_entry = MagicMock()
        mock_entry.title = ""
        mock_entry.link = "https://example.com/article"

        result = crawler._parse_rss_entry(mock_entry)
        assert result is None  # 没有标题应该返回 None

    @pytest.mark.asyncio
    async def test_parse_rss_entry_missing_link(self):
        """测试解析缺少链接的 RSS 条目"""
        crawler = NewsCrawler()

        mock_entry = MagicMock()
        mock_entry.title = "Test Article"
        mock_entry.link = ""

        result = crawler._parse_rss_entry(mock_entry)
        assert result is None  # 没有链接应该返回 None

    @pytest.mark.asyncio
    async def test_parse_rss_entry_minimal_fields(self):
        """测试解析最小化的 RSS 条目"""
        crawler = NewsCrawler()

        mock_entry = MagicMock()
        mock_entry.title = "Minimal Article"
        mock_entry.link = "https://example.com/minimal"
        mock_entry.author = None
        mock_entry.published = None
        mock_entry.content = []
        mock_entry.summary = ""
        mock_entry.description = ""  # 添加 description
        mock_entry.media_thumbnail = []
        mock_entry.enclosures = []  # 添加 enclosures
        mock_entry.tags = []

        result = crawler._parse_rss_entry(mock_entry)

        assert result is not None
        assert result["title"] == "Minimal Article"
        assert result["url"] == "https://example.com/minimal"
        assert result["author"] is None
        assert result["image_url"] is None

    def test_strip_html(self):
        """测试 HTML 清理"""
        crawler = NewsCrawler()

        html = "<p>This is <strong>bold</strong> text.</p>"
        result = crawler._strip_html(html)
        assert result == "This is bold text."

    def test_strip_html_with_entities(self):
        """测试 HTML 实体解码"""
        crawler = NewsCrawler()

        html = "Tom &amp; Jerry &lt;3"
        result = crawler._strip_html(html)
        assert result == "Tom & Jerry <3"

    def test_strip_html_empty_input(self):
        """测试空输入"""
        crawler = NewsCrawler()
        assert crawler._strip_html("") == ""
        assert crawler._strip_html(None) == ""

    @pytest.mark.asyncio
    async def test_fetch_rss_mock(self):
        """测试 RSS 爬取（模拟）"""
        crawler = NewsCrawler()

        with patch.object(crawler, '_fetch_rss', new_callable=AsyncMock) as mock_fetch:
            mock_fetch.return_value = [
                {"title": "Mock Article", "url": "https://example.com"}
            ]

            result = await crawler.fetch("https://example.com/rss", "rss")

            assert len(result) == 1
            assert result[0]["title"] == "Mock Article"
            mock_fetch.assert_called_once_with("https://example.com/rss")

    @pytest.mark.asyncio
    async def test_fetch_http_mock(self):
        """测试 HTTP 爬取（模拟）"""
        crawler = NewsCrawler()

        with patch.object(crawler, '_fetch_http', new_callable=AsyncMock) as mock_fetch:
            mock_fetch.return_value = [
                {"title": "HTTP Article", "url": "https://example.com/article"}
            ]

            result = await crawler.fetch("https://example.com/article", "http")

            assert len(result) == 1
            assert result[0]["title"] == "HTTP Article"
            mock_fetch.assert_called_once_with("https://example.com/article")

    @pytest.mark.asyncio
    async def test_close_client(self):
        """测试关闭客户端"""
        crawler = NewsCrawler()
        await crawler.close()  # 应该不会报错
        assert crawler._client is None
