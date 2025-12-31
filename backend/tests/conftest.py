"""
Pytest configuration and shared fixtures
"""
import pytest
import os
import tempfile
import shutil
from datetime import datetime
from pathlib import Path


@pytest.fixture
def temp_dir():
    """创建临时目录用于测试"""
    temp_path = tempfile.mkdtemp()
    yield temp_path
    shutil.rmtree(temp_path, ignore_errors=True)


@pytest.fixture
def test_config():
    """测试配置字典"""
    return {
        'llm': {
            'provider': 'glm',
            'api_key': 'test_api_key_12345',
            'model': 'glm-4',
            'base_url': 'https://test.api.com'
        },
        'data': {
            'base_dir': '.',
            'logs_dir': 'test_data/daily_logs',
            'vector_db_dir': 'test_data/vector_db'
        }
    }


@pytest.fixture
def test_date():
    """固定的测试日期，避免时间依赖"""
    return '2025-01-15'


@pytest.fixture
def mock_datetime(monkeypatch, test_date):
    """Mock datetime.now()返回固定日期"""
    class MockDateTime:
        @staticmethod
        def now():
            class FakeNow:
                def strftime(self, fmt):
                    return datetime.strptime(test_date, '%Y-%m-%d').strftime(fmt)
            return FakeNow()
        
        @staticmethod
        def strptime(date_string, fmt):
            return datetime.strptime(date_string, fmt)
    
    monkeypatch.setattr('datetime.datetime', MockDateTime)
    return test_date


@pytest.fixture
def test_config_file(tmp_path):
    """创建临时配置文件"""
    config_content = """[llm]
provider = glm
api_key = test_key_12345
model = glm-4
base_url = https://test.api.com

[data]
base_dir = .
logs_dir = test_data/daily_logs
vector_db_dir = test_data/vector_db
"""
    config_file = tmp_path / "test_config.ini"
    config_file.write_text(config_content)
    return str(config_file)


@pytest.fixture
def sample_log_files(tmp_path):
    """创建示例日志文件"""
    log_dir = tmp_path / "daily_logs" / "2025-01-15"
    log_dir.mkdir(parents=True)
    
    files = {
        '新闻简报.md': '# 今日新闻\n\n测试内容',
        '今日工作.md': '# 今日工作\n\n- [x] 任务1',
        '今日生活.md': '# 今日生活\n\n运动完成'
    }
    
    for filename, content in files.items():
        (log_dir / filename).write_text(content, encoding='utf-8')
    
    return log_dir


@pytest.fixture(autouse=True)
def reset_environment():
    """每个测试前重置环境变量"""
    original_env = os.environ.copy()
    yield
    os.environ.clear()
    os.environ.update(original_env)


@pytest.fixture
def mock_llm_response():
    """Mock LLM API响应"""
    return {
        'content': '这是一个测试响应',
        'tokens_used': 100,
        'model': 'glm-4'
    }


@pytest.fixture
def mock_weather_response():
    """Mock天气API响应"""
    return {
        'temperature': 22.5,
        'condition': '晴天',
        'humidity': 65,
        'wind_speed': 3.2
    }


@pytest.fixture
def mock_config_dict():
    """Mock configuration dictionary for secretary tests."""
    return {
        'llm': {
            'provider': 'glm',
            'api_key': 'test_api_key',
            'model': 'glm-4-flash',
            'max_tokens': '2000',
            'temperature': '0.7'
        },
        'data': {
            'base_dir': 'data',
            'daily_logs_dir': 'daily_logs'
        },
        'news': {
            'sources': '',
            'articles_per_summary': '5'
        },
        'weather': {
            'provider': 'qweather',
            'api_key': 'test_weather_key',
            'location': 'Shanghai'
        }
    }


@pytest.fixture
def sample_config_file():
    """Sample config file content for testing."""
    return """[llm]
provider = glm
api_key = test_api_key
model = glm-4-flash
max_tokens = 2000
temperature = 0.7

[data]
base_dir = data
daily_logs_dir = daily_logs

[news]
sources = 
articles_per_summary = 5

[weather]
provider = qweather
api_key = test_weather_key
location = Shanghai
"""
