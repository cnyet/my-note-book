# OpenCode 连接 GitHub MCP 服务完全指南

## 📋 背景

Model Context Protocol (MCP) 是一个标准协议，允许 AI 应用与外部工具 and 数据源进行交互。GitHub 提供了官方的 MCP Server，使 AI 助手能够直接操作 GitHub 仓库、管理 Issues、PR 等。

本文记录了在 OpenCode 中配置 GitHub MCP 服务的完整过程，包括遇到的各种问题和最终的解决方案。

## 🎯 目标

在 OpenCode 中成功配置 GitHub MCP Server，使其能够：
- 读取和操作 GitHub 仓库
- 管理 Issues 和 Pull Requests
- 搜索代码和查询用户信息
- 使用 GitHub Actions 等功能

## 🚧 遇到的问题

### 问题 1: Invalid input mcp.github

**现象**：配置文件保存后，OpenCode 提示 `Invalid input mcp.github`

**尝试的配置**：
```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token"
      }
    }
  }
}
```

**原因**：OpenCode 不支持独立的 `env` 字段，这与 Claude Desktop 的配置方式不同。

### 问题 2: 远程 MCP Server 连接失败

**尝试的配置**：
```json
{
  "github": {
    "type": "remote",
    "url": "https://api.githubcopilot.com/mcp/x/all",
    "headers": {
      "X-MCP-Toolsets": "repos,issues,pull_requests,users,context,gists,actions"
    }
  }
}
```

**原因**：远程 MCP Server 需要 OAuth 认证，OpenCode 可能不支持这种认证方式。

### 问题 3: Python 版本的 MCP Server 不存在

**尝试**：使用 `uvx mcp-server-github`（类似 fetch 的方式）

**结果**：PyPI 上没有官方的 GitHub MCP Server Python 包。

## ✅ 最终解决方案

### 使用 Docker 运行 GitHub MCP Server

根据 [GitHub MCP Server 官方文档](https://github.com/github/github-mcp-server)，推荐使用 Docker 方式运行。

**最终配置**：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "github": {
      "type": "local",
      "command": [
        "docker",
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here",
        "ghcr.io/github/github-mcp-server"
      ]
    }
  }
}
```

**配置说明**：

1. **type**: `local` - 本地运行模式
2. **command**: Docker 命令数组
   - `docker run`: 运行容器
   - `-i`: 交互模式（MCP 协议需要）
   - `--rm`: 容器退出后自动删除
   - `-e GITHUB_PERSONAL_ACCESS_TOKEN=xxx`: 传递环境变量
   - `ghcr.io/github/github-mcp-server`: GitHub 官方镜像

### 配置步骤

#### 1. 获取 GitHub Personal Access Token

访问 [GitHub Settings - Personal Access Tokens](https://github.com/settings/personal-access-tokens/new)

根据需要的功能，授予相应权限：
- `repo`: 仓库访问
- `read:user`: 读取用户信息
- `read:org`: 读取组织信息
- `workflow`: GitHub Actions（可选）

#### 2. 确保 Docker 运行

```bash
# 检查 Docker 版本
docker --version

# 启动 Docker Desktop (macOS)
open -a Docker

# 验证 Docker 运行
docker ps
```

#### 3. 配置 OpenCode

编辑 `~/.config/opencode/opencode.json`，添加上述配置。

#### 4. 重启 OpenCode

配置生效后，OpenCode 会在首次使用时自动拉取 Docker 镜像。

## 🔍 OpenCode vs Claude Desktop 配置对比

### 配置格式差异

| 特性 | Claude Desktop | OpenCode |
|------|---------------|----------|
| **env 字段** | ✅ 支持独立 `env` 对象 | ❌ 不支持，需内联到命令 |
| **命令格式** | `command` + `args` 分离 | `command` 数组包含所有参数 |
| **type 字段** | 不需要 | 需要指定 `local`/`remote` |
| **推荐方式** | npx (Node.js) | Docker |

### Claude Desktop 配置示例

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token"
      }
    }
  }
}
```

