"""
Configuration fixtures for testing
"""
import pytest


@pytest.fixture
def valid_llm_config():
    """有效的LLM配置"""
    return {
        'provider': 'glm',
        'api_key': 'sk-test1234567890abcdef',
        'model': 'glm-4',
        'base_url': 'https://open.bigmodel.cn/api/paas/v4'
    }


@pytest.fixture
def invalid_llm_config():
    """无效的LLM配置（缺少必需字段）"""
    return {
        'provider': 'glm',
        # 缺少api_key
        'model': 'glm-4'
    }


@pytest.fixture
def valid_data_config():
    """有效的数据配置"""
    return {
        'base_dir': '.',
        'logs_dir': 'data/daily_logs',
        'vector_db_dir': 'data/vector_db'
    }


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
