"""Add image_url and thumbnail_url to news_articles table

Revision ID: 20260112120000
Revises: 20260112111525
Create Date: 2025-01-12 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260112120000'
down_revision: Union[str, Sequence[str], None] = '20260112111525'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('news_articles', sa.Column('image_url', sa.String(length=1000), nullable=True))
    op.add_column('news_articles', sa.Column('thumbnail_url', sa.String(length=1000), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('news_articles', 'thumbnail_url')
    op.drop_column('news_articles', 'image_url')
