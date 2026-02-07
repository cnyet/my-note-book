# API Design Specification

> **归属**: Work-Agents 项目
> **技术栈**: FastAPI + SQLite
> **关联文档**: [项目路线图](../planning/roadmap-03.md)

---

## RESTful API标准

### 统一请求格式

```json
{
  "method": "GET|POST|PUT|PATCH|DELETE",
  "path": "/api/v1/{resource}",
  "headers": {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  }
}
```

### 统一响应格式

```json
// 成功响应
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

### HTTP状态码规范

| 状态码 | 含义                  | 使用场景                                    |
| ------ | --------------------- | ------------------------------------------- |
| 200    | OK                    | 成功获取/更新资源                           |
| 201    | Created               | 成功创建新资源                              |
| 204    | No Content            | 成功删除资源                                |
| 400    | Bad Request           | 请求参数错误                                |
| 401    | Unauthorized          | 未认证或Token过期                           |
| 403    | Forbidden             | 无权限访问                                  |
| 404    | Not Found             | 资源不存在                                  |
| 422    | Unprocessable Entity  | 业务逻辑验证失败 (Pydantic 验证等)          |
| 429    | Too Many Requests     | **频率限制**: 登录 (10/min), 全局 (100/min) |
| 500    | Internal Server Error | 服务器内部错误                              |

---

## API端点设计

### 公开端点 (无需认证)

```
GET    /api/v1/home              # 首页数据 (聚合)
GET    /api/v1/agents            # Agents列表 (含 external_url)
GET    /api/v1/agents/{slug}     # Agent详情
GET    /api/v1/tools             # Tools列表 (分类过滤)
GET    /api/v1/tools/{slug}      # Tool详情 (含 related_tools)
GET    /api/v1/labs              # Labs列表 (含 online_count)
GET    /api/v1/labs/{slug}       # Lab详情 (用于轮询 online_count)
GET    /api/v1/blog              # 博客列表 (分页)
GET    /api/v1/blog/{slug}       # 博客详情 (含 SEO Metadata)
GET    /api/v1/blog/tags         # 博客标签
GET    /api/v1/blog/search       # 博客搜索
```

### 认证端点 (需要JWT Token)

```
POST   /api/v1/auth/register     # 用户注册
POST   /api/v1/auth/login        # 用户登录
POST   /api/v1/auth/refresh      # 刷新Token
POST   /api/v1/auth/logout       # 退出登录
GET    /api/v1/auth/me           # 获取当前用户
PUT    /api/v1/auth/me           # 更新个人信息
PUT    /api/v1/auth/password     # 修改密码
```

### 智能体编排端点 (需要认证)

#### 智能体控制 (Agent Lifecycle)

```
POST   /api/v1/orchestration/spawn/{slug}     # 启动 Agent (OnSpawn)
POST   /api/v1/orchestration/terminate/{slug} # 终止 Agent (OnTerminate)
POST   /api/v1/orchestration/idle/{slug}      # 挂起 Agent (OnIdle)
GET    /api/v1/orchestration/status           # 批量获取 Agent 生命周期状态
```

#### 消息总线 (Agent Message Bus)

```
POST   /api/v1/bus/send          # 发送异步消息 (支持 correlation_id)
GET    /api/v1/bus/messages      # 获取消息历史 (支持 correlation_id 追踪)
GET    /api/v1/bus/context/{id}  # 获取特定会话/消息的上下文数据
```

#### 记忆管理 (Agent Memory)

```
GET    /api/v1/memory/{agent_slug}   # 获取 Agent 的长期记忆
POST   /api/v1/memory/{agent_slug}   # 为 Agent 注入新记忆
DELETE /api/v1/memory/{id}           # 删除特定记忆
```

### 管理端点 (需要Admin角色)

```
# Agents管理
GET    /api/v1/admin/agents      # Agents列表
POST   /api/v1/admin/agents      # 创建Agent (含 external_url)
GET    /api/v1/admin/agents/{id} # Agent详情
PUT    /api/v1/admin/agents/{id} # 更新Agent
DELETE /api/v1/admin/agents/{id} # 删除Agent

# Blog管理
GET    /api/v1/admin/blog        # 文章列表
POST   /api/v1/admin/blog        # 创建文章 (含 seo_title, seo_description)
GET    /api/v1/admin/blog/{id}   # 文章详情
PUT    /api/v1/admin/blog/{id}   # 更新文章
DELETE /api/v1/admin/blog/{id}   # 删除文章
PATCH  /api/v1/admin/blog/{id}/status  # 发布/下架状态

