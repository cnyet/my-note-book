# Database Design Schema

> **归属**: Work-Agents 项目  
> **技术栈**: SQLite  
> **关联文档**: [实施计划](../implement/implement-plan.md)

---

## 核心数据实体

### 用户表 (users)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| username | VARCHAR(50) | UNIQUE NOT NULL | 用户名 |
| email | VARCHAR(255) | UNIQUE NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt加密密码 |
| role | VARCHAR(20) | DEFAULT 'admin' | 角色 (admin/editor/viewer) |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### Agent表 (agents)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | NOT NULL | 名称 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL标识 |
| description | TEXT | - | 描述 |
| icon_url | VARCHAR(500) | - | 图标URL |
| api_endpoint | VARCHAR(500) | - | API端点 |
| config | JSON | - | 配置信息 (JSON格式) |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 博客文章表 (blog_posts)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| title | VARCHAR(255) | NOT NULL | 标题 |
| slug | VARCHAR(255) | UNIQUE NOT NULL | URL标识 |
| content | TEXT | NOT NULL | 内容 (Markdown) |
| excerpt | TEXT | - | 摘要 |
| cover_image | VARCHAR(500) | - | 封面图URL |
| status | VARCHAR(20) | DEFAULT 'draft' | 状态 (draft/published) |
| published_at | DATETIME | - | 发布时间 |
| created_by | INTEGER | FOREIGN KEY | 作者ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 博客标签表 (blog_tags)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| name | VARCHAR(50) | UNIQUE NOT NULL | 标签名 |
| slug | VARCHAR(50) | UNIQUE NOT NULL | URL标识 |

### 文章标签关联表 (blog_posts_tags)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| post_id | INTEGER | FOREIGN KEY | 文章ID |
| tag_id | INTEGER | FOREIGN KEY | 标签ID |
| PRIMARY KEY | (post_id, tag_id) | - | 复合主键 |

### 工具表 (tools)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | NOT NULL | 名称 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL标识 |
| description | TEXT | - | 描述 |
| icon_url | VARCHAR(500) | - | 图标URL |
| category_id | INTEGER | FOREIGN KEY | 分类ID |
| url | VARCHAR(500) | - | 访问链接 |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 分类表 (categories)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | NOT NULL | 名称 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL标识 |
| type | VARCHAR(20) | NOT NULL | 类型 (tools/labs) |
| parent_id | INTEGER | FOREIGN KEY | 父分类ID |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |

### 实验室产品表 (labs)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | NOT NULL | 名称 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL标识 |
| description | TEXT | - | 描述 |
| status | VARCHAR(20) | DEFAULT 'experimental' | 状态 |
| media_url | VARCHAR(500) | - | 媒体URL |
| demo_url | VARCHAR(500) | - | Demo链接 |
| category_id | INTEGER | FOREIGN KEY | 分类ID |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

---

## 索引策略

```sql
-- 用户认证索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 博客全文搜索索引 (SQLite FTS5)
CREATE VIRTUAL TABLE blog_posts_fts USING fts5(title, content, excerpt);

-- 分类查询优化
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_labs_category ON labs(category_id);

-- 状态筛选索引
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at);

-- 排序优化
CREATE INDEX idx_sort_order ON agents(sort_order);
CREATE INDEX idx_tools_sort ON tools(sort_order);
CREATE INDEX idx_labs_sort ON labs(sort_order);
```

---

## 缓存策略

> **注意**: 本项目使用SQLite单文件数据库，暂不使用Redis缓存。

| 数据类型 | 缓存策略 | 说明 |
|----------|----------|------|
| 博客列表 | 内存缓存 | 应用级缓存，TTL: 5分钟 |
| Agents列表 | 内存缓存 | 应用级缓存，TTL: 10分钟 |
| Tools列表 | 内存缓存 | 应用级缓存，TTL: 10分钟 |
| Labs列表 | 内存缓存 | 应用级缓存，TTL: 10分钟 |
| 用户Session | JWT Token | 无服务器端缓存 |

---

## 关联关系图

```
users (1) ────< (N) blog_posts
                │
                N ──── (N) blog_tags (通过 blog_posts_tags)

agents (独立表，无复杂关联)

categories (1) ────< (N) tools
               │
               └───< (N) labs
```

---

**最后更新**: 2026-01-30  
**关联计划**: [MVP开发计划](../../.sisyphus/plans/work-agents-mvp.md)
