# Database Design Schema

> **归属**: My-Note-Book 项目
> **技术栈**: SQLite
> **关联文档**: [项目路线图](../planning/roadmap-03.md)

---

## 1. 核心实体 (Core Entities)

### 1.1 用户表 (users)

| 字段          | 类型         | 约束                      | 说明                       |
| ------------- | ------------ | ------------------------- | -------------------------- |
| id            | INTEGER      | PRIMARY KEY               | 自增主键                   |
| username      | VARCHAR(50)  | UNIQUE NOT NULL           | 用户名                     |
| email         | VARCHAR(255) | UNIQUE NOT NULL           | 邮箱                       |
| password_hash | VARCHAR(255) | NOT NULL                  | bcrypt加密密码             |
| role          | VARCHAR(20)  | DEFAULT 'admin'           | 角色 (admin/editor/viewer) |
| is_active     | BOOLEAN      | DEFAULT TRUE              | 是否激活                   |
| created_at    | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                   |
| updated_at    | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                   |

### 1.2 用户身份表 (user_identities)

_用于存储SSO和身份传播相关信息_

| 字段             | 类型         | 约束                      | 说明                            |
| ---------------- | ------------ | ------------------------- | ------------------------------- |
| id               | INTEGER      | PRIMARY KEY               | 自增主键                        |
| user_id          | INTEGER      | FOREIGN KEY               | 关联用户ID                      |
| provider         | VARCHAR(50)  | NOT NULL                  | 认证提供商 (internal/jwt/oauth) |
| provider_user_id | VARCHAR(255) | -                         | 第三方平台用户ID                |
| jwt_token        | TEXT         | -                         | JWT令牌 (加密存储)              |
| refresh_token    | TEXT         | -                         | 刷新令牌 (加密存储)             |
| scopes           | JSON         | -                         | 权限范围 (JSON格式)             |
| created_at       | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                        |
| updated_at       | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                        |

### 1.3 用户偏好表 (user_preferences)

| 字段           | 类型        | 约束                      | 说明                                         |
| -------------- | ----------- | ------------------------- | -------------------------------------------- |
| id             | INTEGER     | PRIMARY KEY               | 自增主键                                     |
| user_id        | INTEGER     | FOREIGN KEY               | 用户ID                                       |
| pref_type      | VARCHAR(50) | NOT NULL                  | 偏好类型 (work_habit/learning/diet/exercise) |
| content        | TEXT        | NOT NULL                  | 偏好内容                                     |
| extracted_from | VARCHAR(50) | -                         | 来源 (review_agent/manual)                   |
| created_at     | DATETIME    | DEFAULT CURRENT_TIMESTAMP | 创建时间                                     |
| updated_at     | DATETIME    | DEFAULT CURRENT_TIMESTAMP | 更新时间                                     |

### 1.4 Agent表 (agents)

| 字段         | 类型         | 约束                      | 说明                                           |
| ------------ | ------------ | ------------------------- | ---------------------------------------------- |
| id           | INTEGER      | PRIMARY KEY               | 自增主键                                       |
| name         | VARCHAR(100) | NOT NULL                  | 名称                                           |
| slug         | VARCHAR(100) | UNIQUE NOT NULL           | URL标识                                        |
| description  | TEXT         | -                         | 描述                                           |
| icon_url     | VARCHAR(500) | -                         | 图标相对路径                                   |
| external_url | VARCHAR(500) | -                         | 外部跳转链接 (如 LobeChat 助手链接)            |
| api_endpoint | VARCHAR(500) | -                         | 内部 API 端点 (可选)                           |
| config       | JSON         | -                         | 配置信息 (JSON格式)                            |
| status       | VARCHAR(20)  | DEFAULT 'offline'         | 生命周期状态 (offline/spawned/idle/terminated) |
| sort_order   | INTEGER      | DEFAULT 0                 | 排序权重                                       |
| is_active    | BOOLEAN      | DEFAULT TRUE              | 是否激活                                       |
| version      | INTEGER      | DEFAULT 1                 | 乐观锁版本号                                   |
| created_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                                       |
| updated_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                                       |

---

## 2. 智能体业务数据 (Agent Business Data)

### 2.1 News Agent - 资讯记录表 (agent_news)

| 字段         | 类型         | 约束                      | 说明                  |
| ------------ | ------------ | ------------------------- | --------------------- |
| id           | INTEGER      | PRIMARY KEY               | 自增主键              |
| date         | DATE         | NOT NULL                  | 记录日期 (YYYY-MM-DD) |
| title        | VARCHAR(255) | NOT NULL                  | 资讯标题              |
| summary      | TEXT         | -                         | 摘要内容              |
| source_url   | VARCHAR(500) | -                         | 原文链接              |
| source_name  | VARCHAR(100) | -                         | 来源名称              |
| published_at | DATETIME     | -                         | 发布时间              |
| created_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 抓取时间              |

