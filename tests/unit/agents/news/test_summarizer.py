"""
Summarizer 单元测试
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from backend.src.agents.news.summarizer import Summarizer


@pytest.mark.unit
class TestSummarizer:
    """摘要生成器测试"""

    @pytest.fixture
    def summarizer(self):
        """创建摘要器实例（使用 mock）"""
        with patch('backend.src.agents.news.summarizer.Summarizer._check_ollama_availability'):
            return Summarizer(ollama_base_url="http://localhost:11434", model="deepseek-r1")

    def test_init_default_values(self, summarizer):
        """测试初始化默认值"""
        assert summarizer.model == "deepseek-r1"
        assert summarizer.provider == "ollama"
        assert summarizer.max_retries == 3
        assert summarizer._available == True

    def test_is_available(self, summarizer):
        """测试可用性检查"""
        assert summarizer.is_available() == True

    def test_is_available_when_unavailable(self, summarizer):
        """测试不可用状态"""
        summarizer._available = False
        assert summarizer.is_available() == False

    @pytest.mark.asyncio
    async def test_summarize_empty_content(self, summarizer):
        """测试空内容摘要"""
        result = await summarizer.summarize("")
        assert result is None  # 空内容应该返回 None

    @pytest.mark.asyncio
    async def test_summarize_short_content(self, summarizer):
        """测试短内容摘要"""
        result = await summarizer.summarize("Short text")
        assert result is None  # 太短的内容应该返回 None

    @pytest.mark.asyncio
    async def test_summarize_truncates_long_content(self, summarizer):
        """测试长内容截断"""
        long_content = "x" * 10000  # 10000 字符
        with patch.object(summarizer, '_summarize_with_ollama', new_callable=AsyncMock) as mock_summarize:
            mock_summarize.return_value = "Summary"
            await summarizer.summarize(long_content)
            # 验证传递给 summarize 的内容被截断
            call_args = mock_summarize.call_args[0][0]
            assert len(call_args) < 9000  # 应该被截断到 8000 左右

    @pytest.mark.asyncio
    async def test_summarize_with_ollama_success(self, summarizer):
        """测试 Ollama 摘要成功"""
        import httpx
        with patch('httpx.AsyncClient') as mock_client_class:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"response": "  Generated summary  "}
            mock_client = MagicMock()
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=None)
            mock_client.post = AsyncMock(return_value=mock_response)
            mock_client_class.return_value = mock_client

            result = await summarizer._summarize_with_ollama("Test prompt", 200)

            assert result == "Generated summary"  # 应该被清理

    @pytest.mark.asyncio
    async def test_summarize_with_ollama_failure(self, summarizer):
        """测试 Ollama 摘要失败"""
        import httpx
        with patch('httpx.AsyncClient') as mock_client_class:
            mock_client = MagicMock()
            mock_client.__aenter__ = AsyncMock(side_effect=Exception("Connection error"))
            mock_client.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client

            with pytest.raises(Exception):
                await summarizer._summarize_with_ollama("Test prompt", 200)

    @pytest.mark.asyncio
    async def test_clean_summary_removes_prefixes(self, summarizer):
        """测试摘要清理 - 移除前缀"""
        test_cases = [
            ('"Summary text"', "Summary text"),
            ("'Summary text'", "Summary text"),
            ("摘要：这是摘要", "这是摘要"),
            ("摘要：这是摘要", "这是摘要"),
            ("Summary: This is summary", "This is summary"),
            ("总结：总结内容", "总结内容"),
        ]

        for input_val, expected in test_cases:
            result = summarizer._clean_summary(input_val)
            assert result == expected

    @pytest.mark.asyncio
    async def test_clean_summary_no_prefix(self, summarizer):
        """测试摘要清理 - 无前缀"""
        result = summarizer._clean_summary("Clean summary")
        assert result == "Clean summary"

    @pytest.mark.asyncio
    async def test_batch_summarize_success(self, summarizer):
        """测试批量摘要成功"""
        articles = [
            {"id": "1", "content": "x" * 100},
            {"id": "2", "content": "y" * 100},
        ]

        with patch.object(summarizer, 'summarize', new_callable=AsyncMock) as mock_summarize:
            mock_summarize.side_effect = ["Summary 1", "Summary 2"]

            results = await summarizer.batch_summarize(articles, concurrency=2)

            assert len(results) == 2
            assert results[0]["summary"] == "Summary 1"
            assert results[1]["summary"] == "Summary 2"

    @pytest.mark.asyncio
    async def test_batch_summarize_partial_failure(self, summarizer):
        """测试批量摘要部分失败"""
        articles = [
            {"id": "1", "content": "x" * 100},
            {"id": "2", "content": "y" * 100},
        ]

        with patch.object(summarizer, 'summarize', new_callable=AsyncMock) as mock_summarize:
            mock_summarize.side_effect = ["Summary 1", Exception("Failed")]

            results = await summarizer.batch_summarize(articles, concurrency=2)

            assert len(results) == 2
            assert results[0]["summary"] == "Summary 1"
            # 失败的文章保留原始数据，无摘要
            assert results[1].get("summary") is None

    @pytest.mark.asyncio
    async def test_batch_summarize_concurrency(self, summarizer):
        """测试批量摘要并发控制"""
        articles = [{"id": str(i), "content": "x" * 100} for i in range(5)]

        with patch.object(summarizer, 'summarize', new_callable=AsyncMock) as mock_summarize:
            mock_summarize.return_value = "Summary"

            results = await summarizer.batch_summarize(articles, concurrency=2)

            assert len(results) == 5
            assert mock_summarize.call_count == 5


@pytest.mark.unit
class TestSummarizerProviders:
    """不同提供者测试"""

    @pytest.fixture
    def anthropic_summarizer(self):
        """创建 Anthropic 摘要器"""
        with patch('backend.src.agents.news.summarizer.Summarizer._check_ollama_availability'):
            return Summarizer(
                api_key="test-key",
                provider="anthropic",
                model="claude-3-sonnet-20240229"
            )

    @pytest.mark.asyncio
    async def test_anthropic_missing_api_key(self, anthropic_summarizer):
        """测试 Anthropic 缺少 API 密钥"""
        anthropic_summarizer.api_key = None
        with pytest.raises(ValueError, match="Anthropic API key not set"):
            await anthropic_summarizer._summarize_with_anthropic("Prompt", 200)
