# backend/src/services/ai/quadrant_analyzer.py
"""
Quadrant Analyzer Service
Analyzes tasks and categorizes them into Eisenhower Matrix quadrants using Anthropic API
"""

import json
from typing import Any, Dict, List, Optional

import anthropic

from .base import AIServiceBase


class QuadrantAnalyzer(AIServiceBase):
    """Eisenhower Matrix Quadrant Analyzer using Anthropic Claude API"""

    SYSTEM_PROMPT = """你是一个 Eisenhower Matrix 分析专家。你的任务是根据任务标题和描述，将任务分类到四个象限中：

1. **重要且紧急 (important_urgent)**: 必须立即处理的任务，如危机处理、明天截止的项目
2. **重要不紧急 (important_not_urgent)**: 对长期发展重要但不需要立即完成的任务，如学习新技能、健康管理
3. **不重要紧急 (not_important_urgent)**: 需要立即处理但对长期目标不重要的任务，如某些会议、邮件回复
4. **不重要不紧急 (not_important_not_urgent)**: 可以少做或不做的任务，如社交媒体浏览、娱乐消遣

请根据任务的标题和描述，分析每个任务的真实优先级，并给出分类理由。

返回格式必须是严格的 JSON：
{
  "important_urgent": [{"title": "任务标题", "description": "描述", "reason": "分类理由"}],
  "important_not_urgent": [{"title": "任务标题", "description": "描述", "reason": "分类理由"}],
  "not_important_urgent": [{"title": "任务标题", "description": "描述", "reason": "分类理由"}],
  "not_important_not_urgent": [{"title": "任务标题", "description": "描述", "reason": "分类理由"}]
}"""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6-20250929"):
        """
        Initialize Quadrant Analyzer

        Args:
            api_key: Anthropic API key
            model: Anthropic model to use (default: claude-sonnet-4-6-20250929)
        """
        super().__init__(api_key)
        self.model = model
        self._client = None

    def _create_client(self) -> anthropic.AsyncClient:
        """Create Anthropic API client"""
        return anthropic.AsyncClient(api_key=self.api_key)

    async def analyze(
        self, tasks: List[Dict[str, str]]
    ) -> Dict[str, List[Dict[str, str]]]:
        """
        Analyze tasks and categorize into Eisenhower Matrix quadrants

        Args:
            tasks: List of tasks with 'title' and 'description' keys

        Returns:
            Dictionary with four quadrant keys, each containing list of tasks
        """
        if not tasks:
            return {
                "important_urgent": [],
                "important_not_urgent": [],
                "not_important_urgent": [],
                "not_important_not_urgent": [],
            }

        user_prompt = f"""请分析以下任务，并将它们分类到 Eisenhower Matrix 的四个象限中：

任务列表：
{self._format_tasks(tasks)}

请返回严格的 JSON 格式，不要有任何额外说明。"""

        client = self.client
        response = await client.messages.create(
            model=self.model,
            max_tokens=2000,
            system=self.SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        # Parse response
        content_text = response.content[0].text  # type: ignore
        try:
            result = json.loads(content_text)
            return self._validate_result(result)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response: {e}")

    def _format_tasks(self, tasks: List[Dict[str, str]]) -> str:
        """Format tasks as a readable list"""
        formatted = []
        for i, task in enumerate(tasks, 1):
            title = task.get("title", "无标题")
            description = task.get("description", "无描述")
            formatted.append(f"{i}. {title} - {description}")
        return "\n".join(formatted)

    def _validate_result(
        self, result: Dict[str, Any]
    ) -> Dict[str, List[Dict[str, str]]]:
        """Validate and normalize the result"""
        required_quadrants = [
            "important_urgent",
            "important_not_urgent",
            "not_important_urgent",
            "not_important_not_urgent",
        ]

        validated = {}
        for quadrant in required_quadrants:
            quadrant_tasks = result.get(quadrant, [])
            if not isinstance(quadrant_tasks, list):
                quadrant_tasks = []
            validated[quadrant] = quadrant_tasks

        return validated

    async def generate(self, prompt: str, **kwargs: Any) -> Any:
        """Abstract method implementation - not used for QuadrantAnalyzer"""
        raise NotImplementedError("Use analyze() method instead")
