"""
Base interface for AI adapters.

This module defines the unified interface that all AI model adapters must implement.
"""
from abc import ABC, abstractmethod
from typing import Protocol, List, Dict, AsyncGenerator, Union
from dataclasses import dataclass
from enum import Enum


class MessageRole(str, Enum):
    """Message roles in a conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


@dataclass
class Message:
    """Represents a message in a conversation."""
    role: MessageRole
    content: str


class AIAdapter(Protocol):
    """Unified interface for AI model adapters."""

    async def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """
        Send messages to the AI model and get a response.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters specific to the model

        Returns:
            The AI model's response as a string
        """
        ...

    async def stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream response from the AI model.

        Args:
            messages: List of messages in the format {'role': str, 'content': str}
            **kwargs: Additional parameters specific to the model

        Yields:
            Chunks of the AI model's response
        """
        ...

    async def is_available(self) -> bool:
        """
        Check if the AI service is available.

        Returns:
            True if the service is reachable and functional, False otherwise
        """
        ...

    def is_configured(self) -> bool:
        """
        Check if the adapter is properly configured (e.g., API keys set).

        Returns:
            True if the adapter has necessary configuration, False otherwise
        """
        ...