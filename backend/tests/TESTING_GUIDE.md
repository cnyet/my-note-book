# Testing Guide - AI Life Assistant

本指南介绍如何为AI Life Assistant项目编写和运行测试。

## 目录

- [测试框架概述](#测试框架概述)
- [运行测试](#运行测试)
- [编写单元测试](#编写单元测试)
- [使用Fixtures](#使用fixtures)
- [使用Mocks](#使用mocks)
- [集成测试](#集成测试)
- [测试覆盖率](#测试覆盖率)
- [最佳实践](#最佳实践)

---

## 测试框架概述

项目使用以下测试工具：

- **pytest**: 主测试框架
- **pytest-cov**: 代码覆盖率报告
- **pytest-mock**: Mock功能增强
- **pytest-xdist**: 并行测试执行
- **unittest.mock**: Python标准库Mock

### 测试目录结构

```
tests/
├── conftest.py              # 全局fixtures和配置
├── fixtures/                # 共享fixtures
│   ├── config_fixtures.py   # 配置相关fixtures
│   ├── data_fixtures.py     # 测试数据fixtures
│   └── secretary_fixtures.py # Secretary相关fixtures
├── unit/                    # 单元测试
│   ├── test_file_manager.py
│   ├── test_llm_client.py
│   ├── test_models.py
│   ├── test_logger.py
│   └── test_*_secretary.py
└── integration/             # 集成测试
    ├── test_workflows.py
    └── test_module_collaboration.py
```

---

## 运行测试

### 基本命令

```bash
# 激活虚拟环境
source venv/bin/activate

# 运行所有测试
python -m pytest tests/

# 运行单元测试
python -m pytest tests/unit/

# 运行集成测试
python -m pytest tests/integration/

# 运行特定测试文件
python -m pytest tests/unit/test_file_manager.py

# 运行特定测试类
python -m pytest tests/unit/test_file_manager.py::TestFileManager

# 运行特定测试方法
python -m pytest tests/unit/test_file_manager.py::TestFileManager::test_save_file
```

### 测试选项

```bash
# 详细输出
python -m pytest tests/ -v

# 简洁输出
python -m pytest tests/ -q

# 显示print输出
python -m pytest tests/ -s

# 失败时停止
python -m pytest tests/ -x

# 只运行失败的测试
python -m pytest tests/ --lf

# 并行运行（使用4个进程）
python -m pytest tests/ -n 4
```

### 覆盖率报告

```bash
# 生成覆盖率报告
python -m pytest tests/ --cov=. --cov-report=term-missing

# 生成HTML报告
python -m pytest tests/ --cov=. --cov-report=html

# 查看HTML报告
open htmlcov/index.html
```

---

## 编写单元测试

### 基本结构

```python
"""
模块测试文件的docstring
描述测试的内容和目的
"""

import pytest
from unittest.mock import Mock, patch

from module_to_test import ClassToTest


class TestClassName:
    """测试类的docstring"""

    def test_method_name(self):
        """测试方法的docstring - 描述测试什么"""
        # Arrange - 准备测试数据
        test_data = "test"
        
        # Act - 执行被测试的代码
        result = function_to_test(test_data)
        
        # Assert - 验证结果
        assert result == expected_value
```

### 测试命名规范

- 测试文件：`test_<module_name>.py`
- 测试类：`Test<ClassName>`
- 测试方法：`test_<what_is_being_tested>`

### 示例：测试FileManager

```python
import pytest
from pathlib import Path
from utils.file_manager import FileManager


class TestFileManager:
    """FileManager单元测试"""

    def test_save_file_creates_directory(self, tmp_path):
        """测试保存文件时自动创建目录"""
        # Arrange
        config = {'base_dir': str(tmp_path)}
        fm = FileManager(config)
        content = "Test content"
        
        # Act
        fm.save_daily_file('test', content)
        
        # Assert
        today_dir = fm.get_today_dir()
        assert Path(today_dir).exists()

    def test_save_file_writes_content(self, tmp_path):
        """测试文件内容正确写入"""
        # Arrange
        config = {'base_dir': str(tmp_path)}
        fm = FileManager(config)
        content = "Test content"
        
        # Act
        fm.save_daily_file('test', content, 'test.md')
        
        # Assert
        today_dir = fm.get_today_dir()
        file_path = Path(today_dir) / 'test.md'
        assert file_path.read_text() == content
```

---

## 使用Fixtures

Fixtures提供可重用的测试数据和设置。

### 内置Fixtures

```python
def test_with_tmp_path(tmp_path):
    """使用临时目录fixture"""
    # tmp_path是一个Path对象，指向临时目录
    test_file = tmp_path / "test.txt"
    test_file.write_text("content")
    assert test_file.read_text() == "content"

def test_with_tmp_path_factory(tmp_path_factory):
    """使用临时目录工厂"""
    # 可以创建多个临时目录
    dir1 = tmp_path_factory.mktemp("data1")
    dir2 = tmp_path_factory.mktemp("data2")
```

### 自定义Fixtures

在`conftest.py`中定义：

```python
import pytest

@pytest.fixture
def sample_config():
    """提供测试配置"""
    return {
        'llm': {'provider': 'glm', 'api_key': 'test_key'},
        'data': {'base_dir': './test_data'}
    }

@pytest.fixture
def mock_llm_client():
    """提供Mock的LLM客户端"""
    mock = Mock()
    mock.simple_chat.return_value = "Test response"
    return mock
```

使用自定义fixture：

```python
def test_with_custom_fixture(sample_config, mock_llm_client):
    """使用自定义fixtures"""
    # 直接使用fixture提供的对象
    assert sample_config['llm']['provider'] == 'glm'
    assert mock_llm_client.simple_chat() == "Test response"
```

### Fixture作用域

```python
@pytest.fixture(scope="function")  # 默认，每个测试函数运行一次
def function_fixture():
    return "function"

@pytest.fixture(scope="class")  # 每个测试类运行一次
def class_fixture():
    return "class"

@pytest.fixture(scope="module")  # 每个模块运行一次
def module_fixture():
    return "module"

@pytest.fixture(scope="session")  # 整个测试会话运行一次
def session_fixture():
    return "session"
```

---

## 使用Mocks

Mock用于隔离测试，避免依赖外部资源（API、数据库等）。

### 基本Mock使用

```python
from unittest.mock import Mock

def test_with_basic_mock():
    """基本Mock使用"""
    # 创建Mock对象
    mock_obj = Mock()
    
    # 设置返回值
    mock_obj.method.return_value = "mocked value"
    
    # 调用并验证
    result = mock_obj.method()
    assert result == "mocked value"
    
    # 验证调用
    mock_obj.method.assert_called_once()
```

### Mock方法返回值

```python
from unittest.mock import Mock

def test_mock_return_values():
    """Mock不同的返回值"""
    mock = Mock()
    
    # 固定返回值
    mock.method.return_value = "fixed"
    
    # 抛出异常
    mock.error_method.side_effect = Exception("Error")
    
    # 多次调用返回不同值
    mock.sequence.side_effect = [1, 2, 3]
    
    assert mock.method() == "fixed"
    with pytest.raises(Exception):
        mock.error_method()
    assert mock.sequence() == 1
    assert mock.sequence() == 2
```

### Patch装饰器

```python
from unittest.mock import patch

@patch('module.ClassName')
def test_with_patch(mock_class):
    """使用patch装饰器"""
    # mock_class替换了module.ClassName
    mock_instance = Mock()
    mock_class.return_value = mock_instance
    
    # 测试代码...
    mock_class.assert_called_once()
```

### Mock LLM客户端示例

```python
from unittest.mock import Mock, patch
from agents.news_secretary import NewsSecretary

@patch('agents.news_secretary.create_llm_client')
def test_news_secretary_with_mock_llm(mock_create_llm, tmp_path):
    """测试NewsSecretary使用Mock LLM"""
    # Setup mock LLM
    mock_llm = Mock()
    mock_llm.simple_chat.return_value = "Mocked news summary"
    mock_create_llm.return_value = mock_llm
    
    # Create secretary
    config = {
        'llm': {'provider': 'glm', 'api_key': 'test'},
        'data': {'base_dir': str(tmp_path)},
        'news': {}
    }
    secretary = NewsSecretary(config_dict=config)
    
    # Mock news collection
    with patch.object(secretary, 'collect_news', return_value="Raw news"):
        result = secretary.generate_news_summary("Raw news")
    
    # Verify
    assert result == "Mocked news summary"
    mock_llm.simple_chat.assert_called_once()
```

### Mock文件操作

```python
from unittest.mock import mock_open, patch

def test_read_file_with_mock():
    """Mock文件读取"""
    mock_data = "file content"
    
    with patch('builtins.open', mock_open(read_data=mock_data)):
        with open('test.txt', 'r') as f:
            content = f.read()
    
    assert content == mock_data
```

---

## 集成测试

集成测试验证多个模块协同工作。

### 工作流测试示例

```python
from unittest.mock import Mock, patch
from main import LifeAssistant

@patch('main.NewsSecretary')
@patch('main.WorkSecretary')
@patch('utils.file_manager.FileManager')
def test_morning_routine(mock_fm, mock_work, mock_news, tmp_path):
    """测试早晨例程工作流"""
    # Setup mocks
    mock_fm_instance = Mock()
    mock_fm_instance.get_today_dir.return_value = str(tmp_path)
    mock_fm.return_value = mock_fm_instance
    
    mock_news_instance = Mock()
    mock_news_instance.run.return_value = "News"
    mock_news.return_value = mock_news_instance
    
    mock_work_instance = Mock()
    mock_work_instance.run.return_value = "Work"
    mock_work.return_value = mock_work_instance
    
    # Run workflow
    with patch('main.configparser.ConfigParser.read'):
        assistant = LifeAssistant()
        assistant.run_morning_routine()
    
    # Verify all secretaries were called
    mock_news_instance.run.assert_called_once()
    mock_work_instance.run.assert_called_once()
```

### 模块协作测试

```python
@patch('agents.news_secretary.create_llm_client')
def test_secretary_file_manager_integration(mock_llm, tmp_path):
    """测试Secretary与FileManager集成"""
    # Setup
    mock_llm_client = Mock()
    mock_llm_client.simple_chat.return_value = "Summary"
    mock_llm.return_value = mock_llm_client
    
    config = {
        'llm': {'provider': 'glm', 'api_key': 'test'},
        'data': {'base_dir': str(tmp_path)},
        'news': {}
    }
    
    # Create secretary
    secretary = NewsSecretary(config_dict=config)
    
    # Mock news collection and run
    with patch.object(secretary, 'collect_news', return_value="News"):
        secretary.run(save_to_file=True)
    
    # Verify file was saved
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")
    expected_file = tmp_path / "data" / "daily_logs" / today / "新闻简报.md"
    assert expected_file.exists()
```

---

## 测试覆盖率

### 查看覆盖率

```bash
# 终端输出
python -m pytest tests/ --cov=. --cov-report=term-missing

# HTML报告（推荐）
python -m pytest tests/ --cov=. --cov-report=html
open htmlcov/index.html
```

### 覆盖率目标

- **项目目标**: ≥80%
- **核心模块**: ≥85%
- **工具类**: ≥75%

### 提高覆盖率

1. **识别未覆盖代码**：查看HTML报告中的红色行
2. **编写针对性测试**：为未覆盖的分支和异常处理添加测试
3. **测试边缘情况**：空输入、错误输入、边界值
4. **测试错误处理**：异常情况、失败场景

---

## 最佳实践

### 1. 测试独立性

```python
# ✅ 好 - 每个测试独立
def test_feature_a():
    result = function_a()
    assert result == expected_a

def test_feature_b():
    result = function_b()
    assert result == expected_b

# ❌ 差 - 测试相互依赖
def test_setup():
    global shared_data
    shared_data = setup()

def test_using_shared():
    assert shared_data.value == 10
```

### 2. 清晰的测试名称

```python
# ✅ 好 - 描述性强
def test_save_file_creates_directory_if_not_exists():
    pass

def test_llm_client_retries_on_network_error():
    pass

# ❌ 差 - 不清楚测试什么
def test_1():
    pass

def test_function():
    pass
```

### 3. AAA模式（Arrange-Act-Assert）

```python
def test_with_aaa_pattern():
    # Arrange - 准备测试数据和环境
    config = {'key': 'value'}
    obj = MyClass(config)
    
    # Act - 执行被测试的操作
    result = obj.method()
    
    # Assert - 验证结果
    assert result == expected_value
```

### 4. 一个测试一个断言（推荐）

```python
# ✅ 好 - 每个测试验证一个行为
def test_returns_correct_value():
    assert function() == expected

def test_raises_error_on_invalid_input():
    with pytest.raises(ValueError):
        function(invalid_input)

# ⚠️ 可接受 - 相关断言可以组合
def test_object_initialization():
    obj = MyClass()
    assert obj.name == "default"
    assert obj.value == 0
    assert obj.active is True
```

### 5. 使用参数化测试

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
])
def test_uppercase(input, expected):
    """参数化测试多个输入"""
    assert input.upper() == expected
```

### 6. 测试异常

```python
def test_raises_exception():
    """测试异常抛出"""
    with pytest.raises(ValueError) as exc_info:
        function_that_raises()
    
    assert "error message" in str(exc_info.value)
```

### 7. 避免过度Mock

```python
# ✅ 好 - 只Mock外部依赖
@patch('module.external_api_call')
def test_with_minimal_mock(mock_api):
    mock_api.return_value = "data"
    result = my_function()
    assert result == processed_data

# ❌ 差 - Mock太多内部逻辑
@patch('module.internal_function_a')
@patch('module.internal_function_b')
@patch('module.internal_function_c')
def test_with_too_many_mocks(mock_c, mock_b, mock_a):
    # 测试变得脆弱且难以维护
    pass
```

### 8. 使用临时目录

```python
def test_file_operations(tmp_path):
    """使用tmp_path避免污染文件系统"""
    test_file = tmp_path / "test.txt"
    test_file.write_text("content")
    
    # 测试结束后自动清理
    assert test_file.exists()
```

---

## 常见问题

### Q: 如何跳过某个测试？

```python
@pytest.mark.skip(reason="暂时跳过")
def test_to_skip():
    pass

@pytest.mark.skipif(sys.version_info < (3, 8), reason="需要Python 3.8+")
def test_conditional_skip():
    pass
```

### Q: 如何标记慢速测试？

```python
@pytest.mark.slow
def test_slow_operation():
    pass

# 运行时排除慢速测试
# pytest tests/ -m "not slow"
```

### Q: 如何测试异步代码？

```python
import pytest

@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result == expected
```

### Q: Mock不生效怎么办？

确保patch路径正确：
```python
# ❌ 错误 - patch定义位置
@patch('original_module.function')

# ✅ 正确 - patch使用位置
@patch('module_being_tested.function')
```

---

## 参考资源

- [pytest官方文档](https://docs.pytest.org/)
- [unittest.mock文档](https://docs.python.org/3/library/unittest.mock.html)
- [pytest-cov文档](https://pytest-cov.readthedocs.io/)
- [项目测试示例](./unit/)

---

**最后更新**: 2025-12-30
