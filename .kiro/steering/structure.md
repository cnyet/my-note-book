# Project Structure & Organization

## Root Directory Layout

```
ai-life-assistant/
├── main.py                    # Main CLI orchestrator
├── requirements.txt           # Python dependencies
├── config/
│   ├── config.ini            # Main configuration file
│   └── config_glm.ini        # GLM-specific config
├── agents/                   # AI Secretary implementations
│   ├── news_secretary.py     # News aggregation & summarization
│   ├── work_secretary.py     # Task management & planning
│   ├── outfit_secretary.py   # Weather-based outfit advice
│   ├── life_secretary.py     # Health & lifestyle management
│   └── review_secretary.py   # Evening reflection & analysis
├── utils/                    # Shared utilities
│   ├── llm_client.py         # LLM API abstraction
│   ├── llm_client_v2.py      # Updated LLM client
│   ├── glm_client.py         # GLM-specific client
│   ├── file_manager.py       # File operations & organization
│   ├── weather_api.py        # Weather API integration
│   └── config_loader.py      # Configuration management
├── data/                     # Data storage
│   ├── daily_logs/           # Date-organized output files
│   │   └── YYYY-MM-DD/       # Daily directories
│   │       ├── 新闻简报.md    # News briefing
│   │       ├── 今日工作.md    # Work planning
│   │       ├── 今日穿搭.md    # Outfit recommendations
│   │       ├── 今日生活.md    # Life management
│   │       └── 今日复盘.md    # Daily review
│   ├── vector_db/            # ChromaDB storage
│   └── knowledge_base/       # Long-term knowledge
├── web-app/                  # Web application
└── tests/                    # Test files
```

## Web Application Structure

```
web-app/
├── package.json              # Root package config
├── frontend/                 # Next.js frontend
│   ├── app/                  # App Router pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Dashboard
│   │   ├── news/             # News secretary pages
│   │   ├── work/             # Work secretary pages
│   │   ├── outfit/           # Outfit secretary pages
│   │   ├── life/             # Life secretary pages
│   │   ├── review/           # Review secretary pages
│   │   └── settings/         # Settings page
│   ├── components/           # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── providers/        # Context providers
│   │   └── background/       # Background effects
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript definitions
└── backend/                  # FastAPI backend
    ├── app/
    │   ├── main.py           # FastAPI application
    │   ├── api/              # API routes
    │   │   ├── v1/           # API v1 routes
    │   │   ├── auth/         # Authentication
    │   │   └── health/       # Health checks
    │   ├── core/             # Core functionality
    │   │   ├── config.py     # Configuration
    │   │   ├── database.py   # Database setup
    │   │   ├── security.py   # Security utilities
    │   │   └── deps.py       # Dependencies
    │   ├── models/           # SQLAlchemy models
    │   ├── schemas/          # Pydantic schemas
    │   └── services/         # Business logic
    ├── alembic/              # Database migrations
    ├── tests/                # Backend tests
    └── scripts/              # Utility scripts
```

## File Naming Conventions

### Python Files
- **Snake case**: `news_secretary.py`, `file_manager.py`
- **Classes**: PascalCase (`NewsSecretary`, `FileManager`)
- **Functions/variables**: snake_case (`run_news_secretary`, `config_dict`)

### Frontend Files
- **Components**: PascalCase (`DashboardContent.tsx`, `ThemeProvider.tsx`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **Utilities**: camelCase (`api.ts`, `utils.ts`)

### Configuration Files
- **Main config**: `config.ini` (INI format)
- **Environment**: `.env` files
- **Package configs**: `package.json`, `pyproject.toml`

## Data Organization

### Daily Logs Structure
- **Directory**: `data/daily_logs/YYYY-MM-DD/`
- **Files**: Chinese names for user-facing content
- **Format**: Markdown with structured sections
- **Automatic**: Created by FileManager utility

### Configuration Hierarchy
1. **Main**: `config/config.ini` (primary configuration)
2. **Specific**: `config/config_glm.ini` (provider-specific)
3. **Environment**: `.env` files (sensitive data)
4. **User**: `aboutme.md` (user preferences)

## Code Organization Patterns

### Agent Structure
- Each secretary is a self-contained class
- Common interface: `__init__(config_dict)` and `run()` methods
- Shared utilities through dependency injection
- File output handled by FileManager

### Utility Modules
- **LLM Client**: Abstraction layer for different AI providers
- **File Manager**: Centralized file operations and organization
- **Config Loader**: Configuration parsing and validation
- **Weather API**: Multi-provider weather integration

### Web App Architecture
- **Frontend**: Component-based React with TypeScript
- **Backend**: FastAPI with SQLAlchemy ORM
- **Shared**: Type definitions and API contracts
- **Testing**: Jest (frontend) + pytest (backend)

## Import Conventions

### Python
```python
# Standard library first
import sys
import os
from datetime import datetime

# Third-party packages
import requests
from bs4 import BeautifulSoup

# Local imports
from utils.llm_client import LLMClient
from utils.file_manager import FileManager
```

### TypeScript
```typescript
// React and Next.js
import React from 'react'
import { NextPage } from 'next'

// Third-party libraries
import { motion } from 'framer-motion'

// Local components and utilities
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
```