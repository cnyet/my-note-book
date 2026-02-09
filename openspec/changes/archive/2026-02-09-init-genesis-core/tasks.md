# Tasks: Initialize Genesis Core Infrastructure

## Phase 1: Configuration & Foundation

- [ ] **Task 1: Bootstrap Tailwind Config**
  - Update `frontend/tailwind.config.js` with Genesis v2.0 tokens (Colors, Typography).
  - Validation: Verify colors are available in Tailwind IntelliSense or via test div styling.
- [ ] **Task 2: Define Global CSS**
  - Implement base variables and glassmorphism utilities in `frontend/src/app/globals.css`.
  - Validation: Check for presence of `--abyss-black` and other CSS variables.

## Phase 2: Core Components (v-ui)

- [ ] **Task 3: Implement ParticleBg**
  - Create Canvas-based particle background component.
  - Validation: Measure FPS during 10-second run (target 60 FPS).
- [ ] **Task 4: Implement GlassCard & NeonButton**
  - Build foundational UI components with Framer Motion hover effects.
  - Validation: Compare against `home-desktop.png` for transparency and glow accuracy.

## Phase 3: Layout & Routing

- [ ] **Task 5: Global Layout Structure**
  - Implement Root Layout with strict theme enforcement for Main site.
  - Create basic `Header` and `Footer` components.
  - Validation: Verify `dark` class is persistent on `html` tag for frontend routes.

## Phase 4: Verification

- [ ] **Task 6: Visual Audit**
  - Perform visual regression check using `ui-ux-pro-max-skill`.
  - Validation: Score ≥ 95.
