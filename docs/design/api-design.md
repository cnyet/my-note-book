# API Design Specification

> **归属**: Work-Agents 项目  
> **技术栈**: FastAPI + SQLite  
> **关联文档**: [实施计划](../implement/implement-plan.md)

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
| 422 | Unprocessable Entity | 业务逻辑验证失败 |
| 429 | Too Many Requests | 频率限制 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## API端点设计

### 公开端点 (无需认证)

```
GET    /api/v1/home              # 首页数据
GET    /api/v1/agents            # Agents列表
GET    /api/v1/agents/{slug}     # Agent详情
GET    /api/v1/tools             # Tools列表
GET    /api/v1/tools/{slug}      # Tool详情
GET    /api/v1/labs              # Labs列表
GET    /api/v1/labs/{slug}       # Lab详情
GET    /api/v1/blog              # 博客列表
GET    /api/v1/blog/{slug}       # 博客详情
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

### 管理端点 (需要Admin角色)

```
# Agents管理
GET    /api/v1/admin/agents      # Agents列表
POST   /api/v1/admin/agents      # 创建Agent
GET    /api/v1/admin/agents/{id} # Agent详情
PUT    /api/v1/admin/agents/{id} # 更新Agent
DELETE /api/v1/admin/agents/{id} # 删除Agent
PATCH  /api/v1/admin/agents/{id}/sort  # 排序

# Blog管理
GET    /api/v1/admin/blog        # 文章列表
POST   /api/v1/admin/blog        # 创建文章
GET    /api/v1/admin/blog/{id}   # 文章详情
PUT    /api/v1/admin/blog/{id}   # 更新文章
DELETE /api/v1/admin/blog/{id}   # 删除文章
PATCH  /api/v1/admin/blog/{id}/status  # 发布/下架
POST   /api/v1/admin/blog/{id}/publish # 立即发布

# Tags管理
GET    /api/v1/admin/tags        # 标签列表
POST   /api/v1/admin/tags        # 创建标签
PUT    /api/v1/admin/tags/{id}   # 更新标签
DELETE /api/v1/admin/tags/{id}   # 删除标签

# Tools管理
GET    /api/v1/admin/tools       # Tools列表
POST   /api/v1/admin/tools       # 创建Tool
GET    /api/v1/admin/tools/{id}  # Tool详情
PUT    /api/v1/admin/tools/{id}  # 更新Tool
DELETE /api/v1/admin/tools/{id}  # 删除Tool

# Labs管理
GET    /api/v1/admin/labs        # Labs列表
POST   /api/v1/admin/labs        # 创建Lab
GET    /api/v1/admin/labs/{id}   # Lab详情
PUT    /api/v1/admin/labs/{id}   # 更新Lab
DELETE /api/v1/admin/labs/{id}   # 删除Lab

# Categories管理
GET    /api/v1/admin/categories  # 分类列表
POST   /api/v1/admin/categories  # 创建分类
PUT    /api/v1/admin/categories/{id}  # 更新分类
DELETE /api/v1/admin/categories/{id}  # 删除分类
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

### OpenAPI/Swagger文档

FastAPI自动生成OpenAPI规范，访问：`/api/v1/docs`

---

**最后更新**: 2026-01-30  
**关联计划**: [MVP开发计划](../../.sisyphus/plans/work-agents-mvp.md)
