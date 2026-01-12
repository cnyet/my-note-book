"""Create news_articles table

Revision ID: 20260112111525
Revises: 7dc4611c3c5f
Create Date: 2025-01-12 11:15:25.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260112111525'
down_revision: Union[str, Sequence[str], None] = '7dc4611c3c5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('news_articles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=500), nullable=False),
    sa.Column('source', sa.String(length=100), nullable=False),
    sa.Column('link', sa.String(length=1000), nullable=False),
    sa.Column('summary', sa.Text(), nullable=True),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('importance_score', sa.Integer(), nullable=True),
    sa.Column('category', sa.String(length=50), nullable=True),
    sa.Column('published_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('article_date', sa.Date(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_news_articles_article_date'), 'news_articles', ['article_date'], unique=False)
    op.create_index(op.f('ix_news_articles_created_at'), 'news_articles', ['created_at'], unique=False)
    op.create_index(op.f('ix_news_articles_id'), 'news_articles', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_news_articles_id'), table_name='news_articles')
    op.drop_index(op.f('ix_news_articles_created_at'), table_name='news_articles')
    op.drop_index(op.f('ix_news_articles_article_date'), table_name='news_articles')
    op.drop_table('news_articles')
