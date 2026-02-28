# backend/src/agents/news/summarizer.py
"""
Summarizer - AI 摘要生成器

使用 LLM API 生成新闻摘要
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class Summarizer:
    """
    AI 摘要生成器

    支持:
    - Anthropic Claude API
    - OpenAI API (可选)

    功能:
    - 单篇摘要
    - 批量摘要
    """

    DEFAULT_PROMPT = """请为以下新闻生成简洁的中文摘要：

要求：
1. 摘要长度控制在 100-200 字
2. 提炼核心要点，包括关键事实和数据
3. 使用客观、准确的语言
4. 不要添加原文没有的信息

新闻内容：
{content}

摘要："""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "claude-sonnet-4-6",
        provider: str = "anthropic",
        max_retries: int = 3
    ):
        self.api_key = api_key
        self.model = model
        self.provider = provider
        self.max_retries = max_retries
        self._client = None

        # 检查 API 密钥是否可用
        self._available = api_key is not None and len(api_key) > 0

        if not self._available:
            logger.warning("No API key provided, summarization will be skipped")

    def is_available(self) -> bool:
        """检查摘要服务是否可用"""
        return self._available

    async def summarize(self, content: str, max_length: int = 200) -> Optional[str]:
        """
        生成摘要

        Args:
            content: 文章内容
            max_length: 最大摘要长度

        Returns:
            str: 生成的摘要，失败返回 None
        """
        if not self._available:
            return None

        if not content or len(content.strip()) < 50:
            # 内容太短，不需要摘要
            return None

        # 截断过长的内容
        max_content_length = 8000
        if len(content) > max_content_length:
            content = content[:max_content_length] + "..."

        prompt = self.DEFAULT_PROMPT.format(content=content)

        for attempt in range(self.max_retries):
            try:
                if self.provider == "anthropic":
                    return await self._summarize_with_anthropic(prompt, max_length)
                elif self.provider == "openai":
                    return await self._summarize_with_openai(prompt, max_length)
                else:
                    logger.error(f"Unknown provider: {self.provider}")
                    return None

            except Exception as e:
                logger.warning(f"Summarization attempt {attempt + 1} failed: {e}")
                if attempt == self.max_retries - 1:
                    logger.error(f"All summarization attempts failed")
                    return None

        return None

    async def _summarize_with_anthropic(self, prompt: str, max_length: int) -> Optional[str]:
        """使用 Anthropic API 生成摘要"""
        try:
            # 延迟导入以避免依赖问题
            from anthropic import AsyncAnthropic

            if not self.api_key:
                raise ValueError("Anthropic API key not set")

            client = AsyncAnthropic(api_key=self.api_key)

            response = await client.messages.create(
                model=self.model,
                max_tokens=500,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            summary = response.content[0].text.strip()

            # 清理摘要
            summary = self._clean_summary(summary)

            logger.info(f"Generated summary using Anthropic {self.model}")
            return summary

        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise

    async def _summarize_with_openai(self, prompt: str, max_length: int) -> Optional[str]:
        """使用 OpenAI API 生成摘要"""
        try:
            # 延迟导入以避免依赖问题
            from openai import AsyncOpenAI

            if not self.api_key:
                raise ValueError("OpenAI API key not set")

            client = AsyncOpenAI(api_key=self.api_key)

            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=500
            )

            summary = response.choices[0].message.content.strip()

            # 清理摘要
            summary = self._clean_summary(summary)

            logger.info(f"Generated summary using OpenAI {self.model}")
            return summary

        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise

    def _clean_summary(self, summary: str) -> str:
        """清理摘要文本"""
        # 移除可能的引号或前缀
        summary = summary.strip('"\'')
        # 移除常见的前缀
        for prefix in ["摘要：", "摘要:", "Summary:", "总结：", "总结:"]:
            if summary.startswith(prefix):
                summary = summary[len(prefix):]
        return summary.strip()

    async def batch_summarize(
        self,
        articles: list[dict],
        concurrency: int = 3
    ) -> list[dict]:
        """
        批量生成摘要

        Args:
            articles: 文章列表
            concurrency: 并发数

        Returns:
            list[dict]: 带摘要的文章列表
        """
        import asyncio

        async def process_one(article: dict) -> dict:
            content = article.get("content", "")
            summary = await self.summarize(content)
            result = article.copy()
            result["summary"] = summary
            result["summary_model"] = self.model if summary else None
            return result

        # 使用信号量控制并发
        semaphore = asyncio.Semaphore(concurrency)

        async def limited_process(article: dict) -> dict:
            async with semaphore:
                return await process_one(article)

        tasks = [limited_process(article) for article in articles]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # 处理结果
        processed = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Batch summarization failed for article {i}: {result}")
                processed.append(articles[i])  # 保持原文，无摘要
            else:
                processed.append(result)

        return processed
