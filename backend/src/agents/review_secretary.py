#!/usr/bin/env python3
"""
Review Secretary Agent
Responsible for evening reflection and behavioral analysis.
"""

import sys
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging
import json
import re

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from integrations.llm.llm_client_v2 import create_llm_client
from utils.file_manager import FileManager

logger = logging.getLogger(__name__)

class ReviewSecretary:
    """AI-powered evening review and reflection secretary."""

    def __init__(self, config: Dict, config_path: str = "config/config.ini"):
        """
        Initialize review secretary.

        Args:
            config: Configuration dictionary containing API keys and settings
            config_path: Path to config.ini file (fallback)
        """
        self.config = config
        self.llm_client = create_llm_client(config_path=config_path)
        self.file_manager = FileManager(config.get('data', {}))

        # Reflection dimensions
        self.reflection_dimensions = {
            'work': {
                'name': '工作表现',
                'prompts': [
                    '今天完成了哪些重要任务？',
                    '遇到了什么挑战？如何解决的？',
                    '学到了什么新知识或技能？',
                    '时间管理如何？',
                    '工作满意度如何？'
                ]
            },
            'personal': {
                'name': '个人成长',
                'prompts': [
                    '今天有什么新的感悟？',
                    '情绪状态如何？',
                    '坚持了哪些好习惯？',
                    '有哪些需要改进的地方？',
                    '个人目标的进展如何？'
                ]
            },
            'health': {
                'name': '健康管理',
                'prompts': [
                    '运动计划执行情况？',
                    '饮食是否健康规律？',
                    '睡眠质量如何？',
                    '压力水平如何？',
                    '身体状况如何？'
                ]
            },
            'relationships': {
                'name': '人际关系',
                'prompts': [
                    '与家人/朋友的互动？',
                    '工作中的协作如何？',
                    '是否有有意义的对话？',
                    '帮助或被帮助的经历？',
                    '需要维护的关系？'
                ]
            },
            'gratitude': {
                'name': '感恩与成就',
                'prompts': [
                    '今天值得感恩的事情？',
                    '让自己感到骄傲的成就？',
                    '收到的善意或帮助？',
                    '美好的瞬间？',
                    '自己的进步？'
                ]
            }
        }

    def run(self, save_to_file: bool = True, interactive: bool = False) -> str:
        """
        Run the review secretary workflow.

        Args:
            save_to_file: Whether to save the review to file
            interactive: Whether to run in interactive mode

        Returns:
            Generated review and reflection in markdown format
        """
        try:
            print("🌙 Review Secretary - Time for daily reflection...")

            # Collect today's data
            today_data = self._collect_today_data()

            if interactive:
                # Interactive reflection mode
                review = self._interactive_reflection(today_data)
            else:
                # Automatic reflection mode
                review = self._generate_reflection(today_data)

            # Display to user
            print("\n" + "=" * 70)
            print("🌙 Daily Reflection Complete")
            print("=" * 70)
            print(review)
            print("=" * 70)

            # Save to file if requested
            if save_to_file:
                self._save_review(review)
                print("\n✅ Review saved to today's logs")

            return review

        except Exception as e:
            logger.error(f"Error in review secretary: {e}")
            return f"❌ Failed to complete review: {str(e)}"

    def _collect_today_data(self) -> Dict:
        """
        Collect all data from today's logs.

        Returns:
            Dictionary containing all today's information
        """
        today = datetime.now().strftime('%Y-%m-%d')
        data = {
            'date': today,
            'files': {},
            'summary': {}
        }

        # Try to read today's log files
        file_types = [
            ('新闻简报.md', 'news'),
            ('今日穿搭.md', 'outfit'),
            ('今日工作.md', 'work'),
            ('今日生活.md', 'life')
        ]

        for filename, file_type in file_types:
            filepath = f"data/daily_logs/{today}/{filename}"
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        data['files'][file_type] = content
                except Exception as e:
                    logger.error(f"Error reading {filename}: {e}")

        # Generate summaries from the content
        data['summary'] = self._generate_summaries(data['files'])

        return data

    def _generate_summaries(self, files: Dict[str, str]) -> Dict:
        """
        Generate summaries from log files.

        Args:
            files: Dictionary of file contents

        Returns:
            Dictionary with summaries
        """
        summaries = {}

        # Work summary
        if 'work' in files:
            summaries['work'] = self._extract_work_summary(files['work'])

        # Life summary
        if 'life' in files:
            summaries['life'] = self._extract_life_summary(files['life'])

        # News summary
        if 'news' in files:
            summaries['news'] = self._extract_news_summary(files['news'])

        # Outfit summary
        if 'outfit' in files:
            summaries['outfit'] = self._extract_outfit_summary(files['outfit'])

        return summaries

    def _extract_work_summary(self, content: str) -> Dict:
        """Extract work-related summary from work log."""
        summary = {
            'tasks_completed': [],
            'tasks_pending': [],
            'highlights': [],
            'challenges': []
        }

        lines = content.split('\n')
        current_section = None

        for line in lines:
            line = line.strip()

            # Identify sections
            if '高优先级' in line:
                current_section = 'high_priority'
            elif '中优先级' in line:
                current_section = 'medium_priority'
            elif '低优先级' in line:
                current_section = 'low_priority'
            elif line.startswith('- [x]') or line.startswith('- [X]'):
                # Completed task
                task = line.replace('- [x]', '').replace('- [X]', '').strip()
                summary['tasks_completed'].append(task)
            elif line.startswith('- [ ]'):
                # Pending task
                task = line.replace('- [ ]', '').strip()
                summary['tasks_pending'].append(task)

        # Extract highlights from completed tasks
        for task in summary['tasks_completed']:
            if any(keyword in task.lower() for keyword in ['完成', '实现', '解决', '优化']):
                summary['highlights'].append(task)

        return summary

    def _extract_life_summary(self, content: str) -> Dict:
        """Extract life-related summary from life log."""
        summary = {
            'exercise_completed': False,
            'meals': [],
            'sleep_target': None,
            'water_intake': 0,
            'health_tips': []
        }

        # Check for exercise
        if any(keyword in content for keyword in ['运动', '锻炼', '健身', '跑步']):
            summary['exercise_completed'] = True

        # Extract meals
        meal_keywords = ['早餐', '午餐', '晚餐']
        for keyword in meal_keywords:
            if keyword in content:
                summary['meals'].append(keyword)

        # Extract water intake
        water_match = re.search(r'饮水.*?(\d+)\s*(ml|毫升)', content)
        if water_match:
            summary['water_intake'] = int(water_match.group(1))

        # Extract health tips
        lines = content.split('\n')
        for line in lines:
            if '小贴士' in line or '提醒' in line:
                summary['health_tips'].append(line.strip())

        return summary

    def _extract_news_summary(self, content: str) -> Dict:
        """Extract news-related summary from news log."""
        summary = {
            'headlines': [],
            'topics': []
        }

        # Extract headlines
        lines = content.split('\n')
        for line in lines:
            if line.startswith('###'):
                # This is a news item
                summary['headlines'].append(line.replace('###', '').strip())

        # Identify topics
        topic_keywords = ['AI', '人工智能', '技术', '科技', '开发', '编程']
        for headline in summary['headlines']:
            for keyword in topic_keywords:
                if keyword in headline:
                    summary['topics'].append(keyword)
                    break

        return summary

    def _extract_outfit_summary(self, content: str) -> Dict:
        """Extract outfit-related summary from outfit log."""
        summary = {
            'main_outfit': '',
            'weather_considered': False,
            'special_notes': []
        }

        # Check if weather was considered
        if '天气' in content or '温度' in content:
            summary['weather_considered'] = True

        # Extract main outfit items
        lines = content.split('\n')
        for line in lines:
            if any(keyword in line for keyword in ['上装', '下装', '鞋履']):
                summary['main_outfit'] += line.strip() + '; '

        # Extract special notes
        if '提示' in content or '贴士' in content:
            summary['special_notes'].append('有特殊穿搭建议')

        return summary

    def _interactive_reflection(self, today_data: Dict) -> str:
        """
        Run interactive reflection session with user.

        Args:
            today_data: Today's collected data

        Returns:
            Complete reflection document
        """
        print("\n" + "=" * 70)
        print("🤔 Let's reflect on your day together")
        print("=" * 70)

        reflections = {}

        # Guide through each dimension
        for dimension, info in self.reflection_dimensions.items():
            print(f"\n📝 {info['name']}")
            print("-" * 40)

            dimension_thoughts = []

            for prompt in info['prompts']:
                print(f"\n{prompt}")
                response = input("→ ").strip()
                if response:
                    dimension_thoughts.append(f"**{prompt}**: {response}")

            reflections[dimension] = dimension_thoughts

        # Ask for overall mood
        print("\n😊 整体心情如何？")
        mood = input("→ ").strip()
        reflections['overall_mood'] = mood

        # Ask for tomorrow's focus
        print("\n🎯 明天最想专注的3件事？")
        tomorrow_focus = []
        for i in range(3):
            item = input(f"{i+1}. ").strip()
            if item:
                tomorrow_focus.append(item)
        reflections['tomorrow_focus'] = tomorrow_focus

        # Generate comprehensive review
        return self._compile_reflection(reflections, today_data)

    def _generate_reflection(self, today_data: Dict) -> str:
        """
        Generate automatic reflection using LLM based on today's data.

        Args:
            today_data: Today's collected data

        Returns:
            Generated reflection document
        """
        print("🤖 Analyzing your day and generating insights...")

        # Prepare context for LLM
        context = self._prepare_reflection_context(today_data)

        # Generate reflection using LLM
        messages = [
            {
                "role": "system",
                "content": """你是一位专业的生活教练和反思引导师，帮助大洪进行每日复盘。

你的职责：
1. 基于今日日志数据生成深度反思
2. 发现行为模式和改进机会
3. 提供鼓励和建设性建议
4. 引导积极的心态和成长思维

写作风格：
- 温暖、支持、有洞察力
- 结构清晰，层次分明
- 使用中文
- 提供具体、可执行的见解
- 保持积极向上的基调

请确保反思既有深度又易于理解，帮助用户获得真正的价值。"""
            },
            {
                "role": "user",
                "content": context
            }
        ]

        response = self.llm_client.send_message(
            messages=messages,
            max_tokens=2500,
            temperature=0.8
        )

        if response and response.get('content'):
            return response['content']

        # Fallback to basic reflection
        return self._generate_basic_reflection(today_data)

    def _prepare_reflection_context(self, today_data: Dict) -> str:
        """
        Prepare context for LLM reflection generation.

        Args:
            today_data: Today's collected data

        Returns:
            Formatted context string
        """
        today = datetime.now().strftime('%Y年%m月%d日 %A')
        summaries = today_data.get('summary', {})

        context = f"""请为{today}生成一份深度个人复盘。

## 今日概览

基于今日的日志数据，以下是主要信息：

### 工作方面
"""

        if 'work' in summaries:
            work_summary = summaries['work']
            if work_summary.get('tasks_completed'):
                context += f"**已完成的任务**：\n"
                for task in work_summary['tasks_completed'][:3]:  # Limit to 3 tasks
                    context += f"- {task}\n"

            if work_summary.get('highlights'):
                context += f"\n**今日亮点**：\n"
                for highlight in work_summary['highlights']:
                    context += f"- {highlight}\n"

            if work_summary.get('tasks_pending'):
                context += f"\n**待完成任务**：{len(work_summary['tasks_pending'])}项\n"

        context += "\n### 生活方面\n"

        if 'life' in summaries:
            life_summary = summaries['life']
            context += f"- **运动情况**：{'已完成' if life_summary.get('exercise_completed') else '未完成'}\n"

            if life_summary.get('water_intake', 0) > 0:
                context += f"- **饮水量**：{life_summary['water_intake']}ml\n"

            if life_summary.get('meals'):
                context += f"- **餐饮记录**：已记录{len(life_summary['meals'])}餐\n"

        context += "\n### 其他信息\n"

        if 'news' in summaries:
            news_summary = summaries['news']
            if news_summary.get('topics'):
                context += f"- **关注的资讯主题**：{', '.join(set(news_summary['topics']))}\n"

        if 'outfit' in summaries:
            outfit_summary = summaries['outfit']
            if outfit_summary.get('weather_considered'):
                context += f"- **穿搭**：已考虑天气因素\n"

        context += """
## 复盘要求

请从以下维度进行深度复盘：

### 1. 工作成就与成长
- 识别今日的关键成就
- 分析完成任务过程中的学习
- 识别能力提升的机会

### 2. 时间管理与效率
- 评估时间使用效率
- 发现时间黑洞
- 提出优化建议

### 3. 身心状态
- 分析精力变化模式
- 评估压力水平
- 识别充电需求

### 4. 人际互动
- 回顾有意义的交流
- 分析协作效果
- 识别关系维护需求

### 5. 感恩与积极面
- 识别值得感恩的事物
- 发现隐藏的美好
- 强化积极体验

### 6. 明日规划
- 基于今日经验确定明日重点
- 设定具体可行的目标
- 制定改进计划

请使用以下格式：
# 今日复盘 - 日期

## 🌟 今日亮点与成就
具体成就和积极体验...

## 📊 深度分析
### 工作表现
深入分析...

### 个人成长
学习与感悟...

### 生活状态
健康与平衡...

## 🎯 改进机会
可优化的方面...

## 💡 洞察与启发
重要发现...

## 🙏 感恩时刻
值得感恩的事物...

## 🚀 明日行动计划
具体目标和行动...

## ✨ 结语
鼓励和展望...
"""

        return context

    def _generate_basic_reflection(self, today_data: Dict) -> str:
        """
        Generate basic reflection without LLM.

        Args:
            today_data: Today's collected data

        Returns:
            Basic reflection document
        """
        today = datetime.now().strftime('%Y年%m月%d日')
        summaries = today_data.get('summary', {})

        reflection = f"""# 今日复盘 - {today}

## 📊 今日概览

### 工作完成情况
"""

        if 'work' in summaries:
            work_summary = summaries['work']
            completed = len(work_summary.get('tasks_completed', []))
            pending = len(work_summary.get('tasks_pending', []))

            reflection += f"- **完成任务**：{completed}项\n"
            reflection += f"- **待办任务**：{pending}项\n"

            if work_summary.get('highlights'):
                reflection += "\n**主要成就**：\n"
                for highlight in work_summary['highlights'][:3]:
                    reflection += f"- {highlight}\n"

        reflection += "\n### 生活管理\n"

        if 'life' in summaries:
            life_summary = summaries['life']
            reflection += f"- **运动**：{'✅ 已完成' if life_summary.get('exercise_completed') else '⏳ 未完成'}\n"

            if life_summary.get('water_intake', 0) > 0:
                water_ratio = life_summary['water_intake'] / 2000 * 100
                reflection += f"- **饮水**：{life_summary['water_intake']}ml ({water_ratio:.0f}%)\n"

            meals = len(life_summary.get('meals', []))
            reflection += f"- **餐饮记录**：{meals}/3餐\n"

        reflection += """
## 🌟 今日亮点

1. **坚持使用AI助手**
   - 成完成了工作规划，提高了效率
   - 记录了生活细节，养成了好习惯

2. **生活规律**
   - 保持了基本的生活节奏
   - 注意健康管理

3. **持续学习**
   - 通过新闻简报了解行业动态
   - 在工作中获得新的经验

## 🤔 反思与洞察

### 做得好的方面
- 使用系统化的方式管理生活
- 保持了记录和反思的习惯
- 在工作和生活之间寻求平衡

### 可以改进的地方
- 时间管理还有提升空间
- 可以更专注于深度工作
- 需要更多的主动休息

## 💡 明日计划

### 工作重点
1. 处理今日未完成的任务
2. 安排深度工作时间
3. 优先处理重要紧急事项

### 生活目标
1. 按时完成运动计划
2. 保持规律作息
3. 增加与家人的交流

### 个人成长
1. 学习新技术或技能
2. 阅读行业文章
3. 反思和总结经验

## 🙏 感恩清单

- 感恩拥有健康的身体
- 感恩工作中的挑战和机会
- 感恩AI助手的帮助
- 感恩家人的支持
- 感恩自己的坚持

## ✨ 结语

每一天都是新的开始，今天的反思是为了明天更好的自己。继续保持记录和反思的习惯，让每一天都充满意义和成长。

晚安，大洪！期待明天的精彩！ 🌙
"""

        return reflection

    def _compile_reflection(self, reflections: Dict, today_data: Dict) -> str:
        """
        Compile user's interactive reflections into a complete review.

        Args:
            reflections: User's reflection responses
            today_data: Today's collected data

        Returns:
            Compiled reflection document
        """
        today = datetime.now().strftime('%Y年%m月%d日')

        review = f"""# 今日复盘 - {today}

## 🤔 深度反思

"""

        # Add reflections for each dimension
        for dimension, info in self.reflection_dimensions.items():
            if dimension in reflections and reflections[dimension]:
                review += f"### {info['name']}\n\n"
                for thought in reflections[dimension]:
                    review += f"{thought}\n\n"
                review += "\n"

        # Add overall mood
        if 'overall_mood' in reflections:
            review += f"## 😊 整体心情\n\n{reflections['overall_mood']}\n\n"

        # Add tomorrow focus
        if 'tomorrow_focus' in reflections and reflections['tomorrow_focus']:
            review += "## 🎯 明日重点关注\n\n"
            for i, focus in enumerate(reflections['tomorrow_focus'], 1):
                review += f"{i}. {focus}\n"

        # Add AI insights
        review += "\n" + "="*50 + "\n\n"
        review += "## 🤖 AI洞察与建议\n\n"

        # Generate some insights based on the reflections
        insights = self._generate_insights(reflections, today_data)
        review += insights

        # Add closing
        review += f"""
## ✨ 结语

感谢你今天花时间进行深度反思。通过这样的复盘，你能够更好地了解自己，发现成长的机会。

记住，每一天的进步都是成功路上的一步。继续保持这种自省的习惯，你会越来越好！

晚安，期待明天更好的你！🌙

---
*复盘完成时间：{datetime.now().strftime('%H:%M')}*
"""

        return review

    def _generate_insights(self, reflections: Dict, today_data: Dict) -> str:
        """
        Generate AI insights based on reflections and data.

        Args:
            reflections: User's reflection responses
            today_data: Today's collected data

        Returns:
            AI insights and suggestions
        """
        insights = []

        # Analyze work completion
        if 'work' in today_data.get('summary', {}):
            work_summary = today_data['summary']['work']
            completed = len(work_summary.get('tasks_completed', []))
            pending = len(work_summary.get('tasks_pending', []))

            if completed > 0:
                insights.append(f"✅ **执行力认可**：今天完成了{completed}项任务，展现了良好的执行力。")

            if pending > 3:
                insights.append(f"💡 **任务管理建议**：还有{pending}项待办，明天考虑优先级排序或拆分大任务。")

        # Analyze health habits
        if 'life' in today_data.get('summary', {}):
            life_summary = today_data['summary']['life']

            if not life_summary.get('exercise_completed'):
                insights.append("🏃‍♂️ **运动提醒**：今天没有运动记录，明天记得安排时间活动身体。")

            water_ratio = life_summary.get('water_intake', 0) / 2000
            if water_ratio < 0.8:
                insights.append(f"💧 **饮水建议**：今天饮水量不足目标，明天记得按时喝水。")

        # Emotional insights
        if 'overall_mood' in reflections:
            mood = reflections['overall_mood'].lower()
            if any(word in mood for word in ['好', '不错', '开心', '满足']):
                insights.append("😊 **积极心态**：保持这样的积极情绪，它是前进的动力。")
            elif any(word in mood for word in ['累', '疲惫', '压力']):
                insights.append("🌸 **关怀提醒**：感到疲惫时记得适当休息，照顾好自己。")

        # Tomorrow focus validation
        if 'tomorrow_focus' in reflections and len(reflections['tomorrow_focus']) == 3:
            insights.append("🎯 **目标设定**：明天的3个重点目标很明确，这样有助于聚焦精力。")

        return "\n".join(insights) if insights else "今天的反思很有深度，继续保持这种自省的习惯！"

    def _save_review(self, review: str):
        """
        Save review to file.

        Args:
            review: Review content
        """
        try:
            # Add timestamp header
            timestamp = datetime.now().strftime('%Y年%m月%d日 %H:%M')
            content = f"{review}\n\n---\n*生成时间: {timestamp}*"

            self.file_manager.save_daily_file(
                file_type='review',
                content=content,
                custom_filename='今日复盘.md'
            )

        except Exception as e:
            logger.error(f"Failed to save review: {e}")

    def get_weekly_summary(self) -> str:
        """
        Generate weekly review summary.

        Returns:
            Weekly summary report
        """
        # This would analyze the past week's reviews
        # For now, return a template
        return """# 本周回顾总结

## 📊 数据概览
- 复盘天数：X天
- 平均工作完成率：XX%
- 运动天数：X天

## 🌟 本周亮点
1. [亮点1]
2. [亮点2]
3. [亮点3]

## 📈 进步轨迹
- [进步1]
- [进步2]

## 💪 挑战与成长
- [挑战1] - 学到了[经验]
- [挑战2] - 改进了[方面]

## 🎯 下周重点
1. [重点1]
2. [重点2]
3. [重点3]

## 🏆 成就解锁
- [成就1]
- [成就2]

继续加油，每一天都是成长的机会！
"""

if __name__ == "__main__":
    # Example usage
    import configparser

    # Load configuration
    config = configparser.ConfigParser()
    config.read('../config/config.ini')

    # Convert to dictionary
    config_dict = {
        'llm': dict(config['llm']) if 'llm' in config else {},
        'data': dict(config['data']) if 'data' in config else {}
    }

    # Create and run review secretary
    secretary = ReviewSecretary(config_dict)

    # Run interactive reflection
    secretary.run(interactive=True)