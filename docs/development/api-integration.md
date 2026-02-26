# Admin CRUD 前后端联调指南

## 快速启动

### 1. 启动后端服务

```bash
cd /Users/yet/ClaudeCode/my-note-book/backend

# 激活虚拟环境
source venv/bin/activate  # macOS/Linux
# 或 .\venv\Scripts\Activate  # Windows

# 启动服务
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

访问 http://127.0.0.1:8001/docs 查看 API 文档

### 2. 启动前端服务

```bash
cd /Users/yet/ClaudeCode/my-note-book/frontend

# 安装依赖 (首次运行)
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/admin 登录管理后台

### 3. 运行 API 集成测试

```bash
cd /Users/yet/ClaudeCode/my-note-book/backend
source venv/bin/activate

# 运行测试脚本
python tests/test_api_integration.py
```

## API 客户端使用示例

### Agents API

```typescript
import { agentsApi } from "@/lib/admin-api";

// 获取所有智能体
const response = await agentsApi.list();
if (response.success && response.data) {
  console.log("Agents:", response.data);
}

// 创建智能体
const result = await agentsApi.create({
  name: "My Agent",
  slug: "my-agent",
  description: "Test agent",
  category: "Dev",
  model: "GPT-4",
});

// 更新智能体
await agentsApi.update(1, {
  name: "Updated Agent",
  description: "New description",
});

// 删除智能体
await agentsApi.delete(1);

// 切换状态
await agentsApi.toggleStatus(1);
```

### Tools API

```typescript
import { toolsApi } from "@/lib/admin-api";

// 获取所有工具
const tools = await toolsApi.list({ category: "Dev" });

// 创建工具
await toolsApi.create({
  name: "Code Runner",
  slug: "code-runner",
  category: "Dev",
  description: "Execute code snippets",
  status: "active",
});

// 切换状态
await toolsApi.toggleStatus(1);
```

### Labs API

```typescript
import { labsApi } from "@/lib/admin-api";

// 获取所有实验室
const labs = await labsApi.list({ status: "Experimental" });

// 创建实验室
await labsApi.create({
  name: "AI Sandbox",
  slug: "ai-sandbox",
  status: "Experimental",
  description: "Test AI experiments",
});

// 更新状态
await labsApi.updateStatus(1, "Preview");

// 增加在线人数
await labsApi.incrementOnline(1);
```

### Blog API

```typescript
import { blogApi } from "@/lib/admin-api";

// 获取所有文章
const posts = await blogApi.list({ status: "published" });

// 创建文章
await blogApi.create({
  title: "My First Post",
  slug: "my-first-post",
  content: "# Hello World",
  summary: "Introduction post",
  author: "Admin",
  status: "draft",
});

// 发布文章
await blogApi.togglePublish(1);

// 删除文章
await blogApi.delete(1);
```

## 前端页面集成

### 在 React 组件中使用

```typescript
"use client";

import { useEffect, useState } from "react";
import { agentsApi, type Agent } from "@/lib/admin-api";
import { message } from "antd";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentsApi.list();
      if (response.success && response.data) {
        setAgents(response.data);
      }
    } catch (error) {
      message.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await agentsApi.delete(id);
      setAgents(agents.filter(a => a.id !== id));
      message.success("Deleted successfully");
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

## 常见问题

### 1. CORS 错误

**错误**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**解决**: 确保后端 CORS 配置包含前端地址：
```python
# backend/src/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. 401 Unauthorized

**错误**: `401 Unauthorized`

**解决**:
- 确保已登录并获取 Token
- 检查 Token 是否正确存储在 localStorage
- 验证 `getAuthToken()` 函数返回正确的 Token

### 3. 数据库表不存在

**错误**: `relation "agents" does not exist`

**解决**:
```bash
cd /Users/yet/ClaudeCode/my-note-book/backend
source venv/bin/activate

# 运行数据库迁移
alembic upgrade head
```

### 4. 字段名不匹配

后端使用 `snake_case` (如 `icon_url`)，前端使用 `camelCase` (如 `iconUrl`)

**解决**: API 客户端已处理转换，确保使用正确的接口类型

## 认证流程

1. 用户访问 `/admin/login` 输入账号密码
2. 调用 `POST /api/v1/admin/auth/login` 获取 Token
3. Token 存储到 localStorage: `admin_auth_token`
4. 后续请求自动从 localStorage 读取 Token 并添加到 Authorization header

## 数据模型对比

### Agent

| 前端字段 | 后端字段 | 类型 |
|---------|---------|------|
| iconUrl | icon_url | string |
| isActive | is_active | boolean |
| sortOrder | sort_order | number |

### Tool

| 前端字段 | 后端字段 | 类型 |
|---------|---------|------|
| iconUrl | icon_url | string |
| sortOrder | sort_order | number |

### Lab

| 前端字段 | 后端字段 | 类型 |
|---------|---------|------|
| demoUrl | demo_url | string |
| mediaUrls | media_urls | string[] |
| onlineCount | online_count | number |

## 测试清单

完成以下测试确保联调成功：

- [ ] 后端服务启动成功
- [ ] 前端服务启动成功
- [ ] API 文档可访问 (http://127.0.0.1:8001/docs)
- [ ] 管理员登录成功
- [ ] Agents 列表加载
- [ ] Agent 创建成功
- [ ] Agent 编辑成功
- [ ] Agent 删除成功
- [ ] Tools 列表加载
- [ ] Tool 创建成功
- [ ] Tool 编辑成功
- [ ] Tool 删除成功
- [ ] Labs 列表加载
- [ ] Lab 创建成功
- [ ] Lab 编辑成功
- [ ] Lab 删除成功
- [ ] Blog 列表加载
- [ ] Blog 创建成功
- [ ] Blog 编辑成功
- [ ] Blog 删除成功

## 下一步

完成联调后：

1. 验证所有 CRUD 操作正常
2. 处理边界情况和错误提示
3. 添加加载状态和骨架屏
4. 优化用户体验
5. 运行完整的 E2E 测试
