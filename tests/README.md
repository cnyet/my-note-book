# AI Life Assistant - 测试指南

## 概述

本项目使用pytest作为测试框架，目标测试覆盖率≥80%。

## 测试结构

```
tests/
├── unit/              # 单元测试
├── integration/       # 集成测试
├── fixtures/          # 测试数据和fixtures
├── conftest.py        # 全局pytest配置
└── README.md          # 本文档
```

## 运行测试

### 使用脚本（推荐）

```bash
# 运行所有测试
./scripts/test.sh

# 只运行单元测试
./scripts/test.sh unit

# 只运行集成测试
./scripts/test.sh integration

# 生成覆盖率报告
./scripts/test.sh --coverage
```

### 直接使用pytest

```bash
# 激活虚拟环境
source .venv/bin/activate

# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/unit/test_file_manager.py

# 运行特定测试函数
pytest tests/unit/test_file_manager.py::test_save_file

# 显示详细输出
pytest -v

# 生成HTML覆盖率报告
pytest --cov=. --cov-report=html
# 报告位置: htmlcov/index.html
```

## 编写测试

### 单元测试示例

```python
# tests/unit/test_example.py
import pytest

def test_basic_function():
    """测试基本功能"""
    result = my_function(input_data)
    assert result == expected_output

def test_with_fixture(test_config):
    """使用fixture的测试"""
    assert test_config['llm']['provider'] == 'glm'

def test_error_handling():
    """测试错误处理"""
    with pytest.raises(ValueError):
        invalid_function()
```

### 使用Mock

```python
def test_with_mock(mocker):
    """使用mock避免实际API调用"""
    # Mock LLM API
    mock_client = mocker.patch('utils.llm_client.LLMClient')
    mock_client.return_value.send_message.return_value = {
        'content': '测试响应'
    }
    
    # 运行测试
    result = function_that_uses_llm()
    assert '测试响应' in result
```

### 使用Fixtures

```python
def test_with_temp_dir(temp_dir):
    """使用临时目录"""
    file_path = os.path.join(temp_dir, 'test.txt')
    with open(file_path, 'w') as f:
        f.write('test content')
    
    assert os.path.exists(file_path)
```

## 可用的Fixtures

### 全局Fixtures (conftest.py)

- `temp_dir`: 临时目录，测试后自动清理
- `test_config`: 测试配置字典
- `test_date`: 固定测试日期 (2025-01-15)
- `mock_datetime`: Mock的datetime对象
- `sample_daily_logs`: 示例日志文件
- `mock_llm_response`: Mock的LLM响应
- `mock_weather_response`: Mock的天气响应

### 配置Fixtures (fixtures/config_fixtures.py)

- `valid_llm_config`: 有效的LLM配置
- `invalid_llm_config`: 无效的LLM配置
- `valid_data_config`: 有效的数据配置
- `test_config_file`: 临时配置文件

### 数据Fixtures (fixtures/data_fixtures.py)

- `sample_task_list`: 示例任务列表
- `sample_news_items`: 示例新闻条目
- `sample_markdown_content`: 示例Markdown内容
- `sample_log_files`: 示例日志文件

## 测试覆盖率

### 查看覆盖率报告

```bash
# 生成HTML报告
pytest --cov=. --cov-report=html

# 在浏览器中打开
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
```

### 覆盖率目标

- 总体覆盖率: ≥80%
- 核心模块: ≥90%
- 工具模块: ≥85%

## Mock策略

### 需要Mock的场景

1. **LLM API调用**: 避免实际API调用和费用
2. **天气API调用**: 避免网络依赖
3. **文件操作**: 使用临时目录
4. **时间相关**: 使用固定测试日期
5. **网络请求**: Mock requests库

### Mock示例

```python
# Mock LLM客户端
@pytest.fixture
def mock_llm_client(mocker):
    mock = mocker.patch('utils.llm_client_v2.create_llm_client')
    mock.return_value.send_message.return_value = {
        'content': '测试响应',
        'tokens_used': 100
    }
    return mock

# Mock文件操作
def test_file_operation(mocker, temp_dir):
    mocker.patch('os.path.exists', return_value=True)
    # 测试代码...
```

## 常见问题

### 测试失败

1. 检查是否激活了虚拟环境
2. 确认所有依赖已安装: `pip install -r requirements.txt`
3. 查看详细错误信息: `pytest -v`

### 覆盖率不足

1. 识别未覆盖的模块: `pytest --cov=. --cov-report=term-missing`
2. 为未覆盖的代码添加测试
3. 关注核心功能优先

### Mock不工作

1. 确认mock的路径正确（使用代码中实际导入的路径）
2. 检查mock是否在函数调用之前设置
3. 使用`mocker.spy()`调试mock调用

## 最佳实践

1. **测试命名**: 使用描述性名称，如`test_save_file_creates_directory`
2. **一个测试一个断言**: 每个测试专注于一个功能点
3. **使用fixtures**: 复用测试数据和设置
4. **Mock外部依赖**: 避免网络调用和文件系统依赖
5. **测试边界条件**: 测试空输入、大输入、错误输入
6. **保持测试独立**: 测试之间不应有依赖关系

## 持续集成

测试配置已准备好用于CI环境：

- 使用环境变量配置
- 返回正确的退出码
- 生成机器可读的XML报告
- 运行时间<5分钟

## 参考资源

- [Pytest文档](https://docs.pytest.org/)
- [pytest-cov文档](https://pytest-cov.readthedocs.io/)
- [pytest-mock文档](https://pytest-mock.readthedocs.io/)