### 2.2 Outfit Agent - 穿搭记录表 (agent_outfit)

| 字段            | 类型         | 约束                      | 说明                                               |
| --------------- | ------------ | ------------------------- | -------------------------------------------------- |
| id              | INTEGER      | PRIMARY KEY               | 自增主键                                           |
| date            | DATE         | NOT NULL                  | 记录日期                                           |
| weather_desc    | VARCHAR(255) | -                         | 天气描述                                           |
| temperature     | VARCHAR(50)  | -                         | 温度范围                                           |
| suggestion_text | TEXT         | -                         | 穿搭建议文字                                       |
| image_path      | VARCHAR(500) | -                         | 生成图片路径 (如 `/uploads/outfit/2025-02-06.png`) |
| image_status    | VARCHAR(20)  | DEFAULT 'pending'         | 图片状态 (pending/generating/completed/failed)     |
| created_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                                           |
| updated_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                                           |

### 2.3 Task Agent - 任务记录表 (agent_tasks)

| 字段         | 类型         | 约束                      | 说明                     |
| ------------ | ------------ | ------------------------- | ------------------------ |
| id           | INTEGER      | PRIMARY KEY               | 自增主键                 |
| date         | DATE         | NOT NULL                  | 记录日期                 |
| title        | VARCHAR(255) | NOT NULL                  | 任务标题                 |
| description  | TEXT         | -                         | 任务描述                 |
| priority     | VARCHAR(20)  | DEFAULT 'medium'          | 优先级 (high/medium/low) |
| deadline     | DATETIME     | -                         | 截止时间                 |
| is_completed | BOOLEAN      | DEFAULT FALSE             | 是否完成                 |
| completed_at | DATETIME     | -                         | 完成时间                 |
| created_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                 |

### 2.4 Life Agent - 健康记录表 (agent_life)

| 字段                | 类型         | 约束                      | 说明         |
| ------------------- | ------------ | ------------------------- | ------------ |
| id                  | INTEGER      | PRIMARY KEY               | 自增主键     |
| date                | DATE         | NOT NULL                  | 记录日期     |
| height              | INTEGER      | CHECK(150-200)            | 身高(cm)     |
| weight              | INTEGER      | CHECK(40-120)             | 体重(kg)     |
| health_status       | VARCHAR(255) | -                         | 健康状况描述 |
| exercise_freq       | VARCHAR(50)  | -                         | 运动频率     |
| diet_pref           | VARCHAR(255) | -                         | 饮食偏好     |
| diet_suggestion     | TEXT         | -                         | 饮食建议     |
| exercise_suggestion | TEXT         | -                         | 运动建议     |
| created_at          | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_at          | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间     |

### 2.5 Review Agent - 复盘记录表 (agent_reviews)

| 字段          | 类型     | 约束                      | 说明             |
| ------------- | -------- | ------------------------- | ---------------- |
| id            | INTEGER  | PRIMARY KEY               | 自增主键         |
| date          | DATE     | NOT NULL                  | 记录日期         |
| summary       | TEXT     | -                         | 今日工作总结     |
| insights      | TEXT     | -                         | 反思与洞察       |
| tasks_summary | JSON     | -                         | 任务完成情况统计 |
| life_summary  | JSON     | -                         | 健康数据摘要     |
| created_at    | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间         |

---

## 3. 智能体系统数据 (Agent System Data)

### 3.1 Agent消息表 (agent_messages)

_用于存储Agent间的通信日志_

| 字段              | 类型         | 约束                      | 说明                                   |
| ----------------- | ------------ | ------------------------- | -------------------------------------- |
| id                | INTEGER      | PRIMARY KEY               | 自增主键                               |
| sender_agent_id   | INTEGER      | FOREIGN KEY               | 发送方Agent ID                         |
| receiver_agent_id | INTEGER      | FOREIGN KEY               | 接收方Agent ID                         |
| message_type      | VARCHAR(50)  | NOT NULL                  | 消息类型 (text/command/event/response) |
| content           | TEXT         | NOT NULL                  | 消息内容                               |
| context_data      | JSON         | -                         | 上下文数据 (JSON格式)                  |
| created_at        | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                               |
| correlation_id    | VARCHAR(100) | -                         | 关联ID，用于追踪消息链                 |

### 3.2 Agent记忆表 (agent_memories)

_用于存储Agent的长期记忆和状态_

