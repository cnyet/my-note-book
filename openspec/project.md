# Project Context: Work Agents

## Purpose
Work Agents is a modern AI multi-agent orchestration platform designed for the geek community, supporting inter-agent collaboration and communication, real-time status synchronization, and unified identity authentication. The platform implements seamless collaboration between agents via the Orchestration Protocol, providing real-time communication capabilities, persistent memory management, and JWT-based identity propagation.

- **Core Requirements**: [docs/requirement.md](../docs/requirement.md) (defined WHAT)
- **Core Specifications**: [openspec/specs/](./specs/) (defined HOW - Single Source of Truth)

## Tech Stack
- **Frontend**: Next.js 15.4 (App Router), React 19, TypeScript 5+, TailwindCSS/Standard CSS.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2.
- **Real-time**: WebSocket Server for live updates and agent communication.
- **Database**: SQLite (Local Development).
- **Authentication**: JWT-based identity propagation across agents.
- **AI Tools**: OpenSpec (Spec-driven development), MCP (Model Context Protocol), Prompt Optimization Skill.

## Domain Context
- **Agent Orchestration Engine**: The core engine for multi-agent collaboration, supporting cross-agent message passing and context sharing.
- **WebSocket Server**: Provides real-time bidirectional communication capabilities, supporting online status updates and real-time data streams.
- **Identity Propagation**: Unified identity authentication protocol based on JWT, achieving identity synchronization across agents and services.
- **Agent Memory**: Persistent storage for agent states and long-term memories, supporting context continuity.
- **Agent Message Bus**: Implements asynchronous messaging mechanisms between multiple agents, supporting event stream processing.
- **Database**: Uses SQLite, file located at `backend/data/work_agents.db`.
- **Storage**: All media files are stored under `frontend/public/uploads`.

## Project Conventions

### Architecture Patterns
- **Frontend**: Capability-based or Feature-driven organization. Server Components by default.
- **Backend**: Service-Schema-Model separation. Dependency Injection for DB sessions.
- **Workflow**: Spec-driven development via OpenSpec (Proposal -> Implementation -> Archive).

### Orchestration Patterns
- **Cross-Agent Communication**: All agent interactions MUST follow the Orchestration Protocol defined in `openspec/specs/orchestration-platform/spec.md`.
- **Real-time Updates**: WebSocket connections SHALL be used for live functionality instead of polling.
- **Identity Propagation**: All authenticated actions across agents MUST maintain consistent JWT-based context.
 - **Message Persistence**: Agent-to-Agent communications SHALL be logged for observability.
## Data & Persistence
- **Database**: SQLite file located at `backend/data/work_agents.db`.
- **Static Assets**: Frontend uploaded files stored in `frontend/public/uploads`.
- **Agent Memories**: Agent state and long-term memories persist in database tables.
- **Agent Messages**: Cross-Agent communication logs are stored for observability.

## External Dependencies
- **LLM Provider**: Default uses Google Gemini 3 Flash.
- **MCP Integration**: Must configure Fetch and Google Search MCP to ensure AI has external information acquisition capabilities.
- **Orchestration Protocol**: LobeChat integration via Orchestration Protocol for cross-agent communication.

## Important Constraints
- **Secrets**: Absolutely forbidden to commit .env or any sensitive keys to the repository.
- **Response**: API target response latency ≤ 200ms.
