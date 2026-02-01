import os
import sys
from logging.config import fileConfig

from sqlalchemy import pool
from alembic import context

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import Base

# this is the Alembic Config object, and provides access to the values
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./work-agents.db")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# target_metadata for auto-migration
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations() -> None:
    """Run migrations synchronously."""
    from src.database import engine
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations()
