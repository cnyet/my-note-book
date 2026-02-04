# Plan: Genesis Core Initiation (Auth & Models)

## TL;DR

> **Quick Summary**: Implement the core database models and a comprehensive authentication system (JWT + GitHub/Google OAuth) with the high-fidelity "Genesis" UI/UX style.
> 
> **Deliverables**: 
> - Core Models: Agent, Category, Tag, User.
> - Auth Backend: JWT login/register, OAuth integration, Token refresh.
> - Genesis UI: Login & Register pages, Home page restoration.
> - Test Suite: Pytest & Vitest base configuration.
> 
> **Estimated Effort**: Medium (5-7 days)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Models Implementation → Auth Backend → Genesis UI Integration

---

## Context

### Original Request
The user wants to analyze the project, follow `implement-plan.md`, and implement Phase 2 (Auth) and Phase 3 (Models) using the "Genesis" UI style and high-quality coding practices (`react-best-practices`, `ui-ux-pro-max`).

### Interview Summary
**Key Discussions**:
- **Auth**: Simultaneous implementation of Local JWT and GitHub/Google OAuth.
- **UI**: Adhere to "Genesis" spec (Abyss/Electric) using `frontend/design-assets/`.
- **Testing**: Agreed on Vitest (Frontend) and Pytest (Backend).
- **Verification**: Mandatory evidence capture for all tasks.

**Research Findings**:
- **Backend**: FastAPI structure exists, but `backend/src/models/` is missing referenced models from `seed.py`.
- **Frontend**: Next.js 15.4 + Tailwind 4 setup exists.

### Metis Review (Self-Review due to tool failure)
**Identified Gaps** (addressed):
- **Missing Models**: Added explicit tasks to recreate `Agent`, `Category`, and `Tag` models.
- **Test Infra**: Added setup tasks for `pytest` and `vitest`.
- **Genesis UI**: Incorporated `framer-motion` and `lucide-react` as per spec.

---

## Work Objectives

### Core Objective
Initialize the project's core functionality by establishing the data layer and a secure, visually stunning authentication system.

