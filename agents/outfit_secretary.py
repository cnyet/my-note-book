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

from utils.llm_client_v2 import create_llm_client
from utils.file_manager import FileManager
from utils.weather_client import WeatherClient

logger = logging.getLogger(__name__)

class OutfitSecretary:
    """AI-powered outfit recommendation secretary with weather integration."""

    def __init__(self, config: Dict, config_path: str = "config/config.ini"):
        """
        Initialize outfit secretary.

        Args:
            config: Configuration dictionary containing API keys and settings
            config_path: Path to config.ini file (fallback)
        """
        self.config = config
        self.llm_client = create_llm_client(config_path=config_path)
        self.file_manager = FileManager(config.get('data', {}))

        # Initialize weather client
        self.weather_client = WeatherClient()

        # User preferences (will be loaded from aboutme.md in future)
        self.user_preferences = {
            'style': 'business_casual',  # business, business_casual, casual, sporty
            'preferred_colors': ['blue', 'gray', 'black', 'white'],
            'avoid_colors': ['yellow'],
            'special_notes': 'prefer comfortable shoes for daily commute',
            'climate_preference': 'slightly_warm'  # slightly_cool, neutral, slightly_warm
        }

    def run(self, save_to_file: bool = True) -> str:
        """
        Run the outfit secretary workflow.

        Args:
            save_to_file: Whether to save the recommendation to file

        Returns:
            Generated outfit recommendation in markdown format
        """
        try:
            print("👔 Outfit Secretary - Analyzing weather and generating outfit recommendations...")

            # Get weather information
            weather_data = self._get_weather_data()

            # Generate outfit recommendation
            recommendation = self._generate_outfit_recommendation(weather_data)

            # Display to user
            print("\n" + "=" * 70)
            print("👔 Outfit Recommendation Generated")
            print("=" * 70)
            print(recommendation)
            print("=" * 70)

            # Save to file if requested
            if save_to_file:
                self._save_recommendation(recommendation)
                print("\n✅ Outfit recommendation saved to today's logs")

            return recommendation

        except Exception as e:
            logger.error(f"Error in outfit secretary: {e}")
            return f"❌ Failed to generate outfit recommendation: {str(e)}"

    def _get_weather_data(self) -> Optional[Dict]:
        """
        Get current weather information.

        Returns:
            Weather data dictionary or None if unavailable
        """
        print("🌤️  Fetching weather data...")
        weather = self.weather_client.get_weather()

        if weather and weather.get('success'):
            current = weather.get('current', {})
            forecast = weather.get('forecast', [])

            # Format weather info for LLM
            weather_info = {
                'temperature': current.get('temp', 'Unknown'),
                'condition': current.get('condition', 'Unknown'),
                'humidity': current.get('humidity', 'Unknown'),
                'wind_speed': current.get('wind_speed', 'Unknown'),
                'air_quality': 'Unknown',  # Not available in current weather_client
                'forecast_today': {
                    'max_temp': forecast[0]['temp_max'] if forecast else current.get('temp', 'Unknown'),
                    'min_temp': forecast[0]['temp_min'] if forecast else current.get('temp', 'Unknown'),
                    'condition': forecast[0]['condition'] if forecast else current.get('condition', 'Unknown')
                } if forecast else None,
                'recommendations': []  # Could add weather analysis here
            }

            print(f"→ Current: {weather_info['temperature']}°C, {weather_info['condition']}")
            return weather_info

        # Fallback to default weather
        print("→ Using default weather assumption (pleasant, 22°C)")
        return {
            'temperature': 22,
            'condition': 'Partly Cloudy',
            'humidity': 65,
            'wind_speed': 5,
            'air_quality': 'Good',
            'forecast_today': {
                'max_temp': 25,
                'min_temp': 18,
                'condition': 'Partly Cloudy'
            },
            'recommendations': ['Pleasant weather, comfortable clothing recommended']
        }

    def _generate_outfit_recommendation(self, weather_data: Optional[Dict]) -> str:
        """
        Generate outfit recommendation using LLM.

        Args:
            weather_data: Weather information dictionary

        Returns:
            Formatted outfit recommendation in markdown
        """
        print("🤖 Generating personalized outfit recommendation...")

        # Prepare context for LLM
        context = self._prepare_llm_context(weather_data)

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

请始终以实用性和舒适性为优先。"""
            },
            {
                "role": "user",
                "content": context
            }
        ]

        response = self.llm_client.send_message(
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )

        if response and response.get('content'):
            return response['content']

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
        today = datetime.now().strftime('%Y年%m月%d日 %A')

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
            context += f"""- 当前温度：{weather_data.get('temperature', 'Unknown')}°C
- 天气状况：{weather_data.get('condition', 'Unknown')}
- 湿度：{weather_data.get('humidity', 'Unknown')}%
- 风速：{weather_data.get('wind_speed', 'Unknown')} km/h
- 空气质量：{weather_data.get('air_quality', 'Unknown')}

今日预报：
"""

            forecast = weather_data.get('forecast_today')
            if forecast:
                context += f"""- 最高温度：{forecast.get('max_temp', 'Unknown')}°C
