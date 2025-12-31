# Design Document: Project Structure Optimization

## Overview

This design document outlines the optimized folder structure for the AI Life Assistant project, transforming it from an organically grown structure into a well-organized, maintainable monorepo. The new structure follows industry best practices for Python/FastAPI backend and Next.js frontend applications while maintaining clear separation of concerns.

## Architecture

### High-Level Structure

The project will adopt a **monorepo structure** with clear separation between backend and frontend:

```
ai-life-assistant/
├── backend/              # Python FastAPI + CLI application
├── frontend/             # Next.js web application (renamed from web-app)
├── docs/                 # All documentation
├── scripts/              # Development and deployment scripts
├── config/               # Shared configuration
├── .github/              # GitHub workflows and templates
└── [root config files]   # Essential project-level configs only
```

### Design Principles

1. **Separation of Concerns**: Backend and frontend are independent but colocated
2. **Feature-Based Organization**: Group by domain/feature rather than technical layer
3. **Discoverability**: Intuitive naming and logical grouping
4. **Scalability**: Structure supports growth without major refactoring
5. **Developer Experience**: Easy navigation and minimal cognitive load

## Components and Interfaces

### 1. Backend Structure (`backend/`)

```
backend/
├── src/                          # All source code
│   ├── agents/                   # AI Secretary modules
│   │   ├── __init__.py
│   │   ├── base.py              # Base secretary class
│   │   ├── news.py
│   │   ├── work.py
│   │   ├── outfit.py
│   │   ├── life.py
│   │   └── review.py
│   │
│   ├── api/                      # FastAPI application
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── dependencies.py
│   │   ├── middleware/
│   │   ├── routes/              # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── agents.py
│   │   │   ├── dashboard.py
│   │   │   └── health.py
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── repositories/        # Data access layer
│   │
│   ├── cli/                      # CLI application
│   │   ├── __init__.py
│   │   ├── main.py              # CLI entry point
│   │   └── commands/            # CLI commands
│   │
│   ├── core/                     # Core utilities and shared code
│   │   ├── __init__.py
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database setup
│   │   ├── logging.py           # Logging configuration
│   │   └── exceptions.py        # Custom exceptions
│   │
│   ├── integrations/             # External service integrations
│   │   ├── __init__.py
│   │   ├── llm/                 # LLM clients (Claude, GLM)
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── claude.py
│   │   │   └── glm.py
│   │   ├── weather/             # Weather API clients
│   │   └── image/               # Image generation
│   │
│   └── utils/                    # Utility functions
│       ├── __init__.py
│       ├── file_manager.py
│       ├── date_utils.py
│       └── validators.py
│
├── tests/                        # All tests
│   ├── __init__.py
│   ├── conftest.py              # Pytest configuration
│   ├── fixtures/                # Test fixtures
│   ├── unit/                    # Unit tests (mirrors src/)
│   │   ├── agents/
│   │   ├── api/
│   │   └── core/
│   └── integration/             # Integration tests
│       ├── test_workflows.py
│       └── test_api_endpoints.py
│
├── alembic/                      # Database migrations
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── config/                       # Backend configuration
│   ├── config.ini
│   ├── config.dev.ini
│   ├── config.prod.ini
│   └── logging.yaml
│
├── scripts/                      # Backend-specific scripts
│   ├── setup_db.py
│   ├── seed_data.py
│   └── migrate.py
│
├── requirements/                 # Python dependencies
│   ├── base.txt                 # Core dependencies
│   ├── dev.txt                  # Development dependencies
│   ├── prod.txt                 # Production dependencies
│   └── test.txt                 # Testing dependencies
│
├── pyproject.toml               # Python project configuration
├── pytest.ini                   # Pytest configuration
├── mypy.ini                     # Type checking configuration
├── alembic.ini                  # Alembic configuration
└── README.md                    # Backend documentation
```

