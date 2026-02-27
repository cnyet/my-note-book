# Proposal: Implement Core Frontend Pages

## Status

- **Date**: 2026-02-09
- **Change ID**: `impl-frontend-pages`
- **Owner**: Antigravity
- **Status**: ✅ Completed
- **Archived**: 2026-02-27

## Summary

Building on the established [Genesis Core Infrastructure](../../2026-02-09-init-genesis-core/proposal.md), this proposal covers the pixel-perfect implementation of five core frontend modules: Home (Enhancement), Agents, Tools, Labs, and Blog. Each page will be implemented strictly according to the design assets at `frontend/design-assets/` and adhere to the visual verification standards (Score ≥ 95).

## Context

With the core design system and layout in place, the project now focuses on delivering the high-fidelity page experiences defined in [PRD v1.1](../../../docs/planning/PRD.md). This phase transitions the frontend from a framework seat to a functional "geek showcase".

## Proposed Changes

### 1. Home Page Enhancement

- Implement full Hero section with 3D illustration placeholder.
- Add "How It Works" and "Key Features" sections with `GlassCard` layouts.
- Fine-tune responsiveness for mobile.

### 2. Agents Integration Page

- Split-screen implementation: Agent list on left, Chat (LobeChat) on right.
- Holographic agent cards with `OnlinePulse` integration.
- Responsive adaptation for single-column mobile view.

### 3. Tools & Labs

- Implementation of the tiered tool grid with neon categories.
- Creation of the Labs page featuring glitch art effects and experiment cards.

### 4. Blog Module

- List view with category filtering.
- Detail view with `ReactMarkdown` and `react-syntax-highlighter` optimized for Genesis styles.

## Relationship to Other Specs

- Depends on `core-infrastructure` (Genesis Design Tokens).
- Establishes new requirements for `home-page`, `agents-page`, `tools-page`, `labs-page`, and `blog-module`.

## Impact & Scope

- **Directory**: `frontend/src/app/(public)/` (or equivalent structure).
- **Quality**: Mandatory UI restoration scoring per page.
