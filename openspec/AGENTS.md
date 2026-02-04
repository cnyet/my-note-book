# OpenSpec Detailed Development Instructions

> **CRITICAL: Language Policy**
> AI agents MUST respond in the same language as the user's prompt (e.g., if asked in Chinese, reply in Chinese). Use technical English only for variable names and specific technical terms.

This document defines the mandatory standards for spec-driven development, engineering excellence, and AI communication within this project.

## 1. TL;DR Quick Checklist

- **Search**: `openspec spec list --long` & `openspec list`. Use `rg` for deep content search.
- **Scope**: New capability = New Change ID. Existing capability = Modify existing Spec.
- **ID Strategy**: `verb-kebab-case` (e.g., `add-user-auth`).
- **Files**: `proposal.md`, `tasks.md`, `design.md` (if complex), and delta specs.
- **Grammar**: `SHALL/MUST` for requirements. `#### Scenario:` for acceptance criteria.
- **Validate**: `openspec validate [id] --strict`.
- **Handshake Protocol**: Initiate formal handshake via orchestration protocol when receiving user intent. Follow the handshaking process: acknowledge, confirm scope, await explicit start command before proceeding.
- **Language**: Respond in the same language as the user's prompt (Mirroring).

---

## 2. The Three-Stage Workflow

### Stage 1: Change Creation (Planning)
**When**: Feature additions, breaking changes, architecture shifts, or security updates.
1. **Context Discovery**: Read `openspec/project.md` and relevant `specs/`. Assess impact on orchestration protocols and agent memory systems.
2. **Scaffold**: Create `openspec/changes/<change-id>/`.
3. **Drafting**:
   - `proposal.md`: Clear "Why", "What", and "Impact" (list affected files/specs).
   - `tasks.md`: Atomic, sequential TODOs (`- [ ]`).
   - `design.md`: **Mandatory** for cross-cutting changes, new dependencies, or database migrations.
4. **Validation**: Run `openspec validate <id> --strict`.
5. **Approval Gate**: Do not execute code until the plan is reviewed and approved. Document potential impacts on agent communication and state management.

### Stage 2: Implementation (Execution)
**Goal**: Atomic, verifiable progress.
1. **Read-First**: Consume `proposal.md` and `design.md` to understand context.
2. **Step-by-Step**: Execute `tasks.md` sequentially. Do not jump ahead.
3. **Real-time Status**: Mark `- [x]` only when a task is truly completed and tested.
4. **Fast-Track**: Bug fixes (restoring spec behavior) and typos can bypass proposals but must be atomic.

### Stage 3: Archiving (Closing)
**Goal**: Maintain the "Single Source of Truth".
1. **Verification**: Confirm build/lint/test pass.
2. **Merge**: `openspec archive <change-id> --yes`.
3. **Cleanup**: Run `openspec validate --strict` to ensure the new global state is valid.

---

## 3. Engineering excellence & Constraints

### 3.1 Code Architecture (GEMINI Standards)
- **Scale Limits**:
    - Dynamic Languages (TS/Python): Max **300 lines** per file.
    - Static/Layout (CSS/HTML): Max **400 lines** per file.
    - Directory Complexity: Max **8 files** per folder. Refactor if exceeded.
- **Logic Complexity**:
    - Functions: Max **50 lines**.
    - Parameters: Max **5**.
    - Nesting: Max **3 levels**.
    - Booleans: Prefix with `is/has/can` (e.g., `isValid`).

### 3.2 Framework Standards
- **Frontend (Next.js 15.4)**:
    - Prefer **Server Components** by default.
    - Use `lucide-react` for icons and `uv-ui` components (internal design system).
    - **UI Verification**: Implementation **MUST** reference high-fidelity mockups and component designs located in `frontend/design-assets/` to ensure visual fidelity.
    - Styling: Vanilla CSS or requested Tailwind (check version).
- **Backend (FastAPI)**:
    - Pydantic v2 for schemas.
    - Dependency Injection for DB sessions and auth.
    - RESTful patterns: Standardized JSON responses.

### 3.3 Security & Environment
- **Secrets**: **ZERO** hardcoding. Use `.env`.
- **Validation**: Mandatory server-side input filtering and sanitization.
- **Error Handling**: No silent failures. Always log context to `/logs`.

---

## 4. Documentation & Communication

- **Core Guides**: [docs/guides/README.md](../docs/guides/README.md) (Standard Workflows & Best Practices)

### 4.1 Architecture Decision Records (ADR)
For major technical choices (e.g., picking a DB client, auth provider):
- Record decisions in `docs/adr/YYYY-MM-DD-title.md`.
- Reference the ADR in the OpenSpec `proposal.md`.