### 2. Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Dashboard route group
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── news/
│   │   │   ├── work/
│   │   │   ├── outfit/
│   │   │   ├── life/
│   │   │   ├── review/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css
│   │
│   ├── components/               # React components
│   │   ├── ui/                  # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── agents/              # Agent-specific components
│   │   │   ├── news/
│   │   │   ├── work/
│   │   │   ├── outfit/
│   │   │   ├── life/
│   │   │   └── review/
│   │   └── shared/              # Shared components
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── api/                 # API client
│   │   │   ├── client.ts        # Base API client
│   │   │   ├── auth.ts
│   │   │   ├── agents.ts
│   │   │   └── dashboard.ts
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAgent.ts
│   │   │   └── useTheme.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── cn.ts            # Class name utility
│   │   │   ├── date.ts
│   │   │   └── format.ts
│   │   └── constants.ts         # App constants
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── agent.ts
│   │   └── index.ts
│   │
│   ├── contexts/                 # React contexts
│   │   ├── auth-context.tsx
│   │   └── theme-context.tsx
│   │
│   └── styles/                   # Global styles
│       └── themes/              # Theme configurations
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                        # Frontend tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment (gitignored)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Node dependencies
├── pnpm-lock.yaml              # Lock file
└── README.md                    # Frontend documentation
```

### 3. Documentation Structure (`docs/`)

```
docs/
├── README.md                    # Documentation index
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── architecture/
│   ├── overview.md
│   ├── backend.md
│   ├── frontend.md
│   └── data-flow.md
├── api/
│   ├── authentication.md
│   ├── endpoints.md
│   └── schemas.md
├── guides/
│   ├── development.md
│   ├── testing.md
│   ├── deployment.md
│   └── contributing.md
├── agents/
│   ├── overview.md
│   ├── news-secretary.md
│   ├── work-secretary.md
│   ├── outfit-secretary.md
│   ├── life-secretary.md
│   └── review-secretary.md
└── migration/
    ├── CHANGELOG.md
    └── migration-guides/
