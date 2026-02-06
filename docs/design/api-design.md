# API Design Specification

> **归属**: Work-Agents 项目  
> **技术栈**: FastAPI + SQLite  
> **关联文档**: [项目路线图](../planning/roadmap.md)

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

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功获取/更新资源 |
| 201 | Created | 成功创建新资源 |
| 204 | No Content | 成功删除资源 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或Token过期 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 业务逻辑验证失败 (Pydantic 验证等) |
| 429 | Too Many Requests | **频率限制**: 登录 (10/min), 全局 (100/min) |
| 500 | Internal Server Error | 服务器内部错误 |

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

| 角色 | 权限 |
|------|------|
| admin | 完整的管理员权限 |
| editor | 可编辑内容，不能删除或管理用户 |
| viewer | 只读权限 |

### 身份传播 (Identity Propagation)

本项目支持两种身份类型在 API 中传播：
1. **User Identity**: 由前端发起的请求，`sub` 为用户 ID。
2. **System Identity**: 由智能体发起的内部请求。

所有通过消息总线（Message Bus）路由的请求必须携带 `X-Agent-Identity` 响应头以标识发起方智能体。

### OpenAPI/Swagger文档

FastAPI自动生成OpenAPI规范，访问：`/api/v1/docs`

---

**最后更新**: 2026-02-02 (Aligned with PRD v1.2)  
**关联计划**: [项目路线图](../planning/roadmap.md)