| 字段             | 类型        | 约束                      | 说明                                 |
| ---------------- | ----------- | ------------------------- | ------------------------------------ |
| id               | INTEGER     | PRIMARY KEY               | 自增主键                             |
| agent_id         | INTEGER     | FOREIGN KEY               | 关联Agent ID                         |
| user_id          | INTEGER     | FOREIGN KEY               | 关联用户ID                           |
| memory_type      | VARCHAR(50) | NOT NULL                  | 记忆类型 (fact/conversation/context) |
| content          | TEXT        | NOT NULL                  | 记忆内容                             |
| importance_score | FLOAT       | DEFAULT 0.5               | 重要性评分 (0.0-1.0)                 |
| version          | INTEGER     | DEFAULT 1                 | 乐观锁版本号                         |
| expires_at       | DATETIME    | -                         | 过期时间                             |
| created_at       | DATETIME    | DEFAULT CURRENT_TIMESTAMP | 创建时间                             |
| updated_at       | DATETIME    | DEFAULT CURRENT_TIMESTAMP | 更新时间                             |

### 3.3 LobeChat对话历史表 (lobechat_history)

| 字段              | 类型         | 约束                      | 说明                  |
| ----------------- | ------------ | ------------------------- | --------------------- |
| id                | INTEGER      | PRIMARY KEY               | 自增主键              |
| session_id        | VARCHAR(100) | NOT NULL                  | 会话ID                |
| role              | VARCHAR(20)  | NOT NULL                  | 角色 (user/assistant) |
| content           | TEXT         | NOT NULL                  | 对话内容              |
| agent_calls       | JSON         | -                         | 调用的智能体及结果    |
| is_saved_to_agent | BOOLEAN      | DEFAULT FALSE             | 是否已保存到智能体    |
| created_at        | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间              |

---

## 4. 内容与资源 (Content & Resources)

### 4.1 博客文章表 (blog_posts)

| 字段            | 类型         | 约束                      | 说明                   |
| --------------- | ------------ | ------------------------- | ---------------------- |
| id              | INTEGER      | PRIMARY KEY               | 自增主键               |
| title           | VARCHAR(255) | NOT NULL                  | 标题                   |
| slug            | VARCHAR(255) | UNIQUE NOT NULL           | URL标识                |
| content         | TEXT         | NOT NULL                  | 内容 (Markdown)        |
| excerpt         | TEXT         | -                         | 摘要                   |
| cover_image     | VARCHAR(500) | -                         | 封面图相对路径         |
| seo_title       | VARCHAR(255) | -                         | SEO 标题 (可选)        |
| seo_description | VARCHAR(500) | -                         | SEO 描述               |
| status          | VARCHAR(20)  | DEFAULT 'draft'           | 状态 (draft/published) |
| published_at    | DATETIME     | -                         | 发布时间               |
| created_by      | INTEGER      | FOREIGN KEY               | 作者ID                 |
| created_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间               |
| updated_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间               |

### 4.2 博客标签表 (blog_tags) & 关联表 (blog_posts_tags)

_`blog_tags`_: `id`, `name`, `slug`
_`blog_posts_tags`_: `post_id`, `tag_id` (Composite PK)

### 4.3 工具表 (tools)

| 字段            | 类型         | 约束                      | 说明         |
| --------------- | ------------ | ------------------------- | ------------ |
| id              | INTEGER      | PRIMARY KEY               | 自增主键     |
| name            | VARCHAR(100) | NOT NULL                  | 名称         |
| slug            | VARCHAR(100) | UNIQUE NOT NULL           | URL标识      |
| description     | TEXT         | -                         | 描述         |
| icon_url        | VARCHAR(500) | -                         | 图标相对路径 |
| category_id     | INTEGER      | FOREIGN KEY               | 分类ID       |
| url             | VARCHAR(500) | -                         | 访问链接     |
| seo_title       | VARCHAR(255) | -                         | SEO 标题     |
| seo_description | VARCHAR(500) | -                         | SEO 描述     |
| sort_order      | INTEGER      | DEFAULT 0                 | 排序权重     |
| is_active       | BOOLEAN      | DEFAULT TRUE              | 是否激活     |
| created_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间     |

### 4.4 实验室产品表 (labs)

