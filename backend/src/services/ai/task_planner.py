# backend/src/services/ai/task_planner.py
"""
Task Planner Service
Generates daily task plans based on user goals using Anthropic API
"""

import json
from typing import Any, Dict, List, Optional

import anthropic

from .base import AIServiceBase


class TaskPlanner(AIServiceBase):
    """Task Planner using Anthropic Claude API"""

    SYSTEM_PROMPT = """你是一个专业的任务规划专家。你的任务是根据用户的目标，拆解成具体可执行的任务。

**规划原则**：
1. 任务必须具体、可执行、有时间限制
2. 每个任务应该有明确的完成标准
3. 考虑任务的优先级和依赖关系
4. 任务数量应合理，避免过度安排
5. 考虑长期目标的拆解，将大目标分成小步骤

**任务优先级**：
- high: 重要且紧急，必须今天完成
- medium: 重要不紧急，今天应该完成
- low: 可选任务，有时间再做

**任务类别**：
- work: 工作相关任务
- personal: 个人生活任务
- health: 健康/运动任务
- learning: 学习提升任务
- other: 其他类别

返回格式必须是严格的 JSON 数组：
[
  {"title": "任务标题", "description": "任务描述", "priority": "high|medium|low", "category": "work|personal|health|learning|other"},
  ...
]"""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6-20250929"):
        """
        Initialize Task Planner

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

    async def plan(
        self,
        goals: str,
        long_term_goals: Optional[List[str]] = None,
        date: Optional[str] = None,
    ) -> List[Dict[str, str]]:
        """
        Generate a task plan based on goals

        Args:
            goals: Today's goals (string, may be comma-separated)
            long_term_goals: Optional list of long-term goals
            date: Optional target date

        Returns:
            List of planned tasks with title, description, priority, category
        """
        user_prompt = self._build_prompt(goals, long_term_goals, date)

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
            return self._validate_tasks(result)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response: {e}")

    def _build_prompt(
        self,
        goals: str,
        long_term_goals: Optional[List[str]],
        date: Optional[str],
    ) -> str:
        """Build the prompt for the AI"""
        prompt_parts = []

        if date:
            prompt_parts.append(f"日期：{date}")

        prompt_parts.append(f"今日目标：{goals}")

        if long_term_goals:
            prompt_parts.append("\n长期目标：")
            for i, goal in enumerate(long_term_goals, 1):
                prompt_parts.append(f"{i}. {goal}")

        prompt_parts.append(
            "\n请根据以上目标，生成今日可执行的任务列表。考虑将长期目标拆解为今日可做的小步骤。"
        )

        return "\n".join(prompt_parts)

    def _validate_tasks(self, tasks: Any) -> List[Dict[str, str]]:
        """Validate and normalize tasks"""
        if not isinstance(tasks, list):
            return []

        validated = []
        valid_priorities = {"high", "medium", "low"}
        valid_categories = {"work", "personal", "health", "learning", "other"}

        for task in tasks:
            if not isinstance(task, dict):
                continue

            validated_task = {
                "title": task.get("title", ""),
                "description": task.get("description", ""),
                "priority": task.get("priority", "medium"),
                "category": task.get("category", "other"),
            }

            # Validate and default
            if validated_task["priority"] not in valid_priorities:
                validated_task["priority"] = "medium"
            if validated_task["category"] not in valid_categories:
                validated_task["category"] = "other"

            # Only add if title exists
            if validated_task["title"]:
                validated.append(validated_task)

        return validated

    async def generate(self, prompt: str, **kwargs: Any) -> Any:
        """Abstract method implementation - not used for TaskPlanner"""
        raise NotImplementedError("Use plan() method instead")
