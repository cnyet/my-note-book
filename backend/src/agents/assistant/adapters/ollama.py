"""
Ollama AI Adapter.

This module implements the AIAdapter interface for Ollama models.
"""
import asyncio
import aiohttp
from typing import List, Dict, AsyncGenerator
from .base import AIAdapter
import logging

logger = logging.getLogger(__name__)


class OllamaAdapter(AIAdapter):
    """Adapter for Ollama AI models."""

    def __init__(self, base_url: str = "http://localhost:11434", model: str = "deepseek-r1"):
        """
        Initialize the Ollama adapter.

        Args:
            base_url: The base URL for the Ollama API server
            model: The model name to use (default: deepseek-r1)
        """
        self.base_url = base_url.rstrip('/')
        self.model = model
        self._session = None
        self._own_session = True  # Track if we own the session

    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create an aiohttp client session."""
        if self._session is None or self._session.closed:
            timeout = aiohttp.ClientTimeout(total=30)  # 30 second timeout
            self._session = aiohttp.ClientSession(timeout=timeout)
        return self._session

    async def _close_session(self):
        """Close the aiohttp client session if we own it."""
        if self._session and self._own_session and not self._session.closed:
            await self._session.close()
            self._session = None

    async def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """
        Send messages to the Ollama API and get a response.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Returns:
            The AI model's response as a string
        """
        session = await self._get_session()

        # Prepare the payload for Ollama API
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {}
        }

        # Add any additional parameters from kwargs
        if "temperature" in kwargs:
            payload["options"]["temperature"] = kwargs["temperature"]
        if "max_tokens" in kwargs:
            payload["options"]["num_predict"] = kwargs["max_tokens"]
        if "top_p" in kwargs:
            payload["options"]["top_p"] = kwargs["top_p"]

        try:
            async with session.post(f"{self.base_url}/api/chat", json=payload) as response:
                if response.status != 200:
                    raise Exception(f"Ollama API request failed with status {response.status}")

                result = await response.json()
                return result.get("message", {}).get("content", "")
        except asyncio.TimeoutError:
            logger.error("Ollama API request timed out")
            raise Exception("Request to Ollama API timed out")
        except Exception as e:
            logger.error(f"Error calling Ollama API: {str(e)}")
            raise

    async def stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream response from the Ollama API.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Yields:
            Chunks of the AI model's response
        """
        import json  # Moved import to top level
        session = await self._get_session()

        # Prepare the payload for Ollama API
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "options": {}
        }

        # Add any additional parameters from kwargs
        if "temperature" in kwargs:
            payload["options"]["temperature"] = kwargs["temperature"]
        if "max_tokens" in kwargs:
            payload["options"]["num_predict"] = kwargs["max_tokens"]
        if "top_p" in kwargs:
            payload["options"]["top_p"] = kwargs["top_p"]

        try:
            async with session.post(f"{self.base_url}/api/chat", json=payload) as response:
                if response.status != 200:
                    raise Exception(f"Ollama API request failed with status {response.status}")

                async for line in response.content:
                    if line.strip():
                        try:
                            chunk_data = json.loads(line.decode('utf-8'))
                            if chunk_data.get("done", False):
                                break
                            message_content = chunk_data.get("message", {}).get("content", "")
                            if message_content:
                                yield message_content
                        except json.JSONDecodeError:
                            continue
        except asyncio.TimeoutError:
            logger.error("Ollama API streaming request timed out")
            raise Exception("Streaming request to Ollama API timed out")
        except Exception as e:
            logger.error(f"Error streaming from Ollama API: {str(e)}")
            raise

    async def is_available(self) -> bool:
        """
        Check if the Ollama service is available.

        Returns:
            True if the service is reachable and functional, False otherwise
        """
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/api/tags") as response:
                return response.status == 200
        except Exception:
            return False

    def is_configured(self) -> bool:
        """
        Check if the adapter is properly configured.

        Returns:
            True if the adapter has necessary configuration, False otherwise
        """
        return bool(self.base_url and self.model)

    async def __aenter__(self):
        """Async context manager entry."""
        self._session = await self._get_session()
        self._own_session = True
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._session and self._own_session and not self._session.closed:
            await self._session.close()
            self._session = None