### 4.2 Communication Protocol
- **Language Mirroring**: AI agents MUST respond in the same language as the user's most recent prompt.
- **Orchestration Communication**: When acting as background agents, ensure communication follows the orchestration protocol with proper message routing through the Agent Message Bus.
- **Clarification**: If a request is ambiguous, ask **1-2** high-quality questions before scaffolding. Do not guess.
- **Tone**: Professional, collaborative, and proactive.

---

## 5. Spec & Tooling Reference

### 5.1 Critical Formatting Rules
- **Scenario Header**: **MUST** use `#### Scenario: Name`. (No bold, no bullets).
- **Wording**: Use `SHALL` or `MUST`.
- **MODIFIED Requirement**: Must contain the **entire** block (Header + Scenarios) to avoid data loss during archival.

### 5.2 CLI Command Palette
| Task | Command |
| :--- | :--- |
| **List Specs** | `openspec spec list --long` |
| **List Changes** | `openspec list` |
| **View Change** | `openspec show <id> --json` |
| **Validate All** | `openspec validate --strict` |
| **Search Requirements** | `rg -n "Requirement:\|Scenario:" openspec/specs` |

## 6. Agentic Environment & Capabilities

This project operates with a **Mandatory Priority Hierarchy** for capability usage. AI agents MUST evaluate and prioritize specialized tools over manual implementation:

**PRIORITY HIERARCHY:**
1. **Specialized Skills**: Use `playwright`, `git-master`, `frontend-ui-ux`, `prompt-optimization`, etc.
2. **Specialized Agents**: Delegate to `oracle`, `librarian`, `metis`, `prometheus` via `delegate_task()`.
3. **Integrated Tools**: Use LSP, AST-grep, WebFetch, Google Search for research and refactoring.
4. **Direct Implementation**: Only if no specialized capability exists for the task.

- **Mandatory Reference**: Read `docs/guides/agentic-environment.md` and `docs/guides/opencode-workflows.md` to understand your full arsenal and command workflows.
- **Key Concepts**:
    - **Skills First**: Before writing any code, check if a specialized skill can handle the logic or provide best practices.
    - **Delegation**: Use `delegate_task()` to offload work. Use **Categories** (e.g., `visual-engineering`) for execution and **Sub-agents** (e.g., `oracle`, `librarian`) for specialized research. Ensure all delegated work is properly reported back through the orchestration protocol and logged to the message bus.
    - **Loops**: Use `/ulw-loop` for autonomous progress until a task is 100% complete.
- **Orchestration Integration**: When delegating tasks, ensure proper communication through the Agent Message Bus and store relevant context in Agent Memories for persistence.
- **LSP Integration**: Always use provided LSP and AST-grep tools for safe refactoring instead of manual regex.

## 7. Troubleshooting & Self-Audit

### 7.1 Automatic Persistence Protocol

Before executing a compaction skill (e.g., conversation-accuracy-skill) or switching tasks, the agent SHALL perform a semantic scan of the current history. Identified "Crystallized Knowledge" (decisions, logic shifts, major pitfalls) MUST be appended to `.sisyphus/notepads/` immediately. This is a mandatory safety step to prevent context loss during history truncation.

All AI agents operating within this framework must implement pre-compaction synchronization to preserve valuable insights. This protocol ensures that critical knowledge gained during long-form conversations is automatically persisted before any session compaction or task transition occurs. The process involves:
- Scanning the conversation history for significant decision points
- Identifying breakthrough moments or problem-solving insights
- Extracting important architectural or technical considerations
- Persisting this "crystallized knowledge" to the designated notepads directory

### Pre-Submission Checklist (AI Internal)
- [ ] Does this file exceed 300/400 lines?
- [ ] Are all secrets in `.env`?
- [ ] Did I use `#### Scenario:` correctly?
- [ ] Am I using the correct language for response?
- [ ] Did I run `openspec validate`?
- [ ] Have I updated relevant Agent Memories with new context/state?
- [ ] Were all agent communications logged to the Message Bus appropriately?
- [ ] Does the implementation respect the orchestration protocol?
- [ ] Have I performed the pre-compaction sync to save crystallized knowledge to `.sisyphus/notepads/`?

### Common Error Fixes
- **"No deltas found"**: Check if `## ADDED Requirements` header exists.
- **"Missing Scenario"**: Ensure 4 hashtags (`####`) are used.
- **"Target path not found"**: Ensure `mkdir -p` was run for the change directory.
- **Orchestration Failures**: 
  - **Agent Deadlock**: Check for circular dependencies in agent delegation; ensure proper timeout mechanisms
  - **Stale Memory**: Verify Agent Memory records haven't expired or become inconsistent; use freshness checks
  - **Message Bus Issues**: Confirm messages are properly formatted and routed through the Agent Message Bus
  - **WebSocket Disconnections**: Handle reconnection logic for real-time communication failures

Remember: **Specs are the only truth. Code is an implementation detail. Keep them in sync.**
