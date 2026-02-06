# Scripts 目录结构

本项目脚本已按用途分类组织，便于查找和维护。

## 目录结构

```
scripts/
├── README.md              # 本文档
├── build/                 # 构建脚本
│   └── build.sh          # 生产构建
├── test/                  # 测试脚本
│   └── test.sh           # 运行所有测试
├── deploy/                # 部署脚本
│   └── deploy.sh         # Docker 部署
└── maintenance/           # 维护脚本
    ├── setup.sh          # 环境初始化
    ├── start-dev.sh      # 启动开发服务器
    ├── clean.sh          # 清理项目
    └── lint.sh           # 代码检查
```

## 使用说明

### 构建
```bash
./scripts/build/build.sh
```

### 测试
```bash
./scripts/test/test.sh
```

### 部署
```bash
./scripts/deploy/deploy.sh
```

### 维护
```bash
# 初始化项目
./scripts/maintenance/setup.sh

# 启动开发服务器
./scripts/maintenance/start-dev.sh

# 清理项目
./scripts/maintenance/clean.sh

# 代码检查
./scripts/maintenance/lint.sh
```

## 向后兼容

为了保持向后兼容，原脚本仍保留在 `scripts/` 根目录，但建议迁移到新路径：

| 旧路径 | 新路径 |
|--------|--------|
| `./scripts/build.sh` | `./scripts/build/build.sh` |
| `./scripts/test.sh` | `./scripts/test/test.sh` |
| `./scripts/deploy.sh` | `./scripts/deploy/deploy.sh` |
| `./scripts/setup.sh` | `./scripts/maintenance/setup.sh` |
| `./scripts/start-dev.sh` | `./scripts/maintenance/start-dev.sh` |
| `./scripts/clean.sh` | `./scripts/maintenance/clean.sh` |
| `./scripts/lint.sh` | `./scripts/maintenance/lint.sh` |

## 添加新脚本

1. 根据用途选择正确的子目录
2. 更新子目录中的 README.md
3. 如需全局访问，在根目录创建软链接

---

**最后更新**: 2026年2月6日
