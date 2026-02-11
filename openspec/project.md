# Project Context: Work Agents

## Purpose

Work Agents is a modern AI multi-agent orchestration platform designed for the geek community, supporting inter-agent collaboration and communication, real-time status synchronization, and unified identity authentication. The platform implements seamless collaboration between agents via the Orchestration Protocol, providing real-time communication capabilities, persistent memory management, and JWT-based identity propagation.

- **Core Requirements**: [docs/planning/PRD.md](../docs/planning/PRD.md) (v1.1 - Frontend Focus)
- **Core Specifications**: [openspec/specs/](./specs/) (defined HOW - Single Source of Truth)

## Tech Stack

- **Frontend**: Next.js 15.5 (App Router), React 19, TypeScript 5+, TailwindCSS 3.x, Framer Motion.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2.
- **Real-time**: WebSocket Server for live updates and agent communication.
- **Database**: SQLite (Local Development).
- **Authentication**: JWT-based identity propagation across agents.
- **AI Tools**: OpenSpec (Spec-driven development), MCP (Model Context Protocol), UI/UX Pro Max Skill, React Best Practices Skill.

## Domain Context

- **Agent Orchestration Engine**: The core engine for multi-agent collaboration, supporting cross-agent message passing and context sharing.
- **Agent Lifecycle**: Managed lifecycle transitions for agents:
  - `OnSpawn`: Initialization, capability registration, and memory attachment.
  - `OnIdle`: State checkpointing and resource suspension.
  - `OnTerminate`: Final memory persistence, cleanup, and broadcast of termination.
- **WebSocket Server**: Provides real-time bidirectional communication capabilities,支持在线状态更新和实时数据流。
- **Identity Propagation**: Unified identity authentication protocol based on JWT.
- **Agent Memory**: Persistent storage for agent states and long-term memories, supporting context continuity.
- **Agent Message Bus**: Implements asynchronous messaging mechanisms between multiple agents, supporting event stream processing.

## Operational Context

- **Resilience Policy**:
  - **Timeouts**: Agent-to-Agent requests MUST have a mandatory 30s timeout.
  - **Backpressure**: The Message Bus SHALL implement buffering limits.
  - **Error Propagation**: Failures SHALL be categorized as `Transient` or `Fatal`.
- **Environment Parity**:
  - Development: SQLite.
  - Production: PostgreSQL/Vector Database.

## Project Conventions

### Architecture Patterns (v1.1 Standards)

- **Frontend**: Capability-based or Feature-driven organization. 100% Pixel-Perfect implementation required.
- **Backend**: Service-Schema-Model separation. Dependency Injection for DB sessions.
- **Workflow**: Spec-driven development via OpenSpec (Proposal -> Implementation -> Archive).
- **Verification**: Mandatory visual regression check (Score ≥ 95) after UI development.

### Orchestration Patterns

- **Cross-Agent Communication**: All agent interactions MUST follow the Orchestration Protocol.
- **Real-time Updates**: WebSocket connections SHALL be used for live functionality.
- **Identity Propagation**: All authenticated actions across agents MUST maintain consistent JWT-based context.

## Data & Persistence

- **Database**: SQLite file located at `backend/data/my_note_book.db`.
- **Agent Memories**: Agent state and long-term memories persist in database tables.
- **Agent Messages**: Cross-Agent communication logs are stored for observability.

## External Dependencies

- **LLM Provider**: Default uses Google Gemini 1.5 Pro or Flash.
- **MCP Integration**: Must configure Fetch, Google Search, and GitHub MCP.
- **Orchestration Protocol**: LobeChat integration via postMessage/WebSocket.

## Important Constraints

- **Secrets**: Absolutely forbidden to commit .env or any sensitive keys.
- **Performance**: API target response latency ≤ 200ms. LCP < 1.5s.
- **UI/UX**: Strictly follow Genesis Design System v2.0.
