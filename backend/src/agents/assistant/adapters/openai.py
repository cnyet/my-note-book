"""
OpenAI AI Adapter.

This module implements the AIAdapter interface for OpenAI GPT models.
"""
import asyncio
from openai import AsyncOpenAI
from typing import List, Dict, AsyncGenerator
from .base import AIAdapter
import logging
import os

logger = logging.getLogger(__name__)


class OpenAIAdapter(AIAdapter):
    """Adapter for OpenAI GPT models."""

    def __init__(self, api_key: str = None, model: str = "gpt-4o"):
        """
        Initialize the OpenAI adapter.

        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY environment variable)
            model: The model name to use (default: gpt-4o)
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")

        self.model = model
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """
        Send messages to the OpenAI API and get a response.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Returns:
            The AI model's response as a string
        """
        try:
            # Prepare the parameters for the API call
            params = {
                "model": self.model,
                "messages": messages,
                "max_tokens": kwargs.get("max_tokens", 1024),
            }

            # Add other parameters from kwargs
            if "temperature" in kwargs:
                params["temperature"] = kwargs["temperature"]
            if "top_p" in kwargs:
                params["top_p"] = kwargs["top_p"]
            if "frequency_penalty" in kwargs:
                params["frequency_penalty"] = kwargs["frequency_penalty"]
            if "presence_penalty" in kwargs:
                params["presence_penalty"] = kwargs["presence_penalty"]

            # Make the API call
            response = await self.client.chat.completions.create(**params)

            # Return the content of the response
            return response.choices[0].message.content or ""

        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            raise

    async def stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream response from the OpenAI API.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Yields:
            Chunks of the AI model's response
        """
        try:
            # Prepare the parameters for the API call
            params = {
                "model": self.model,
                "messages": messages,
                "max_tokens": kwargs.get("max_tokens", 1024),
            }

            # Add other parameters from kwargs
            if "temperature" in kwargs:
                params["temperature"] = kwargs["temperature"]
            if "top_p" in kwargs:
                params["top_p"] = kwargs["top_p"]
            if "frequency_penalty" in kwargs:
                params["frequency_penalty"] = kwargs["frequency_penalty"]
            if "presence_penalty" in kwargs:
                params["presence_penalty"] = kwargs["presence_penalty"]

            # Make the streaming API call
            async_stream = await self.client.chat.completions.create(**params, stream=True)

            async for chunk in async_stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Error streaming from OpenAI API: {str(e)}")
            raise

    async def is_available(self) -> bool:
        """
        Check if the OpenAI service is available by attempting a minimal API call.

        Returns:
            True if the service is reachable and functional, False otherwise
        """
        try:
            # Attempt a minimal API call to validate the API key and connectivity
            # Using a minimal request to reduce cost and time
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=10,
                temperature=0
            )

            # If we got a response, the service is available
            return True

        except Exception:
            return False

    def is_configured(self) -> bool:
        """
        Check if the adapter is properly configured.

        Returns:
            True if the adapter has necessary configuration, False otherwise
        """
        return bool(self.api_key and self.model and self.api_key.startswith("sk-"))