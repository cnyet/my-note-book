# backend/src/services/ai/nano_banana.py
"""
Nano Banana Pro Service
Generates images using Nano Banana Pro API
"""

import uuid
from typing import Any, Dict, Optional

import httpx

from .base import AIServiceBase


class NanoBananaService(AIServiceBase):
    """Nano Banana Pro Image Generation Service"""

    DEFAULT_BASE_URL = "https://api.nanobanana.pro/v1"

    def __init__(
        self,
        api_key: str,
        base_url: Optional[str] = None,
        model: str = "nano-banana-pro",
    ):
        """
        Initialize Nano Banana Pro Service

        Args:
            api_key: Nano Banana Pro API key
            base_url: Optional custom base URL
            model: Model to use for generation
        """
        super().__init__(api_key, base_url or self.DEFAULT_BASE_URL)
        self.model = model
        self._client = None

    def _create_client(self) -> httpx.AsyncClient:
        """Create HTTP client for API requests"""
        return httpx.AsyncClient(
            base_url=self.base_url,
            headers=self._get_headers(),
            timeout=60.0,
        )

    async def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        size: str = "1024x1024",
        style: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate an image using Nano Banana Pro

        Args:
            prompt: Text description of the image to generate
            negative_prompt: Things to exclude from the image
            size: Image size (default: 1024x1024)
            style: Optional style preset

        Returns:
            Dictionary with image_url and generation details
        """
        payload = self._build_payload(
            prompt, negative_prompt, size, style
        )

        try:
            client = self.client
            response = await client.post(
                "/generate",
                json=payload,
            )
            response.raise_for_status()
            result = response.json()
            return self._parse_response(result)
        except httpx.HTTPError as e:
            raise RuntimeError(f"Nano Banana Pro API error: {e}")

    def _build_payload(
        self,
        prompt: str,
        negative_prompt: Optional[str],
        size: str,
        style: Optional[str],
    ) -> Dict[str, Any]:
        """Build the API request payload"""
        width, height = self._parse_size(size)

        payload = {
            "model": self.model,
            "prompt": prompt,
            "width": width,
            "height": height,
        }

        if negative_prompt:
            payload["negative_prompt"] = negative_prompt

        if style:
            payload["style"] = style

        return payload

    def _parse_size(self, size: str) -> tuple:
        """Parse size string like '1024x1024' into width and height"""
        try:
            width, height = map(int, size.split("x"))
            return width, height
        except ValueError:
            return 1024, 1024

    def _parse_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Parse API response"""
        # Adjust based on actual API response format
        return {
            "image_url": result.get("image_url") or result.get("url"),
            "prompt": result.get("prompt", ""),
            "model": result.get("model", self.model),
            "size": result.get("size", "1024x1024"),
            "generation_id": result.get("id") or str(uuid.uuid4()),
        }

    async def generate(self, prompt: str, **kwargs: Any) -> Dict[str, Any]:
        """
        Generate method for base class compatibility

        Args:
            prompt: Image generation prompt
            **kwargs: Additional parameters (negative_prompt, size, style)

        Returns:
            Image generation result
        """
        return await self.generate_image(
            prompt=prompt,
            negative_prompt=kwargs.get("negative_prompt"),
            size=kwargs.get("size", "1024x1024"),
            style=kwargs.get("style"),
        )
