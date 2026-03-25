# backend/src/services/ai/diet_generator.py
"""
Diet Plan Generator Service
Generates personalized meal plans using Anthropic API
"""

import json
from typing import Any, Dict, List, Optional

import anthropic

from .base import AIServiceBase


class DietGenerator(AIServiceBase):
    """Diet Plan Generator using Anthropic Claude API"""

    SYSTEM_PROMPT = """你是一个专业的营养师。你的任务是根据用户的健康数据和偏好，生成个性化的三餐食谱。

**输出要求**：
1. 每餐包含：名称、卡路里、蛋白质（克）、碳水化合物（克）、脂肪（克）
2. 考虑用户的饮食偏好（如素食、低碳水、高蛋白等）
3. 食谱应该实际可行，食材容易获取
4. 营养搭配均衡

返回格式必须是严格的 JSON：
{
  "breakfast": {"name": "早餐名称", "calories": 300, "protein": 15, "carbs": 40, "fat": 10, "ingredients": ["食材 1", "食材 2"]},
  "lunch": {"name": "午餐名称", "calories": 500, "protein": 30, "carbs": 60, "fat": 20, "ingredients": ["食材 1", "食材 2"]},
  "dinner": {"name": "晚餐名称", "calories": 400, "protein": 25, "carbs": 45, "fat": 15, "ingredients": ["食材 1", "食材 2"]}
}"""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6-20250929"):
        """
        Initialize Diet Generator

        Args:
            api_key: Anthropic API key
            model: Anthropic model to use
        """
        super().__init__(api_key)
        self.model = model
        self._client = None

    def _create_client(self) -> anthropic.AsyncClient:
        """Create Anthropic API client"""
        return anthropic.AsyncClient(api_key=self.api_key)

    async def generate_plan(
        self,
        health_data: Dict[str, Any],
        preferences: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Generate a personalized meal plan

        Args:
            health_data: User's health metrics (weight, height, goals, etc.)
            preferences: Dietary preferences (vegetarian, low-carb, etc.)

        Returns:
            Meal plan with breakfast, lunch, dinner
        """
        user_prompt = self._build_prompt(health_data, preferences)

        client = self.client
        response = await client.messages.create(
            model=self.model,
            max_tokens=2000,
            system=self.SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        content_text = response.content[0].text  # type: ignore
        try:
            result = json.loads(content_text)
            return self._validate_plan(result)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response: {e}")

    def _build_prompt(
        self,
        health_data: Dict[str, Any],
        preferences: Optional[Dict[str, str]],
    ) -> str:
        """Build the prompt for the AI"""
        prompt_parts = ["请根据以下用户信息生成三餐食谱：\n"]

        # Health data
        if health_data.get("weight"):
            prompt_parts.append(f"- 体重：{health_data['weight']}kg")
        if health_data.get("height"):
            prompt_parts.append(f"- 身高：{health_data['height']}cm")
        if health_data.get("health_status"):
            prompt_parts.append(f"- 健康状况：{health_data['health_status']}")
        if health_data.get("goal"):
            prompt_parts.append(f"- 目标：{health_data['goal']}")

        # Preferences
        if preferences:
            prompt_parts.append("\n饮食偏好：")
            if preferences.get("diet"):
                prompt_parts.append(f"- 饮食类型：{preferences['diet']}")
            if preferences.get("allergies"):
                prompt_parts.append(f"- 过敏/忌口：{preferences['allergies']}")
            if preferences.get("favorite_foods"):
                prompt_parts.append(f"- 喜好食物：{preferences['favorite_foods']}")

        prompt_parts.append(
            "\n请生成营养均衡的三餐食谱，每餐包含名称、卡路里、蛋白质、碳水化合物、脂肪和主要食材。"
        )

        return "\n".join(prompt_parts)

    def _validate_plan(
        self, plan: Dict[str, Any]
    ) -> Dict[str, Dict[str, Any]]:
        """Validate and normalize the meal plan"""
        validated = {}
        meals = ["breakfast", "lunch", "dinner"]

        for meal in meals:
            if meal not in plan or not isinstance(plan[meal], dict):
                # Default meal
                validated[meal] = {
                    "name": "均衡营养餐",
                    "calories": 400,
                    "protein": 20,
                    "carbs": 50,
                    "fat": 12,
                    "ingredients": ["米饭", "蔬菜", "蛋白质来源"],
                }
            else:
                meal_data = plan[meal]
                validated[meal] = {
                    "name": meal_data.get("name", "营养餐"),
                    "calories": meal_data.get("calories", 400),
                    "protein": meal_data.get("protein", 20),
                    "carbs": meal_data.get("carbs", 50),
                    "fat": meal_data.get("fat", 12),
                    "ingredients": meal_data.get("ingredients", []),
                }

        return validated

    async def generate(self, prompt: str, **kwargs: Any) -> Any:
        """Abstract method implementation - not used for DietGenerator"""
        raise NotImplementedError("Use generate_plan() method instead")
