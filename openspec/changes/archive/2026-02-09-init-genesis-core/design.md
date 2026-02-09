# Design: Genesis Core Infrastructure

## Overview

This design document details the technical implementation of the Genesis Design System v2.0 core within the Work Agents platform. It focuses on composability, performance, and strict fidelity to the design assets.

## Architectural Patterns

### 1. Theme Management

- **Web Frontend**: Enforced `dark` class on the `<html>` element. No theme toggling allowed to maintain visual consistency for the geek showcase.
- **Admin Dashboard**: Implementation of a `ThemeProvider` using `next-themes` or a custom React Context to permit switching between `light` and `dark` modes.
- **Color Variables**: All colors will be defined as CSS variables in `index.css` and mapped to Tailwind tokens in `tailwind.config.js` for dynamic accessibility.

### 2. Component Architecture (v-ui)

- **Atomic Design**: Components will be built as small, single-responsibility units.
- **Framer Motion Integration**: Standardized transition presets (e.g., `spring`, `smooth-in`) will be shared via a `motion-config` utility.
- **Canvas for ParticleBg**: To ensure high performance, the粒子背景 will be implemented using raw Canvas API with an optimized animation loop (requestAnimationFrame), rather than many DOM nodes.

### 3. Layout Structure

- **Next.js App Router**: Utilizing nested layouts to separate the public-facing Web Frontend from the authenticated Admin Dashboard.
- **Server vs Client**: Layouts will be Server Components where possible; interactive elements like `Header` will use `use client` with minimal state.

## Implementation Details

### Color Palette (Genesis v2.0)

| Name        | Hex       | Usage                                |
| :---------- | :-------- | :----------------------------------- |
| Abyss Black | `#0a0a0f` | Main Background                      |
| Cyber-Cyan  | `#00f2ff` | Primary Glow, Interactive Elements   |
| Neon-Purple | `#bc13fe` | AI Interaction, Rare Accents         |
| Surface     | `#1a1a24` | Card Backgrounds (with transparency) |

### Design Restration Scoring (Visual Verification)

A custom script or manual AI verification process will compare implemented components against design assets at `frontend/design-assets/`. The scoring criteria:

- **Geometry**: 40% (Dimensions, spacing, alignment)
- **Visuals**: 30% (Colors, gradients, blurs, shadows)
- **Dynamics**: 20% (Animations, hover states)
- **Responsive**: 10% (Adaptation across breakpoints)

## Trade-offs

- **Complexity vs Fidelity**: Implementing custom Canvas backgrounds and complex glassmorphism effects increases bundle size slightly but is necessary to meet the "WOW" requirement of the PRD.
- **Strict Dark Mode**: May limit accessibility for some users but is a conscious design choice for the primary "geek showcase" brand.
