"""
Anthropic AI Adapter.

This module implements the AIAdapter interface for Anthropic Claude models.
"""
import asyncio
import anthropic
from typing import List, Dict, AsyncGenerator
from .base import AIAdapter
import logging
import os
from anthropic import AsyncAnthropic

logger = logging.getLogger(__name__)


class AnthropicAdapter(AIAdapter):
    """Adapter for Anthropic Claude models."""

    def __init__(self, api_key: str = None, model: str = "claude-3-5-sonnet-20241022"):
        """
        Initialize the Anthropic adapter.

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY environment variable)
            model: The model name to use (default: claude-3-5-sonnet-20241022)
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.")

        self.model = model
        self.client = AsyncAnthropic(api_key=self.api_key)

    async def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """
        Send messages to the Anthropic API and get a response.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Returns:
            The AI model's response as a string
        """
        try:
            # Anthropic requires the first message to be from the user
            # If the first message is from the system, we need to convert it appropriately
            system_message = ""
            processed_messages = []

            for msg in messages:
                if msg.get("role") == "system":
                    if not system_message:
                        system_message = msg.get("content", "")
                    else:
                        # If there are multiple system messages, append them
                        system_message += "\n\n" + msg.get("content", "")
                else:
                    processed_messages.append({
                        "role": msg.get("role"),
                        "content": msg.get("content")
                    })

            # Prepare the parameters for the API call
            params = {
                "model": self.model,
                "messages": processed_messages,
                "max_tokens": kwargs.get("max_tokens", 1024),
            }

            # Add system message if present
            if system_message:
                params["system"] = system_message

            # Add other parameters from kwargs
            if "temperature" in kwargs:
                params["temperature"] = kwargs["temperature"]
            if "top_p" in kwargs:
                params["top_p"] = kwargs["top_p"]

            # Make the API call
            response = await self.client.messages.create(**params)

            # Return the content of the response
            return "".join([block.text for block in response.content if block.type == "text"])

        except Exception as e:
            logger.error(f"Error calling Anthropic API: {str(e)}")
            raise

    async def stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream response from the Anthropic API.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters like temperature, max_tokens, etc.

        Yields:
            Chunks of the AI model's response
        """
        try:
            # Process messages the same way as in chat method
            system_message = ""
            processed_messages = []

            for msg in messages:
                if msg.get("role") == "system":
                    if not system_message:
                        system_message = msg.get("content", "")
                    else:
                        system_message += "\n\n" + msg.get("content", "")
                else:
                    processed_messages.append({
                        "role": msg.get("role"),
                        "content": msg.get("content")
                    })

            # Prepare the parameters for the API call
            params = {
                "model": self.model,
                "messages": processed_messages,
                "max_tokens": kwargs.get("max_tokens", 1024),
            }

            # Add system message if present
            if system_message:
                params["system"] = system_message

            # Add other parameters from kwargs
            if "temperature" in kwargs:
                params["temperature"] = kwargs["temperature"]
            if "top_p" in kwargs:
                params["top_p"] = kwargs["top_p"]

            # Make the streaming API call
            async with self.client.messages.stream(**params) as stream:
                async for text_chunk in stream.text_stream:
                    yield text_chunk

        except Exception as e:
            logger.error(f"Error streaming from Anthropic API: {str(e)}")
            raise

    async def is_available(self) -> bool:
        """
        Check if the Anthropic service is available by attempting a minimal API call.

        Returns:
            True if the service is reachable and functional, False otherwise
        """
        try:
            # Attempt a minimal API call to validate the API key and connectivity
            # Using a minimal request to reduce cost and time
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}],
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
        return bool(self.api_key and self.model and self.api_key.startswith("sk-ant-"))