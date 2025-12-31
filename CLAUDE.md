# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal life assistant AI system designed for 大洪 (Hong), a 37-year-old developer in Shanghai. The project implements 5 specialized AI agents to manage different aspects of daily life through intelligent automation and personalized assistance.

**Primary Goal**: Create an efficient, intelligent, and practical life assistant team of 5 AI agents that provide comprehensive daily support, allowing Hong to focus on core responsibilities while maintaining work-life balance.

## Architecture

### Core System (待实现)
- `main.py` - Daily workflow scheduler and command center
- `config.ini` - API keys and system configuration (Note: secrets.ini for sensitive data should be gitignored)
- `aboutme.md` - User profile containing personal preferences, goals, and family information

### Five Specialized Agents (待实现)
Located in `/agents/` directory:
1. **news_secretary.py** - Morning news briefing (AI/tech focus)
2. **outfit_secretary.py** - Daily outfit recommendations with weather integration
3. **work_secretary.py** - Work task management and prioritization
4. **life_secretary.py** - Lifestyle management (diet, exercise, schedules)
5. **review_secretary.py** - Evening reflection and analysis

### Data Management
- `data/vector_db/` - RAG knowledge base for long-term memory
- `data/daily_logs/YYYY-MM-DD/` - Daily organized logs:
  - `新闻简报.md` - News briefings
  - `今日穿搭.md` - Outfit recommendations
  - `今日工作.md` - Work tasks
  - `今日生活.md` - Lifestyle notes
  - `今日复盘.md` - Daily reflections

### Utility Modules (待实现)
Located in `/utils/`:
- `config_loader.py` - Configuration management
- `llm_client.py` - Unified LLM interface (Claude Sonnet 3.5 primary, Haiku for lightweight tasks)
- `rag_manager.py` - Vector database management
- `file_manager.py` - File operations
- `lark_api.py` - Feishu integration
- `image_generator.py` - Image generation interface (Jimeng AI preferred)

## Key Dependencies

### External APIs Required
- **Anthropic Claude API** - Core LLM functionality (Essential)
- **Jimeng AI API** - Outfit visualization (Strongly Recommended)
- **Feishu Open Platform** - Message push notifications (Optional but Recommended)
- **Weather API** (QWeather/Seniverse/OpenWeatherMap) - Outfit/sport recommendations

### Python Packages
- Core LLM: anthropic
- Web scraping: beautifulsoup4, selenium, feedparser
- RAG Vector DB: chromadb or faiss
- HTTP: requests
- Configuration: configparser
- Scheduling: APScheduler (for advanced automation)

## Workflow Commands

### Manual Workflow Execution
```bash
# Execute specific agent
python main.py --step news      # Run news secretary
python main.py --step outfit    # Run outfit secretary
python main.py --step work      # Run work secretary
python main.py --step life      # Run life secretary
python main.py --step review    # Run review secretary

# Interactive mode
python main.py                  # Enter guided workflow
```

### Knowledge Base Management
- Daily logs auto-generated in `data/daily_logs/YYYY-MM-DD/`
- Vector DB updates happen during review sessions
- aboutme.md updates with work experiences and goals

### Development Tasks
```bash
# Install dependencies
pip install -r requirements.txt

# Run tests (when implemented)
pytest tests/

# Data backup (recommended weekly)
# Implement backup script for data/ to cloud storage
```

## Important Implementation Notes

### RAG Knowledge Structure
The vector database organizes information into:
- `personal_profile` - Basic info, style preferences, goals, habits
- `work_experience` - Project management cases, technical solutions, meeting notes
- `life_records` - Weight changes, diet records, outfit history, exercise data
- `reflection_insights` - Behavior patterns, emotional patterns, key decisions, milestones

### MCP Tool Sets Available
Each agent has access to:
- Base tools: get_weather(), get_date(), read_file(), write_file(), search_in_knowledge()
- Agent-specific specialized tools for their domain

### Design Philosophy
- **Personalization** - Agents learn user preferences through RAG
- **Proactive Engagement** - Agents initiate conversations based on context
- **Deep Reflection** - Review secretary facilitates multi-round guided introspection
- **Growth Together** - System improves through accumulated knowledge

### Current Status
**Phase 1 (MVP) Pending**:
- News secretary (basic version)
- Work secretary (TODO management)
- File management mechanism
- Basic conversation flow

The system is currently in design phase with documentation completed. Implementation of core agents and workflow automation is the immediate priority.
