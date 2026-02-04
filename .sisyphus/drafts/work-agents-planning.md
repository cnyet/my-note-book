# Draft: Work Agents Implementation Plan

## Requirements (confirmed)
- Follow `implement-plan.md` as the master plan.
- Use OpenSpec workflow for all changes.
- Frontend: Next.js 15.4 (App Router), React 19, Tailwind CSS 4, Shadcn/UI.
- Backend: FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite.
- UI Style: "Genesis" (Abyss/Electric/Glassy/Kinetic) with mockups in `frontend/design-assets/`.
- Technical constraints: Max 300 lines per file (TS/Python), max 400 lines (CSS/HTML).
- Key pages: Home, Agents, Tools, Labs, Blog.
- Special skills to use: `vercel-react-best-practices`, `ui-ux-pro-max`, `prompt-optimization`.

## Technical Decisions
- **Phase 2 Priority**: Authentication system (JWT + OAuth).
- **Identity Propagation**: JWT-based, maintained across all agents.
- **Orchestration Protocol**: Mandatory for cross-agent communication.

## Research Findings
- Project structure confirms FastAPI backend and Next.js frontend.
- `openspec/project.md` and `openspec/AGENTS.md` provide clear governance rules.
- `docs/design/` has specs for architecture, API, and UI/UX.

## Open Questions
- Start with a specific Change ID (e.g., `implement-auth-system`)?
- Implement OAuth (GitHub/Google) in the first pass of Phase 2?
- Priority page for "Genesis" UI?
- Automated test strategy (TDD preference)?

## Scope Boundaries
- INCLUDE: Authentication, Blog, Tools, Labs, Home, Agents, Management Backend.
- EXCLUDE: Blog comments, advanced data analysis.
