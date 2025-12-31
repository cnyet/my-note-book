# Design Document - Code Quality Foundation

## Overview

建立AI Life Assistant的代码质量基础设施，包括测试套件、Pydantic类型系统和日志管理。为后续大规模重构提供安全保障。

## Architecture

### 三层架构

```
测试层 (Test Layer)
├── 单元测试 (Unit Tests)
├── 集成测试 (Integration Tests)
└── 性能测试 (Performance Tests)

类型层 (Type Layer)
├── 配置模型 (Config Models)
├── API模型 (API Models)
└── 业务模型 (Business Models)

日志层 (Logging Layer)
├── 结构化日志 (Structured Logging)
├── 日志轮转 (Log Rotation)
└── 敏感信息过滤 (Sensitive Data Filtering)
```

## Components and Interfaces

### 1. 测试框架组件

**TestRunner**
- 职责：执行测试并生成报告
- 接口：`run_tests(pattern: str) -> TestResult`
- 依赖：pytest, pytest-cov

**FixtureManager**
- 职责：管理测试数据和fixtures
- 接口：`get_fixture(name: str) -> Any`
- 依赖：pytest fixtures

**MockFactory**
- 职责：创建mock对象
- 接口：`create_mock(target: str) -> Mock`
- 依赖：pytest-mock, unittest.mock

### 2. 类型系统组件

**BaseConfig (Pydantic)**
```python
from pydantic import BaseModel, Field
from typing import Optional

class LLMConfig(BaseModel):
    provider: str = Field(..., description="LLM provider")
    api_key: str = Field(..., description="API key")
    model: str = Field(default="glm-4", description="Model name")
    
class DataConfig(BaseModel):
    base_dir: str = Field(default=".", description="Base directory")
    logs_dir: str = Field(default="data/daily_logs")
```

**APIResponse (Pydantic)**
```python
class LLMResponse(BaseModel):
    content: str
    tokens_used: int
    model: str
    
class WeatherResponse(BaseModel):
    temperature: float
    condition: str
    humidity: int
```

### 3. 日志系统组件

**Logger**
- 职责：统一日志管理
- 接口：`log(level: str, message: str, **kwargs)`
- 特性：自动过滤敏感信息

**LogRotator**
- 职责：日志文件轮转
- 配置：按大小(10MB)或时间(每天)轮转

**SensitiveFilter**
- 职责：过滤敏感信息
- 模式：API密钥、密码、token等

## Data Models

### 核心Pydantic模型

```python
# utils/models/config.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List

class LLMConfig(BaseModel):
    """LLM配置模型"""
    provider: str = Field(..., description="Provider: glm or anthropic")
    api_key: str = Field(..., min_length=10)
    model: str = Field(default="glm-4")
    base_url: Optional[str] = None
    
    @validator('provider')
    def validate_provider(cls, v):
        if v not in ['glm', 'anthropic', 'claude']:
            raise ValueError('Invalid provider')
        return v

class DataConfig(BaseModel):
    """数据配置模型"""
    base_dir: str = Field(default=".")
    logs_dir: str = Field(default="data/daily_logs")
    vector_db_dir: str = Field(default="data/vector_db")

class AppConfig(BaseModel):
    """应用配置模型"""
    llm: LLMConfig
    data: DataConfig
    
# utils/models/secretary.py
class TaskSummary(BaseModel):
    """任务摘要模型"""
    tasks_completed: List[str] = Field(default_factory=list)
    tasks_pending: List[str] = Field(default_factory=list)
    highlights: List[str] = Field(default_factory=list)

class DailyData(BaseModel):
    """每日数据模型"""
    date: str
    work_summary: Optional[TaskSummary] = None
    life_summary: Optional[dict] = None
```

## Correctness Properties

*属性是跨所有有效执行应该保持为真的特征或行为，是人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: Pydantic验证拒绝无效数据
*For any* Pydantic模型和无效输入数据，模型验证应该抛出ValidationError
**Validates: Requirements 2.4**

### Property 2: 敏感信息过滤
*For any* 日志消息，如果包含敏感模式（API密钥、密码），日志系统应该自动过滤或掩码这些信息
**Validates: Requirements 3.4**

### Property 3: 测试覆盖率阈值
*For any* 测试运行，如果覆盖率低于80%，测试系统应该返回失败状态
**Validates: Requirements 1.2**

### Property 4: Mock避免实际调用
*For any* 涉及外部API的测试，不应该产生实际的网络请求
**Validates: Requirements 1.8, 5.1, 5.2, 5.4**

### Property 5: Optional类型处理None
*For any* 使用Optional类型注解的函数，传入None值应该正常处理不抛出异常
**Validates: Requirements 2.8**

### Property 6: 日志级别过滤
*For any* 配置的日志级别，只有该级别及以上的日志应该被输出
**Validates: Requirements 3.7**

## Error Handling

### 测试错误处理
- 测试失败：清晰的错误消息和堆栈跟踪
- 覆盖率不足：指出未覆盖的模块
- Mock失败：提示mock配置问题

### 类型错误处理
- ValidationError：提供详细的字段错误信息
- 类型检查失败：mypy报告错误位置和原因

### 日志错误处理
- 日志写入失败：降级到stderr
- 轮转失败：保留当前日志文件继续写入

## Testing Strategy

### 双重测试方法
- **单元测试**：验证具体示例、边缘情况、错误条件
- **属性测试**：验证通用属性跨所有输入

### 测试配置
- 最小100次迭代（属性测试）
- 每个属性测试引用设计文档属性
- 标签格式：`# Feature: code-quality-foundation, Property 1: Pydantic验证拒绝无效数据`

### 测试覆盖目标
- 核心模块：≥90%
- 工具模块：≥85%
- 总体：≥80%

### Mock策略
- LLM API：返回预定义响应
- 天气API：返回测试数据
- 文件操作：使用临时目录
- 时间：固定测试日期

### 测试库选择
- **pytest**：测试框架
- **pytest-cov**：覆盖率报告
- **pytest-mock**：Mock支持
- **hypothesis**：属性测试（可选）

## Implementation Notes

### 目录结构
```
tests/
├── unit/
│   ├── test_config.py
│   ├── test_file_manager.py
│   └── test_secretaries.py
├── integration/
│   ├── test_workflow.py
│   └── test_api.py
├── fixtures/
│   ├── config_fixtures.py
│   └── data_fixtures.py
└── conftest.py

utils/models/
├── __init__.py
├── config.py
├── secretary.py
└── api.py

utils/
├── logger.py
└── log_config.py
```

### 实现优先级
1. **Phase 1**：基础测试框架和fixtures
2. **Phase 2**：核心模块Pydantic模型
3. **Phase 3**：日志系统实现
4. **Phase 4**：提高测试覆盖率至80%

### 技术选型
- **Pydantic v2**：性能更好，验证更严格
- **structlog**：结构化日志，易于解析
- **pytest-xdist**：并行测试加速

---

**文档版本**: 1.0
**创建日期**: 2025-12-30
**最后更新**: 2025-12-30
