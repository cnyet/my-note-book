# OpenSpec Detailed Development Specification

> AI agents must respond in the same language as the user's prompt (e.g., respond in Chinese if asked in Chinese). Variable names and technical terms may remain in English.

> ‼️ Important Note: After all plans are confirmed and conditions are ready to begin implementation, first ask me: "Can I start execution according to the plan?" Then wait for my explicit instruction: "Start Execution" before proceeding. Automatic execution is not allowed without this confirmation. Except for regular conversations outside of tasks or other routine modifications. Remember this!!

This document defines the mandatory standards for specification-driven development, engineering excellence, and AI communication in this project.

## 1. Quick Summary Checklist

- **Search**: `openspec spec list --long` & `openspec list`. Use `rg` for deep content search.
- **Scope**: New features = New Change ID. Existing features = Modify existing specifications.
- **ID Strategy**: `verb-hyphen-lowercase` (e.g. `add-user-auth`).
- **Files**: `proposal.md`, `tasks.md`, `design.md` (if complex) and incremental specifications.
- **Syntax**: `SHALL/MUST` indicates requirements. `#### Scenario:` indicates acceptance criteria.
- **Validation**: `openspec validate [id] --strict`.
- **Language**: Respond in the same language as the user's prompt (mirroring).

---

## 2. Three-Stage Workflow

### Stage 1: Change Creation (Planning)

**Timing**: Feature additions, breaking changes, architectural changes, or security updates.

1. **Context Discovery**: Read `openspec/project.md` and related `specs/`. Assess impact on orchestration protocols and agent memory systems.
2. **Scaffolding**: Create `openspec/changes/<change-id>/`.
3. **Drafting**:
   - `proposal.md`: Clear "why", "what", and "impact" (list affected files/specifications).
   - `tasks.md`: Atomic, sequential to-do items (`- [ ]`).
   - `design.md`: **Required** for cross-domain changes, new dependencies, or database migrations.
4. **Validation**: Run `openspec validate <id> --strict`.
5. **Approval Threshold**: Do not execute code until plans are reviewed and approved. Document potential impacts on agent communication and state management.

### Stage 2: Implementation (Execution)

**Goal**: Atomic, verifiable progress.

1. **First Read**: Absorb `proposal.md` and `design.md` to understand context.
2. **Step-by-Step Execution**: Execute `tasks.md` in sequence. Do not skip.
3. **Real-Time Status**: Mark `- [x]` only after tasks are truly completed and tested.
4. **Fast Track**: Bug fixes (restoring specification behavior) and typos may bypass proposals, but must be atomic.

### Stage 3: Archiving (Closing)

**Goal**: Maintain "single source of truth".

1. **Validation**: Confirm build/formatting/tests pass.
2. **Merge**: `openspec archive <change-id> --yes`.
3. **Cleanup**: Run `openspec validate --strict` to ensure new global state is valid.

---

## 3. Engineering Excellence and Constraints

### 3.1 Code Architecture (GEMINI Standards)

- **Size Limits**:
  - Dynamic languages (TS/Python): maximum **300 lines** per file.
  - Static/layout (CSS/HTML): maximum **400 lines** per file.
  - Directory complexity: maximum **8 files** per folder. Refactor when exceeded.
  - **Exemption Mechanism**: Core configuration files (such as `types.ts`, `constants.ts`) or files with `// @openspec-allow-long-file` comments may have relaxed limits, but reasons must be documented in `design.md`.
- **Logic Complexity**:
  - Functions: maximum **50 lines**.
  - Parameters: maximum **5**.
  - Nesting: maximum **3 levels**.
  - Booleans: Use `is/has/can` prefixes (e.g. `isValid`).

### 3.2 Framework Standards

- **Frontend (Next.js 15.4)**:
  - Default preference for **server components**.
  - Use `lucide-react` for icons, `uv-ui` components (internal design system).
  - **UI Validation**: Implementation **must** reference high-fidelity prototypes and component designs located in `frontend/design-assets/` to ensure visual fidelity.
  - Styling: Native CSS or Tailwind as requested (check version).
- **Backend (FastAPI)**:
  - Use Pydantic v2 for schemas.
  - Use dependency injection for database sessions and authentication.
  - RESTful patterns: Standardized JSON responses.

### 3.3 Security and Environment

- **Secrets**: **Zero** hardcoded values. Use `.env`.
- **Validation**: Required server-side input filtering and sanitization.
- **Error Handling**: Silent failures not allowed. Always log context to `/logs`.

---

## 4. Documentation and Communication

- **Core Guide**: [docs/guides/README.md](../docs/guides/README.md) (standard workflows and best practices)

### 4.1 Architecture Decision Records (ADR)

For major technical choices (e.g., selecting database client, authentication provider):

- Record decision in `docs/adr/YYYY-MM-DD-title.md`.
- Reference ADR in OpenSpec `proposal.md`.

### 4.2 Communication Protocol

- **Language Mirroring**: AI agents must respond in the same language as the user's most recent prompt.
- **Orchestration Communication**: When operating as background agents, ensure communication follows orchestration protocol, routing messages appropriately through agent message bus.
- **Clarification**: If requests are unclear, ask **1-2** high-quality questions before scaffolding. Do not guess.
- **Tone**: Professional, collaborative, and proactive.