| 字段         | 类型         | 约束                      | 说明                    |
| ------------ | ------------ | ------------------------- | ----------------------- |
| id           | INTEGER      | PRIMARY KEY               | 自增主键                |
| name         | VARCHAR(100) | NOT NULL                  | 名称                    |
| slug         | VARCHAR(100) | UNIQUE NOT NULL           | URL标识                 |
| description  | TEXT         | -                         | 描述                    |
| status       | VARCHAR(20)  | DEFAULT 'experimental'    | 状态                    |
| media_url    | VARCHAR(500) | -                         | 媒体相对路径            |
| demo_url     | VARCHAR(500) | -                         | Demo链接                |
| online_count | INTEGER      | DEFAULT 0                 | 在线用户计数 (轮询更新) |
| category_id  | INTEGER      | FOREIGN KEY               | 分类ID                  |
| sort_order   | INTEGER      | DEFAULT 0                 | 排序权重                |
| is_active    | BOOLEAN      | DEFAULT TRUE              | 是否激活                |
| created_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                |
| updated_at   | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                |

### 4.5 分类表 (categories) & 工具关联表 (tool_relations)

_`categories`_: `id`, `name`, `slug`, `type`, `parent_id`, `sort_order`
_`tool_relations`_: `tool_id`, `related_id` (Composite PK)

---

## 5. 系统基础设施 (System Infrastructure)

### 5.1 审计日志表 (audit_logs)

_用于系统级操作审计和Agent行为追踪_

| 字段          | 类型         | 约束                      | 说明                                    |
| ------------- | ------------ | ------------------------- | --------------------------------------- |
| id            | INTEGER      | PRIMARY KEY               | 自增主键                                |
| entity_type   | VARCHAR(50)  | NOT NULL                  | 实体类型 (user/agent/system)            |
| entity_id     | VARCHAR(100) | -                         | 实体ID                                  |
| action        | VARCHAR(100) | NOT NULL                  | 执行操作 (login/spawn/terminate/update) |
| payload       | JSON         | -                         | 操作载荷                                |
| ip_address    | VARCHAR(45)  | -                         | IP地址                                  |
| identity_type | VARCHAR(20)  | -                         | 身份类型 (user/system)                  |
| created_at    | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                                |

### 5.2 后台任务队列表 (tasks_queue)

| 字段          | 类型        | 约束                      | 说明                                                     |
| ------------- | ----------- | ------------------------- | -------------------------------------------------------- |
| id            | INTEGER     | PRIMARY KEY               | 自增主键                                                 |
| task_type     | VARCHAR(50) | NOT NULL                  | 任务类型 (news_crawl/outfit_gen/review_gen/data_cleanup) |
| status        | VARCHAR(20) | DEFAULT 'pending'         | 状态 (pending/processing/success/failed)                 |
| payload       | JSON        | -                         | 任务参数                                                 |
| result        | JSON        | -                         | 执行结果                                                 |
| retry_count   | INTEGER     | DEFAULT 0                 | 重试次数                                                 |
| max_retries   | INTEGER     | DEFAULT 3                 | 最大重试次数                                             |
| error_message | TEXT        | -                         | 错误信息                                                 |
| scheduled_at  | DATETIME    | -                         | 计划执行时间                                             |
| started_at    | DATETIME    | -                         | 开始时间                                                 |
| completed_at  | DATETIME    | -                         | 完成时间                                                 |
| created_at    | DATETIME    | DEFAULT CURRENT_TIMESTAMP | 创建时间                                                 |

### 5.3 定时任务记录表 (scheduled_jobs)

| 字段            | 类型         | 约束                      | 说明                              |
| --------------- | ------------ | ------------------------- | --------------------------------- |
| id              | INTEGER      | PRIMARY KEY               | 自增主键                          |
| job_name        | VARCHAR(100) | NOT NULL                  | 任务名称                          |
| job_type        | VARCHAR(50)  | NOT NULL                  | 类型 (news/outfit/review/cleanup) |
| cron_expression | VARCHAR(100) | -                         | Cron表达式                        |
| is_enabled      | BOOLEAN      | DEFAULT TRUE              | 是否启用                          |
| last_run_at     | DATETIME     | -                         | 上次执行时间                      |
| last_run_status | VARCHAR(20)  | -                         | 上次执行状态                      |
| last_run_result | TEXT         | -                         | 上次执行结果                      |
| next_run_at     | DATETIME     | -                         | 下次执行时间                      |
| created_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 创建时间                          |
| updated_at      | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 更新时间                          |

---

## 6. 索引策略 (Index Strategy)

