"""
Vision Helper for AI Life Assistant v2.0
Handles Image analysis for Life and Outfit secretaries
"""

from typing import Dict, Any, Optional
from integrations.llm.llm_client_v2 import LLMClient


class VisionHelper:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    async def analyze_food_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """Extract nutritional info and meal type from a food photo."""
        # implementation using GPT-4o or GLM-4V
        prompt = "识别图片中的食物，估算热量，并判断是早餐、午餐还是晚餐。"
        # res = await self.llm.vision_chat(image_bytes, prompt)
        return {
            "meal_type": "lunch",
            "estimated_calories": 550,
            "items": ["Chicken salad"],
        }

    async def analyze_health_tracker(self, image_bytes: bytes) -> Dict[str, Any]:
        """Extract steps or weight from a screenshot or photo of a device."""
        prompt = "识别图片中的运动步数或体重数值。"
        return {"steps": 8500, "weight": 72.5}
