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
| icon_url | VARCHAR(500) | - | 图标相对路径 |
| external_url | VARCHAR(500) | - | 外部跳转链接 (如 LobeChat 助手链接) |
| api_endpoint | VARCHAR(500) | - | 内部 API 端点 (可选) |
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
| cover_image | VARCHAR(500) | - | 封面图相对路径 |
| seo_title | VARCHAR(255) | - | SEO 标题 (可选) |
| seo_description | VARCHAR(500) | - | SEO 描述 |
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
| icon_url | VARCHAR(500) | - | 图标相对路径 |
| category_id | INTEGER | FOREIGN KEY | 分类ID |
| url | VARCHAR(500) | - | 访问链接 |
| seo_title | VARCHAR(255) | - | SEO 标题 |
| seo_description | VARCHAR(500) | - | SEO 描述 |
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
| media_url | VARCHAR(500) | - | 媒体相对路径 |
| demo_url | VARCHAR(500) | - | Demo链接 |
| online_count | INTEGER | DEFAULT 0 | 在线用户计数 (轮询更新) |
| category_id | INTEGER | FOREIGN KEY | 分类ID |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |
| is_active | BOOLEAN | DEFAULT TRUE | 是否激活 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 工具关联表 (tool_relations)
 *用于支持“相关工具推荐”模式*

 | 字段 | 类型 | 约束 | 说明 |
 |------|------|------|------|
 | tool_id | INTEGER | FOREIGN KEY | 主工具ID |
 | related_id | INTEGER | FOREIGN KEY | 关联工具ID |
 | PRIMARY KEY | (tool_id, related_id) | - | 复合主键 |

### Agent消息表 (agent_messages)
 *用于存储Agent间的通信日志*

 | 字段 | 类型 | 约束 | 说明 |
 |------|------|------|------|
 | id | INTEGER | PRIMARY KEY | 自增主键 |
 | sender_agent_id | INTEGER | FOREIGN KEY | 发送方Agent ID |
 | receiver_agent_id | INTEGER | FOREIGN KEY | 接收方Agent ID |
 | message_type | VARCHAR(50) | NOT NULL | 消息类型 (text/command/event/response) |
 | content | TEXT | NOT NULL | 消息内容 |
 | context_data | JSON | - | 上下文数据 (JSON格式) |
 | created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
 | correlation_id | VARCHAR(100) | - | 关联ID，用于追踪消息链 |

### Agent记忆表 (agent_memories)
 *用于存储Agent的长期记忆和状态*

 | 字段 | 类型 | 约束 | 说明 |
 |------|------|------|------|
 | id | INTEGER | PRIMARY KEY | 自增主键 |
 | agent_id | INTEGER | FOREIGN KEY | 关联Agent ID |
 | user_id | INTEGER | FOREIGN KEY | 关联用户ID |
 | memory_type | VARCHAR(50) | NOT NULL | 记忆类型 (fact/conversation/context) |
 | content | TEXT | NOT NULL | 记忆内容 |
 | importance_score | FLOAT | DEFAULT 0.5 | 重要性评分 (0.0-1.0) |
 | expires_at | DATETIME | - | 过期时间 |
 | created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
 | updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 用户身份表 (user_identities)
 *用于存储SSO和身份传播相关信息*

 | 字段 | 类型 | 约束 | 说明 |
 |------|------|------|------|
 | id | INTEGER | PRIMARY KEY | 自增主键 |
 | user_id | INTEGER | FOREIGN KEY | 关联用户ID |
 | provider | VARCHAR(50) | NOT NULL | 认证提供商 (internal/jwt/oauth) |
 | provider_user_id | VARCHAR(255) | - | 第三方平台用户ID |
 | jwt_token | TEXT | - | JWT令牌 (加密存储) |
 | refresh_token | TEXT | - | 刷新令牌 (加密存储) |
 | scopes | JSON | - | 权限范围 (JSON格式) |
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
 
 -- Agent消息索引
 CREATE INDEX idx_agent_messages_sender ON agent_messages(sender_agent_id);
 CREATE INDEX idx_agent_messages_receiver ON agent_messages(receiver_agent_id);
 CREATE INDEX idx_agent_messages_timestamp ON agent_messages(created_at);
 CREATE INDEX idx_agent_messages_correlation ON agent_messages(correlation_id);
 
 -- Agent记忆索引
 CREATE INDEX idx_agent_memories_agent ON agent_memories(agent_id);
 CREATE INDEX idx_agent_memories_user ON agent_memories(user_id);
 CREATE INDEX idx_agent_memories_type ON agent_memories(memory_type);
 CREATE INDEX idx_agent_memories_expires ON agent_memories(expires_at);
 
 -- 用户身份索引
 CREATE INDEX idx_user_identities_user ON user_identities(user_id);
 CREATE INDEX idx_user_identities_provider ON user_identities(provider);
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
 
 users (1) ────< (N) user_identities
 users (1) ────< (N) agent_memories
 agents (1) ───< (N) agent_memories
 agents (1) ───< (N) agent_messages (sender/receiver)
 
 agents (独立表，可能与其他表建立关联)
 
 categories (1) ────< (N) tools
                │      │
                │      └── (N) tools (通过 tool_relations 自关联)
                │
                └───< (N) labs
 ```

---

**版本**: v1.2 (Genesis Edition)  
**日期**: 2026-02-02  
**存储策略**: 所有媒体文件（图片、图标）均存储为相对于 `frontend/public` 的**相对路径**（例如 `/uploads/hero.png`）。
**最后更新**: 2026-02-02  
**关联计划**: [项目实施计划](../implement/implement-plan.md)