```

### 4. Scripts Structure (`scripts/`)

```
scripts/
├── setup/
│   ├── install-dependencies.sh
│   ├── setup-database.sh
│   └── create-env-files.sh
├── dev/
│   ├── start-backend.sh
│   ├── start-frontend.sh
│   ├── start-all.sh           # Quick start script
│   └── watch-logs.sh
├── build/
│   ├── build-backend.sh
│   ├── build-frontend.sh
│   └── build-all.sh
├── test/
│   ├── test-backend.sh
│   ├── test-frontend.sh
│   ├── test-all.sh
│   └── test-e2e.sh
├── deploy/
│   ├── deploy-backend.sh
│   ├── deploy-frontend.sh
│   └── deploy-all.sh
├── utils/
│   ├── clean.sh
│   ├── lint.sh
│   └── format.sh
└── README.md
```

### 5. Root Directory (Minimal)

```
ai-life-assistant/
├── backend/                     # Backend application
├── frontend/                    # Frontend application
├── docs/                        # Documentation
├── scripts/                     # Development scripts
├── config/                      # Shared configuration
│   └── aboutme.md              # User preferences
├── data/                        # Application data (gitignored)
│   ├── daily_logs/
│   ├── knowledge_base/
│   ├── vector_db/
│   └── database/
├── .github/                     # GitHub configuration
│   ├── workflows/
│   └── CODEOWNERS
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment template
├── docker-compose.yml           # Docker configuration
├── LICENSE                      # License file
├── README.md                    # Project README
└── CONTRIBUTING.md              # Contribution guidelines
```

## Data Models

### File Movement Mapping

```yaml
# Backend files
agents/* → backend/src/agents/
api/* → backend/src/api/
utils/* → backend/src/core/ (config, logging) and backend/src/utils/ (others)
alembic/* → backend/alembic/
tests/* → backend/tests/
test/* → backend/tests/ (merge with tests/)
config/*.ini → backend/config/
requirements.txt → backend/requirements/base.txt
main.py → backend/src/cli/main.py
*.py (root) → backend/scripts/ or backend/src/cli/

# Frontend files
web-app/* → frontend/

# Documentation
*.md (root) → docs/ or root (README, LICENSE, CONTRIBUTING)
logs/*.md → docs/migration/ or delete if obsolete

# Scripts
scripts/* → scripts/ (reorganize by purpose)

# Data
data/* → data/ (no change, but ensure .gitignore)
logs/*.log → data/logs/ or delete

# Configuration
config/aboutme.md → config/aboutme.md (keep)
.env.example → root and backend/ and frontend/
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: File Preservation
*For any* file in the original structure, after migration the file should exist in the new structure at the mapped location with identical content
**Validates: Requirements 10.2, 10.3**

### Property 2: Import Path Consistency
*For any* Python import statement in the codebase, after migration all imports should resolve correctly to their new locations
**Validates: Requirements 10.3**

### Property 3: Configuration Accessibility
*For any* configuration file, after migration the application should be able to load the configuration from its new location
**Validates: Requirements 5.1, 5.2**

### Property 4: Test Execution
*For any* test in the test suite, after migration the test should execute successfully with the same results as before migration
**Validates: Requirements 10.4**

### Property 5: Directory Structure Compliance
*For any* directory in the new structure, it should conform to the naming conventions and organizational principles defined in the design
**Validates: Requirements 1.4, 2.2**

### Property 6: Dependency Resolution
*For any* dependency declaration, after migration all dependencies should resolve and install correctly in their respective environments
**Validates: Requirements 9.1, 9.2**

### Property 7: Documentation Completeness
*For any* moved file or changed import path, there should be corresponding documentation in the migration guide
**Validates: Requirements 10.1, 6.4**

### Property 8: Artifact Exclusion
*For any* generated artifact (logs, coverage, build outputs), it should be excluded from version control via .gitignore
**Validates: Requirements 8.2**

### Property 9: Script Functionality
*For any* development script, after migration the script should execute successfully and perform its intended function
**Validates: Requirements 7.3, 10.2**

### Property 10: Rollback Capability
*For any* migration step, there should be a corresponding rollback operation that restores the previous state
**Validates: Requirements 10.5**

## Error Handling

### Migration Errors

1. **File Conflict**: If a file already exists at the destination
   - Action: Prompt user for resolution (skip, overwrite, rename)
   - Logging: Record all conflicts in migration log

2. **Import Resolution Failure**: If imports cannot be automatically updated
   - Action: Generate a report of failed imports
   - Fallback: Manual review required

3. **Test Failure**: If tests fail after migration
   - Action: Halt migration, provide detailed error report
   - Rollback: Automatic rollback to pre-migration state

4. **Permission Error**: If file operations fail due to permissions
   - Action: Report permission issues
   - Guidance: Provide commands to fix permissions

### Validation Errors

1. **Missing Files**: If expected files are not found
   - Action: Report missing files
   - Decision: Continue or abort based on criticality

2. **Invalid Structure**: If new structure doesn't match design
   - Action: Report structural violations
   - Correction: Automated fix where possible

## Testing Strategy

### Unit Tests

1. **File Operations**
   - Test file moving, copying, and deletion
   - Test path resolution and normalization
   - Test content preservation

2. **Import Rewriting**
   - Test Python import path updates
   - Test TypeScript import path updates
   - Test relative vs absolute imports

3. **Configuration Loading**
   - Test config file discovery
   - Test environment-specific configs
   - Test config merging

### Integration Tests

1. **Migration Workflow**
   - Test complete migration process
   - Test rollback functionality
   - Test validation steps

2. **Application Functionality**
   - Test backend API endpoints
   - Test frontend page rendering
   - Test CLI commands

3. **Cross-Module Integration**
   - Test backend-frontend communication
   - Test database connectivity
   - Test external service integrations

### Property-Based Tests

1. **File Preservation Property**
   - Generate random file structures
   - Verify all files preserved after migration
   - Verify content integrity

2. **Import Resolution Property**
   - Generate random import statements
   - Verify all imports resolve correctly
   - Verify no circular dependencies

3. **Configuration Loading Property**
   - Generate random config structures
   - Verify configs load correctly
   - Verify environment overrides work

### Manual Testing

1. **Developer Experience**
   - Navigate new structure
   - Run common development tasks
   - Verify IDE integration

2. **Documentation Review**
   - Verify all docs are accessible
   - Check for broken links
   - Validate migration guides

## Migration Strategy

### Phase 1: Preparation (No Code Changes)

1. Create new directory structure (empty)
2. Update .gitignore for new structure
3. Create migration script
4. Backup current state
5. Run validation on current structure

### Phase 2: Backend Migration

1. Move backend source code to `backend/src/`
2. Update Python import paths
3. Move tests to `backend/tests/`
4. Update test imports and fixtures
5. Move configuration to `backend/config/`
6. Update configuration loading code
7. Run backend tests to verify

### Phase 3: Frontend Migration

1. Rename `web-app/` to `frontend/`
2. Update package.json scripts
3. Update import paths if needed
4. Run frontend tests to verify
5. Update build configurations

### Phase 4: Documentation and Scripts

1. Move documentation to `docs/`
2. Reorganize scripts by purpose
3. Update script paths and references
4. Update README files

### Phase 5: Root Cleanup

1. Move remaining files to appropriate locations
2. Remove obsolete files
3. Update root README
4. Clean up root directory

### Phase 6: Validation and Testing

1. Run all unit tests
2. Run all integration tests
3. Test development workflow
4. Test build and deployment
5. Verify documentation

### Phase 7: Finalization

1. Update CI/CD pipelines
2. Update deployment scripts
3. Create migration guide
4. Tag release
5. Communicate changes to team

## Rollback Procedure

1. **Automated Rollback**
   ```bash
   python scripts/migrate.py --rollback
   ```
   - Restores from backup
   - Reverts all file moves
   - Restores original import paths

2. **Manual Rollback**
   - Git reset to pre-migration commit
   - Restore from backup directory
   - Verify functionality

3. **Partial Rollback**
   - Rollback specific phases
   - Keep successful migrations
   - Fix and retry failed phases

## Implementation Notes

### Import Path Updates

**Python Backend:**
```python
# Old
from agents.news_secretary import NewsSecretary
from utils.llm_client import LLMClient
from api.routes.auth import router

# New
from backend.src.agents.news import NewsSecretary
from backend.src.integrations.llm.claude import ClaudeClient
from backend.src.api.routes.auth import router
```

**TypeScript Frontend:**
```typescript
// Old
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

// New (no change, using path aliases)
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
```

### Configuration Updates

**Backend Config Loading:**
```python
# Old
config_path = 'config/config.ini'

# New
config_path = 'backend/config/config.ini'
# Or use environment-specific
config_path = f'backend/config/config.{env}.ini'
```

### Script Updates

**Development Scripts:**
```bash
# Old
python main.py --step news

# New
cd backend && python -m src.cli.main --step news
# Or use wrapper script
./scripts/dev/run-cli.sh --step news
```

## Benefits of New Structure

1. **Clarity**: Clear separation between backend and frontend
2. **Scalability**: Easy to add new features and modules
3. **Maintainability**: Logical organization reduces cognitive load
4. **Testability**: Tests mirror source structure
5. **Onboarding**: New developers can navigate easily
6. **Tooling**: Better IDE support and tooling integration
7. **Deployment**: Independent deployment of backend/frontend
8. **Documentation**: Centralized, organized documentation

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking imports | High | Automated import rewriting + validation |
| Test failures | High | Comprehensive test suite + rollback |
| Lost files | Critical | Backup + file tracking + validation |
| Developer confusion | Medium | Clear documentation + migration guide |
| CI/CD breakage | High | Update pipelines before merge |
| Deployment issues | High | Test deployment in staging first |
