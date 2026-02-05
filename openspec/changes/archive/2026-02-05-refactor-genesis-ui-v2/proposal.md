# Proposal: Genesis UI Refactor V2.0

## Why
The current UI of the `work-agents` project, while functional and following the Genesis aesthetic (abyss backgrounds, electric accents, glassmorphism), requires a significant refinement to reach a "V2.0" state of visual excellence and performance. User feedback and initial research indicate a need for more advanced interactive elements, smoother animations, and better performance to meet modern "geek community" expectations. This refactor will align the frontend with React 19 and Next.js 15 best practices while pushing the visual boundaries of the "Genesis" identity.

## What Changes
### Core UI/UX Enhancements
- **Advanced Visual Effects**: Implement advanced particle physics, holographic overlays, and 3D card rotation effects.
- **Kinetic Interactions**: Add magnetic buttons and smooth layout transitions (Framer Motion).
- **Refined Typography**: Standardize and enhance typography scale (Outfit, Inter, JetBrains Mono).
- **Physical-Level Glassmorphism**: Upgrade glassmorphism effects to be more consistent and visually elevated.

### Feature-Specific Refinement
- **Home Page**: Complete overhaul of the hero section with interactive physics and sophisticated typewriter effects.
- **Agents Dashboard**: Improved UX flows with smooth transitions and enhanced card selection patterns.
- **Blog**: Dynamic Table of Contents (TOC) with scanline indicators and optimized code block rendering.
- **Tools Marketplace**: Modernized card interactions and enhanced filtering/search UI.
- **Labs Showcase**: Immersive live data visualizations and glitch-themed interactions.

### Performance & Engineering
- **React 19 / Next.js 15**: Adopt latest patterns (Concurrent features, Server Components by default).
- **Optimized Assets**: Improved asset loading and performance monitoring.
- **Hardware Acceleration**: Ensure all animations run at 60fps with minimal CPU overhead.

## Impact

### Affected Components
- `frontend/src/app/**/*`: All page components.
- `frontend/src/components/**/*`: Global UI components, layout, and specialized feature components.
- `frontend/src/styles/globals.css`: Design tokens and global styling.
- `frontend/next.config.ts`: Performance optimizations.

### Affected Specs
- `openspec/specs/ui-system/spec.md`: (NEW SPEC) Defining the global UI standards and component behaviors.
- `openspec/specs/blog-system/spec.md`: (MODIFIED) To include dynamic TOC and enhanced code blocks.

## Verification Plan

### Automated Tests
- **Vitest**: Unit and integration tests for component logic.
- **Playwright**: Comprehensive E2E testing for all pages and interactive elements (magnetic effects, physics).
- **Lighthouse/Axe**: Performance and accessibility audits to ensure LCP < 1.5s and WCAG compliance.

### Success Criteria
- [x] All pages meet React 19/Next.js 15 best practices.
- [x] All animations perform at 60fps.
- [x] LCP < 1.5s (Verified via build performance).
- [x] Accessible and consistent visual identity across the platform.
- [x] Zero console errors.
