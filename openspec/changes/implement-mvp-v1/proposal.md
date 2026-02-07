# Proposal: Implement Work Agents MVP v1.0

## Why

We are building a personal intelligent workspace "Work Agents" based on the confirmed [PRD-03](../../docs/planning/PRD-03.md) and [Roadmap-03](../../docs/planning/roadmap-03.md). The MVP aims to provide a unified interface for 5 core agents (News, Task, Review, Life, Outfit) and integrate LobeChat for general AI conversations.

### Problem Statement

Currently, the user lacks a centralized platform to:

- Aggregate daily AI news automatically.
- Manage daily tasks and life metrics in a structured way.
- Review daily progress and get AI-driven insights.
- Showcase personal development skills.

## What

Implement the Work Agents MVP with the following core components:

### Core Agents

- **News Agent**: Daily crawling of AI news, summarization, and storage.
- **Task Agent**: Q&A based task generation, CRUD management.
- **Review Agent**: Daily summary and user preference extraction.
- **Life Agent**: Health data recording (encrypted) and advice generation.
- **Outfit Agent**: Weather-based outfit recommendation (text/image).

### Integration

- **LobeChat**: Integrated via Iframe for general chat, independent of internal agents.

### Infrastructure

- **Backend**: FastAPI + SQLite + APScheduler + SQLAlchemy + Pydantic.
- **Frontend**: Next.js + Shadcn/UI (Genesis Design System).
- **Deployment**: Docker Compose.

## Impact

- **New Capabilities**:
  - `agent-news`: Crawling and summarization.
  - `agent-task`: Task management.
  - `agent-life`: Encrypted health data management.
  - `agent-outfit`: Weather and outfit recommendation.
  - `agent-review`: Daily review and preference learning.
- **Modified Systems**:
  - Database Schema: New tables for agents.
  - API: New endpoints for agents.
  - Frontend: New pages for Agents, Dashboard, Login.

## Risk Assessment

- **Complexity**: High. Involves 5 distinct agents and Iframe integration.
- **Privacy**: Health data must be encrypted.
- **External Dependencies**: public APIs (News, Weather) may be unstable.

## Alternatives Considered

- **LobeChat Plugin**: Rejected for MVP due to complexity. Chosen Iframe for speed.
- **Celery**: Rejected for pure Python `APScheduler` to keep deployment simple (no Redis required for MVP).
