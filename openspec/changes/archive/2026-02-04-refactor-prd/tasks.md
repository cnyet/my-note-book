# Tasks: Refactor PRD for Agent Orchestration

- [x] 1. Refactor `docs/requirement.md` for Orchestration
  - Update Section 1.1 (Product Positioning) to emphasize "Orchestration Platform"
  - Refactor Section 2.1.2 (Agents) to replace "iframe" with "Orchestration Protocol"
  - Refactor Section 2.1.4 (Labs) to replace "Polling" with "WebSocket"
  - Add Section 2.3 (System Capabilities) for Memory, Observability, and SSO
  - Remove all Node.js references and confirm FastAPI

- [x] 2. Align `docs/design/architecture.md`
  - Add "Orchestration Engine" to the system diagram (text description)
  - Define WebSocket server responsibilities
  - Add "Identity Propagation" to the Security layer

- [x] 3. Update `docs/design/database-schema.md`
  - Add `agent_messages` table for communication logs
  - Add `agent_memories` table for long-term state
  - Add `user_identities` or update `users` for SSO tokens

- [x] 4. Final OpenSpec Validation
  - Run `openspec validate refactor-prd --strict`
  - Created proper OpenSpec structure with deltas and scenarios