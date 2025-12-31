#!/usr/bin/env python3
"""
Documentation Index Generator

This module provides functionality to generate comprehensive README files
for the documentation structure, creating navigation and overview content.
"""

import os
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime


@dataclass
class DocumentInfo:
    """Information about a documentation file"""
    filename: str
    title: str
    description: str
    relative_path: str


class DocumentationIndexGenerator:
    """Main class for generating documentation indices"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.docs_dir = self.base_dir / "docs"
        
        # Document metadata for generating descriptions
        self.document_metadata = self._build_document_metadata()
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def _build_document_metadata(self) -> Dict[str, DocumentInfo]:
        """Define metadata for all documentation files"""
        return {
            "concept.md": DocumentInfo(
                filename="concept.md",
                title="项目构想",
                description="AI Life Assistant 的核心理念和设计思路",
                relative_path="project/concept.md"
            ),
            "phase1-summary.md": DocumentInfo(
                filename="phase1-summary.md", 
                title="第一阶段总结",
                description="项目第一阶段的完成情况和成果总结",
                relative_path="project/phase1-summary.md"
            ),
            "phase2-plan.md": DocumentInfo(
                filename="phase2-plan.md",
                title="第二阶段计划", 
                description="项目第二阶段的详细实施计划",
                relative_path="project/phase2-plan.md"
            ),
            "phase2-summary.md": DocumentInfo(
                filename="phase2-summary.md",
                title="第二阶段总结",
                description="项目第二阶段的完成情况和成果总结", 
                relative_path="project/phase2-summary.md"
            ),
            "web-app-requirements.md": DocumentInfo(
                filename="web-app-requirements.md",
                title="Web 应用需求",
                description="Web 应用的功能需求和技术规范",
                relative_path="project/web-app-requirements.md"
            ),
            "quickstart.md": DocumentInfo(
                filename="quickstart.md",
                title="快速开始",
                description="AI Life Assistant 的快速安装和使用指南",
                relative_path="guides/quickstart.md"
            ),
            "user-profile.md": DocumentInfo(
                filename="user-profile.md", 
                title="用户配置",
                description="个人偏好设置和用户信息配置",
                relative_path="guides/user-profile.md"
            ),
            "claude-guide.md": DocumentInfo(
                filename="claude-guide.md",
                title="Claude 开发指南",
                description="使用 Claude API 进行开发的详细指南",
                relative_path="development/claude-guide.md"
            ),
            "glm-integration.md": DocumentInfo(
                filename="glm-integration.md",
                title="GLM 集成指南", 
                description="智谱 GLM API 的集成和使用说明",
                relative_path="development/glm-integration.md"
            ),
            "rules.md": DocumentInfo(
                filename="rules.md",
                title="开发规范",
                description="项目开发的规范和最佳实践",
                relative_path="development/rules.md"
            )
        }
    
    def extract_title_from_file(self, file_path: Path) -> str:
        """Extract title from the first heading in a markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('# '):
                        return line[2:].strip()
                    elif line.startswith('## ') and not line.startswith('### '):
                        # If no h1, use first h2 as title
                        return line[3:].strip()
            
            # If no heading found, use filename without extension
            return file_path.stem.replace('-', ' ').title()
            
        except Exception as e:
            self.logger.warning(f"Could not extract title from {file_path}: {e}")
            return file_path.stem.replace('-', ' ').title()
    
    def generate_main_index(self) -> str:
        """Generate the main docs/README.md file"""
        content = f"""# AI Life Assistant 文档

欢迎使用 AI Life Assistant 文档！这里包含了项目的完整文档，帮助您了解和使用这个智能生活助手系统。

## 📋 文档概览

AI Life Assistant 是一个综合性的个人生产力系统，包含 5 个专业的 AI 秘书，为您提供全方位的日常生活管理支持。

### 🎯 核心功能

- **新闻秘书** - AI/科技新闻聚合和摘要
- **工作秘书** - 任务管理和工作规划  
- **穿搭秘书** - 基于天气的服装推荐
- **生活秘书** - 健康、饮食和生活方式管理
- **复盘秘书** - 晚间反思和个人成长分析

## 📚 文档导航

### 📁 [项目文档](./project/)
项目概述、规划和需求文档

- [项目构想](./project/concept.md) - AI Life Assistant 的核心理念和设计思路
- [第一阶段总结](./project/phase1-summary.md) - 项目第一阶段的完成情况和成果总结
- [第二阶段计划](./project/phase2-plan.md) - 项目第二阶段的详细实施计划
- [第二阶段总结](./project/phase2-summary.md) - 项目第二阶段的完成情况和成果总结
- [Web 应用需求](./project/web-app-requirements.md) - Web 应用的功能需求和技术规范

### 📖 [使用指南](./guides/)
用户指南和教程

- [快速开始](./guides/quickstart.md) - AI Life Assistant 的快速安装和使用指南
- [用户配置](./guides/user-profile.md) - 个人偏好设置和用户信息配置

### 🛠️ [开发文档](./development/)
开发指南和技术文档

- [Claude 开发指南](./development/claude-guide.md) - 使用 Claude API 进行开发的详细指南
- [GLM 集成指南](./development/glm-integration.md) - 智谱 GLM API 的集成和使用说明
- [开发规范](./development/rules.md) - 项目开发的规范和最佳实践

### 🔧 [技术规范](./technical/)
技术细节和规范文档

*技术规范文档正在完善中...*

## 🚀 快速开始

如果您是第一次使用 AI Life Assistant，建议按以下顺序阅读文档：

1. [项目构想](./project/concept.md) - 了解项目的核心理念
2. [快速开始](./guides/quickstart.md) - 快速安装和配置系统
3. [用户配置](./guides/user-profile.md) - 个性化配置您的助手
4. [开发规范](./development/rules.md) - 如果您需要进行开发工作

## 🏗️ 系统架构

- **后端**: Python CLI + FastAPI Web 服务器
- **前端**: Next.js Web 应用
- **数据**: 基于文件的存储，按日期组织的日志
- **AI**: Claude API (Anthropic) 或 GLM API 集成

## 📞 获取帮助

如果您在使用过程中遇到问题，可以：

1. 查看相关的文档章节
2. 检查 [开发规范](./development/rules.md) 中的常见问题
3. 查看项目的 [快速开始指南](./guides/quickstart.md)

---

*文档最后更新: {datetime.now().strftime('%Y-%m-%d')}*
"""
        return content
    
    def generate_project_index(self) -> str:
        """Generate the project section README"""
        content = """# 项目文档

这个目录包含了 AI Life Assistant 项目的概述、规划和需求文档。

## 📋 文档列表

### [项目构想](./concept.md)
AI Life Assistant 的核心理念和设计思路，包括：
- 项目愿景和目标
- 核心功能设计
- 技术架构概述
- 用户体验设计

### [第一阶段总结](./phase1-summary.md)
项目第一阶段的完成情况和成果总结，包括：
- 已完成的功能模块
- 技术实现细节
- 遇到的挑战和解决方案
- 经验教训和改进建议

### [第二阶段计划](./phase2-plan.md)
项目第二阶段的详细实施计划，包括：
- 功能规划和优先级
- 技术实现方案
- 时间安排和里程碑
- 资源需求和风险评估

### [第二阶段总结](./phase2-summary.md)
项目第二阶段的完成情况和成果总结，包括：
- 实现的新功能
- 性能优化成果
- 用户体验改进
- 下一阶段规划

### [Web 应用需求](./web-app-requirements.md)
Web 应用的功能需求和技术规范，包括：
- 功能需求详细说明
- 用户界面设计要求
- 技术架构规范
- 性能和安全要求

## 🎯 项目概述

AI Life Assistant 是一个综合性的个人生产力系统，旨在通过 5 个专业的 AI 秘书为用户提供全方位的日常生活管理支持。

### 核心特性
- 🤖 智能化的个人助手服务
- 📱 现代化的 Web 界面
- 🔄 自动化的日常流程
- 📊 数据驱动的个性化建议
- 🌐 多 API 集成支持

### 技术栈
- **后端**: Python, FastAPI, SQLAlchemy
- **前端**: Next.js, React, Tailwind CSS
- **AI**: Claude API, GLM API
- **数据**: SQLite/PostgreSQL, ChromaDB

---

*返回 [主文档](../README.md)*
"""
        return content
    
    def generate_guides_index(self) -> str:
        """Generate the guides section README"""
        content = """# 使用指南

这个目录包含了 AI Life Assistant 的用户指南和教程，帮助您快速上手和深入使用系统。

## 📖 指南列表

### [快速开始](./quickstart.md)
AI Life Assistant 的快速安装和使用指南，包括：
- 系统要求和环境准备
- 安装步骤和配置说明
- 基本使用方法
- 常见问题解答

### [用户配置](./user-profile.md)
个人偏好设置和用户信息配置，包括：
- 个人信息设置
- 偏好配置选项
- 自定义设置说明
- 配置文件管理

## 🚀 使用流程

### 新用户入门
1. **安装配置** - 按照 [快速开始](./quickstart.md) 完成系统安装
2. **个人设置** - 根据 [用户配置](./user-profile.md) 设置个人信息
3. **功能体验** - 逐步体验各个 AI 秘书的功能
4. **个性化调整** - 根据使用习惯调整配置

### 日常使用
- **晨间流程**: 新闻简报 → 工作规划 → 穿搭建议
- **日间管理**: 任务执行 → 生活提醒 → 健康监控
- **晚间复盘**: 日程回顾 → 经验总结 → 明日准备

## 🎯 功能概览

### 五大 AI 秘书
- **新闻秘书** 📰 - 个性化新闻聚合和智能摘要
- **工作秘书** 💼 - 任务管理和工作效率优化
- **穿搭秘书** 👔 - 天气感知的服装搭配建议
- **生活秘书** 🏠 - 健康管理和生活方式指导
- **复盘秘书** 📝 - 反思总结和个人成长追踪

### 核心特性
- 🤖 智能对话交互
- 📊 数据可视化展示
- 🔄 自动化工作流程
- 📱 响应式 Web 界面
- 🌙 深色/浅色主题切换

## 💡 使用技巧

### 提高效率
- 设置个性化的偏好配置
- 利用自动化流程减少重复操作
- 定期查看和调整 AI 建议
- 充分利用数据分析功能

### 最佳实践
- 保持配置信息的及时更新
- 定期备份重要数据
- 合理安排各秘书的使用时间
- 积极反馈使用体验以优化系统

---

*返回 [主文档](../README.md)*
"""
        return content
    
    def generate_development_index(self) -> str:
        """Generate the development section README"""
        content = """# 开发文档

这个目录包含了 AI Life Assistant 的开发指南和技术文档，为开发者提供详细的技术参考。

## 🛠️ 开发指南

### [Claude 开发指南](./claude-guide.md)
使用 Claude API 进行开发的详细指南，包括：
- Claude API 的基本使用方法
- 最佳实践和优化技巧
- 错误处理和调试方法
- 性能优化建议

### [GLM 集成指南](./glm-integration.md)
智谱 GLM API 的集成和使用说明，包括：
- GLM API 的配置和认证
- 接口调用方法和参数说明
- 与 Claude API 的对比和选择
- 集成测试和验证

### [开发规范](./rules.md)
项目开发的规范和最佳实践，包括：
- 代码风格和命名规范
- 项目结构和组织方式
- 测试策略和质量保证
- 部署和运维规范

## 🏗️ 技术架构

### 后端架构
- **Python CLI**: 核心业务逻辑和 AI 秘书实现
- **FastAPI**: RESTful API 服务和 Web 后端
- **SQLAlchemy**: 数据库 ORM 和数据管理
- **ChromaDB**: 向量数据库和 RAG 功能

### 前端架构
- **Next.js 14+**: React 框架和服务端渲染
- **Tailwind CSS**: 样式系统和响应式设计
- **Radix UI**: 无障碍 UI 组件库
- **Zustand**: 状态管理和数据流

### AI 集成
- **Claude API**: Anthropic 的大语言模型
- **GLM API**: 智谱 AI 的中文优化模型
- **多模型支持**: 灵活的模型切换和配置

## 🔧 开发环境

### 环境要求
- Python 3.8+
- Node.js 18+
- Git 版本控制
- 现代代码编辑器 (VS Code 推荐)

### 开发工具
- **后端**: pytest, black, flake8, mypy
- **前端**: ESLint, Prettier, TypeScript
- **数据库**: SQLite (开发), PostgreSQL (生产)
- **部署**: Docker, Uvicorn, PM2

## 📋 开发流程

### 代码贡献
1. Fork 项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request
5. 代码审查和合并

### 测试策略
- **单元测试**: 核心功能和业务逻辑
- **集成测试**: API 接口和数据流
- **端到端测试**: 用户场景和工作流
- **性能测试**: 响应时间和并发处理

### 部署流程
- **开发环境**: 本地开发和功能测试
- **测试环境**: 集成测试和用户验收
- **生产环境**: 正式部署和监控

## 🚀 快速开发

### 后端开发
```bash
# 安装依赖
pip install -r requirements.txt

# 运行开发服务器
uvicorn app.main:app --reload

# 运行测试
pytest
```

### 前端开发
```bash
# 安装依赖
cd web-app/frontend && npm install

# 运行开发服务器
npm run dev

# 运行测试
npm test
```

## 📚 相关资源

- [Python 官方文档](https://docs.python.org/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

*返回 [主文档](../README.md)*
"""
        return content
    
    def generate_technical_index(self) -> str:
        """Generate the technical section README"""
        content = """# 技术规范

这个目录包含了 AI Life Assistant 的技术细节和规范文档。

## 🔧 技术文档

*技术规范文档正在完善中，将包括：*

### API 规范
- RESTful API 接口定义
- 请求/响应格式说明
- 认证和授权机制
- 错误码和异常处理

### 数据库设计
- 数据模型和关系设计
- 索引策略和性能优化
- 数据迁移和版本管理
- 备份和恢复方案

### 系统架构
- 微服务架构设计
- 组件交互和通信协议
- 缓存策略和性能优化
- 监控和日志系统

### 安全规范
- 数据加密和传输安全
- 用户认证和权限控制
- API 安全和防护措施
- 隐私保护和合规要求

## 📋 待完善内容

- [ ] API 接口文档
- [ ] 数据库设计文档
- [ ] 系统架构图
- [ ] 安全规范文档
- [ ] 性能测试报告
- [ ] 部署运维手册

---

*返回 [主文档](../README.md)*
"""
        return content
    
    def create_all_indices(self, dry_run: bool = False) -> bool:
        """Create all documentation index files"""
        try:
            indices = {
                "docs/README.md": self.generate_main_index(),
                "docs/project/README.md": self.generate_project_index(),
                "docs/guides/README.md": self.generate_guides_index(),
                "docs/development/README.md": self.generate_development_index(),
                "docs/technical/README.md": self.generate_technical_index()
            }
            
            if dry_run:
                self.logger.info("DRY RUN: Would create the following index files:")
                for file_path in indices.keys():
                    self.logger.info(f"  {file_path}")
                return True
            
            success_count = 0
            for file_path, content in indices.items():
                full_path = self.base_dir / file_path
                
                # Ensure directory exists
                full_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Write the index file
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.logger.info(f"Created index: {file_path}")
                success_count += 1
            
            self.logger.info(f"Successfully created {success_count} index files")
            return success_count == len(indices)
            
        except Exception as e:
            self.logger.error(f"Failed to create documentation indices: {e}")
            return False
    
    def validate_indices(self) -> bool:
        """Validate that all index files exist and are properly formatted"""
        try:
            required_indices = [
                "docs/README.md",
                "docs/project/README.md", 
                "docs/guides/README.md",
                "docs/development/README.md",
                "docs/technical/README.md"
            ]
            
            validation_errors = []
            
            for index_file in required_indices:
                index_path = self.base_dir / index_file
                
                if not index_path.exists():
                    validation_errors.append(f"Missing index file: {index_file}")
                    continue
                
                # Check that file is not empty
                if index_path.stat().st_size == 0:
                    validation_errors.append(f"Empty index file: {index_file}")
                    continue
                
                # Check that file contains markdown content
                with open(index_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if not content.strip().startswith('#'):
                        validation_errors.append(f"Invalid markdown format in: {index_file}")
            
            if validation_errors:
                self.logger.error("Index validation failed:")
                for error in validation_errors:
                    self.logger.error(f"  {error}")
                return False
            
            self.logger.info("All documentation indices validated successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Index validation failed: {e}")
            return False


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate documentation indices")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Show what would be created without making changes")
    parser.add_argument("--validate", action="store_true",
                       help="Validate existing index files")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for index generation (default: current directory)")
    
    args = parser.parse_args()
    
    generator = DocumentationIndexGenerator(args.base_dir)
    
    if args.validate:
        success = generator.validate_indices()
    else:
        success = generator.create_all_indices(dry_run=args.dry_run)
    
    if success:
        print("Documentation index generation completed successfully!")
    else:
        print("Documentation index generation failed!")
        exit(1)