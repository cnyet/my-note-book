# Admin CRUD API 联调指南

## 前置条件

1. **启动后端服务**
```bash
cd /Users/yet/ClaudeCode/my-note-book/backend
source venv/bin/activate  # 或使用你的虚拟环境激活命令
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

2. **启动前端服务**
```bash
cd /Users/yet/ClaudeCode/my-note-book/frontend
npm run dev
```

3. **设置环境变量**
在 `frontend/.env.local` 中配置：
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

## API 端点清单

### Agents (智能体管理)
- `GET /api/v1/admin/agents` - 获取所有智能体
- `GET /api/v1/admin/agents/:id` - 获取智能体详情
- `POST /api/v1/admin/agents` - 创建智能体
- `PUT /api/v1/admin/agents/:id` - 更新智能体
- `DELETE /api/v1/admin/agents/:id` - 删除智能体
- `POST /api/v1/admin/agents/:id/status` - 切换状态
- `GET /api/v1/admin/agents/categories` - 获取所有类别
- `GET /api/v1/admin/agents/stats/summary` - 统计摘要

### Tools (工具管理)
- `GET /api/v1/admin/tools` - 获取所有工具
- `GET /api/v1/admin/tools/:id` - 获取工具详情
- `POST /api/v1/admin/tools` - 创建工具
- `PUT /api/v1/admin/tools/:id` - 更新工具
- `DELETE /api/v1/admin/tools/:id` - 删除工具
- `PATCH /api/v1/admin/tools/:id/status` - 切换状态
- `GET /api/v1/admin/tools/categories` - 获取所有类别
- `GET /api/v1/admin/tools/stats/summary` - 统计摘要

### Labs (实验室管理)
- `GET /api/v1/admin/labs` - 获取所有实验室
- `GET /api/v1/admin/labs/:id` - 获取实验室详情
- `POST /api/v1/admin/labs` - 创建实验室
- `PUT /api/v1/admin/labs/:id` - 更新实验室
- `DELETE /api/v1/admin/labs/:id` - 删除实验室
- `POST /api/v1/admin/labs/:id/status` - 更新状态
- `PATCH /api/v1/admin/labs/:id/online` - 增加在线人数
- `GET /api/v1/admin/labs/statuses` - 获取所有状态
- `GET /api/v1/admin/labs/stats/summary` - 统计摘要

### Blog (博客管理)
- `GET /api/v1/admin/blog` - 获取所有文章
- `GET /api/v1/admin/blog/:id` - 获取文章详情
- `POST /api/v1/admin/blog` - 创建文章
- `PUT /api/v1/admin/blog/:id` - 更新文章
- `DELETE /api/v1/admin/blog/:id` - 删除文章
- `PATCH /api/v1/admin/blog/:id/publish` - 发布/取消发布
- `GET /api/v1/admin/blog/categories` - 获取所有分类
- `GET /api/v1/admin/blog/stats/summary` - 统计摘要

### Auth (认证)
- `POST /api/v1/admin/auth/login` - 登录
- `GET /api/v1/admin/auth/verify` - 验证 Token

## 数据结构对比

### Agent - 前端 vs 后端

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `iconUrl` | `icon_url` | string | 图标 URL (命名不同) |
| `status` | `is_active` | string/bool | 前端："offline"|"spawned"|"idle"，后端：boolean |
| `config.model` | `model` | string | AI 模型 |
| `config.promptTemplate` | `system_prompt` | string | 系统提示词 |
| `config.quota` | - | number | 调用配额 (前端独有) |
| `config.websocketPriority` | - | number | WebSocket 优先级 (前端独有) |
| `connections.lobeChatUrl` | `link` | string | 链接 |
| `connections.apiEndpoint` | - | string | API 端点 (前端独有) |

### Tool - 前端 vs 后端

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `icon` | `icon_url` | string | 图标 URL (命名不同) |
| 其他字段 | 相同 | - | 基本一致 |

### Lab - 前端 vs 后端

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `demoLink` | `demo_url` | string | 演示链接 (命名不同) |
| `mediaAssets` | `media_urls` | string[] | 媒体资源 (命名不同) |
| `status` | `status` | string | 状态 (后端无 "Live" 和 "Preview"，只有 "Experimental"|"Preview"|"Archived") |

## 联调步骤

### 1. 验证后端 API 可访问性

```bash
# 测试 Agents API
curl -X GET "http://127.0.0.1:8001/api/v1/admin/agents" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试 Tools API
curl -X GET "http://127.0.0.1:8001/api/v1/admin/tools" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. 获取认证 Token

访问 `http://localhost:3000/admin` 进行登录，Token 会存储在 localStorage 中。

### 3. 前端 API 集成

前端 API 客户端已位于 `frontend/src/lib/admin-api.ts`

使用示例：
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
```

### 4. 前端页面集成

需要修改前端页面的数据层，将 mock 数据替换为 API 调用：

**Agents 页面** (`/admin/agents/page.tsx`):
- 将 `mockAgents` 替换为 `agentsApi.list()`
- 将 `handleSaveAgent` 连接到 `agentsApi.create()` 或 `agentsApi.update()`
- 将 `handleDelete` 连接到 `agentsApi.delete()`

**Tools 页面** (`/admin/tools/page.tsx`):
- 将 `mockTools` 替换为 `toolsApi.list()`
- 更新保存和删除处理

**Labs 页面** (`/admin/labs/page.tsx`):
- 将 `mockLabs` 替换为 `labsApi.list()`
- 更新保存和删除处理

**Blog 页面** (`/admin/blog/page.tsx`):
- 将 `mockBlogPosts` 替换为 `blogApi.list()`
- 更新保存和删除处理

## 注意事项

1. **认证**: 所有 API 请求需要携带 JWT Token
2. **CORS**: 确保后端配置了正确的 CORS 允许前端访问
3. **数据转换**: 前后端字段命名有差异（驼峰 vs 下划线），需要适配
4. **状态映射**: Agent 的状态需要转换 (spawned/idle/offline <-> is_active)
5. **错误处理**: 前端需要处理 API 错误并显示友好提示

## 测试清单

- [ ] Agents 列表加载
- [ ] Agent 创建
- [ ] Agent 编辑
- [ ] Agent 删除
- [ ] Agent 状态切换
- [ ] Tools 列表加载
- [ ] Tool 创建
- [ ] Tool 编辑
- [ ] Tool 删除
- [ ] Tool 状态切换
- [ ] Labs 列表加载
- [ ] Lab 创建
- [ ] Lab 编辑
- [ ] Lab 删除
- [ ] Lab 状态更新
- [ ] Blog 列表加载
- [ ] Blog 创建
- [ ] Blog 编辑
- [ ] Blog 删除
- [ ] Blog 发布/取消发布
