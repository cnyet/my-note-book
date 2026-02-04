# Plan: Genesis Full Implementation (End-to-End)

## TL;DR

> **Quick Summary**: A comprehensive roadmap to fully implement the Work Agents platform, from the core identity layer to advanced agentic memory systems, all wrapped in a high-fidelity "Genesis" UI.
> 
> **Deliverables**: 
> - Full Database Schema & Seeding.
> - JWT + OAuth 2.0 Auth System.
> - 5 Genesis-style Pages: Home, Agents, Tools, Labs, Blog.
> - Full CRUD Admin Dashboard.
> - Advanced Systems: WebSocket Memory, Observability, Message Bus.
> - Production-ready Deployment (Docker/Nginx).
> 
> **Estimated Effort**: Large (21-28 days)
> **Parallel Execution**: YES - 8 Waves
> **Critical Path**: Base Models → Auth → Blog CRUD → UI/UX Restoration → Advanced Systems

---

## Work Objectives

### Core Objective
Deliver a production-grade, aesthetically superior multi-agent orchestration platform that strictly follows the Genesis UI spec and OpenSpec engineering standards.

### Concrete Deliverables
- Backend: FastAPI service with SQLite/SQLAlchemy.
- Frontend: Next.js 15.4 App Router.
- Infrastructure: Dockerized deployment.
- Specs: Fully archived OpenSpec deltas.

### Must Have
- Genesis Visuals: Abyss background, Neon Glow, Magnetic Buttons, Glassmorphism.
- Functional WebSocket: Real-time user counting and agent status synchronization.
- Identity Propagation: Seamless JWT sharing across agents.

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL verification is executed by the agent. No human actions like "check manually" are allowed.

### Test Decision
- **Automated tests**: YES (Pytest for Backend, Vitest for Frontend).
- **QA Method**: Agent-Executed QA Scenarios (Playwright for UI, curl for API, tmux for CLI).

---

## Execution Strategy (Waves)

Wave 1: Foundation (Models, Test Infra, Design Tokens)
Wave 2: Identity & Auth (JWT, OAuth Backend/UI)
Wave 3: Content Foundation (Blog CRUD Backend, Tiptap Editor)
Wave 4: UI/UX Masterclass (Home, Blog UI, Layout Transition)
Wave 5: Real-time & Agents (WebSocket Server, Agents Page, Orchestration)
Wave 6: Ecosystem (Tools & Labs, Online Counters)
Wave 7: Management (Admin Dashboard, User Permissions)
Wave 8: Resilience & Delivery (Memory, Message Bus, Docker, Nginx)

---

## TODOs (Summary of Key Tasks)

### Wave 1-2: Core Identity & Data (P0)
- [x] 1. Models & Test Setup
  - Create `{user,agent,category,tag}.py` models.
  - Setup Pytest & Vitest config.
- [x] 2. Auth System (Local + OAuth)
  - JWT register/login, GitHub/Google OAuth.
  - Genesis-style Login/Register UI.

### Wave 3-4: The Content Engine (P1)
- [x] 3. Blog CRUD & Editor
  - FastAPI Blog API, Tiptap rich text integration.
- [x] 4. Genesis UI Restoration
  - Home page particle effects, Blog detail markdown rendering.

### Wave 5-6: Real-time & Ecosystem (P1)
- [ ] 5. WebSocket & Agents
  - LobeChat integration via Orchestration Protocol.
  - Real-time status sync.
- [ ] 6. Tools & Labs
  - Category search, WebSocket online user counter.

### Wave 7-8: Advanced Architecture (P2)
- [x] 7. Admin Dashboard
  - Full CRUD management for all content types.
- [x] 8. System Capabilities
  - Persistent Agent Memory, Message Bus, Observability.
- [ ] 9. Deployment
  - `scripts/deploy.sh`, Docker/Nginx configuration.

---

## Verification Scenarios (Example)

Scenario: WebSocket Real-time Counter
  Tool: Playwright (playwright skill)
  Steps:
    1. Open http://localhost:3000/labs
    2. Assert: .online-counter shows "●" with pulse animation.
    3. Open second browser instance to same URL.
    4. Assert: Counter increments in both instances.
  Expected Result: Live updates without polling.

Scenario: Identity Propagation
  Tool: Bash (curl)
  Steps:
    1. POST /auth/login → Extract JWT.
    2. GET /agents/status with JWT header.
    3. Assert: 200 OK and correct user ID.
  Expected Result: Identity maintained across services.

---

## Success Criteria
- [ ] 100% of `implement-plan.md` tasks marked as `- [x]`.
- [ ] All 5 Genesis pages match `design-assets/`.
- [ ] Zero human intervention in deployment and verification.