- 最低温度：{forecast.get('min_temp', 'Unknown')}°C
- 天气状况：{forecast.get('condition', 'Unknown')}
"""

            recommendations = weather_data.get('recommendations', [])
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
        today = datetime.now().strftime('%Y年%m月%d日')

        temp = weather_data.get('temperature', 22) if weather_data else 22
        condition = weather_data.get('condition', 'Partly Cloudy') if weather_data else 'Partly Cloudy'

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

    def _save_recommendation(self, recommendation: str):
        """
        Save outfit recommendation to file.

        Args:
            recommendation: Outfit recommendation content
        """
        try:
            # Add timestamp header
            timestamp = datetime.now().strftime('%Y年%m月%d日 %H:%M')
            content = f"{recommendation}\n\n---\n*生成时间: {timestamp}*"

            self.file_manager.save_daily_file(
                file_type='outfit',
                content=content,
                custom_filename='今日穿搭.md'
            )

        except Exception as e:
            logger.error(f"Failed to save outfit recommendation: {e}")

    def interactive_mode(self):
        """
        Run outfit secretary in interactive mode.

        Allows user to provide preferences and get customized recommendations.
        """
        print("\n" + "=" * 70)
        print("👔 Outfit Secretary - Interactive Mode")
        print("=" * 70)

        print("\n📋 Please provide your preferences for today:")

        # Collect user preferences
        preferences = {}

        # Special occasions
        special = input("\nAny special occasions today? (meeting/casual/sporty/none): ").strip().lower()
        if special and special != 'none':
            preferences['special_occasion'] = special

        # Color preferences
        color_pref = input("Preferred color today? (optional): ").strip()
        if color_pref:
            preferences['color_preference'] = color_pref

        # Comfort priority
        comfort = input("Comfort priority level (1-5, 5=most comfortable): ").strip()
        try:
            preferences['comfort_priority'] = int(comfort) if comfort else 3
        except:
            preferences['comfort_priority'] = 3

        # Generate recommendation with preferences
        weather_data = self._get_weather_data()

        # Customize prompt based on preferences
        custom_prompt = self._prepare_llm_context(weather_data)

        if preferences:
            custom_prompt += f"\n\n今日特殊需求：\n"
            if preferences.get('special_occasion'):
                custom_prompt += f"- 特殊场合：{preferences['special_occasion']}\n"
            if preferences.get('color_preference'):
                custom_prompt += f"- 偏好颜色：{preferences['color_preference']}\n"
            if preferences.get('comfort_priority'):
                custom_prompt += f"- 舒适度优先级：{preferences['comfort_priority']}/5\n"

        # Generate recommendation
        print("\n🤖 Generating personalized outfit recommendation...")

        messages = [
            {
                "role": "system",
                "content": """你是一位专业的着装顾问。请根据用户的特殊需求和偏好，提供更加个性化的着装建议。"""
            },
            {
                "role": "user",
                "content": custom_prompt
            }
        ]

        response = self.llm_client.send_message(
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )

        if response and response.get('content'):
            recommendation = response['content']
        else:
            recommendation = self._generate_basic_recommendation(weather_data)

        # Display and save
        print("\n" + "=" * 70)
        print("👔 Your Personalized Outfit Recommendation")
        print("=" * 70)
        print(recommendation)
        print("=" * 70)

        # Ask if user wants to save
        save = input("\n💾 Save this recommendation? (y/n): ").strip().lower()
        if save == 'y':
            self._save_recommendation(recommendation)
            print("✅ Saved to today's logs!")

        return recommendation

    def get_style_guide(self) -> str:
        """
        Get general style guide for the user.

        Returns:
            Style guide information
        """
        guide = """# 大洪的个人穿搭指南

## 🎨 基本风格原则

### 商务休闲风（Business Casual）
- 适合日常办公和技术会议
- 平衡专业性和舒适性
- 易于在不同场合转换

### 色彩搭配
- **主色调**：蓝色、灰色、黑色、白色
- **避免**：黄色等过于鲜艳的颜色
- **原则**：全身不超过3种主要颜色

## 👔 必备单品

### 上装
- **正装衬衫**：白色、浅蓝色（各2件）
- **休闲衬衫**：牛津纺、格纹（各2件）
- **Polo衫**：深色系（3件）
- **毛衣**：V领、圆领（各2件）

### 下装
- **休闲裤**：卡其色、灰色、海军蓝（各2条）
- **牛仔裤**：深色、原色（各2条）
- **西裤**：深蓝色、炭灰色（各1条）

### 鞋履
- **正装鞋**：黑色、深棕色（各1双）
- **休闲鞋**：白色运动鞋、乐福鞋（各1双）

## 🌡️ 季节性调整

### 春秋（15-25°C）
- 叠穿策略：衬衫+薄外套
- 面料选择：棉、牛津纺、轻薄羊毛

### 夏天（>25°C）
- 透气面料：亚麻、纯棉
- 颜色选择：浅色系为主

### 冬天（<15°C）
- 保暖层：羊毛衫、羽绒服
- 配饰：围巾、手套

## 💼 场合着装

### 重要会议
- 深色西装+浅色衬衫
- 皮质正装鞋
- 简约配饰

### 日常办公
- 商务休闲混搭
- 舒适的鞋履
- 功能性背包

### 团队活动
- 智能休闲风
- 运动鞋
- 品牌T恤（如合适）

## 🚇 通勤考虑

### 地铁通勤
- 易于行走的鞋履
- 避免过多褶皱的面料
- 考虑体温变化的叠穿

### 步行
- 防滑鞋底
- 舒适的鞋垫
- 天雨时的备用方案

## 🔧 保养建议

- 定期擦鞋
- 衣物及时清洗
- 悬挂存放避免褶皱
- 季节性衣物防潮处理
"""

        return guide

if __name__ == "__main__":
    # Example usage
    import configparser

    # Load configuration
    config = configparser.ConfigParser()
    config.read('../config/config.ini')

    # Convert to dictionary
    config_dict = {
        'llm': dict(config['llm']) if 'llm' in config else {},
        'data': dict(config['data']) if 'data' in config else {},
        'weather': dict(config['weather']) if 'weather' in config else {}
    }

    # Create and run outfit secretary
    secretary = OutfitSecretary(config_dict)

    # Run interactive mode
    secretary.interactive_mode()