```sql
-- Core
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_identities_user ON user_identities(user_id);
CREATE INDEX idx_user_identities_provider ON user_identities(provider);
CREATE INDEX idx_user_prefs_user ON user_preferences(user_id);
CREATE INDEX idx_user_prefs_type ON user_preferences(pref_type);

-- Agent Business
CREATE INDEX idx_agent_news_date ON agent_news(date);
CREATE INDEX idx_agent_news_created ON agent_news(created_at);
CREATE INDEX idx_agent_outfit_date ON agent_outfit(date);
CREATE INDEX idx_agent_tasks_date ON agent_tasks(date);
CREATE INDEX idx_agent_tasks_completed ON agent_tasks(is_completed);
CREATE INDEX idx_agent_life_date ON agent_life(date);
CREATE INDEX idx_agent_reviews_date ON agent_reviews(date);

-- Agent System
CREATE INDEX idx_agent_messages_sender ON agent_messages(sender_agent_id);
CREATE INDEX idx_agent_messages_receiver ON agent_messages(receiver_agent_id);
CREATE INDEX idx_agent_messages_timestamp ON agent_messages(created_at);
CREATE INDEX idx_agent_messages_correlation ON agent_messages(correlation_id);
CREATE INDEX idx_agent_memories_agent ON agent_memories(agent_id);
CREATE INDEX idx_agent_memories_user ON agent_memories(user_id);
CREATE INDEX idx_agent_memories_type ON agent_memories(memory_type);
CREATE INDEX idx_agent_memories_expires ON agent_memories(expires_at);
CREATE INDEX idx_lobechat_session ON lobechat_history(session_id);
CREATE INDEX idx_lobechat_created ON lobechat_history(created_at);

-- Content
CREATE VIRTUAL TABLE blog_posts_fts USING fts5(title, content, excerpt);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_labs_category ON labs(category_id);
CREATE INDEX idx_sort_order ON agents(sort_order);
CREATE INDEX idx_tools_sort ON tools(sort_order);
CREATE INDEX idx_labs_sort ON labs(sort_order);

-- Infrastructure
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at);
CREATE INDEX idx_tasks_queue_status ON tasks_queue(status);
CREATE INDEX idx_tasks_queue_type ON tasks_queue(task_type);
CREATE INDEX idx_tasks_queue_scheduled ON tasks_queue(scheduled_at);
CREATE INDEX idx_scheduled_jobs_name ON scheduled_jobs(job_name);
CREATE INDEX idx_scheduled_jobs_enabled ON scheduled_jobs(is_enabled);
```

---

## 7. 数据保留与缓存 (Retention & Caching)

### 自动清理逻辑

```sql
-- 清理智能体数据 (保留15天)
DELETE FROM agent_news WHERE created_at < datetime('now', '-15 days');
DELETE FROM agent_outfit WHERE created_at < datetime('now', '-15 days');
DELETE FROM agent_tasks WHERE date < date('now', '-15 days');
DELETE FROM agent_life WHERE date < date('now', '-15 days');
DELETE FROM agent_reviews WHERE date < date('now', '-15 days');
DELETE FROM lobechat_history WHERE created_at < datetime('now', '-15 days');

-- 清理任务队列历史 (保留30天)
DELETE FROM tasks_queue WHERE completed_at < datetime('now', '-30 days');
```

### 缓存策略

> **注意**: 本项目使用SQLite单文件数据库，暂不使用Redis缓存。

| 数据类型    | 缓存策略  | 说明                    |
| ----------- | --------- | ----------------------- |
| 博客列表    | 内存缓存  | 应用级缓存，TTL: 5分钟  |
| Agents列表  | 内存缓存  | 应用级缓存，TTL: 10分钟 |
| Tools列表   | 内存缓存  | 应用级缓存，TTL: 10分钟 |
| Labs列表    | 内存缓存  | 应用级缓存，TTL: 10分钟 |
| 用户Session | JWT Token | 无服务器端缓存          |

---

## 8. 实体关系图 (ERD)

```
users (1) ────< (N) user_preferences
users (1) ────< (N) user_identities
users (1) ────< (N) blog_posts
users (1) ────< (N) agent_memories
users (1) ────< (N) audit_logs

users (1) ────< (N) agent_news (按日期)
users (1) ────< (N) agent_outfit (按日期)
users (1) ────< (N) agent_tasks (按日期)
users (1) ────< (N) agent_life (按日期)
users (1) ────< (N) agent_reviews (按日期)
users (1) ────< (N) lobechat_history (15天)

agents (1) ───< (N) agent_memories
agents (1) ───< (N) agent_messages (sender/receiver)

tools (N) ──── (N) tools (Related)
blog_posts (N) ──── (N) tags

tasks_queue ── (系统任务队列)
scheduled_jobs ── (定时任务配置)
```

---

**版本**: v2.0 (Consolidated)
**日期**: 2026-02-07
**存储策略**: 所有媒体文件（图片、图标）均存储为相对于 `frontend/public` 的**相对路径**（例如 `/uploads/hero.png`）。
