# work-agents Backend

FastAPI backend for the work-agents project.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Access
# - API: http://localhost:8000
# - Docs: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
```

## Project Structure

```
backend/
├── src/
│   ├── main.py           # FastAPI application entry point
│   ├── database.py       # Database configuration
│   ├── api/              # API routes
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   └── services/         # Business logic
├── migrations/           # Alembic migrations
├── tests/                # Test files
├── requirements.txt      # Python dependencies
├── alembic.ini          # Alembic configuration
└── .env                 # Environment variables
```

## Database

- SQLite with SQLAlchemy ORM
- Run migrations: `alembic upgrade head`
- Create new migration: `alembic revision -m "description"`

## Environment Variables

See `.env` file for configuration options.
