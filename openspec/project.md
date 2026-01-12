# Project Context

## Purpose
AI生活助理团队（AI Life Assistant Team）是为大洪打造的个人生活助理AI系统。通过5个专业AI秘书提供全方位生活支持：新闻秘书（AI/科技新闻简报）、工作秘书（任务管理和TODO生成）、穿搭秘书（基于天气的着装建议）、生活秘书（饮食、运动、作息管理）、复盘秘书（晚间反思和行为分析）。系统提供CLI交互模式和Web应用两种使用方式，帮助用户高效管理日常生活。

## Tech Stack

### Backend
- **Language**: Python 3.14
- **API Framework**: FastAPI + Uvicorn
- **Database**: SQLite + SQLAlchemy ORM + Alembic migrations
- **LLM Providers**: Anthropic Claude (primary), Zhipu GLM (alternative)
- **Data Validation**: Pydantic 2.0+
- **Type Checking**: mypy
- **Web Scraping**: BeautifulSoup4, feedparser, requests
- **Authentication**: JWT (python-jose) + bcrypt (passlib)
- **Task Scheduling**: APScheduler
- **Testing**: pytest + pytest-cov + pytest-mock + pytest-xdist

### Frontend
- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Particles**: tsparticles
- **Form Validation**: react-hook-form + zod
- **Build Tool**: pnpm

### Developer Tools
- **Code Formatting**: Black (Python, line length: 88), isort
- **Linting**: flake8, ESLint (TypeScript/JavaScript)
- **Pre-commit Hooks**: Pre-commit framework
- **Git Hooks**: Conventional Commits
- **Testing**: pytest with 80% coverage requirement
- **CI/CD**: GitHub Actions (backend and frontend workflows)
- **Containerization**: Docker support

## Project Conventions

### Code Style
- **Python**: Black formatter (88 character line length), isort for imports, flake8 for linting
- **TypeScript/JavaScript**: ESLint with Next.js configuration, Prettier formatting
- **Naming**: snake_case for Python variables/functions, camelCase for TypeScript/JavaScript, PascalCase for classes/components
- **File Structure**: Feature-based organization with kebab-case filenames
- **Commits**: Conventional Commits (feat:, fix:, docs:, refactor:, test:, chore:)
- **Documentation**: Comprehensive docstrings for public functions, inline comments for complex logic

### Architecture Patterns
- **Backend**: FastAPI service layer with repository pattern, SQLAlchemy ORM with unit of work pattern, dependency injection, Pydantic models for validation
- **Frontend**: Next.js App Router with server components, client components for interactivity, component-based architecture with Radix UI primitives
- **Agents**: Modular agent system with 5 specialized secretaries, each with clear responsibilities and interfaces
- **Database**: Repository pattern for data access, Alembic for schema migrations, SQLite for local development
- **LLM Integration**: Abstract LLM client supporting multiple providers, prompt engineering for Chinese context
- **Authentication**: JWT-based authentication with refresh tokens, password hashing with bcrypt, protected routes

### Testing Strategy
- **Test Pyramid**: Heavy emphasis on unit tests (70%), moderate integration tests (20%), minimal E2E tests (10%)
- **Coverage**: Minimum 80% code coverage enforced via pytest-cov
- **Unit Tests**: Isolated testing with pytest-mock for external dependencies, fast execution (< 1 second per test)
- **Integration Tests**: Database transactions for test isolation, LLM API mocking, realistic data scenarios
- **Test Organization**: tests/unit/ for unit tests, tests/integration/ for integration tests, fixtures for reusable test data
- **Continuous Testing**: GitHub Actions for automated testing on PRs, local pre-commit hooks for code quality
- **Parallel Testing**: pytest-xdist for faster test execution (n = CPU cores)

### Git Workflow
- **Branching Strategy**: GitHub flow with feature branches, main as production branch
- **Branch Naming**: feature/xxx, fix/xxx, docs/xxx, refactor/xxx
- **Commits**: Conventional Commits with descriptive messages, atomic commits
- **Pull Requests**: Required for all changes, automated CI checks, code review required

## Domain Context
- **Primary User**: 大洪 (Da Hong), 37-year-old tech expert based in Shanghai
- **Language**: Bilingual support (Chinese primary, English secondary)
- **Location**: Shanghai, China (Asia/Shanghai timezone)
- **Use Cases**: Daily news consumption, task management, outfit planning, health tracking, evening reflection
- **Privacy**: Local data storage with optional cloud backup, no third-party data sharing
- **Personalization**: User preferences stored in config, health goals, occupation-based recommendations

## Important Constraints
- **Python 3.14 Compatibility**: All code must be compatible with Python 3.14+ features
- **LLM Provider Flexibility**: Must support multiple LLM providers (Claude, GLM) with easy switching
- **Modular Architecture**: Each secretary must be independently runnable and testable
- **Offline Capability**: Core functionality works without internet (cached data), enhanced features require connectivity
- **Data Privacy**: No sensitive data in logs or error messages, encrypted storage for credentials
- **Performance**: CLI commands must complete within 5 seconds, API responses within 1 second
- **Resource Limits**: Memory usage under 500MB, disk usage under 1GB for local data

## External Dependencies
- **LLM APIs**: Anthropic Claude API (primary), Zhipu GLM API (alternative), both require API keys
- **Weather Services**: QWeather API (default), Seniverse API (alternative), OpenWeatherMap (fallback)
- **News Sources**: TechCrunch AI section, The Verge AI, MIT Technology Review, Hugging Face Blog
- **Optional Integrations**: Feishu/Lark for notifications, Jimeng AI for image generation
- **Development Services**: GitHub for version control, GitHub Actions for CI/CD