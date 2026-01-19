#!/usr/bin/env python3
"""
Life Secretary Agent
Responsible for lifestyle management including diet, exercise, and daily schedules.
"""

import sys
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging
import json

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.base import BaseAgent
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json


class LifeAgent(BaseAgent):
    """AI-powered lifestyle management agent."""

    def __init__(self, **kwargs):
        super().__init__(name="Life", **kwargs)

        # User profile (will be enhanced with RAG in future)
        self.user_profile = {
            "name": "大洪",
            "age": 37,
            "occupation": "技术专家",
            "location": "上海",
            "health_goals": {
                "weight": "maintain",
                "fitness_level": "moderate",
                "target_exercise_per_week": 3,
                "sleep_target": 8,
                "water_target": 2000,
                "dietary_preferences": {
                    "avoid": ["excessive_spicy", "greasy"],
                    "prefer": ["balanced", "light"],
                    "allergies": [],
                },
            },
            "daily_routine": {
                "wake_up": "07:00",
                "work_start": "09:30",
                "lunch": "12:30",
                "work_end": "18:30",
                "dinner": "19:30",
                "bed_time": "23:00",
            },
        }

    def run(self, save_to_file: bool = True, **kwargs) -> str:
        """
        Run the life agent workflow.
        """
        try:
            print("🌱 Life Agent - Analyzing your lifestyle needs...")

            # Get context from previous logs
            context = self._get_life_context()

            # Generate life management plan
            plan = self._generate_life_plan(context)

            # Display to user
            print("\n" + "=" * 70)
            print("🌱 Today's Life Management Plan")
            print("=" * 70)
            print(plan)
            print("=" * 70)

            # Save to file if requested
            if save_to_file:
                self._save_log("life", plan, "今日生活管理")
                print("\n✅ Life plan saved to today's logs")

            return plan

        except Exception as e:
            self.logger.error(f"Error in life agent: {e}")
            return f"❌ Failed to generate life plan: {str(e)}"

    def _get_life_context(self) -> Dict:
        """
        Gather context from previous logs and user profile.

        Returns:
            Dictionary containing life context information
        """
        context = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "day_of_week": datetime.now().strftime("%A"),
            "user_profile": self.user_profile,
            "recent_logs": self._get_recent_life_logs(),
            "health_metrics": self._get_health_metrics(),
        }

        return context

    def _get_recent_life_logs(self) -> List[Dict]:
        """
        Get recent life logs for context.

        Returns:
            List of recent life log entries
        """
        try:
            # Get yesterday's log if available
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            yesterday_file = f"data/daily_logs/{yesterday}/今日生活.md"

            if os.path.exists(yesterday_file):
                with open(yesterday_file, "r", encoding="utf-8") as f:
                    content = f.read()

                # Parse key information from yesterday's log
                parsed_info = {
                    "date": yesterday,
                    "exercise_completed": self._extract_exercise_info(content),
                    "meals": self._extract_meal_info(content),
                    "sleep": self._extract_sleep_info(content),
                    "water_intake": self._extract_water_info(content),
                    "notes": self._extract_notes(content),
                }

                return [parsed_info]

        except Exception as e:
            self.logger.error(f"Error reading recent life logs: {e}")

        return []

    def _extract_exercise_info(self, content: str) -> Dict:
        """Extract exercise information from log content."""
        exercise = {"type": None, "duration": 0, "completed": False}

        # Simple keyword-based extraction
        if "运动" in content or "锻炼" in content or "健身" in content:
            exercise["completed"] = True
            # Try to extract duration
            import re

            duration_match = re.search(r"(\d+)\s*(分钟|小时)", content)
            if duration_match:
                duration = int(duration_match.group(1))
                if "小时" in duration_match.group(2):
                    duration *= 60
                exercise["duration"] = duration

        return exercise

    def _extract_meal_info(self, content: str) -> List[str]:
        """Extract meal information from log content."""
        meals = []
        meal_keywords = ["早餐", "午餐", "晚餐", "加餐"]

        for keyword in meal_keywords:
            if keyword in content:
                # Simple extraction - in real implementation would be more sophisticated
                lines = content.split("\n")
                for i, line in enumerate(lines):
                    if keyword in line and i + 1 < len(lines):
                        meals.append(lines[i + 1].strip())

        return meals

    def _extract_sleep_info(self, content: str) -> Dict:
        """Extract sleep information from log content."""
        sleep = {"hours": 0, "quality": "unknown"}

        import re

        # Look for sleep duration patterns
        duration_match = re.search(r"睡眠\s*(\d+\.?\d*)\s*小时", content)
        if duration_match:
            sleep["hours"] = float(duration_match.group(1))

        quality_keywords = ["很好", "不错", "一般", "较差"]
        for keyword in quality_keywords:
            if keyword in content:
                sleep["quality"] = keyword
                break

        return sleep

    def _extract_water_info(self, content: str) -> int:
        """Extract water intake from log content."""
        import re

        water_match = re.search(r"饮水\s*(\d+)\s*(ml|毫升)", content)
        if water_match:
            return int(water_match.group(1))

        return 0

    def _extract_notes(self, content: str) -> List[str]:
        """Extract general notes from log content."""
        notes = []
        lines = content.split("\n")

        for line in lines:
            if "备注" in line or "注意" in line or "提醒" in line:
                notes.append(line.strip())

        return notes

    def _get_health_metrics(self) -> Dict:
        """
        Get current health metrics (placeholder for future integration).

        Returns:
            Dictionary with health metrics
        """
        # In a real implementation, this would integrate with:
        # - Smart scales
        # - Fitness trackers
        # - Health apps
        # - Manual input

        return {
            "weight": None,  # Would be populated from actual data
            "body_fat": None,
            "muscle_mass": None,
            "resting_heart_rate": None,
            "sleep_quality_score": None,
            "stress_level": None,
            "energy_level": None,
        }

    def _generate_life_plan(self, context: Dict) -> str:
        """
        Generate life management plan using LLM.

        Args:
            context: Life context information

        Returns:
            Formatted life plan in markdown
        """
        print("🤖 Generating personalized life management plan...")

        # Prepare context for LLM
        prompt_context = self._prepare_llm_context(context)

        # Generate plan using LLM
        messages = [
            {
                "role": "system",
                "content": """你是一位专业的生活管理顾问，为37岁的技术专家大洪提供个性化的生活方式管理建议。

你的职责：
1. 提供科学的饮食建议
2. 制定合理的运动计划
3. 优化作息时间安排
4. 给出健康生活小贴士

输出要求：
- 使用中文
- 建议具体、可执行
- 考虑技术工作者的生活方式
- 注重实用性和可持续性
- 关注身心健康平衡

请始终以专业、贴心、务实的方式提供建议。""",
            },
            {"role": "user", "content": prompt_context},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=2000, temperature=0.7
        )

        if response and isinstance(response, str):
            return response

        # Fallback to basic plan
        return self._generate_basic_plan(context)

    def _prepare_llm_context(self, context: Dict) -> str:
        """
        Prepare context for LLM.

        Args:
            context: Life context information

        Returns:
            Formatted context string
        """
        today = datetime.now().strftime("%Y年%m月%d日 %A")
        profile = context["user_profile"]
        recent_logs = context.get("recent_logs", [])

        context_str = f"""请为{today}制定生活管理计划。

用户基本信息：
- 姓名：{profile["name"]}
- 年龄：{profile["age"]}岁
- 职业：{profile["occupation"]}
- 地点：{profile["location"]}

健康目标：
- 体重目标：{profile["health_goals"]["weight"]}
- 运动频率：每周{profile["health_goals"]["target_exercise_per_week"]}次
- 睡眠目标：{profile["health_goals"]["sleep_target"]}小时
- 饮水目标：{profile["health_goals"]["water_target"]}ml
- 健身水平：{profile["health_goals"]["fitness_level"]}

日常作息：
- 起床：{profile["daily_routine"]["wake_up"]}
- 工作开始：{profile["daily_routine"]["work_start"]}
- 午餐：{profile["daily_routine"]["lunch"]}
- 工作结束：{profile["daily_routine"]["work_end"]}
- 晚餐：{profile["daily_routine"]["dinner"]}
- 睡觉：{profile["daily_routine"]["bed_time"]}

饮食习惯：
- 偏好：{", ".join(profile["health_goals"]["dietary_preferences"]["prefer"])}
- 避免：{", ".join(profile["health_goals"]["dietary_preferences"]["avoid"])}
"""

        if recent_logs:
            yesterday_log = recent_logs[0]
            context_str += f"""
昨日情况回顾：
- 运动完成：{"是" if yesterday_log["exercise_completed"]["completed"] else "否"}
"""

            if yesterday_log["exercise_completed"]["completed"]:
                context_str += f"- 运动时长：{yesterday_log['exercise_completed']['duration']}分钟\n"

            if yesterday_log["sleep"]["hours"] > 0:
                context_str += f"- 睡眠时长：{yesterday_log['sleep']['hours']}小时\n"
                context_str += f"- 睡眠质量：{yesterday_log['sleep']['quality']}\n"

            if yesterday_log["water_intake"] > 0:
                context_str += f"- 饮水量：{yesterday_log['water_intake']}ml\n"

        context_str += """
请提供以下内容：
1. 今日饮食计划（三餐建议）
2. 运动安排（如有）
3. 作息优化建议
4. 健康小贴士
5. 特别注意事项

请使用以下格式：
# 今日生活管理 - 日期

## 🥗 饮食计划
### 早餐
具体建议...

### 午餐
具体建议...

### 晚餐
具体建议...

### 加餐（可选）
具体建议...

## 🏃‍♂️ 运动安排
今日运动建议...
备选方案...

## ⏰ 作息建议
作息优化建议...

## 💡 健康小贴士
3-5条实用建议...

## ⚠️ 特别提醒
注意事项...
"""

        return context_str

    def _generate_basic_plan(self, context: Dict) -> str:
        """
        Generate basic life plan without LLM.

        Args:
            context: Life context information

        Returns:
            Basic life plan
        """
        today = datetime.now().strftime("%Y年%m月%d日")
        day_of_week = context.get("day_of_week", "Monday")

        # Adjust recommendations based on day of week
        is_weekend = day_of_week in ["Saturday", "Sunday"]

        plan = f"""# 今日生活管理 - {today}

## 🥗 饮食计划

### 早餐 (07:30)
**推荐：**
- 全麦面包2片 + 鸡蛋2个
- 牛奶250ml 或 豆浆250ml
- 水果1份（苹果/香蕉）
- 坚果少量

**营养重点：** 优质蛋白质 + 复合碳水

### 午餐 (12:30)
**推荐：**
- 糙米饭1小碗
- 清蒸鱼/鸡胸肉 100g
- 绿叶蔬菜200g
- 豆腐/豆制品50g

**外卖建议：** 选择少油少盐的健康餐

### 下午茶 (15:30)
**推荐：**
- 酸奶1杯
- 水果1份
- 坚果少量

### 晚餐 (19:30)
**推荐：**
- 杂粮饭1/2碗
- 蔬菜沙拉
- 清炒时蔬
- 汤品1份（非油腻）

**注意：** 晚餐不宜过饱，睡前3小时完成

## 🏃‍♂️ 运动安排

{"### 今日休息日" if is_weekend else "### 今日运动建议"}

**{"休息或轻度活动" if is_weekend else "有氧运动 + 力量训练"}**

{"- 散步30分钟" if is_weekend else "- 快走/慢跑 30分钟"}
{"- 瑜伽/拉伸 20分钟" if is_weekend else "- 力量训练 20分钟"}
{"- 户外活动" if is_weekend else "- 核心训练 10分钟"}

**时间建议：** 工作后30分钟或晚上20:00

## ⏰ 作息建议

### 起床 (07:00)
- 醒后卧床5分钟，缓慢起身
- 喝一杯温水
- 简单拉伸5分钟

### 工作间隙
- 每小时站立活动5分钟
- 眼部放松练习
- 保持正确坐姿

### 睡前准备 (22:30)
- 停止使用电子设备
- 泡脚或热水澡
- 轻度拉伸
- 冥想或听轻音乐

## 💡 健康小贴士

1. **饮水提醒：** 每小时饮水200ml，目标2000ml/天
2. **护眼建议：** 工作45分钟，远眺5分钟
3. **姿势提醒：** 保持腰背挺直，避免久坐
4. **压力管理：** 深呼吸练习，定期放松
5. **社交互动：** 保持与朋友家人的联系

## ⚠️ 特别提醒

1. 避免连续工作超过2小时不休息
2. 注意办公室空调温度，适时增减衣物
3. 外卖选择时注意食品安全和营养均衡
4. 保持充足的睡眠，避免熬夜
5. 如感到身体不适，及时休息或就医

## 📝 今日打卡清单

- [ ] 早起喝水
- [ ] 早餐按时
- [ ] 午餐营养均衡
- [ ] 工作间隙活动
- [ ] 完成今日运动
- [ ] 晚餐不过饱
- [ ] 睡前放松
- [ ] 按时睡觉
"""

        return plan

    def interactive_mode(self):
        """
        Run life agent in interactive mode.
        """
        print("\n" + "=" * 70)
        print("🌱 Life Agent - Interactive Mode")
        print("=" * 70)

        print("\n📋 Let's check in with your current status:")

        current_status = {}

        sleep_quality = (
            input("\nHow was your sleep last night? (excellent/good/fair/poor): ")
            .strip()
            .lower()
        )
        current_status["sleep_quality"] = sleep_quality

        energy = input("Current energy level? (high/medium/low): ").strip().lower()
        current_status["energy_level"] = energy

        exercise = input("Already exercised today? (yes/no): ").strip().lower()
        current_status["exercised"] = exercise == "yes"

        water = input("Water intake so far (ml, 0 if not sure): ").strip()
        try:
            current_status["water_intake"] = int(water) if water else 0
        except:
            current_status["water_intake"] = 0

        notes = input("Any special notes or concerns? (optional): ").strip()
        current_status["notes"] = notes

        context = self._get_life_context()
        context["current_status"] = current_status

        print("\n🤖 Generating personalized life plan...")

        custom_context = self._prepare_llm_context(context)

        if current_status:
            custom_context += f"\n\n当前状态更新：\n"
            if current_status.get("sleep_quality"):
                custom_context += f"- 睡眠质量：{current_status['sleep_quality']}\n"
            if current_status.get("energy_level"):
                custom_context += f"- 精力水平：{current_status['energy_level']}\n"
            if current_status.get("exercised"):
                custom_context += (
                    f"- 已运动：{'是' if current_status['exercised'] else '否'}\n"
                )
            if current_status.get("water_intake", 0) > 0:
                custom_context += f"- 当前饮水量：{current_status['water_intake']}ml\n"
            if current_status.get("notes"):
                custom_context += f"- 特殊情况：{current_status['notes']}\n"

        messages = [
            {
                "role": "system",
                "content": """你是一位专业的生活管理顾问。请根据用户当前的状态，提供针对性的生活管理建议。如果用户已经完成某些任务，请给予肯定并调整建议。""",
            },
            {"role": "user", "content": custom_context},
        ]

        response = self.llm.send_message(
            messages=messages, max_tokens=2000, temperature=0.7
        )

        if response and isinstance(response, str):
            plan = response["content"]
        else:
            plan = self._generate_basic_plan(context)

        print("\n" + "=" * 70)
        print("🌱 Your Personalized Life Plan")
        print("=" * 70)
        print(plan)
        print("=" * 70)

        save = input("\n💾 Save this plan? (y/n): ").strip().lower()
        if save == "y":
            self._save_log("life", plan, "今日生活管理")
            print("✅ Saved to today's logs!")

        return plan

    def _save_log(self, file_type: str, content: str, title: str) -> bool:
        return super()._save_log(file_type, content, title)


if __name__ == "__main__":
    # Example usage
    # Create and run life agent
    agent = LifeAgent()

    # Run interactive mode
    agent.interactive_mode()
