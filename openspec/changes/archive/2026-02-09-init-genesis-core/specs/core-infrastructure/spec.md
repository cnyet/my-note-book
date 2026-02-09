# Capability: core-infrastructure Specification

## Purpose

Establishes the foundational design system and layout requirements for the Work Agents platform.

## ADDED Requirements

### Requirement: Global Design Tokens (v2.0)

The application MUST implement the Genesis v2.0 design tokens.

#### Scenario: Tailwind Configuration

- GIVEN a `tailwind.config.js` file
- WHEN defining the theme
- THEN it MUST include `abyss-black`, `cyber-cyan`, and `neon-purple`
- AND it MUST define `Outfit` as the heading font and `Inter` as the body font

### Requirement: Theme Enforcement

The system SHALL handle themes differently between segments.

#### Scenario: Web Frontend Theme

- GIVEN the Web Frontend application segments
- WHEN rendering a page
- THEN it MUST be locked to Dark Mode
- AND it SHALL NOT provide a theme toggle

#### Scenario: Admin Backend Theme

- GIVEN the Admin Dashboard application segments
- WHEN rendering a page
- THEN it MUST support both Light and Dark modes
- AND it MUST persist the user preference in `localStorage`

### Requirement: Foundation UI Components (v-ui)

The platform SHALL provide a set of reusable, high-fidelity components.

#### Scenario: Particle Background Performance

- GIVEN the `ParticleBg` component
- WHEN rendered in the browser
- THEN it MUST use Canvas for rendering
- AND it MUST maintain 60 FPS on modern desktop browsers

#### Scenario: Glassmorphism Implementation

- GIVEN the `GlassCard` component
- WHEN applied to a UI section
- THEN it MUST implement `backdrop-blur-xl`
- AND it MUST have a subtle 1-pixel border with low opacity
