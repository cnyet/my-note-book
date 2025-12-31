"""
GLM API Client Wrapper for Life Assistant System
Supports GLM models (GLM-4.5 for main tasks, GLM-4-Flash for lightweight tasks)
"""

import requests
import json
from typing import List, Dict, Optional, Union, Any


class GLMClient:
    def __init__(self, api_key: str, base_url: str = "https://open.bigmodel.cn/api/paas/v4"):
        """
        Initialize GLM client

        Args:
            api_key: GLM API key
            base_url: GLM API base URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.model = "glm-4.6v-flash"  # Main model for complex tasks
        self.lightweight_model = "glm-4-flash"  # Fast model for simple tasks
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def send_message(
        self,
        messages: List[Dict],
        system_prompt: str = "",
        max_tokens: int = 4000,
        temperature: float = 0.7,
        is_lightweight: bool = False,
        stream: bool = False
    ) -> str:
        """
        Send message to GLM and get response

        Args:
            messages: List of conversation messages
            system_prompt: System prompt for context
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            is_lightweight: If True, use GLM-4-Flash model
            stream: Whether to use streaming response

        Returns:
            str: GLM response text
        """
        try:
            # Prepare the request payload
            payload = {
                "model": self.lightweight_model if is_lightweight else self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "stream": stream
            }

            # Add system prompt if provided
            if system_prompt:
                # GLM API expects system as a message
                payload["messages"] = [{"role": "system", "content": system_prompt}] + messages

            # Make the API request
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=30
            )

            # Check for successful response
            if response.status_code == 200:
                result = response.json()

                if "choices" in result and len(result["choices"]) > 0:
                    content: str = result["choices"][0]["message"]["content"]
                    return content
                else:
                    print(f"Unexpected GLM API response format: {result}")
                    return ""
            else:
                print(f"GLM API error: {response.status_code} - {response.text}")
                return ""

        except Exception as e:
            print(f"Error calling GLM API: {e}")
            return ""

    def simple_chat(
        self,
        user_message: str,
        system_prompt: str = "",
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Simplified chat interface for single-turn conversations

        Args:
            user_message: User's message
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature

        Returns:
            str: GLM response
        """
        messages = [{"role": "user", "content": user_message}]
        return self.send_message(messages, system_prompt, max_tokens, temperature)

    def generate_news_summary(self, news_content: str, num_articles: int = 5) -> str:
        """
        Generate structured news summary

        Args:
            news_content: Raw news content to summarize
            num_articles: Number of articles to include

        Returns:
            str: Formatted news summary
        """
        system_prompt = f"""
        你是一个专业的新闻编辑，专门处理AI和科技新闻。
        请分析以下新闻文章，创建一个结构化的简报。

        对于每篇文章，请提供：
        1. 标题（改编得清晰明了）
        2. 摘要（2-3句话突出重点）
        3. 关键要点（项目符号）
        4. 重要性评分（1-5分，5分最重要）
        5. 与AI/科技行业的相关性

        请包含最重要的{num_articles}篇文章。
        用清晰、易读的中文格式回复。
        """

        return self.simple_chat(news_content, system_prompt, max_tokens=3000, temperature=0.3)

    def generate_outfit_suggestion(
        self,
        weather_info: Dict,
        user_preferences: Dict,
        occasion: str = "日常工作"
    ) -> str:
        """
        Generate outfit suggestions based on weather and preferences

        Args:
            weather_info: Weather information dict
            user_preferences: User preferences dict
            occasion: Occasion/destination

        Returns:
            str: Outfit suggestion
        """
        system_prompt = """
        你是一位专业的穿搭顾问，擅长根据天气、场合和个人偏好提供合适的穿搭建议。
        请提供详细、实用的穿搭建议，包括：
        1. 上下装搭配
        2. 鞋履选择
        3. 配饰建议
        4. 穿搭注意事项
        请用中文回复，语气友好专业。
        """

        user_message = f"""
        请为我提供今日穿搭建议：

        天气情况：
        - 温度：{weather_info.get('temperature', '未知')}°C
        - 天气：{weather_info.get('condition', '未知')}
        - 湿度：{weather_info.get('humidity', '未知')}%

        场合：{occasion}

        个人偏好：
        - 风格：{user_preferences.get('style', '休闲商务')}
        - 不喜欢：{user_preferences.get('dislikes', '无特殊要求')}
        """

        return self.simple_chat(user_message, system_prompt, max_tokens=2000, temperature=0.8)

    def generate_work_plan(
        self,
        tasks: List[str],
        priorities: Optional[List[str]] = None,
        time_available: int = 8
    ) -> str:
        """
        Generate structured work plan

        Args:
            tasks: List of tasks to plan
            priorities: List of priorities for tasks
            time_available: Available hours in the day

        Returns:
            str: Work plan
        """
        system_prompt = """
        你是一位高效的时间管理专家，擅长帮助人们规划工作任务。
        请根据提供的任务列表，创建一个结构化的工作计划，包括：
        1. 任务优先级排序
        2. 时间分配建议
        3. 执行顺序
        4. 休息安排
        5. 注意事项

        请用中文回复，格式清晰，实用性强。
        """

        user_message = f"""
        请帮我制定今日工作计划：

        可用时间：{time_available}小时

        任务列表：
        {chr(10).join([f"- {task}" for task in tasks])}

        {f"优先级说明：{chr(10).join([f"- {p}" for p in priorities])}" if priorities else ""}
        """

        return self.simple_chat(user_message, system_prompt, max_tokens=2500, temperature=0.5)

    def generate_health_advice(
        self,
        health_data: Dict,
        goals: Dict,
        current_date: str
    ) -> str:
        """
        Generate personalized health advice

        Args:
            health_data: Current health data
            goals: Health goals
            current_date: Current date

        Returns:
            str: Health advice
        """
        system_prompt = """
        你是一位专业的健康管理顾问，擅长提供个性化的健康建议。
        请根据用户的健康数据和目标，提供实用的建议，包括：
        1. 饮食建议
        2. 运动计划
        3. 作息调整
        4. 健康提醒
        5. 改善建议

        请用中文回复，语气关怀且专业。
        """

        user_message = f"""
        请为我提供今日健康建议（日期：{current_date}）：

        当前健康数据：
        - 饮水量：{health_data.get('water_intake', 0)}ml / 目标 {goals.get('water_goal', 2000)}ml
        - 运动情况：{health_data.get('exercise', '尚未进行')}
        - 睡眠时长：{health_data.get('sleep_hours', '未知')}小时

        健康目标：
        - 每日饮水：{goals.get('water_goal', 2000)}ml
        - 运动频率：{goals.get('exercise_frequency', 3)}次/周
        - 睡眠目标：{goals.get('sleep_target', 8)}小时
        """

        return self.simple_chat(user_message, system_prompt, max_tokens=2000, temperature=0.7)

    def generate_review_questions(self, review_date: str) -> str:
        """
        Generate evening review questions

        Args:
            review_date: Date to review

        Returns:
            str: Review questions and guidance
        """
        system_prompt = """
        你是一位专业的生活教练，擅长引导人们进行深度反思。
        请设计一系列有深度的问题，引导用户回顾一天的生活，包括：
        1. 工作成就与挑战
        2. 学习与成长
        3. 身心状态
        4. 人际关系
        5. 感恩与收获

        问题应该具有启发性，能够引导深入思考。
        请用中文回复，语气温和鼓励。
        """

        user_message = f"""
        请为今日（{review_date}）设计晚间复盘问题。
        问题应该帮助用户：
        - 回顾成就和进步
        - 识别需要改进的地方
        - 规划明天的重点
        - 保持积极的心态
        """

        return self.simple_chat(user_message, system_prompt, max_tokens=1500, temperature=0.8)

    def analyze_review_responses(self, responses: Dict, review_date: str) -> str:
        """
        Analyze user's review responses and generate insights

        Args:
            responses: User's review responses
            review_date: Date of review

        Returns:
            str: Analysis and insights
        """
        system_prompt = """
        你是一位专业的生活分析师，擅长从日常反思中提取洞察和模式。
        请分析用户的复盘回答，提供：
        1. 成就亮点总结
        2. 行为模式识别
        3. 改进建议
        4. 积极心态强化
        5. 明日行动建议

        请用中文回复，既要客观分析，又要给予鼓励。
        """

        user_message = f"""
        请分析以下今日复盘（{review_date}）：

        用户回答：
        {json.dumps(responses, ensure_ascii=False, indent=2)}

        请提供深度分析和建议。
        """

        return self.simple_chat(user_message, system_prompt, max_tokens=2500, temperature=0.6)

    def check_api_connection(self) -> bool:
        """
        Check if the GLM API is accessible

        Returns:
            bool: True if API is working
        """
        try:
            test_message = [{"role": "user", "content": "Hello, this is a test."}]
            response = self.send_message(test_message, max_tokens=10, is_lightweight=True)
            return len(response) > 0
        except:
            return False


# Create a unified interface that can switch between providers
class UniversalLLMClient:
    """
    Universal LLM Client that supports multiple providers
    Currently supports: GLM, Claude (if needed in future)
    """

    def __init__(self, provider: str, **kwargs: Any) -> None:
        """
        Initialize the universal client

        Args:
            provider: Provider name ('glm' or 'claude')
            **kwargs: Provider-specific arguments (api_key, etc.)
        """
        self.provider = provider.lower()

        if self.provider == 'glm':
            api_key = kwargs.get('api_key', '')
            if not isinstance(api_key, str):
                raise ValueError('api_key must be a string')
            self.client = GLMClient(
                api_key=api_key,
                base_url=kwargs.get('base_url', 'https://open.bigmodel.cn/api/paas/v4')
            )
        else:
            raise ValueError(f"Unsupported provider: {provider}")

    def __getattr__(self, name: str) -> Any:
        """Delegate method calls to the underlying client"""
        return getattr(self.client, name)