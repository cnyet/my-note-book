#!/usr/bin/env python3
"""
Outfit Secretary Agent
Responsible for daily outfit recommendations with weather integration.
"""

import sys
import os
from datetime import datetime
from typing import Dict, List, Optional
import logging

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.base import BaseAgent
from datetime import datetime
from typing import Dict, List, Optional
from integrations.weather.weather_client import WeatherClient


class OutfitAgent(BaseAgent):
    """AI-powered outfit recommendation agent with weather integration."""

    def __init__(self, **kwargs):
        super().__init__(name="Outfit", **kwargs)
        self.weather_client = WeatherClient()

        # User preferences (will be loaded from aboutme.md in future)
        self.user_preferences = {
            "style": "business_casual",
            "preferred_colors": ["blue", "gray", "black", "white"],
            "avoid_colors": ["yellow"],
            "special_notes": "prefer comfortable shoes for daily commute",
            "climate_preference": "slightly_warm",
        }

    def run(
        self, save_to_file: bool = True, formal_requested: bool = False, **kwargs
    ) -> str:
        """
        Run the outfit agent workflow.
        """
        try:
            print("👔 Outfit Agent - Analyzing weather and context...")

            if formal_requested:
                print("📌 Note: Formal attire requested due to daily schedule.")

            # Get weather information
            weather_data = self._get_weather_data()

            # Inject context into LLM generation
            recommendation = self._generate_outfit_recommendation(
                weather_data, formal_requested
            )

            # Display to user
            print("\n" + "=" * 70)
            print("👔 Outfit Recommendation Generated")
            print("=" * 70)
            print(recommendation)
            print("=" * 70)

            # Save to file if requested
            if save_to_file:
                self._save_log("outfit", recommendation, "今日穿搭建议")
                print("\n✅ Outfit recommendation saved to today's logs")

            return recommendation

        except Exception as e:
            self.logger.error(f"Error in outfit agent: {e}")
            return f"❌ Failed to generate outfit recommendation: {str(e)}"

    def _get_weather_data(self) -> Optional[Dict]:
        """
        Get current weather information.

        Returns:
            Weather data dictionary or None if unavailable
        """
        print("🌤️  Fetching weather data...")
        weather = self.weather_client.get_weather()

        if weather and weather.get("success"):
            current = weather.get("current", {})
            forecast = weather.get("forecast", [])

            # Format weather info for LLM
            weather_info = {
                "temperature": current.get("temp", "Unknown"),
                "condition": current.get("condition", "Unknown"),
                "humidity": current.get("humidity", "Unknown"),
                "wind_speed": current.get("wind_speed", "Unknown"),
                "air_quality": "Unknown",  # Not available in current weather_client
                "forecast_today": {
                    "max_temp": forecast[0]["temp_max"]
                    if forecast
                    else current.get("temp", "Unknown"),
                    "min_temp": forecast[0]["temp_min"]
                    if forecast
                    else current.get("temp", "Unknown"),
                    "condition": forecast[0]["condition"]
                    if forecast
                    else current.get("condition", "Unknown"),
                }
                if forecast
                else None,
                "recommendations": [],  # Could add weather analysis here
            }

            print(
                f"→ Current: {weather_info['temperature']}°C, {weather_info['condition']}"
            )
            return weather_info

        # Fallback to default weather
        print("→ Using default weather assumption (pleasant, 22°C)")
        return {
            "temperature": 22,
            "condition": "Partly Cloudy",
            "humidity": 65,
            "wind_speed": 5,
            "air_quality": "Good",
            "forecast_today": {
                "max_temp": 25,
                "min_temp": 18,
                "condition": "Partly Cloudy",
            },
            "recommendations": ["Pleasant weather, comfortable clothing recommended"],
        }

    def _generate_outfit_recommendation(
        self, weather_data: Optional[Dict], is_formal: bool = False
    ) -> str:
        print("🤖 Generating personalized outfit recommendation...")

        context = self._prepare_llm_context(weather_data)
        if is_formal:
            context += "\n\n⚠️ 重要：用户今天有重要活动或会议，请优先推荐正式度较高的商务套装或精致商务休闲装。"

        # Generate recommendation using LLM
        messages = [
            {
                "role": "system",
                "content": """你是一位专业的着装顾问，为生活在上海的37岁技术专家大洪提供每日穿搭建议。

你的职责：
1. 基于天气条件提供实用的着装建议
2. 考虑用户的个人偏好和生活方式
3. 提供具体、可执行的穿搭方案
4. 给出备选方案和搭配技巧

输出格式要求：
- 使用中文
- 结构清晰，层次分明
- 包含具体的单品建议
- 考虑通勤、办公、可能的社交场合
- 给出配饰建议

请始终以实用性和舒适性为优先。""",
            },
            {"role": "user", "content": context},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=1500, temperature=0.7
        )

        if response and isinstance(response, str):
            return response

        # Fallback to basic recommendation
        return self._generate_basic_recommendation(weather_data)

    def _prepare_llm_context(self, weather_data: Optional[Dict]) -> str:
        """
        Prepare context for LLM including weather and user preferences.

        Args:
            weather_data: Weather information

        Returns:
            Formatted context string
        """
        today = datetime.now().strftime("%Y年%m月%d日 %A")

        context = f"""请为{today}提供着装建议。

用户信息：
- 姓名：大洪
- 年龄：37岁
- 职业：技术专家/开发者
- 地点：上海
- 通勤方式：地铁（需要步行）
- 工作环境：办公室（空调环境）
- 风格偏好：商务休闲风
- 偏好颜色：蓝色、灰色、黑色、白色
- 不喜欢：黄色
- 特殊需求：通勤鞋履要舒适

今日天气信息：
"""

        if weather_data:
            context += f"""- 当前温度：{weather_data.get("temperature", "Unknown")}°C
- 天气状况：{weather_data.get("condition", "Unknown")}
- 湿度：{weather_data.get("humidity", "Unknown")}%
- 风速：{weather_data.get("wind_speed", "Unknown")} km/h
- 空气质量：{weather_data.get("air_quality", "Unknown")}

今日预报：
"""

            forecast = weather_data.get("forecast_today")
            if forecast:
                context += f"""- 最高温度：{forecast.get("max_temp", "Unknown")}°C
- 最低温度：{forecast.get("min_temp", "Unknown")}°C
- 天气状况：{forecast.get("condition", "Unknown")}
"""

            recommendations = weather_data.get("recommendations", [])
            if recommendations:
                context += f"\n天气建议：{'; '.join(recommendations)}\n"

        context += """
请提供：
1. 主要穿搭方案（上装、下装、鞋履）
2. 备选方案（如温度变化）
3. 配饰建议
4. 特殊注意事项
5. 通勤建议

请使用以下格式：
# 今日穿搭建议 - 日期

## 👔 主要穿搭
### 上装
具体建议...

### 下装
具体建议...

### 鞋履
具体建议...

## 🔄 备选方案
温度变化或场合变化时的调整建议...

## 🎒 配饰建议
包袋、手表、其他配饰...

## 💡 穿搭小贴士
实用性建议...

## 🚇 通勤提示
针对地铁通勤的特殊建议...
"""

        return context

    def _generate_basic_recommendation(self, weather_data: Optional[Dict]) -> str:
        """
        Generate basic outfit recommendation without LLM.

        Args:
            weather_data: Weather information

        Returns:
            Basic outfit recommendation
        """
        today = datetime.now().strftime("%Y年%m月%d日")

        temp = weather_data.get("temperature", 22) if weather_data else 22
        condition = (
            weather_data.get("condition", "Partly Cloudy")
            if weather_data
            else "Partly Cloudy"
        )

        recommendation = f"""# 今日穿搭建议 - {today}

## 天气概况
- 温度：{temp}°C
- 状况：{condition}
- 地点：上海

## 👔 主要穿搭

### 上装
**商务休闲选择：**
- 深蓝色牛津纺衬衫
- 浅灰色Polo衫（ casual Friday）
- 海军蓝毛衣（如空调较冷）

### 下装
- 卡其色休闲裤
- 深灰色牛仔裤（ casual Friday）
- 海军蓝西裤（重要会议日）

### 鞋履
- 深棕色皮鞋（正式场合）
- 白色运动鞋（日常通勤）
- 深蓝色乐福鞋（商务休闲）

## 🔄 备选方案

### 温度升高（>26°C）
- 换穿短袖衬衫
- 选择轻薄面料
- 准备薄外套应对空调

### 温度降低（<18°C）
- 添加西装外套
- 选择较厚面料
- 考虑围巾配饰

## 🎒 配饰建议
- 黑色皮质双肩包（通勤）
- 简约商务手表
- 皮带选择与鞋履颜色搭配

## 💡 穿搭小贴士
1. 地铁通勤建议选择透气面料
2. 办公室空调较冷，准备薄外套
3. 鞋履选择兼顾正式与舒适
4. 颜色搭配以中性色调为主

## 🚇 通勤提示
- 选择易于行走的鞋履
- 避免过多配饰影响通勤
- 考虑雨具（根据天气预报）
"""

        return recommendation

    def interactive_mode(self):
        """
        Run outfit agent in interactive mode.
        """
        print("\n" + "=" * 70)
        print("👔 Outfit Agent - Interactive Mode")
        print("=" * 70)

        print("\n📋 Please provide your preferences for today:")

        preferences = {}

        special = (
            input("\nAny special occasions today? (meeting/casual/sporty/none): ")
            .strip()
            .lower()
        )
        if special and special != "none":
            preferences["special_occasion"] = special

        color_pref = input("Preferred color today? (optional): ").strip()
        if color_pref:
            preferences["color_preference"] = color_pref

        comfort = input("Comfort priority level (1-5, 5=most comfortable): ").strip()
        try:
            preferences["comfort_priority"] = int(comfort) if comfort else 3
        except:
            preferences["comfort_priority"] = 3

        weather_data = self._get_weather_data()

        custom_prompt = self._prepare_llm_context(weather_data)

        if preferences:
            custom_prompt += f"\n\n今日特殊需求：\n"
            if preferences.get("special_occasion"):
                custom_prompt += f"- 特殊场合：{preferences['special_occasion']}\n"
            if preferences.get("color_preference"):
                custom_prompt += f"- 偏好颜色：{preferences['color_preference']}\n"
            if preferences.get("comfort_priority"):
                custom_prompt += (
                    f"- 舒适度优先级：{preferences['comfort_priority']}/5\n"
                )

        print("\n🤖 Generating personalized outfit recommendation...")

        messages = [
            {
                "role": "system",
                "content": """你是一位专业的着装顾问。请根据用户的特殊需求和偏好，提供更加个性化的着装建议。""",
            },
            {"role": "user", "content": custom_prompt},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=1500, temperature=0.7
        )

        if response and isinstance(response, str):
            recommendation = response["content"]
        else:
            recommendation = self._generate_basic_recommendation(weather_data)

        print("\n" + "=" * 70)
        print("👔 Your Personalized Outfit Recommendation")
        print("=" * 70)
        print(recommendation)
        print("=" * 70)

        save = input("\n💾 Save this recommendation? (y/n): ").strip().lower()
        if save == "y":
            self._save_log("outfit", recommendation, "今日穿搭建议")
            print("✅ Saved to today's logs!")

        return recommendation

    def _save_log(self, file_type: str, content: str, title: str) -> bool:
        return super()._save_log(file_type, content, title)


if __name__ == "__main__":
    # Example usage
    import configparser

    # Create and run outfit agent
    agent = OutfitAgent()

    # Run interactive mode
    agent.interactive_mode()
