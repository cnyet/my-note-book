# 集成测试与端到端测试

本目录包含项目的集成测试和端到端测试。

## 目录结构

```
tests/
├── integration/      # 集成测试
│   ├── api/         # API 集成测试
│   ├── websocket/   # WebSocket 集成测试
│   └── auth/        # 认证流程集成测试
├── e2e/             # 端到端测试
│   ├── user-journey/    # 用户旅程测试
│   └── admin-workflow/  # 管理工作流测试
└── fixtures/        # 测试数据和 fixtures
    ├── users/       # 用户数据
    └── agents/      # Agent 数据
```

## 运行测试

```bash
# 运行所有集成测试
pytest tests/integration/ -v

# 运行端到端测试
pytest tests/e2e/ -v

# 运行特定测试文件
pytest tests/integration/api/test_agents.py -v
```

## 测试规范

1. **集成测试**：测试多个组件的协作，使用测试数据库
2. **端到端测试**：模拟真实用户场景，使用完整应用堆栈
3. **Fixtures**：可复用的测试数据，放在 `fixtures/` 目录

## 环境要求

- 测试数据库自动创建和销毁
- 使用 `conftest.py` 配置共享 fixtures
- 测试之间相互独立，可并行运行
