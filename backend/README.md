# AI Life Assistant - Backend

Python FastAPI backend service and CLI application for the AI Life Assistant.

## Structure

```
backend/
├── src/                    # Source code
│   ├── agents/            # AI Secretary modules
│   ├── api/               # FastAPI web service
│   ├── cli/               # CLI application
│   ├── core/              # Core utilities (config, logging)
│   ├── integrations/      # External service integrations
│   └── utils/             # Utility functions
├── tests/                 # Test suite
├── alembic/               # Database migrations
├── config/                # Configuration files
└── requirements/          # Python dependencies
```

## Quick Start

```bash
# Install dependencies
cd backend
pip install -r requirements/base.txt

# Run CLI
python -m src.cli.main

# Run API server
python -m src.api.server
```

## Development

```bash
# Run tests
pytest

# Type checking
mypy src/

# Run with hot reload
uvicorn src.api.server:app --reload
```

## Configuration

Edit `config/config.ini` with your API keys and preferences.

See main project README for detailed documentation.
