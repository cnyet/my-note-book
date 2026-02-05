# Design: Genesis UI Refactor V2.0

## Architectural Overview
The Genesis UI V2.0 is built on a foundation of "Abyss/Electric/Kinetic" aesthetics. The architecture focuses on maximizing visual fidelity while maintaining high performance through modern browser capabilities and React 19's concurrent features.

## Core Design Tokens

### Color Palette (Electric Accents)
- **Primary**: `#00f2ff` (Cyan/Electric)
- **Secondary**: `#bc13fe` (Purple/Accent)
- **Background**: Deep Abyss gradients (Black/Navy)
- **Surface**: Glassmorphism layers with variable translucency.

### Typography
- **Headers**: `Outfit` (Refined, modern)
- **Body**: `Inter` (Readable, clean)
- **Monospace**: `JetBrains Mono` (Geek/Dev aesthetic)

## Component Strategy

### 1. Kinetic Interaction Engine
- **Magnetic Buttons**: Uses a custom React hook `useMagnetic` to track cursor proximity and apply subtle CSS transforms.
- **Spring Physics**: All transitions use Framer Motion with spring configurations for "kinetic" feel.

### 2. Particle Physics System
- **Implementation**: Canvas-based or CSS `@property` optimized particle system.
- **Interaction**: Particles react to mouse movement (repulsion/attraction) and scroll depth.

### 3. Glassmorphism Architecture
- **Standard Glass**: `backdrop-filter: blur(8px) saturate(180%)`.
- **Elevated Glass**: Multiple layers with subtle borders and internal glows for 3D depth.

### 4. Code Block Rendering
- Integration with `prismjs` or `shiki` for high-quality syntax highlighting.
- Custom "Genesis" theme following the "Tomorrow Night" dark scheme.

## Design Inspiration & References
Implementation SHALL reference the following for modern UI patterns and kinetic interactions:
- **Checkmarx.dev**: For sophisticated layout patterns and grid systems.
- **Clawdbotai.co**: For advanced interactive elements and visual hierarchy.
- **Genesis Assets**: Reference mockups in `frontend/design-assets/` for exact visual fidelity.

## Performance Optimizations
- **React 19 Concurrent Rendering**: Offloading heavy UI updates to transitions.
- **Next.js 15 Partial Prerendering (PPR)**: Faster initial loads for dynamic pages.
- **Lazy Loading**: Using `next/dynamic` for heavy animation components (Particles, 3D cards).
- **GPU Acceleration**: Leveraging `transform: translateZ(0)` and `will-change` appropriately.

## Accessibility (A11y)
- **Reduced Motion**: Respect `prefers-reduced-motion` media query to simplify or disable intensive animations.
- **Contrast**: Ensuring text meets AA standards against abyss backgrounds.
- **Focus States**: High-visibility focus indicators integrated with the "Electric" accent colors.
