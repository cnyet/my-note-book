#!/usr/bin/env python3
"""
添加 GitHub MCP 配置文章到数据库
"""

import sys
import argparse
from pathlib import Path
from datetime import datetime, timezone

# 添加项目路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root / "backend" / "src"))

try:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from api.database import DATABASE_URL
    from api.models.blog import BlogPost
    from api.models.user import User
except ImportError as e:
    print(f"❌ 导入错误: {e}")
    print("请确保已在 backend/src 目录下安装依赖，并且 PYTHONPATH 包含该目录。")
    sys.exit(1)

# 默认配置
TITLE = "OpenCode 连接 GitHub MCP 服务完全指南"
CATEGORY = "技术教程"
DEFAULT_TEMPLATE = project_root / "templates" / "github_mcp_blog.md"


def main():
    parser = argparse.ArgumentParser(description="将博客文章导入数据库")
    parser.add_argument(
        "--template", type=str, default=str(DEFAULT_TEMPLATE), help="Markdown 模板路径"
    )
    parser.add_argument(
        "--author-email", type=str, default="admin@example.com", help="作者邮箱"
    )
    args = parser.parse_args()

    template_path = Path(args.template)
    if not template_path.exists():
        print(f"❌ 模板文件不存在: {template_path}")
        sys.exit(1)

    # 读取内容
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 读取模板失败: {e}")
        sys.exit(1)

    # 提取摘要 (前 200 个字符或第一段)
    summary = content.split("\n\n")[1] if "\n\n" in content else content[:200]
    if len(summary) > 500:
        summary = summary[:497] + "..."

    # 创建数据库引擎
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 获取或创建作者
        author = session.query(User).filter(User.email == args.author_email).first()
        if not author:
            print(f"⚠️ 未找到邮箱为 {args.author_email} 的用户，正在创建默认管理员...")
            author = User(
                email=args.author_email,
                username="admin",
                hashed_password="hashed_password_placeholder",  # 实际应用中应处理好密码
                is_active=True,
            )
            session.add(author)
            session.flush()  # 获取 ID

        # 创建博客文章
        blog_post = BlogPost(
            title=TITLE,
            content=content,
            summary=summary.strip(),
            category=CATEGORY,
            author_id=author.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        session.add(blog_post)
        session.commit()

        print(f"✅ 文章创建成功！")
        print(f"📝 标题: {TITLE}")
        print(f"📂 分类: {CATEGORY}")
        print(f"🆔 文章 ID: {blog_post.id}")
        print(f"👤 作者: {author.email} (ID: {author.id})")
        print(f"📅 创建时间: {blog_post.created_at}")

    except Exception as e:
        session.rollback()
        print(f"❌ 创建失败: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
