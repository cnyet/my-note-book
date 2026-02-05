# work-agents Backend

FastAPI backend for the work-agents project.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001

# Access
# - API: http://localhost:8001
# - Docs: http://localhost:8001/docs
# - ReDoc: http://localhost:8001/redoc
```

## Management & Scripts

### 1. Create Superuser (Admin)
To access protected endpoints or admin interfaces, create a superuser:

```bash
python src/scripts/create_superuser.py
```

**Default Credentials:**
- **Email**: `admin@example.com`
- **Password**: `admin`

> ⚠️ **Security Warning**: Change this password immediately after first login.

### 2. Seed Initial Data
Populate the database with default categories, tags, and example agents:

```bash
python src/scripts/seed.py
```

## Project Structure

```
backend/
├── alembic/              # Alembic migration scripts
├── alembic.ini           # Alembic configuration
├── data/                 # Database file storage (SQLite)
├── requirements.txt      # Python dependencies
├── src/                  # Source code
│   ├── api/              # API endpoints (v1 routes)
│   ├── core/             # Core configurations (db, security, logging)
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic services
│   └── main.py           # Application entry point
└── tests/                # Test suite
```

## Database

- **Engine**: SQLite (Async supported via `aiosqlite`)
- **ORM**: SQLAlchemy 2.0+
- **Location**: `./data/work_agents.db` (default)

### Migrations (Alembic)

```bash
# Apply migrations to update database schema
alembic upgrade head

# Create a new migration after modifying models
alembic revision --autogenerate -m "description of changes"
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=sqlite:///./data/work_agents.db
SECRET_KEY=your-secret-key
# ... see .env.example for full list
```