---

## 5. Specifications and Tool References

### 5.1 Key Format Rules

- **Scenario Headers**: **Must** use `#### Scenario: Name`. (No bold, no bullet points).
- **Wording**: Use `SHALL` or `MUST`.
- **Modification Requirements**: Must include entire block (header + scenario) to prevent data loss during archiving.

### 5.2 CLI Command Panel

| Task                    | Command                                          |
| :---------------------- | :----------------------------------------------- |
| **List Specs**          | `openspec spec list --long`                      |
| **List Changes**        | `openspec list`                                  |
| **View Change**         | `openspec show <id> --json`                      |
| **Validate All**        | `openspec validate --strict`                     |
| **Search Requirements** | `rg -n "Requirement:\|Scenario:" openspec/specs` |

## 6. Agent Environment and Capabilities

This project employs a **mandatory priority hierarchy** for using capabilities. AI agents must evaluate and prioritize dedicated tools over manual implementation:

**Priority Hierarchy:**

1. **Dedicated Skills**: Use `playwright`, `git-master`, `frontend-ui-ux`, `prompt-optimization`, etc.
2. **Dedicated Agents**: Delegate to `oracle`, `librarian`, `metis`, `prometheus` via `delegate_task()`.
3. **Integrated Tools**: Use LSP, AST-grep, WebFetch, Google Search for research and refactoring.
4. **Direct Implementation**: Only when no dedicated capability exists for the task.

- **Cost Trade-off**: For estimated work under 5 minutes or extremely simple logic, agents should prioritize **3 (Integrated Tools)** or **4 (Direct Implementation)** to avoid resource waste from excessive delegation.
- **Mandatory Reference**: Read `docs/guides/agentic-environment.md` and `docs/guides/opencode-workflows.md` to understand your complete arsenal and command workflows.
- **Key Concepts**:
  - **Skill First**: Before writing any code, check if dedicated skills can handle logic or provide best practices.
  - **Delegation**: Use `delegate_task()` to offload work. Use **categories** (e.g., `visual-engineering`) for execution, **sub-agents** (e.g., `oracle`, `librarian`) for specialized research. Ensure all delegated work reports properly through orchestration protocol and records via message bus.
  - **Loops**: Use `/ulw-loop` for autonomous progress until 100% task completion.
- **Orchestration Integration**: When delegating tasks, ensure proper communication through agent message bus and store relevant context to agent memory for persistence.
- **LSP Integration**: Always use provided LSP and AST-grep tools for safe refactoring instead of manual regex.

## 7. Troubleshooting and Self-Audit

### 7.1 Auto Persistence Protocol

Before executing compression skills (e.g., conversation-accuracy-skill) or switching tasks, agents should perform semantic scanning of current history. Identified "crystallized knowledge" (decisions, logic shifts, major pitfalls) must be immediately appended to `.sisyphus/notepads/`. This is a mandatory safety step to prevent context loss during history truncation.

All AI agents operating within this framework must implement pre-compression synchronization to preserve valuable insights. The process includes:

- **Core Decision Points**: Trade-off analysis for non-obvious design choices.
- **Pitfall Guides**: Non-intuitive bugs that were fixed and their root causes.
- **Architectural Evolution**: Thoughts on scalability for future extensions or limitations of current implementation.
- **Technical Debt**: Logic points compromised for quick delivery.

All "crystallized knowledge" must be persisted to designated notepads directory.

### 7.2 Circuit Breaker Protocol

To prevent AI from getting stuck in error loops, the following circuit breaker mechanisms must be enforced:

- **Consecutive Failures**: Same atomic task failing **3 times** consecutively (e.g., lint errors, test failures), AI must stop attempting.
- **Timeout Limit**: Single task execution exceeding estimated duration by **2x**, must enter standby state.
- **Intervention Flow**: After circuit breaker triggers, AI must generate a "failure diagnostic report" (containing attempted solutions, current blocking points, suggested alternatives) and explicitly request human intervention.

### Pre-Submission Checklist (AI Internal)

- [ ] Does this file exceed 300/400 lines?
- [ ] Are all secrets in `.env`?
- [ ] Did I properly use `#### Scenario:`?
- [ ] Did I respond in the correct language?
- [ ] Did I run `openspec validate`?
- [ ] Did I update relevant agent memories with new context/state?
- [ ] Are all agent communications properly recorded to message bus?
- [ ] Does implementation follow orchestration protocol?
- [ ] Did I execute pre-compression sync to save crystallized knowledge to `.sisyphus/notepads/`?

### Common Error Fixes

- **"Diff not found"**: Check if `## ADDED Requirements` header exists.
- **"Missing scenarios"**: Ensure 4 hash symbols (`####`) are used.
- **"Target path not found"**: Ensure `mkdir -p` ran for change directory.
- **Orchestration failures**:
  - **Agent deadlock**: Check circular dependencies in agent delegation; ensure proper timeout mechanisms
  - **Stale memory**: Verify agent memory records are expired or inconsistent; use freshness checks
  - **Message bus issues**: Confirm message formats are correct and properly routed through agent message bus
  - **WebSocket disconnection**: Add reconnection logic for real-time communication failures

Remember: **Specifications are the sole truth. Code is implementation detail. Keep them synchronized.**
