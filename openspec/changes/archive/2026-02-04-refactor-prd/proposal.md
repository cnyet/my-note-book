# Proposal: Refactor PRD for Agent Orchestration

## Why

The current system uses iframe-based integration which has significant limitations:
- Cross-domain restrictions prevent deep integration
- No shared context between agents
- No real-time communication capabilities
- No unified identity propagation

We need to refactor the system to support a dynamic multi-agent orchestration architecture with real-time communication and SSO identity propagation.

## What Changes

Transform the project from a static tool directory into a dynamic agentic orchestration platform through requirement and design refactoring:

- `docs/requirement.md`: Refactored sections 2.1.2 (Agents), 2.1.4 (Labs), and 3.4 (Database/Memory).
- `docs/design/architecture.md`: Updated to include Orchestration Engine and WebSocket Server components.
- `docs/design/database-schema.md`: Added tables for Agent State, Conversation History, and Message Logs.

## Impact

Affected Files:
- `docs/requirement.md`
- `docs/design/architecture.md`
- `docs/design/database-schema.md`
- `docs/ideas-draft.md`

This change enables:
- Multi-Agent communication and context sharing
- Real-time state updates via WebSocket
- Unified identity across agents (SSO)
- Memory persistence and observability