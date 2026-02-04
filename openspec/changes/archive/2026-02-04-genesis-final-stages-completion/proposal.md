# Proposal: Genesis Final Stages Completion

## Why
To fulfill the complete vision of the Work Agents platform as outlined in `implement-plan.md`, a unified standardization of all remaining phases (5 through 9) is required. This ensures that the Blog system, Ecosystem (Tools/Labs), Admin deepening, Deployment, and Advanced System Capabilities (Memory, Messaging, Observability) are implemented with consistent high-fidelity visuals, security, and performance.

## What
- **Phase 5 (Blog)**: Full reader and editor experience with Media service.
- **Phase 6 (Ecosystem)**: Tools/Labs discovery with WebSocket-based live user counting.
- **Phase 7 (Admin Deepening)**: Advanced RBAC, statistics dashboard, and full content management.
- **Phase 8 (Deployment & Optimization)**: Production-ready Docker/Nginx and performance hardening.
- **Phase 9 (System Capabilities)**: Advanced Agent Memory, Message Bus tracing, and Observability.

## Implementation Guardrails (Mandatory)
All implementation tasks under this proposal MUST strictly adhere to the following project constraints:
1. **Prompt Engineering**: Before executing ANY task, the agent MUST call the `prompt-optimization` skill to generate a high-quality, standardized prompt for the specific implementation sub-task.
2. **Coding Standards**: Frontend MUST use `react-best-practices` and `ui-ux-pro-max-skill`.
3. **File Length**: No source file (TS/Python) shall exceed 300 lines. No CSS/HTML file shall exceed 400 lines.
4. **OpenSpec Workflow**: Every atomic change must be verified against its respective `#### Scenario:`.
5. **Identity**: Identity propagation via JWT must be maintained across all cross-agent communications.
6. **UI Fidelity**: Visuals must 100% match the "Genesis" design assets.

## Impact
- **Systems**: Introduction of WebSocket server, internal event bus, and persistent logging.
- **Security**: Hardened RBAC and sanitized media handling.
- **Specs Affected**:
    - `openspec/specs/orchestration-platform/spec.md`: MODIFIED (Added Observability and Bus tracing).
    - `openspec/specs/blog-system/spec.md`: ADDED (Finalized Blog requirements).
    - `openspec/specs/media-service/spec.md`: ADDED (Finalized Media requirements).
    - `openspec/specs/ecosystem/spec.md`: ADDED (Tools, Labs, WebSocket counter).
    - `openspec/specs/admin-deep/spec.md`: ADDED (RBAC, Dashboard).