### Concrete Deliverables
- `backend/src/models/{user,agent,category,tag}.py`
- `backend/src/api/v1/auth.py`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/register/page.tsx`
- `frontend/src/app/page.tsx` (Genesis Home)

### Definition of Done
- [ ] All models migrated and seeded successfully.
- [ ] User can register/login via local and OAuth.
- [ ] Login/Register/Home pages match "Genesis" design assets.
- [ ] All tests pass (Backend & Frontend).

### Must Have
- JWT-based identity propagation.
- Genesis UI: Abyss background, Neon accents, Glassmorphism.
- File size < 300 lines (TS/Python).

### Must NOT Have (Guardrails)
- NO hardcoded secrets.
- NO native browser shadows (use Glow).
- NO complex dependencies without ADR.

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL verification is executed by the agent using tools. No human action permitted.

### Test Decision
- **Infrastructure exists**: NO (Base scripts only)
- **Automated tests**: YES (TDD/Tests-after)
- **Framework**: Vitest (Frontend), Pytest (Backend)

### Agent-Executed QA Scenarios (MANDATORY)

Scenario: Local Login Verification
  Tool: Playwright (playwright skill)
  Preconditions: Backend running, test user seeded.
  Steps:
    1. Navigate to: http://localhost:3000/login
    2. Fill: input[name="email"] → "admin@test.com"
    3. Fill: input[name="password"] → "Admin123!"
    4. Click: button[type="submit"]
    5. Wait for: navigation to /dashboard or /agents
    6. Assert: h1 text contains "Welcome"
    7. Screenshot: .sisyphus/evidence/task-auth-login-success.png
  Expected Result: User logged in, redirected to agents/dashboard.
  Evidence: .sisyphus/evidence/task-auth-login-success.png

Scenario: Genesis UI Fidelity Check
  Tool: Playwright (playwright skill)
  Preconditions: Home page rendered.
  Steps:
    1. Navigate to: http://localhost:3000/
    2. Assert: body background-color matches #0a0a0f (Abyss).
    3. Assert: .hero-title has text-transparent and bg-clip-text.
    4. Screenshot: .sisyphus/evidence/task-ui-home-fidelity.png
  Expected Result: Visuals match Genesis spec.
  Evidence: .sisyphus/evidence/task-ui-home-fidelity.png

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately):
├── Task 1: Setup Testing Infrastructure
├── Task 2: Core Models Implementation (User, Agent, Category, Tag)
└── Task 3: Genesis UI Foundation (Styles, Fonts, Tokens)

Wave 2 (After Wave 1):
├── Task 4: Auth Backend Implementation (JWT + OAuth)
└── Task 5: Genesis Auth UI (Login/Register Pages)

Wave 3 (After Wave 2):
└── Task 6: Genesis Home Page Implementation & Integration

Parallel Speedup: ~35%

---

## TODOs

- [ ] 1. Setup Testing Infrastructure
  **What to do**:
  - Backend: Install `pytest`, `pytest-asyncio`, `pytest-cov`, `httpx`.
  - Frontend: Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
  - Create `backend/tests/conftest.py` and `frontend/vitest.config.ts`.
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: [`test-infra`]
  **Parallelization**: Wave 1
  **Acceptance Criteria**:
  - [ ] `cd backend && pytest --version` → Success.
  - [ ] `cd frontend && npx vitest --version` → Success.

- [ ] 2. Core Models Implementation
  **What to do**:
  - Create `backend/src/models/{agent,category,tag}.py` (missing referenced files).
  - Implement `User` model with auth fields.
  - Run Alembic migrations.
  - Verify with `seed.py`.
  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
  - **Skills**: [`database-design`]
  **Parallelization**: Wave 1
  **Acceptance Criteria**:
  - [ ] `cd backend && python src/scripts/seed.py` → Success.
  - [ ] Table existence verified via sqlite3.

- [ ] 3. Genesis UI Foundation
  **What to do**:
  - Configure `tailwind.config.ts` (Tailwind 4) with Genesis tokens: `--bg-abyss`, `--primary`, etc.
  - Import `Outfit` and `JetBrains Mono` fonts.
  - Create base Glassmorphism components in `frontend/src/components/ui/glass`.
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`ui-ux-pro-max`]
  **Parallelization**: Wave 1
  **Acceptance Criteria**:
  - [ ] `globals.css` contains all design tokens.
  - [ ] Font rendering verified in dev server.

- [ ] 4. Auth Backend Implementation
  **What to do**:
  - Implement JWT login/register endpoints in `backend/src/api/v1/auth.py`.
  - Integrate GitHub and Google OAuth providers using `httpx` or `authlib`.
  - Implement Identity Propagation middleware for WebSocket/API.
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`api-design`]
  **Parallelization**: Wave 2
  **Acceptance Criteria**:
  - [ ] API documentation (Swagger) shows all auth endpoints.
  - [ ] `pytest backend/tests/test_auth.py` → PASS.

- [ ] 5. Genesis Auth UI
  **What to do**:
  - Build `login` and `register` pages matching `frontend/design-assets/`.
  - Use `framer-motion` for kinetic transitions.
  - Implement Magnetic buttons and Glow effects.
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`ui-ux-pro-max`, `vercel-react-best-practices`]
  **Parallelization**: Wave 2
  **Acceptance Criteria**:
  - [ ] UI Scenario: Local Login Redirects (verified by Playwright).
  - [ ] Visual Scenario: Glassmorphism check on Login card.

- [ ] 6. Genesis Home Page Implementation
  **What to do**:
  - Implement "The Cyber Portal" Home page.
  - Add "Electric Charge Particle Flow" background.
  - Add Typewriter slogan effect.
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`ui-ux-pro-max`]
  **Parallelization**: Wave 3
  **Acceptance Criteria**:
  - [ ] UI Scenario: Genesis UI Fidelity Check (verified by Playwright).

---

## Success Criteria

### Verification Commands
```bash
./scripts/test.sh  # Run all tests
# Playwright evidence should exist in .sisyphus/evidence/
```

### Final Checklist
- [ ] Core models recreated and operational.
- [ ] JWT + OAuth 2.0 (GitHub/Google) working.
- [ ] Genesis UI visuals (Abyss/Neon) 100% matched.
- [ ] Zero human intervention required for verification.
