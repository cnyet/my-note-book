#!/usr/bin/env python3
"""
Outfit Secretary Agent - v2.0
Responsible for daily outfit recommendations with weather integration.
Refactored to inherit from BaseAgent with Memory and standardized lifecycle.
"""

import logging
from typing import Dict, Any, Optional
from agents.base import BaseAgent
from integrations.weather.weather_client import WeatherClient

logger = logging.getLogger(__name__)

class OutfitAgent(BaseAgent):
    """AI-powered outfit recommendation agent with weather integration."""

    def __init__(self, **kwargs):
        super().__init__(name="Outfit", **kwargs)
        self.weather_client = WeatherClient()

        # Default preferences (will be enhanced by Memory in execute)
        self.user_preferences = {
            "style": "business_casual",
            "preferred_colors": ["blue", "gray", "black", "white"],
            "avoid_colors": ["yellow"],
            "special_notes": "prefer comfortable shoes for daily commute",
            "climate_preference": "slightly_warm",
        }

    def _collect_data(self, **kwargs) -> Dict[str, Any]:
        """Step 1: Gather weather data."""
        logger.info("🌤️ Fetching weather data for outfit recommendation...")
        weather = self.weather_client.get_weather()
        
        if not weather or not weather.get("success"):
            logger.warning("Failed to fetch real weather data, using fallback.")
            # Fallback is handled by weather_client._get_mock_weather internally or we can provide here
            return weather or {"success": False}
            
        return weather

    def _process_with_llm(self, raw_data: Any, historical_context: str = "", **kwargs) -> str:
        """Step 2: Transform weather and preferences into outfit recommendation."""
        logger.info("🤖 Generating personalized outfit recommendation using LLM...")
        
        weather_summary = self.weather_client.get_weather_summary()
        weather_analysis = self.weather_client.analyze_for_outfit(raw_data)
        
        # Merge default preferences with any historical context if available
        # In v2.0, historical_context comes from VectorMemory via BaseAgent.execute()
        
        prompt_content = self._prepare_prompt(weather_summary, weather_analysis, historical_context, **kwargs)
        
        messages = [
            {
                "role": "system",
                "content": """你是一位专业的着装顾问，为生活在上海的37岁技术专家大洪提供每日穿搭建议。
你的职责：
1. 基于天气条件提供实用的着装建议
2. 考虑用户的个人偏好和生活方式（参考历史记忆）
3. 提供具体、可执行的穿搭方案
4. 给出备选方案和搭配技巧

请始终以实用性和舒适性为优先，语气专业、贴心且务实。""",
            },
            {"role": "user", "content": prompt_content},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=1500, temperature=0.7
        )

        if response and isinstance(response, str):
            return response
            
        return "❌ 无法生成穿搭建议，请检查 LLM 配置。"

    def _prepare_prompt(self, weather_summary: str, weather_analysis: str, historical_context: str, **kwargs) -> str:
        """Prepare the prompt for LLM."""
        is_formal = kwargs.get("formal_requested", False)
        
        context_str = f"""【今日天气信息】
{weather_summary}

【天气分析建议】
{weather_analysis}

【用户基础偏好】
- 风格：{self.user_preferences['style']}
- 偏好颜色：{", ".join(self.user_preferences['preferred_colors'])}
- 备注：{self.user_preferences['special_notes']}
"""
        if historical_context:
            context_str += f"\n【历史记忆/偏好参考】\n{historical_context}\n"

        if is_formal:
            context_str += "\n⚠️ 重要提示：用户今天有重要活动或会议，请优先推荐正式度较高的商务套装。"

        context_str += """
请提供以下格式的建议：
# 今日穿搭建议 - [日期]

## 👔 主要穿搭
### 上装
...
### 下装
...
### 鞋履
...

## 🔄 备选方案
...

## 🎒 配饰与通勤建议
...

## 💡 穿搭小贴士
...
"""
        return context_str

    def interactive_mode(self):
        """Standardized interactive mode for CLI usage."""
        print("\n" + "=" * 70)
        print("👔 Outfit Agent - Interactive Mode")
        print("=" * 70)
        
        formal = input("\nAny formal meetings today? (y/n): ").strip().lower() == 'y'
        
        print("\n🤖 Running agent pipeline...")
        result = self.execute(formal_requested=formal)
        
        print("\n" + "=" * 70)
        print(result)
        print("=" * 70)
        
        return result

if __name__ == "__main__":
    agent = OutfitAgent()
    agent.interactive_mode()
