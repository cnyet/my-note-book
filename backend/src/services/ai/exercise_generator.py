# backend/src/services/ai/exercise_generator.py
"""
Exercise Plan Generator Service
Generates personalized workout plans using Anthropic API
"""

import json
from typing import Any, Dict, List, Optional

import anthropic

from .base import AIServiceBase


class ExerciseGenerator(AIServiceBase):
    """Exercise Plan Generator using Anthropic Claude API"""

    SYSTEM_PROMPT = """你是一个专业的健身教练。你的任务是根据用户的健康数据和健身水平，生成个性化的健身计划。

**输出要求**：
1. 每个动作包含：名称、组数、次数/时间、说明
2. 考虑用户的健身水平（beginner/intermediate/advanced）
3. 动作应该安全、有效、适合用户水平
4. 包含热身和拉伸动作

返回格式必须是严格的 JSON 数组：
[
  {"name": "动作名称", "sets": 3, "reps": 15, "duration": null, "description": "动作说明", "category": "warmup|strength|cardio|stretch"},
  {"name": "深蹲", "sets": 3, "reps": 12, "duration": null, "description": "双脚与肩同宽，下蹲至大腿与地面平行", "category": "strength"},
  {"name": "平板支撑", "sets": 3, "reps": null, "duration": 30, "description": "保持身体成一条直线", "category": "strength"}
]"""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6-20250929"):
        """
        Initialize Exercise Generator

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
        exercise_level: str = "beginner",
        equipment_available: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Generate a personalized exercise plan

        Args:
            health_data: User's health metrics
            exercise_level: Fitness level (beginner/intermediate/advanced)
            equipment_available: Available equipment (if any)

        Returns:
            List of exercises with details
        """
        user_prompt = self._build_prompt(
            health_data, exercise_level, equipment_available
        )

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
            return self._validate_exercises(result)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response: {e}")

    def _build_prompt(
        self,
        health_data: Dict[str, Any],
        exercise_level: str,
        equipment_available: Optional[List[str]],
    ) -> str:
        """Build the prompt for the AI"""
        prompt_parts = ["请根据以下用户信息生成健身计划：\n"]

        # Health data
        if health_data.get("weight"):
            prompt_parts.append(f"- 体重：{health_data['weight']}kg")
        if health_data.get("height"):
            prompt_parts.append(f"- 身高：{health_data['height']}cm")
        if health_data.get("health_status"):
            prompt_parts.append(f"- 健康状况：{health_data['health_status']}")

        # Level and equipment
        prompt_parts.append(f"- 健身水平：{exercise_level}")

        if equipment_available:
            prompt_parts.append(f"- 可用器材：{', '.join(equipment_available)}")
        else:
            prompt_parts.append("- 可用器材：无（居家徒手训练）")

        prompt_parts.append(
            "\n请生成适合用户水平的健身计划，包含热身、主要训练和拉伸动作。每个动作注明名称、组数、次数（或持续时间）和简单说明。"
        )

        return "\n".join(prompt_parts)

    def _validate_exercises(
        self, exercises: Any
    ) -> List[Dict[str, Any]]:
        """Validate and normalize exercises"""
        if not isinstance(exercises, list):
            return []

        validated = []
        valid_categories = {"warmup", "strength", "cardio", "stretch"}

        for exercise in exercises:
            if not isinstance(exercise, dict):
                continue

            validated_exercise = {
                "name": exercise.get("name", "未知动作"),
                "sets": exercise.get("sets", 3),
                "reps": exercise.get("reps"),
                "duration": exercise.get("duration"),
                "description": exercise.get("description", ""),
                "category": exercise.get("category", "strength"),
            }

            # Validate category
            if validated_exercise["category"] not in valid_categories:
                validated_exercise["category"] = "strength"

            # Ensure at least reps or duration is set
            if (
                validated_exercise["reps"] is None
                and validated_exercise["duration"] is None
            ):
                validated_exercise["reps"] = 10

            validated.append(validated_exercise)

        return validated

    async def generate(self, prompt: str, **kwargs: Any) -> Any:
        """Abstract method implementation - not used for ExerciseGenerator"""
        raise NotImplementedError("Use generate_plan() method instead")
