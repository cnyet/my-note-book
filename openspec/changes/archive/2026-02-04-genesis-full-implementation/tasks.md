# Tasks: Genesis Full Implementation

## Wave 1: Foundation (Data & Infrastructure)
- [x] Implement core models: `User`, `Agent`, `Category`, `Tag` in `backend/src/models/`.
- [x] Create initial Alembic migration and apply to `test.db`.
- [x] Setup testing infrastructure (Pytest for backend, Vitest for frontend).
- [x] Configure Tailwind 4 with Genesis design tokens in `frontend/tailwind.config.ts`.
- [x] Seed database with initial data using `backend/src/scripts/seed.py`.

## Wave 2: Identity & Authentication
- [x] Implement local login/register API with JWT tokens.
- [x] Implement OAuth 2.0 backend handlers (GitHub, Google).
- [x] Create Genesis-style Login and Register pages.
- [x] Implement JWT propagation middleware for WebSocket and API.

## Wave 3: Content & Editor
- [x] Implement Blog, Tools, and Labs CRUD APIs on the backend.
- [x] Integrate Tiptap editor in the frontend Admin area.
- [x] Implement media upload service for images/assets.

## Wave 4: UI/UX Restoration (The 5 Pages)
- [x] Implement Genesis Home page with particle effects and kinetic slogans.
- [x] Implement Agents page using Orchestration Protocol.
- [x] Implement Blog list and detail pages with Markdown rendering.
- [x] Implement Tools and Labs pages with category filtering.

## Wave 5: Advanced Systems & Deployment
- [x] Implement Persistent Agent Memory system.
- [x] Implement Agent Message Bus for cross-agent communication.
- [x] Implement Admin Dashboard UI for full platform management.
- [x] Finalize Docker and Nginx production configurations.
- [x] Perform full system verification and quality audit.