# 系统审计管理
GET    /api/v1/admin/audit/logs  # 审计日志列表 (支持 entity_type, action 过滤)
GET    /api/v1/admin/audit/logs/{id} # 日志详情

# 其他管理
GET    /api/v1/admin/categories  # 分类列表

GET    /api/v1/admin/tags        # 标签列表
POST   /api/v1/admin/media/upload # 媒体上传 (返回相对路径)
```

### 智能体业务API (Agent Business APIs)

#### News Agent API (新闻智能体)

**获取今日资讯**

```http
GET /api/v1/agents/news/today
```

**响应**:

```json
{
  "success": true,
  "data": {
    "date": "2026-02-07",
    "items": [
      {
        "id": 1,
        "title": "AI新闻标题",
        "summary": "新闻摘要...",
        "source_url": "https://...",
        "source_name": "AI Base",
        "published_at": "2026-02-07T08:00:00Z"
      }
    ],
    "total": 10
  }
}
```

**手动触发资讯抓取**

```http
POST /api/v1/agents/news/trigger
```

**权限**: 需要认证
**响应**:

```json
{
  "success": true,
  "data": {
    "task_id": 123,
    "message": "资讯抓取任务已启动"
  }
}
```

**获取历史资讯**

```http
GET /api/v1/agents/news/history?date_from=2026-01-01&date_to=2026-02-07
```

#### Outfit Agent API (穿搭智能体)

**获取今日穿搭**

```http
GET /api/v1/agents/outfit/today
```

**响应**:

```json
{
  "success": true,
  "data": {
    "date": "2026-02-07",
    "weather": {
      "description": "晴朗",
      "temperature": "15-22°C"
    },
    "suggestion": "建议穿轻便外套...",
    "image_path": "/uploads/outfit/2026-02-07.png",
    "image_status": "completed"
  }
}
```

**手动触发生成**

```http
POST /api/v1/agents/outfit/trigger
```

**权限**: 需要认证
**响应**:

```json
{
  "success": true,
  "data": {
    "task_id": 124,
    "message": "穿搭生成任务已启动"
  }
}
```

#### Task Agent API (任务智能体)

**获取今日任务列表**

```http
GET /api/v1/agents/tasks/today
```

**响应**:

```json
{
  "success": true,
  "data": {
    "date": "2026-02-07",
    "tasks": [
      {
        "id": 1,
        "title": "完成代码审查",
        "description": "审查PR #123",
        "priority": "high",
        "deadline": "2026-02-07T18:00:00Z",
        "is_completed": false
      }
    ],
    "completed_count": 0,
    "total_count": 5
  }
}
```

**创建任务（通过表单）**

```http
POST /api/v1/agents/tasks/generate
```

**请求体**:

```json
{
  "answers": {
    "work_plan": "完成API设计和数据库Schema",
    "priority": "high",
    "deadline": "today"
  }
}
```

**响应**: 返回生成的任务列表

**标记任务完成**

```http
PATCH /api/v1/agents/tasks/{task_id}/complete
```

**响应**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "is_completed": true,
    "completed_at": "2026-02-07T14:30:00Z"
  }
}
```

#### Life Agent API (健康生活智能体)

**获取今日健康记录**

```http
GET /api/v1/agents/life/today
```

**响应**:

```json
{
  "success": true,
  "data": {
    "date": "2026-02-07",
    "metrics": {
      "height": 175,
      "weight": 70,
      "health_status": "良好",
      "exercise_freq": "每周3次",
      "diet_pref": "低碳水"
    },
    "suggestions": {
      "diet": "今日建议多摄入蛋白质...",
      "exercise": "建议进行30分钟有氧运动..."
    }
  }
}
```

**提交健康数据**

```http
POST /api/v1/agents/life/record
```

**请求体**:

```json
{
  "height": 175,
  "weight": 70,
  "health_status": "良好",
  "exercise_freq": "每周3次",
  "diet_pref": "低碳水"
}
```

**校验规则**:

- `height`: 150-200 cm
- `weight`: 40-120 kg

**生成健康建议**

```http
POST /api/v1/agents/life/generate-advice
```

**响应**: 生成饮食和运动建议

#### Review Agent API (复盘智能体)

**获取今日复盘**

```http
GET /api/v1/agents/review/today
```

**响应**:

```json
{
  "success": true,
  "data": {
    "date": "2026-02-07",
    "summary": "今日完成了API设计...",
    "insights": "发现可以更优化的地方...",
    "tasks_summary": {
      "total": 5,
      "completed": 3,
      "completion_rate": "60%"
    },
    "life_summary": {
      "health_status": "良好",
      "exercise_done": true
    }
  }
}
```

**生成复盘**

```http
POST /api/v1/agents/review/generate
```

**说明**: 基于当天的Task和Life数据自动生成复盘

### 用户偏好API (User Preferences)

**获取用户偏好**

```http
GET /api/v1/preferences
```

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "work_habit",
      "content": "喜欢在上午处理复杂任务",
      "extracted_from": "review_agent"
    }
  ]
}
```

**更新用户偏好**

```http
PUT /api/v1/preferences/{pref_id}
```

**请求体**:

```json
{
  "content": "更新后的偏好内容"
}
```

### LobeChat集成API

**获取对话历史**

```http
GET /api/v1/lobechat/history?session_id=xxx&date=2026-02-07
```

**保存对话消息**

```http
POST /api/v1/lobechat/messages
```

**请求体**:

```json
{
  "session_id": "session_xxx",
  "role": "user",
  "content": "今天天气怎么样？",
  "agent_calls": [{ "agent": "outfit", "result": "..." }]
}
```

**清空对话历史**

```http
DELETE /api/v1/lobechat/history?date=2026-02-07
```

**说明**: date参数为空时清空全部

### 数据导出API

**请求数据导出**

```http
POST /api/v1/export
```

**请求体**:

```json
{
  "format": "json",
  "date_from": "2026-01-24",
  "date_to": "2026-02-07",
  "agents": ["news", "outfit", "tasks", "life", "review"],
  "include_images": false
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "export_id": "exp_123",
    "download_url": "/api/v1/export/download/exp_123",
    "expires_at": "2026-02-08T00:00:00Z"
  }
}
```

**下载导出文件**

```http
GET /api/v1/export/download/{export_id}
```

### 任务队列管理API (Admin only)

**获取任务队列列表**

```http
GET /api/v1/admin/tasks-queue
```

**查询参数**:

- `status`: pending/processing/success/failed
- `type`: news_crawl/outfit_gen/review_gen/data_cleanup

**响应**:

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "task_type": "news_crawl",
      "status": "failed",
      "retry_count": 3,
      "error_message": "网络连接超时",
      "created_at": "2026-02-07T08:00:00Z"
    }
  ]
}
```

**手动重试任务**

```http
POST /api/v1/admin/tasks-queue/{task_id}/retry
```

### 定时任务管理API (Admin only)

**获取定时任务列表**

```http
GET /api/v1/admin/scheduled-jobs
```

**更新定时任务**

```http
PUT /api/v1/admin/scheduled-jobs/{job_id}
```

**请求体**:

```json
{
  "is_enabled": true,
  "cron_expression": "0 8 * * *"
}
```

**手动触发定时任务**

```http
POST /api/v1/admin/scheduled-jobs/{job_id}/trigger
```

---

## WebSocket 实时API

### 连接端点

```
ws://localhost:8001/ws/agents
```

### 消息类型

#### 客户端 → 服务端

```json
{
  "type": "subscribe",
  "channels": ["agent_status", "task_updates"]
}
```

#### 服务端 → 客户端

```json
{
  "type": "agent_status_update",
  "data": {
    "agent": "outfit",
    "status": "generating",
    "progress": 50
  }
}
```

---

## 认证与授权

### JWT Token设计

```python
# Token Payload
{
  "sub": "user_id",
  "username": "admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890,
  "type": "access"
}

# Refresh Token Payload
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 权限等级

| 角色   | 权限                           |
| ------ | ------------------------------ |
| admin  | 完整的管理员权限               |
| editor | 可编辑内容，不能删除或管理用户 |
| viewer | 只读权限                       |

### 身份传播 (Identity Propagation)

本项目支持两种身份类型在 API 中传播：

1. **User Identity**: 由前端发起的请求，`sub` 为用户 ID。
2. **System Identity**: 由智能体发起的内部请求。

所有通过消息总线（Message Bus）路由的请求必须携带 `X-Agent-Identity` 响应头以标识发起方智能体。

### OpenAPI/Swagger文档

FastAPI自动生成OpenAPI规范，访问：`/api/v1/docs`

---

**最后更新**: 2026-02-07 (Consolidated with Supplement)
**关联计划**: [项目路线图](../planning/roadmap-03.md)
