# ui-system Specification

## Purpose
TBD - created by archiving change refactor-genesis-ui-v2. Update Purpose after archive.
## Requirements
### Requirement: Global Design Language
The platform SHALL implement a consistent "Genesis" aesthetic defined by abyss backgrounds, electric accents, and kinetic movement.

#### Scenario: Color Engine Consistency
- Action: Inspect CSS variables and theme tokens.
- Expectation: Primary accent is `#00f2ff`, secondary is `#bc13fe`. Backgrounds use deep gradients.

#### Scenario: Typography Standards
- Action: Inspect font families on headers, body, and code.
- Expectation: Headers use `Outfit`, body text uses `Inter`, and code/monospaced text uses `JetBrains Mono`.

### Requirement: Kinetic Interaction Components
Interactive components SHALL provide physical-level feedback to user inputs.

#### Scenario: Magnetic Button Interaction
- Action: Hover cursor near a magnetic button (within 40px).
- Expectation: The button element SHIFTS its position toward the cursor by up to 10% of its width/height.

#### Scenario: Layout Transitions
- Action: Navigate between items in a list (e.g., Agent Registry).
- Expectation: The active state indicator SHALL move smoothly to the new selection using spring-based animation.

### Requirement: Advanced Visual Effects
The platform SHALL use high-performance visual effects to enhance immersion.

#### Scenario: Particle Physics System
- Action: Move mouse across the Home page background.
- Expectation: Particle elements SHALL react to mouse proximity with repulsion or attraction effects while maintaining 60fps.

#### Scenario: Holographic Overlays
- Action: Hover over an Agent or Tool card.
- Expectation: A subtle holographic glow and brief glitch effect (approx. 50ms) SHALL appear on the card surface.

