# Design System

## Overview

**Genesis Design System** - My-Note-Book

A cyberpunk-inspired dark interface for an AI multi-agent orchestration platform. High contrast, neon accents, glassmorphism effects, and physics-based motion.

## Colors

- **Primary** (#00f2ff): Electric Cyan - main CTAs, active states, interactive elements
- **Secondary** (#bc13fe): Neon Purple - accent elements, hover effects, glitch aesthetics
- **Surface** (#0a0a0f): Abyss Black - page backgrounds
- **Surface Variant** (#1a1a24): Glass card backgrounds with `backdrop-blur-xl`
- **On-surface** (#f8f8f8): Primary text
- **On-surface Secondary** (#a0a0b0): Secondary text
- **Success** (#00ff88): Fluorescent green for active/online states
- **Warning** (#ffaa00): Amber for warnings
- **Error** (#ff3366): Red for destructive actions

## Typography

- **Headlines**: Outfit, bold (700-900), tight tracking
- **Body**: Inter, regular (400), 16px
- **Mono**: JetBrains Mono / Fira Code, medium (500), 14px - for code and technical data

## Spacing

- **Base unit**: 8px
- **Scale**: 4, 8, 16, 24, 32, 48, 64px

## Components

- **Buttons**: Rounded (8px), primary uses Electric Cyan fill with glow shadow on hover
- **Inputs**: 1px border (`border-white/10`), dark surface background, cyan focus ring
- **Cards**: Glassmorphism (`bg-[#1a1a24]/80 backdrop-blur-xl`), subtle border, hover glow effect
- **Badges**: Full rounded, 10% opacity background with full color text

## Motion

- **Duration**: 150ms (fast), 300ms (normal), 600ms (enter)
- **Easing**: Spring physics (`stiffness: 400, damping: 17`)
- **Enter**: Fade in + slide up 20px

## Do's and Don'ts

- Do use the primary cyan color sparingly - only for the most important actions
- Do apply glassmorphism to all card surfaces
- Do maintain high contrast for accessibility (4.5:1 minimum)
- Don't use flat backgrounds without glass effect
- Don't mix different border radius values inconsistently
- Don't apply generic AI aesthetics (plain gradients everywhere)

---

**Last Updated**: 2026-04-10
