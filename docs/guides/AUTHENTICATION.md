# 身份验证系统指南

## 概述
AI Life Assistant v2.0 采用工业级的 JWT (JSON Web Token) 无状态身份验证体系，确保个人数据的私密性与安全性。

## 核心特性
- **无状态验证**：服务端不保存 Session，所有权限校验通过客户端携带的加密 Token 完成。
- **持久化存储**：v2.0 已将用户数据与 Session 全面迁移至 SQLite 数据库，不再依赖任何本地临时文件。
- **多层安全防护**：
  - **Bcrypt 哈希**：密码以 Cost Factor 12 的高强度哈希存储。
  - **速率限制**：API 层面防止暴力破解（每 15 分钟 5 次尝试限制）。
  - **智能续期**：支持“记住我”模式（最长 30 天有效期）。

## 系统配置

### 环境变量 (.env)
```bash
# JWT 核心配置
JWT_SECRET_KEY=your-random-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 天

# 数据库连接
DATABASE_URL=sqlite:///./data/ai_life_assistant.db
```

## 前端集成
系统在 `frontend/src/contexts/auth-context.tsx` 中封装了全局认证状态。

### 受保护路由
在 `app/(dashboard)/layout.tsx` 中，所有页面默认被 `ProtectedRoute` 包裹。未登录用户访问 Dashboard 或对话页面将被自动重定向至 `/login`。

## 常见问题
1. **Token 过期怎么办？** 系统会自动检测 401 错误并跳转至登录页，请重新输入凭据以获取新 Token。
2. **能否手动清除数据？** 登录后可在设置页面或通过直接操作 `data/ai_life_assistant.db` 的 `users` 表进行管理。

---
*分类：系统规范*
*版本：v2.0*
*更新日期：2026-01-23*
