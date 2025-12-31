"""
Unit tests for LLM Client modules
Tests Claude client, GLM client, and universal client factory
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from utils.llm_client import LLMClient
from utils.glm_client import GLMClient
from utils.llm_client_v2 import create_llm_client, LLMClientUniversal


class TestLLMClient:
    """Tests for Claude LLM Client"""

    def test_init(self):
        """测试LLMClient初始化"""
        client = LLMClient(api_key="test-key", model="claude-3-5-sonnet-20241022")
        assert client.model == "claude-3-5-sonnet-20241022"
        assert client.lightweight_model == "claude-3-5-haiku-20241022"

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_send_message_success(self, mock_anthropic):
        """测试成功发送消息"""
        # Mock API response
        mock_response = Mock()
        mock_response.content = [Mock(text="Test response")]
        mock_client = Mock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.return_value = mock_client

        # Test
        client = LLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == "Test response"
        mock_client.messages.create.assert_called_once()

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_send_message_with_system_prompt(self, mock_anthropic):
        """测试带系统提示的消息发送"""
        mock_response = Mock()
        mock_response.content = [Mock(text="Response with system")]
        mock_client = Mock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.return_value = mock_client

        client = LLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(
            messages,
            system_prompt="You are a helpful assistant"
        )

        assert result == "Response with system"
        call_args = mock_client.messages.create.call_args
        assert call_args.kwargs['system'] == "You are a helpful assistant"

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_send_message_lightweight_model(self, mock_anthropic):
        """测试使用轻量级模型"""
        mock_response = Mock()
        mock_response.content = [Mock(text="Lightweight response")]
        mock_client = Mock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.return_value = mock_client

        client = LLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Quick task"}]
        result = client.send_message(messages, is_lightweight=True)

        assert result == "Lightweight response"
        call_args = mock_client.messages.create.call_args
        assert call_args.kwargs['model'] == "claude-3-5-haiku-20241022"

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_send_message_error_handling(self, mock_anthropic):
        """测试错误处理"""
        mock_client = Mock()
        mock_client.messages.create.side_effect = Exception("API Error")
        mock_anthropic.return_value = mock_client

        client = LLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == ""

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_simple_chat(self, mock_anthropic):
        """测试简化聊天接口"""
        mock_response = Mock()
        mock_response.content = [Mock(text="Simple chat response")]
        mock_client = Mock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.return_value = mock_client

        client = LLMClient(api_key="test-key")
        result = client.simple_chat("Hello, how are you?")

        assert result == "Simple chat response"

    @patch('utils.llm_client.anthropic.Anthropic')
    def test_generate_news_summary(self, mock_anthropic):
        """测试新闻摘要生成"""
        mock_response = Mock()
        mock_response.content = [Mock(text="News summary")]
        mock_client = Mock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.return_value = mock_client

        client = LLMClient(api_key="test-key")
        result = client.generate_news_summary("News content", num_articles=3)

        assert result == "News summary"
        call_args = mock_client.messages.create.call_args
        assert "3" in call_args.kwargs['system']


class TestGLMClient:
    """Tests for GLM Client"""

    def test_init(self):
        """测试GLMClient初始化"""
        client = GLMClient(api_key="test-key")
        assert client.api_key == "test-key"
        assert client.model == "glm-4.6v-flash"
        assert client.lightweight_model == "glm-4-flash"
        assert "Bearer test-key" in client.headers["Authorization"]

    @patch('utils.glm_client.requests.post')
    def test_send_message_success(self, mock_post):
        """测试成功发送消息"""
        # Mock successful response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "GLM response"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == "GLM response"
        mock_post.assert_called_once()

    @patch('utils.glm_client.requests.post')
    def test_send_message_with_system_prompt(self, mock_post):
        """测试带系统提示的消息"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Response with system"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(
            messages,
            system_prompt="You are helpful"
        )

        assert result == "Response with system"
        call_args = mock_post.call_args
        payload = call_args.kwargs['json']
        assert payload['messages'][0]['role'] == 'system'

    @patch('utils.glm_client.requests.post')
    def test_send_message_lightweight_model(self, mock_post):
        """测试轻量级模型"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Fast response"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Quick"}]
        result = client.send_message(messages, is_lightweight=True)

        assert result == "Fast response"
        call_args = mock_post.call_args
        assert call_args.kwargs['json']['model'] == "glm-4-flash"

    @patch('utils.glm_client.requests.post')
    def test_send_message_api_error(self, mock_post):
        """测试API错误响应"""
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.text = "Internal Server Error"
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == ""

    @patch('utils.glm_client.requests.post')
    def test_send_message_unexpected_format(self, mock_post):
        """测试意外的响应格式"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"unexpected": "format"}
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == ""

    @patch('utils.glm_client.requests.post')
    def test_send_message_exception(self, mock_post):
        """测试异常处理"""
        mock_post.side_effect = Exception("Network error")

        client = GLMClient(api_key="test-key")
        messages = [{"role": "user", "content": "Hello"}]
        result = client.send_message(messages)

        assert result == ""

    @patch('utils.glm_client.requests.post')
    def test_simple_chat(self, mock_post):
        """测试简化聊天接口"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Chat response"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        result = client.simple_chat("Hello")

        assert result == "Chat response"

    @patch('utils.glm_client.requests.post')
    def test_generate_news_summary(self, mock_post):
        """测试新闻摘要生成"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "新闻摘要"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        result = client.generate_news_summary("新闻内容", num_articles=5)

        assert result == "新闻摘要"

    @patch('utils.glm_client.requests.post')
    def test_generate_outfit_suggestion(self, mock_post):
        """测试穿搭建议生成"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "穿搭建议"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        weather = {"temperature": 20, "condition": "晴天", "humidity": 60}
        preferences = {"style": "休闲", "dislikes": "正装"}
        result = client.generate_outfit_suggestion(weather, preferences)

        assert result == "穿搭建议"

    @patch('utils.glm_client.requests.post')
    def test_generate_work_plan(self, mock_post):
        """测试工作计划生成"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "工作计划"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        tasks = ["任务1", "任务2", "任务3"]
        result = client.generate_work_plan(tasks, time_available=8)

        assert result == "工作计划"

    @patch('utils.glm_client.requests.post')
    def test_check_api_connection_success(self, mock_post):
        """测试API连接检查成功"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "OK"}}]
        }
        mock_post.return_value = mock_response

        client = GLMClient(api_key="test-key")
        result = client.check_api_connection()

        assert result is True

    @patch('utils.glm_client.requests.post')
    def test_check_api_connection_failure(self, mock_post):
        """测试API连接检查失败"""
        mock_post.side_effect = Exception("Connection failed")

        client = GLMClient(api_key="test-key")
        result = client.check_api_connection()

        assert result is False


class TestLLMClientV2:
    """Tests for Universal LLM Client Factory"""

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.glm_client.GLMClient')
    def test_create_llm_client_glm(self, mock_glm_client, mock_config_loader):
        """测试创建GLM客户端"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'glm',
            ('llm', 'api_key', ''): 'test-glm-key',
            ('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4'): 
                'https://open.bigmodel.cn/api/paas/v4'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = create_llm_client(config_path="test_config.ini")

        mock_glm_client.assert_called_once_with(
            api_key='test-glm-key',
            base_url='https://open.bigmodel.cn/api/paas/v4'
        )

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.llm_client.LLMClient')
    def test_create_llm_client_anthropic(self, mock_llm_client, mock_config_loader):
        """测试创建Anthropic客户端"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'anthropic',
            ('llm', 'api_key', ''): 'test-anthropic-key',
            ('llm', 'main_model', 'claude-3-5-sonnet-20241022'): 
                'claude-3-5-sonnet-20241022'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = create_llm_client(config_path="test_config.ini")

        mock_llm_client.assert_called_once_with(
            api_key='test-anthropic-key',
            model='claude-3-5-sonnet-20241022'
        )

    @patch('utils.llm_client_v2.ConfigLoader')
    def test_create_llm_client_unsupported_provider(self, mock_config_loader):
        """测试不支持的提供商"""
        mock_config = Mock()
        mock_config.get.return_value = 'unsupported'
        mock_config_loader.return_value = mock_config

        with pytest.raises(ValueError, match="Unsupported LLM provider"):
            create_llm_client(config_path="test_config.ini")

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.glm_client.GLMClient')
    def test_universal_client_init(self, mock_glm_client, mock_config_loader):
        """测试通用客户端初始化"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'glm',
            ('llm', 'api_key', ''): 'test-key',
            ('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4'): 
                'https://open.bigmodel.cn/api/paas/v4'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = LLMClientUniversal(config_path="test_config.ini")

        assert client.config is not None
        assert client.client is not None

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.glm_client.GLMClient')
    def test_universal_client_get_provider(self, mock_glm_client, mock_config_loader):
        """测试获取提供商名称"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'glm',
            ('llm', 'api_key', ''): 'test-key',
            ('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4'): 
                'https://open.bigmodel.cn/api/paas/v4'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = LLMClientUniversal(config_path="test_config.ini")
        provider = client.get_provider()

        assert provider == 'glm'

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.glm_client.GLMClient')
    def test_universal_client_switch_provider(self, mock_glm_client, mock_config_loader):
        """测试切换提供商"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'glm',
            ('llm', 'api_key', ''): 'test-key',
            ('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4'): 
                'https://open.bigmodel.cn/api/paas/v4'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = LLMClientUniversal(config_path="test_config.ini")
        
        # Switch to GLM
        client.switch_provider('glm', api_key='new-key')
        
        # Verify switch happened
        assert mock_glm_client.call_count >= 2

    @patch('utils.llm_client_v2.ConfigLoader')
    @patch('utils.glm_client.GLMClient')
    def test_universal_client_switch_unsupported(self, mock_glm_client, mock_config_loader):
        """测试切换到不支持的提供商"""
        mock_config = Mock()
        mock_config.get.side_effect = lambda section, key, default='': {
            ('llm', 'provider', 'anthropic'): 'glm',
            ('llm', 'api_key', ''): 'test-key',
            ('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4'): 
                'https://open.bigmodel.cn/api/paas/v4'
        }.get((section, key, default), default)
        mock_config_loader.return_value = mock_config

        client = LLMClientUniversal(config_path="test_config.ini")
        
        with pytest.raises(ValueError, match="Unsupported provider"):
            client.switch_provider('unsupported')
