#!/usr/bin/env python3
"""
Life Secretary Agent - v2.0
Responsible for lifestyle management including diet, exercise, and health.
Refactored to inherit from BaseAgent with Memory and standardized lifecycle.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from agents.base import BaseAgent

logger = logging.getLogger(__name__)

class LifeAgent(BaseAgent):
    """AI-powered lifestyle management agent."""

    def __init__(self, **kwargs):
        super().__init__(name="Life", **kwargs)

        # Standard user profile
        self.user_profile = {
            "name": "大洪",
            "age": 37,
            "occupation": "技术专家",
            "location": "上海",
            "health_goals": {
                "weight": "maintain",
                "target_exercise_per_week": 3,
                "sleep_target": 8,
                "water_target": 2000,
            }
        }

    def _collect_data(self, **kwargs) -> Dict[str, Any]:
        """Step 1: Gather raw life/health data."""
        logger.info("🌱 Collecting lifestyle data and health metrics...")
        
        # In v2.0, we collect:
        # 1. Current timestamp info
        # 2. Any visual data passed via kwargs (from API)
        # 3. Health metrics (placeholder for integration)
        
        data = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "day_of_week": datetime.now().strftime("%A"),
            "user_profile": self.user_profile,
            "vision_data": kwargs.get("vision_results", None),
            "health_metrics": self._get_placeholder_metrics()
        }
        
        return data

    def _process_with_llm(self, raw_data: Any, historical_context: str = "", **kwargs) -> str:
        """Step 2: Transform life data into a personalized plan."""
        logger.info("🤖 Generating lifestyle plan using LLM...")
        
        prompt_content = self._prepare_prompt(raw_data, historical_context)
        
        messages = [
            {
                "role": "system",
                "content": """你是一位专业的生活管理顾问，为37岁的技术专家大洪提供个性化的生活方式建议。
你的职责：
1. 提供科学的饮食建议
2. 制定合理的运动计划
3. 优化作息时间安排
4. 给出健康生活小贴士

请始终以专业、贴心、务实的方式提供建议，并充分利用提供的历史背景和偏好。""",
            },
            {"role": "user", "content": prompt_content},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=2000, temperature=0.7
        )

        if response and isinstance(response, str):
            return response
            
        return "❌ 无法生成生活建议，请检查 LLM 配置。"

    def _prepare_prompt(self, data: Dict[str, Any], historical_context: str) -> str:
        """Prepare context for LLM."""
        profile = data["user_profile"]
        
        context_str = f"""请为今日制定生活管理计划。

【用户信息】
- 姓名：{profile['name']}，{profile['age']}岁，{profile['occupation']}
- 地点：{profile['location']}
- 目标：睡眠{profile['health_goals']['sleep_target']}h, 饮水{profile['health_goals']['water_target']}ml

【当前状态/数据】
- 日期：{data['date']} ({data['day_of_week']})
"""
        if data.get("vision_data"):
            context_str += f"- 视觉识别输入：{data['vision_data']}\n"
            
        if historical_context:
            context_str += f"\n【历史健康记录/偏好】\n{historical_context}\n"

        context_str += """
请按以下格式输出：
# 今日生活管理 - [日期]

## 🥗 饮食计划
- 早餐：...
- 午餐：...
- 晚餐：...
- 饮水提醒：...

## 🏃‍♂️ 运动安排
...

## ⏰ 作息与精力建议
...

## 💡 健康小贴士
...
"""
        return context_str

    def _get_placeholder_metrics(self) -> Dict[str, Any]:
        """Placeholder for real health data integration."""
        return {
            "weight": 75,
            "steps_yesterday": 8500,
            "sleep_last_night": 7.5
        }

    def interactive_mode(self):
        """Standardized interactive mode for CLI usage."""
        print("\n" + "=" * 70)
        print("🌱 Life Agent - Interactive Mode")
        print("=" * 70)
        
        print("\n🤖 Running agent pipeline...")
        result = self.execute()
        
        print("\n" + "=" * 70)
        print(result)
        print("=" * 70)
        
        return result

if __name__ == "__main__":
    agent = LifeAgent()
    agent.interactive_mode()
