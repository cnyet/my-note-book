"""
LLM Client Wrapper for Life Assistant System
Supports Claude models (Sonnet 3.5 for main tasks, Haiku for lightweight tasks)
"""

import anthropic
from typing import List, Dict, Optional, Any
import time


class LLMClient:
    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20241022") -> None:
        """
        Initialize LLM client

        Args:
            api_key: Anthropic API key
            model: Model name, defaults to Claude Sonnet 3.5
        """
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.lightweight_model = "claude-3-5-haiku-20241022"

    def send_message(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: str = "",
        max_tokens: int = 4000,
        temperature: float = 0.7,
        is_lightweight: bool = False
    ) -> str:
        """
        Send message to LLM and get response

        Args:
            messages: List of conversation messages
            system_prompt: System prompt for context
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            is_lightweight: If True, use Haiku model for faster/cheaper tasks

        Returns:
            str: LLM response text
        """
        try:
            model = self.lightweight_model if is_lightweight else self.model

            response = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=messages  # type: ignore[arg-type]
            )

            return response.content[0].text  # type: ignore[union-attr]

        except Exception as e:
            print(f"Error calling LLM API: {e}")
            return ""

    def simple_chat(
        self,
        user_message: str,
        system_prompt: str = "",
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Simplified chat interface for single-turn conversations

        Args:
            user_message: User's message
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature

        Returns:
            str: LLM response
        """
        messages = [{"role": "user", "content": user_message}]
        return self.send_message(messages, system_prompt, max_tokens, temperature)

    def generate_news_summary(self, news_content: str, num_articles: int = 5) -> str:
        """
        Generate structured news summary

        Args:
            news_content: Raw news content to summarize
            num_articles: Number of articles to include

        Returns:
            str: Formatted news summary
        """
        system_prompt = f"""
        You are a professional news curator specializing in AI and technology news.
        Analyze the following news articles and create a structured briefing.

        For each article, provide:
        1. Title (adapted to be clear and informative)
        2. Summary (2-3 sentences highlighting key points)
        3. Key takeaways (bullet points)
        4. Importance score (1-5, where 5 is most important)
        5. Relevance to AI/technology industry

        Include {num_articles} most important articles.
        Format the response in clear, readable Chinese.
        """

        return self.simple_chat(news_content, system_prompt, max_tokens=3000, temperature=0.3)
