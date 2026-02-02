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
- **Validate**: `openspec validate [id] --strict`. **Wait for human "Start" command.**
- **Language**: Respond in the same language as the user's prompt (Mirroring).

---

## 2. The Three-Stage Workflow

### Stage 1: Change Creation (Planning)
**When**: Feature additions, breaking changes, architecture shifts, or security updates.
1. **Context Discovery**: Read `openspec/project.md` and relevant `specs/`.
2. **Scaffold**: Create `openspec/changes/<change-id>/`.
3. **Drafting**:
   - `proposal.md`: Clear "Why", "What", and "Impact" (list affected files/specs).
   - `tasks.md`: Atomic, sequential TODOs (`- [ ]`).
   - `design.md`: **Mandatory** for cross-cutting changes, new dependencies, or database migrations.
4. **Validation**: Run `openspec validate <id> --strict`.
5. **Approval Gate**: Do not execute code until the plan is reviewed and approved.

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

### 4.1 Architecture Decision Records (ADR)
For major technical choices (e.g., picking a DB client, auth provider):
- Record decisions in `docs/adr/YYYY-MM-DD-title.md`.
- Reference the ADR in the OpenSpec `proposal.md`.

### 4.2 Communication Protocol
- **Language Mirroring**: AI agents MUST respond in the same language as the user's most recent prompt.
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

This project is a high-autonomy environment. AI agents are encouraged to use specialized skills and sub-agents to maintain focus and context efficiency.

- **Mandatory Reference**: Read `docs/guides/agentic-environment.md` to understand your full arsenal.
- **Key Concepts**:
    - **Skills**: Use `playwright` for browsers, `git-master` for commits, and `frontend-ui-ux` for premium designs.
    - **Delegation**: Use `delegate_task()` to offload work. Use **Categories** (e.g., `visual-engineering`) for execution and **Sub-agents** (e.g., `oracle`, `librarian`) for specialized research.
    - **Loops**: Use `/ulw-loop` for autonomous progress until a task is 100% complete.
- **LSP Integration**: Always use provided LSP and AST-grep tools for safe refactoring instead of manual regex.

## 7. Troubleshooting & Self-Audit

### Pre-Submission Checklist (AI Internal)
- [ ] Does this file exceed 300/400 lines?
- [ ] Are all secrets in `.env`?
- [ ] Did I use `#### Scenario:` correctly?
- [ ] Am I using the correct language for response?
- [ ] Did I run `openspec validate`?

### Common Error Fixes
- **"No deltas found"**: Check if `## ADDED Requirements` header exists.
- **"Missing Scenario"**: Ensure 4 hashtags (`####`) are used.
- **"Target path not found"**: Ensure `mkdir -p` was run for the change directory.

Remember: **Specs are the only truth. Code is an implementation detail. Keep them in sync.**