### 为什么配置方式不同？

1. **技术栈差异**
   - Claude Desktop: Electron + Node.js
   - OpenCode: Go 语言

2. **设计哲学**
   - Claude: 完整的 Node.js 环境，原生支持 `child_process` 的 `env` 参数
   - OpenCode: 轻量化设计，环境变量通过命令行传递

3. **安全考虑**
   - OpenCode 避免在配置文件中暴露环境变量结构
   - 统一的配置接口，所有 MCP 服务器使用相同模式

## 💡 最佳实践

### 1. 使用环境变量存储 Token

**不推荐**（Token 直接写在配置中）：
```json
{
  "command": [
    "docker", "run", "-i", "--rm",
    "-e", "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx",
    "ghcr.io/github/github-mcp-server"
  ]
}
```

**推荐**（使用系统环境变量）：

1. 在 `~/.zshrc` 或 `~/.bashrc` 中添加：
```bash
export GITHUB_PAT="your_token_here"
```

2. 配置中引用：
```json
{
  "command": [
    "sh", "-c",
    "docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT ghcr.io/github/github-mcp-server"
  ]
}
```

### 2. 确保 Docker 自动启动

**macOS**:
- Docker Desktop → Settings → General → Start Docker Desktop when you log in

**Linux**:
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

### 3. 定期更新 Docker 镜像

```bash
# 拉取最新镜像
docker pull ghcr.io/github/github-mcp-server:latest

# 清理旧镜像
docker image prune -a
```

## 🎯 可用功能

配置成功后，可以使用以下 GitHub 功能：

### Repos Toolset
- `get_file_contents`: 读取文件内容
- `search_code`: 搜索代码
- `create_or_update_file`: 创建或更新文件
- `push_files`: 批量推送文件
- `create_branch`: 创建分支
- `create_repository`: 创建仓库

### Issues Toolset
- `issue_read`: 读取 Issue
- `create_issue`: 创建 Issue
- `update_issue`: 更新 Issue
- `add_issue_comment`: 添加评论

### Pull Requests Toolset
- `pull_request_read`: 读取 PR
- `create_pull_request`: 创建 PR
- `update_pull_request`: 更新 PR
- `merge_pull_request`: 合并 PR

### 其他 Toolsets
- **Users**: 用户信息查询
- **Context**: 仓库上下文
- **Gists**: Gist 管理
- **Actions**: GitHub Actions 操作

## 🐛 故障排除

### 问题：Docker daemon 未运行

**错误信息**:
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**解决方案**:
```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

### 问题：镜像拉取失败

**错误信息**:
```
Error response from daemon: Get https://ghcr.io/v2/: unauthorized
```

**解决方案**:
```bash
# 登出 GitHub Container Registry
docker logout ghcr.io

# 重新拉取（公开镜像无需登录）
docker pull ghcr.io/github/github-mcp-server
```

### 问题：Token 权限不足

**现象**: 某些操作返回 403 Forbidden

**解决方案**: 重新生成 Token，确保授予了必要的权限。

## 📚 参考资料

- [GitHub MCP Server 官方仓库](https://github.com/github/github-mcp-server)
- [GitHub MCP Server 配置文档](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md)
- [远程 MCP Server 文档](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md)
- [Model Context Protocol 规范](https://modelcontextprotocol.io/)
- [OpenCode 官方文档](https://opencode.ai/)

## 🎉 总结

通过 Docker 方式成功在 OpenCode 中配置了 GitHub MCP Server。关键要点：

1. **OpenCode 不支持独立的 `env` 字段**，需要将环境变量内联到命令中
2. **Docker 是最佳选择**，无需 Node.js 依赖，环境隔离
3. **配置格式因工具而异**，但 MCP 协议本身是标准的
4. **安全第一**，建议使用环境变量存储敏感信息

希望这篇文章能帮助你顺利配置 GitHub MCP Server！

---

**作者**: AI Assistant  
**日期**: 2026-01-23  
**分类**: 技术教程  
**标签**: OpenCode, GitHub, MCP, Docker, 配置指南
