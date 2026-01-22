"""add_blog_posts_table

Revision ID: add_blog_posts
Revises: 20260112120000
Create Date: 2026-01-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime, timezone
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = 'add_blog_posts'
down_revision = '20260112120000'
branch_labels = None
depends_on = None


def upgrade():
    # Create blog_posts table
    op.create_table(
        'blog_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('summary', sa.String(length=1000), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False, server_default='未分类'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('ix_blog_posts_id', 'blog_posts', ['id'], unique=False)
    op.create_index('ix_blog_posts_title', 'blog_posts', ['title'], unique=False)
    op.create_index('ix_blog_posts_category', 'blog_posts', ['category'], unique=False)
    op.create_index('ix_blog_posts_created_at', 'blog_posts', ['created_at'], unique=False)
    
    # Get the first user ID dynamically
    connection = op.get_bind()
    result = connection.execute(text("SELECT id FROM users LIMIT 1"))
    user_id = result.scalar()
    
    if not user_id:
        # If no user exists, skip inserting sample data
        return
        
    # Insert sample blog posts
    from sqlalchemy.sql import table, column
    
    now = datetime.now(timezone.utc)
    
    sample_posts = [
        {
            'title': 'Next.js App Router 深度解析',
            'content': '# Next.js App Router 深度解析\n\nNext.js 13 引入了全新的 App Router...',
            'summary': 'Next.js App Router 的核心特性、迁移指南和最佳实践。',
            'category': '前端开发',
            'created_at': now,
            'updated_at': now,
            'author_id': user_id
        },
        {
            'title': 'FastAPI 异步编程最佳实践',
            'content': '# FastAPI 异步编程最佳实践\n\nFastAPI 是基于 Starlette 的 modern Web 框架...',
            'summary': 'FastAPI 异步编程的核心概念、最佳实践和性能调优技巧。',
            'category': '后端开发',
            'created_at': now,
            'updated_at': now,
            'author_id': user_id
        }
    ]
    
    posts_table = table(
        'blog_posts',
        column('title', sa.String),
        column('content', sa.Text),
        column('summary', sa.String),
        column('category', sa.String),
        column('created_at', sa.DateTime),
        column('updated_at', sa.DateTime),
        column('author_id', sa.Integer)
    )
    
    op.bulk_insert(posts_table, sample_posts)


def downgrade():
    op.drop_index('ix_blog_posts_created_at', table_name='blog_posts')
    op.drop_index('ix_blog_posts_category', table_name='blog_posts')
    op.drop_index('ix_blog_posts_title', table_name='blog_posts')
    op.drop_index('ix_blog_posts_id', table_name='blog_posts')
    op.drop_table('blog_posts')
