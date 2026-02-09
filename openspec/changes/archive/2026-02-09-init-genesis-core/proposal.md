# Proposal: Initialize Genesis Core Infrastructure

## Status

- **Date**: 2026-02-09
- **Change ID**: `init-genesis-core`
- **Owner**: Antigravity
- **Status**: Draft

## Summary

Building on [PRD v1.1](../../../docs/planning/PRD.md) and the project [Roadmap](../../../docs/planning/roadmap.md), this proposal outlines the initialization of the Genesis Design System v2.0 core. This includes defining global design tokens (colors, typography, spacing), implementing the baseline `v-ui` component library, and establishing the global layout with strict dark mode for the Web Frontend and adaptive theme support for the Admin Dashboard.

## Context

The project has been reset to a "Framework Ready" state. To ensure 100% pixel-perfect implementation as mandated by the PRD, we must first establish a solid design infrastructure. This ensures that all subsequent feature development adheres to the Genesis Design System without ad-hoc styling.

## Proposed Changes

### Frontend Infrastructure

- **Design Tokens**: Update `tailwind.config.js` with Genesis v2.0 color palette (Abyss Black, Cyber-Cyan, Neon-Purple, etc.) and typography (Outfit, Inter, JetBrains Mono).
- **v-ui Components**: Create foundational components:
  - `ParticleBg`: Interactive canvas-based background.
  - `GlassCard`: Standardized container with backdrop blur and glow borders.
  - `NeonButton`: Cyberpunk-styled interactive buttons.
  - `OnlinePulse`: Real-time status indicator.
- **Global Layout**: Implement `RootLayout` with:
  - Strict Dark Mode for Web Frontend.
  - Adaptive theme context providers for Admin Dashboard support.
  - Performance-optimized `Header` and `Footer`.

## Relationship to Other Specs

- Modifies `openspec/specs/frontend/spec.md` to formalize Genesis v2.0 requirements.

## Impact & Scope

- **Scope**: `frontend/` directory, specifically `src/components/v-ui`, `src/app`, and configuration files.
- **Breaking Changes**: None (starting from near-empty state).
- **Performance**: Targets LCP < 1.5s by using optimized Next.js patterns and minimal client-side runtime for animations.
