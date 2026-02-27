# Capability: home-page Specification

## Purpose

Specifies the requirement for the high-fidelity Home landing page.

## ADDED Requirements

### Requirement: Hero Section Fidelity

The home page MUST implement a Hero section that visually matches the `home-desktop.png` design asset with high precision.

#### Scenario: Visual Restoration Score

- GIVEN the `home-desktop.png` design file
- WHEN comparing the implemented Hero section
- THEN the combined Restore Score (Geometry + Visuals) MUST be $\ge 95$

### Requirement: Content blocks

The home page SHALL include sections for "How It Works" and "Key Features" as defined in the design guide.

#### Scenario: Layout blocks

- GIVEN the home page layout
- WHEN scrolling through the content
- THEN "How It Works" and "Key Features" sections MUST be present
- AND they MUST use `GlassCard` components for their content containers
