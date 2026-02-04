# Plan: Refactor PRD for Agent Orchestration

## TL;DR

> **Quick Summary**: Refactor the Product Requirements Document (PRD) and align design specifications to support a dynamic multi-agent orchestration architecture, real-time WebSocket communication, and SSO identity propagation.
> 
> **Deliverables**:
> - Updated `docs/requirement.md`
> - Updated `docs/design/architecture.md`
> - Updated `docs/design/database-schema.md`
> - OpenSpec Stage 1 Artifacts (Proposal, Tasks, Design Delta)
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential updates required for consistency
> **Critical Path**: PRD Update → Design Alignment → Spec Validation

---

## Context

### Original Request
Refactor PRD to align with Geek-level Agent Orchestration Architecture.

### Interview Summary
**Key Discussions**:
- **Agent Model**: Moving from "iframe-only" to "orchestration-first" where agents can communicate and share context.
- **Real-time**: Replacing polling in Labs with WebSocket/SSE for low-latency state updates.
- **Identity**: Implementing SSO/Identity Propagation to allow seamless agent interaction on behalf of the user.
- **Observability**: Adding requirements for execution tracing, memory persistence, and human-in-the-loop feedback.

**Research Findings**:
- **Current State**: Codebase has models and seed data but lacks business logic and orchestration infrastructure.
- **Industry Standards**: Multi-agent systems require state management, message passing, and clear delegation protocols.

### Metis Review
**Identified Gaps** (addressed):
- **Failed to Consult Metis**: Infrastructure issues prevented Metis call.
- **Self-Resolved**: 1) Added requirement for WebSocket reconnection logic; 2) Defined SSO as "JWT-based Identity Propagation"; 3) Explicitly excluded actual implementation code from this PRD phase.

### Auto-Resolved Gaps
- **Broken Imports in Seed Script**: Added a task to align the seeding script with the new directory structure, as it's foundational for testing agents.

### Defaults Applied (override if needed)
- **Identity Propagation**: Assumed a JWT-based protocol for cross-agent authentication.
- **Message Broker**: For MVP, orchestration communication will use a lightweight in-memory broker with FastAPI WebSockets.

### Technical Debt / Pre-flight Fixes
- **Seed Script Alignment**: The `backend/src/scripts/seed.py` currently has broken imports due to directory restructuring. This must be fixed before functional verification of agents can proceed.

---

## Work Objectives

### Core Objective
Transform the project from a static tool directory into a dynamic agentic orchestration platform through requirement and design refactoring.

### Concrete Deliverables
- `docs/requirement.md`: Refactored sections 2.1.2 (Agents), 2.1.4 (Labs), and 3.4 (Database/Memory).
- `docs/design/architecture.md`: Updated to include Orchestration Engine and WebSocket Server components.
- `docs/design/database-schema.md`: Added tables for Agent State, Conversation History, and Message Logs.
- `openspec/changes/refactor-prd/`: Complete proposal and task artifacts.

### Definition of Done
 - [x] `docs/requirement.md` updated with "Orchestration" focus.
 - [x] Technical stack consistent (FastAPI + WebSocket) across all docs.
 - [x] `openspec validate refactor-prd --strict` passes.

### Must Have
- Definition of a "Message Bus" or "Event Stream" for agent communication.
- Requirement for "Identity Propagation" (SSO).
- WebSocket requirement for real-time state.
- Memory and Observability requirements.

### Must NOT Have (Guardrails)
- NO actual Python/Next.js code implementation (Planning phase only).
- NO external Auth providers mentioned yet (Keep it generic "SSO").
- NO change to the SQLite decision for MVP.

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision
- **Infrastructure exists**: YES (Markdown/OpenSpec)
- **Automated tests**: None (Documentation update)
- **Framework**: `openspec validate`

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

Scenario: PRD Content Validation
  Tool: Bash (grep/openspec)
  Preconditions: Requirement file updated
  Steps:
    1. grep "WebSocket" docs/requirement.md → Assert found
    2. grep "Orchestration" docs/requirement.md → Assert found
    3. openspec validate refactor-prd --strict → Assert exit 0
  Expected Result: Document contains new requirements and passes strict validation.
  Evidence: Terminal output captured

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately):
└── Task 1: Refactor docs/requirement.md

Wave 2 (After Wave 1):
├── Task 2: Align docs/design/architecture.md
└── Task 3: Update docs/design/database-schema.md

Wave 3 (After Wave 2):
└── Task 4: Final OpenSpec Validation

Critical Path: Task 1 → Task 2 → Task 4

---

## TODOs

- [x] 1. Refactor `docs/requirement.md` for Orchestration

  **What to do**:
  - Update Section 1.1 (Product Positioning) to emphasize "Orchestration Platform".
  - Refactor Section 2.1.2 (Agents) to replace "iframe" with "Orchestration Protocol".
  - Refactor Section 2.1.4 (Labs) to replace "Polling" with "WebSocket".
  - Add Section 2.3 (System Capabilities) for Memory, Observability, and SSO.
  - Remove all Node.js references and confirm FastAPI.

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: [`conversation-accuracy-skill`]
  - **Reason**: Requires high-density technical writing and context preservation.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: 2, 3

  **References**:
  - `docs/requirement.md` - Current source
  - `docs/ideas-draft.md` - Context for vision

  **Acceptance Criteria**:
  - [x] `grep -i "orchestration" docs/requirement.md` returns results.
  - [x] Section 2.1.2 mentions "Message Passing" or "Context Sharing".
  - [x] Section 2.1.4 mentions "WebSocket".

- [x] 2. Align `docs/design/architecture.md`

  **What to do**:
  - Add "Orchestration Engine" to the system diagram (text description).
  - Define WebSocket server responsibilities.
  - Add "Identity Propagation" to the Security layer.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Blocked By**: 1

  **Acceptance Criteria**:
  - [x] Document contains "Orchestration Engine" description.

- [x] 3. Update `docs/design/database-schema.md`

  **What to do**:
  - Add `agent_messages` table for communication logs.
  - Add `agent_memories` table for long-term state.
  - Add `user_identities` or update `users` for SSO tokens.

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
  - **Reason**: Requires logical consistency in relational design.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Blocked By**: 1

  **Acceptance Criteria**:
  - [x] Table `agent_messages` exists in document.

- [x] 4. Final OpenSpec Validation

  **What to do**:
  - Run `openspec validate refactor-prd --strict`.
  - Fix any dangling references or BDD syntax errors.

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: 2, 3

  **Acceptance Criteria**:
  - [x] `openspec validate` returns "OKAY".

---

## Success Criteria

### Verification Commands
```bash
grep "WebSocket" docs/requirement.md  # Expected: contains requirement
openspec validate refactor-prd --strict  # Expected: OKAY
```

### Final Checklist
 - [x] Agents are defined as collaborative participants.
 - [x] WebSocket is the real-time standard.
 - [x] SSO and Identity Propagation are included.
 - [x] Tech stack is 100% FastAPI.
