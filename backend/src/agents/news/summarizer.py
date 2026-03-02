# backend/src/agents/news/summarizer.py
"""
Summarizer - AI 摘要生成器

使用本地 Ollama 部署的 deepseek-r1 模型生成新闻摘要
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class Summarizer:
    """
    AI 摘要生成器

    支持:
    - Ollama (deepseek-r1) - 本地部署
    - Anthropic Claude API (可选)
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
        ollama_base_url: str = "http://localhost:11434",
        model: str = "deepseek-r1",
        api_key: Optional[str] = None,
        provider: str = "ollama",
        max_retries: int = 3
    ):
        self.ollama_base_url = ollama_base_url
        self.api_key = api_key
        self.model = model
        self.provider = provider
        self.max_retries = max_retries
        self._available = True

        # 对于 Ollama，检查服务是否可访问
        if provider == "ollama":
            self._check_ollama_availability()

    def _check_ollama_availability(self) -> None:
        """检查 Ollama 服务是否可用"""
        import httpx
        try:
            # 简单检查 Ollama 服务
            with httpx.Client(timeout=5.0) as client:
                response = client.get(f"{self.ollama_base_url}/api/tags")
                if response.status_code == 200:
                    logger.info(f"Ollama service available at {self.ollama_base_url}")
                    self._available = True
                else:
                    logger.warning(f"Ollama service returned status {response.status_code}")
                    self._available = False
        except Exception as e:
            logger.warning(f"Could not connect to Ollama: {e}. Summarization will be skipped.")
            self._available = False

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
                if self.provider == "ollama":
                    return await self._summarize_with_ollama(prompt, max_length)
                elif self.provider == "anthropic":
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

    async def _summarize_with_ollama(self, prompt: str, max_length: int) -> Optional[str]:
        """使用本地 Ollama 服务生成摘要"""
        try:
            import httpx

            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.ollama_base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.3,
                            "top_p": 0.9,
                            "num_predict": 500
                        }
                    }
                )
                response.raise_for_status()
                result = response.json()
                summary = result.get("response", "").strip()

                # 清理摘要
                summary = self._clean_summary(summary)

                logger.info(f"Generated summary using Ollama {self.model}")
                return summary

        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            raise

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
