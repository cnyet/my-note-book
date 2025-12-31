# Technology Stack & Build System

## Core Technologies

### Python Backend (CLI Application)
- **Python**: 3.8+ (main application language)
- **LLM Integration**: Anthropic Claude API or GLM API (zhipuai)
- **Web Scraping**: requests, beautifulsoup4, feedparser
- **Configuration**: configparser for .ini files
- **Data Processing**: pandas, numpy
- **Vector DB**: ChromaDB for RAG functionality
- **Task Scheduling**: APScheduler
- **Weather APIs**: Multiple providers (qweather, seniverse, openweathermap)

### Web Application Stack
- **Frontend**: Next.js 14+ with React 18+
- **UI Components**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React

### Backend API
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: SQLAlchemy with SQLite/PostgreSQL
- **Migrations**: Alembic
- **Authentication**: JWT + OAuth2
- **Caching**: Redis
- **Task Queue**: Celery
- **Logging**: structlog

## Common Commands

### Python CLI Application
```bash
# Install dependencies
pip install -r requirements.txt

# Run interactive menu
python main.py

# Run specific secretary
python main.py --step news|work|outfit|life|review

# Run morning routine
python main.py --step morning

# Run full daily routine
python main.py --step full

# Interactive mode (where supported)
python main.py --step outfit --interactive

# List today's files
python main.py --list

# View history
python main.py --history

# Verify setup
python verify_setup.py
```

### Web Application Development
```bash
# Frontend development
cd web-app/frontend
npm install
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code

# Backend development
cd web-app/backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # Start development server
alembic upgrade head           # Run migrations
pytest                         # Run tests

# Database management
python scripts/db_manager.py
```

## Configuration Management

### Main Configuration
- **File**: `config/config.ini`
- **Sections**: [llm], [data], [news], [weather], [user], [health], [system]
- **API Keys**: Store in config.ini (not committed to git)

### Environment Variables
- **Backend**: `.env` files for sensitive data
- **Frontend**: Next.js environment variables

## Development Tools
- **Package Manager**: pip (Python), npm/pnpm (Node.js)
- **Testing**: pytest (Python), Jest (JavaScript)
- **Linting**: flake8/black (Python), ESLint (JavaScript)
- **Type Checking**: mypy (Python), TypeScript
- **Database**: SQLite (dev), PostgreSQL (prod)

## API Integration
- **LLM Providers**: Anthropic Claude, GLM (zhipuai)
- **Weather APIs**: QWeather, Seniverse, OpenWeatherMap
- **Optional**: Feishu/Lark integration, Jimeng AI for images