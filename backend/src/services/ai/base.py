# backend/src/services/ai/base.py
"""
AI Service Base Module
Provides base class for all AI services (Anthropic, Nano Banana Pro, etc.)
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class AIServiceBase(ABC):
    """Abstract base class for all AI services"""

    def __init__(self, api_key: str, base_url: Optional[str] = None):
        """
        Initialize AI service base

        Args:
            api_key: API key for the service
            base_url: Optional base URL for the API
        """
        self.api_key = api_key
        self.base_url = base_url
        self._client: Optional[Any] = None

    @abstractmethod
    async def generate(self, prompt: str, **kwargs: Any) -> Any:
        """
        Generate content using the AI service

        Args:
            prompt: Input prompt for generation
            **kwargs: Additional generation parameters

        Returns:
            Generated content (type depends on service)
        """
        pass

    def _get_headers(self) -> Dict[str, str]:
        """Get default headers for API requests"""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    @property
    def client(self) -> Any:
        """Lazy-load the API client"""
        if self._client is None:
            self._client = self._create_client()
        return self._client

    def _create_client(self) -> Any:
        """Create and return the API client instance"""
        # Subclasses should override this to create their specific client
        raise NotImplementedError("Subclasses must implement _create_client")
