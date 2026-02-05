# Genesis UI Refactor V2.0

## TL;DR

> **Quick Summary**: Complete refactor of the work-agents frontend to enhance the Genesis aesthetic with refined animations, improved performance, and advanced interactive elements following React 19/Next.js 15 best practices.
> 
> **Deliverables**: 
> - Enhanced Home page with advanced particle physics
> - Revamped Agents dashboard with improved UX flows
> - Optimized Blog with dynamic TOC and enhanced readability
> - Interactive Tools marketplace with 3D card effects
> - Immersive Labs showcase with live data visualization
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Wave 1 (Home) → Wave 5 (Integration) 

---

## Context

### Original Request
Refactor the frontend UI/UX of the `work-agents` project with the "Abyss/Electric/Kinetic" Genesis aesthetic, adhering to `ui-ux-spec.md` and referencing design assets in `frontend/design-assets/`.

### Interview Summary
**Key Discussions**:
- Current implementation already follows Genesis design system (abyss backgrounds, electric accents, glassmorphism)
- Need for V2.0 enhancements to refine and advance the visual experience
- Focus on React 19 / Next.js 15 best practices

**Research Findings**:
- Existing pages: Home, Agents, Blog, Tools, Labs all implemented with Genesis aesthetic
- Current design follows UI/UX spec with #00f2ff, #bc13fe accents, Outfit/JetBrains Mono fonts
- Design assets available for both desktop and mobile versions

### Oracle Review
**Identified Gaps** (addressed):
- Advanced animations and physics simulations need refinement
- Performance optimizations needed for complex visual effects
- Accessibility improvements to current design

---

## Work Objectives

### Core Objective
Enhance the existing Genesis UI with advanced visual effects, improved performance, and refined UX patterns while maintaining the core aesthetic identity.

### Concrete Deliverables
- Enhanced Home page with advanced particle physics and improved hero section
- Improved Agents dashboard with better interaction patterns
- Refined Blog layout with dynamic table of contents
- Modernized Tools marketplace with 3D card interactions
- Immersive Labs showcase with real-time data visualization

### Definition of Done
- All pages meet React 19/Next.js 15 best practices
- All animations perform at 60fps with hardware acceleration
- All interactions pass accessibility standards
- Zero console errors across all pages

### Must Have
- Preserve Genesis aesthetic (deep abyss, electric accents, kinetic movement)
- Improve performance compared to current implementation
- Implement advanced interactive elements (magnetic buttons, glith effects, etc.)

### Must NOT Have (Guardrails)
- Heavy CPU-intensive animations that cause performance drops
- Reduced accessibility compared to current implementation
- Removal of core Genesis design elements

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> This is NOT conditional — it applies to EVERY task, regardless of test strategy.
>
> **FORBIDDEN** — acceptance criteria that require:
> - "User manually tests..." / "사용자가 직접 테스트..."
> - "User visually confirms..." / "사용자가 눈으로 확인..."
> - "User interacts with..." / "사용자가 직접 조작..."
> - "Ask user to verify..." / "사용자에게 확인 요청..."
> - ANY step where a human must perform an action
>
> **ALL verification is executed by the agent** using tools (Playwright, interactive_bash, curl, etc.). No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest.config.ts in frontend/)
- **Automated tests**: Tests-after
- **Framework**: vitest

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Frontend/UI** | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **Performance** | interactive_bash (lighthouse) | Run audits, verify performance metrics |
| **Accessibility** | interactive_bash (axe-core) | Run accessibility audits for compliance |

**Each Scenario MUST Follow This Format:**

```
Scenario: Enhanced particle physics on home page operate smoothly
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:3001
  Steps:
    1. Navigate to: http://localhost:3001
    2. Wait for: particle animation container visible (timeout: 5s)
    3. Monitor: page performance for 30s (FPS should remain >55)
    4. Assert: no dropped frames or jank
    5. Screenshot: .sisyphus/evidence/genesis-home-enhanced.png
  Expected Result: Smooth 60fps particle animation
  Evidence: .sisyphus/evidence/genesis-home-enhanced.png

Scenario: Magnetic buttons respond correctly to hover
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, page loaded
  Steps:
    1. Navigate to: http://localhost:3001
    2. Locate: magnetic button element
    3. Hover over: button with mouse
    4. Assert: button moves toward cursor and inner content shifts
    5. Move mouse away: verify return to original position
  Expected Result: Magnet-like attraction effect
  Evidence: Screenshot of hover state
```

**Evidence Requirements:**
- Screenshots in .sisyphus/evidence/ for UI scenarios
- Performance metrics captured for animation scenarios
- Accessibility reports for compliance scenarios
- Each evidence file named: task-{N}-{scenario-slug}.{ext}

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately):
├── Task 1: Enhanced Home Page
└── Task 2: Refined Agents Dashboard

Wave 2 (After Wave 1):
├── Task 3: Optimized Blog Layout
└── Task 4: Modernized Tools Marketplace

Wave 3 (After Waves 1-2):
└── Task 5: Immersive Labs Showcase

Wave 4 (After All Feature Waves):
├── Task 6: Global Component Refinements
└── Task 7: Performance Optimization

Wave 5 (Final Integration):
└── Task 8: Cross-Page Integration & Testing

Critical Path: Task 1 → Task 6 → Task 8
Parallel Speedup: ~60% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 6, 8 | 2 |
| 2 | None | 6, 8 | 1 |
| 3 | None | 6, 8 | 4 |
| 4 | None | 6, 8 | 3 |
| 5 | None | 8 | 1, 2, 3, 4 |
| 6 | 1, 2, 3, 4 | 8 | None |
| 7 | 6 | 8 | None |
| 8 | 1, 2, 3, 4, 5, 6, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="visual-engineering", load_skills=["ui-ux-pro-max", "react-best-practices"], run_in_background=true) |
| 2 | 3, 4 | dispatch parallel after Wave 1 completes |
| 3 | 5 | single agent after Wave 2 completes |
| 4 | 6, 7 | single agent after Wave 3 completes |
| 5 | 8 | final integration task |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Enhance Home Page with Advanced Particle Physics

  **What to do**:
  - Upgrade particle system to use advanced physics simulation
  - Implement dynamic lighting effects that respond to scroll/mouse
  - Add parallax layers to create depth perception
  - Enhance typewriter animation with more sophisticated cursor effects

  **Must NOT do**:
  - Heavy CPU-intensive animations that cause performance drops
  - Remove existing Genesis aesthetic elements

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: This task requires deep visual design skills and animation expertise to enhance the Genesis aesthetic
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Essential for creating sophisticated visual effects aligned with Genesis aesthetic
    - `react-best-practices`: Needed to ensure animations are optimized for React 19 best practices
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a pure UI/animation task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2) 
  - **Blocks**: [6, 8] (Global refinements and integration depend on this)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/page.tsx:23-43` - Current particle implementation and animation patterns
  - `frontend/src/app/page.tsx:144-152` - Current CSS animation patterns for particle flow
  
  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Check for any shared types that need updating
  - `frontend/src/components/types.ts` - Any component-specific types

  **Test References** (testing patterns to follow):
  - `frontend/src/test/utils.ts:renderWithProviders` - Testing utilities to use for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:2.1` - Color engine and physical-level glassmorphism specs
  - `docs/design/ui-ux-spec.md:3.1` - Magnetic interaction specifications

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For advanced Framer Motion animation parameters
  - Example repo: `github.com/framer/examples/particles` - Reference for advanced particle implementations
  - Three.js: `https://threejs.org/docs` - For potential 3D effects integration

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/app/page.tsx:23-43`: Provides the baseline implementation to enhance, shows current performance considerations
  - `docs/design/ui-ux-spec.md:2.1`: Critical for maintaining consistent color and glassmorphism implementation with Genesis aesthetic
  - `docs/design/ui-ux-spec.md:3.1`: Provides exact specifications for enhanced magnetic effects

  **Technical Implementation**:
  - Use CSS `@property` for hardware-accelerated particle animations 
  - Leverage Framer Motion's reduced motion API for accessibility
  - Implement particle pooling for performance optimization

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Advanced particle physics respond to mouse movement
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3001, home page loaded
    Steps:
      1. Navigate to: http://localhost:3001
      2. Wait for: particle container visible (timeout: 5s)
      3. Move mouse: from left to right across screen
      4. Assert: particles react to mouse proximity with subtle repulsion
      5. Screenshot: .sisyphus/evidence/task-1-particle-physics.png
    Expected Result: Particles exhibit realistic physics behavior near cursor
    Evidence: .sisyphus/evidence/task-1-particle-physics.png

  Scenario: Particle system maintains 60fps during intense activity
    Tool: Playwright (playwright skill) + Performance monitoring
    Preconditions: Dev server running, home page with particle system active
    Steps:
      1. Navigate to: http://localhost:3001
      2. Start FPS monitoring: for 30 seconds
      3. Move cursor rapidly: around screen to trigger intensive particle effects
      4. Assert: Average FPS > 55 during interaction period
      5. Log: Performance metrics to .sisyphus/evidence/performance-home.log
    Expected Result: Smooth performance maintained despite intensive graphics
    Evidence: Performance log file with FPS measurements

  Scenario: Typewriter animation enhanced with cursor effects
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, home page loaded
    Steps:
      1. Navigate to: http://localhost:3001
      2. Wait for: typewriter text element (timeout: 5s)
      3. Monitor: typewriter animation for 10 seconds
      4. Assert: Cursor blinks with pulse effect as specified in UI/UX spec
      5. Screenshot: .sisyphus/evidence/task-1-typewriter-effect.png
    Expected Result: Enhanced typewriter with distinctive Genesis-style cursor
    Evidence: Screenshot showing enhanced typewriter animation
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] Performance logs for particle physics scenarios
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 2. Refine Agents Dashboard with Advanced UX Flows

  **What to do**:
  - Implement magnetic button interactions throughout the agent registry
  - Enhance card selection animations with improved smooth transitions
  - Add holographic overlay effects on hover for agent cards
  - Implement enhanced search functionality with predictive suggestions

  **Must NOT do**:
  - Compromise the existing functional agent selection workflow
  - Remove current Genesis aesthetic elements

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves significant visual enhancements and interactive elements
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Needed for creating sophisticated interactive elements
    - `react-best-practices`: Important for optimizing the enhanced dashboard performance
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a UI/UX task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: [6, 8] (Global refinements and integration depend on this)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/agents/page.tsx:56-89` - Current agent registry implementation
  - `frontend/src/app/agents/page.tsx:92-167` - Current command terminal and animation patterns

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/agent.ts:Agent` - Agent data structure definitions
  - `frontend/src/components/types.ts:AgentCardProps` - Agent card component types

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:3.1` - Magnetic interaction specifications
  - `docs/design/ui-ux-spec.md:3.2` - Agent bridge transition specifications

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For advanced animation parameters
  - Example repo: `github.com/framer/examples/magnetic-buttons` - Reference implementation
  - Tailwind docs: `https://tailwindcss.com/docs` - For advanced utility classes

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/app/agents/page.tsx:56-89`: Baseline for enhancing agent selection flow while preserving functionality
  - `docs/design/ui-ux-spec.md:3.1`: Provides exact specifications for magnetic button implementation
  - `docs/design/ui-ux-spec.md:3.2`: Specifies the enhanced bridge transition requirements

  **Technical Implementation**:
  - Implement mouse tracking with custom hook for magnetic calculations
  - Use CSS transforms for performant button movement
  - Leverage Framer Motion's layout animations for smooth transitions

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Magnetic buttons respond correctly to cursor proximity
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, agents page loaded
    Steps:
      1. Navigate to: http://localhost:3001/agents
      2. Locate: Magnetic button element (e.g., "Initiate Neural Thread")
      3. Move mouse: towards button from 40px distance
      4. Assert: Button shifts 10% toward cursor as specified in UI/UX spec
      5. Move mouse away: verify return to original position
      6. Screenshot: .sisyphus/evidence/task-2-magnetic-button.png
    Expected Result: Button exhibits magnetic attraction behavior
    Evidence: .sisyphus/evidence/task-2-magnetic-button.png

  Scenario: Agent card selection triggers smooth layout animation
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, agents page loaded
    Steps:
      1. Navigate to: http://localhost:3001/agents
      2. Click: on second agent card in registry
      3. Wait for: layout transition to complete (timeout: 2s)
      4. Assert: Active marker moves smoothly to new selection
      5. Assert: Content fades and slides correctly
      6. Screenshot: .sisyphus/evidence/task-2-card-selection.png
    Expected Result: Smooth, visually appealing transition between agent selections
    Evidence: Screenshot showing smooth transition state

  Scenario: Holographic overlay appears on card hover
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, agents page loaded
    Steps:
      1. Navigate to: http://localhost:3001/agents
      2. Hover over: first agent card
      3. Assert: Subtle holographic glow appears as specified
      4. Assert: Glitch effect briefly appears on hover (50ms duration)
      5. Move mouse away: verify effect disappears
      6. Screenshot: .sisyphus/evidence/task-2-holographic-effect.png
    Expected Result: Enhanced visual feedback during card interaction
    Evidence: Screenshot of enhanced hover effect
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] Performance metrics for smoothness of transitions
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 3. Optimize Blog Layout with Dynamic Table of Contents

  **What to do**:
  - Implement sticky table of contents with scanline indicator
  - Add enhanced typography with better readability
  - Implement dynamic content loading for better performance
  - Add enhanced code block rendering with language indicators

  **Must NOT do**:
  - Remove existing blog functionality or data fetching
  - Compromise accessibility of existing blog content

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves significant layout and typography enhancements
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Needed for creating sophisticated content layout and typography
    - `react-best-practices`: Important for optimizing blog performance and rendering
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a UI/UX task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: [6, 8] (Global refinements and integration depend on this)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/blog/page.tsx` - Current blog page implementation
  - `frontend/src/components/blog/BlogCard.tsx` - Current blog card patterns

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/blog.ts:Article` - Blog article data structure
  - `frontend/src/components/types.ts:BlogCardProps` - Component prop types

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:2.4` - Typography architecture specifications
  - `docs/design/ui-ux-spec.md:2.6` - Table of contents indicator specifications

  **External References** (libraries and frameworks):
  - Official docs: `https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API` - For TOC indicator
  - Example repo: `github.com/vercel/examples/blog-toc` - Reference for TOC implementations
  - Syntax highlighter: `https://prismjs.com` - For enhanced code block rendering

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/app/blog/page.tsx`: Baseline for understanding current blog implementation
  - `docs/design/ui-ux-spec.md:2.4`: Provides exact typography specifications for readability
  - `docs/design/ui-ux-spec.md:2.6`: Details the scanline indicator requirements for TOC

  **Technical Implementation**:
  - Use Intersection Observer API for efficient scroll detection
  - Implement dynamic TOC generation from headings in content
  - Use Prism.js or similar for enhanced code syntax highlighting

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Sticky TOC with scanline indicator functions properly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, blog page with multiple articles
    Steps:
      1. Navigate to: http://localhost:3001/blog
      2. Scroll down: until TOC becomes sticky
      3. Assert: TOC remains visible during scroll
      4. Scroll through page: observe active section highlighting
      5. Assert: Scanline indicator moves correctly between sections
      6. Screenshot: .sisyphus/evidence/task-3-toc-indicator.png
    Expected Result: TOC remains accessible and indicator shows current section
    Evidence: .sisyphus/evidence/task-3-toc-indicator.png

  Scenario: Enhanced typography improves readability
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, blog page loaded
    Steps:
      1. Navigate to: http://localhost:3001/blog
      2. Inspect: Text elements' line height, spacing, and font properties
      3. Assert: Line height is 1.8 as specified in UI/UX spec
      4. Assert: Paragraph spacing is 1.5rem as specified
      5. Assert: Font family is Inter as specified in typography spec
      6. Screenshot: .sisyphus/evidence/task-3-typography-improvements.png
    Expected Result: Text elements follow enhanced readability specifications
    Evidence: .sisyphus/evidence/task-3-typography-improvements.png

  Scenario: Enhanced code blocks display language indicators
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, blog with code samples
    Steps:
      1. Navigate to: http://localhost:3001/blog/some-post-with-code
      2. Locate: Code block elements
      3. Assert: Right-top corner shows language tag with JetBrains Mono font
      4. Assert: Theme follows Tomorrow Night dark scheme
      5. Screenshot: .sisyphus/evidence/task-3-enhanced-code-blocks.png
    Expected Result: Code blocks show enhanced styling with language identification
    Evidence: Screenshot showing enhanced code blocks
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] DOM inspections for typography properties
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 4. Modernize Tools Marketplace with 3D Card Effects

  **What to do**:
  - Implement 3D card rotation effects on hover
  - Add enhanced filtering and search with predictive suggestions
  - Create animated category tags with particle effects
  - Implement skeleton loading with enhanced Genesis styling

  **Must NOT do**:
  - Compromise existing tools discovery functionality
  - Remove current Genesis aesthetic elements

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves significant 3D transformation effects and complex animations
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Needed for creating sophisticated 3D interaction effects
    - `react-best-practices`: Important for ensuring smooth 3D transforms
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a UI/UX task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: [6, 8] (Global refinements and integration depend on this)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/tools/page.tsx` - Current tools marketplace implementation
  - `frontend/src/components/tools/ToolCard.tsx` - Assuming tool card component exists

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/tool.ts:Tool` - Tool data structure definitions
  - `frontend/src/components/types.ts:ToolCardProps` - Component prop types

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:2.1` - Color engine and glassmorphism specs
  - `docs/design/ui-ux-spec.md:3.1` - Magnetic interaction specifications (for 3D effects)

  **External References** (libraries and frameworks):
  - Official docs: `https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d()` - For 3D transforms
  - Example repo: `github.com/framer/examples/3d-cards` - Reference for 3D card implementations
  - Framer Motion: `https://framer.com/motion` - For optimized 3D animations

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/app/tools/page.tsx`: Baseline for understanding current tools implementation
  - `docs/design/ui-ux-spec.md:2.1`: Critical for maintaining consistent Genesis styling
  - `docs/design/ui-ux-spec.md:3.1`: Provides foundation for magnetic-inspired 3D effects

  **Technical Implementation**:
  - Use CSS 3D transforms with perspective for realistic card rotations
  - Implement requestAnimationFrame for smooth particle animations
  - Use CSS mask animations for Genesis-style skeleton loading

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: 3D card rotation works smoothly on hover
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, tools page loaded
    Steps:
      1. Navigate to: http://localhost:3001/tools
      2. Hover over: first tool card
      3. Assert: Card rotates 3D with perspective effect
      4. Assert: Rotation is smooth with no jank (60fps minimum)
      5. Move mouse away: verify card returns to original position smoothly
      6. Screenshot: .sisyphus/evidence/task-4-3d-card-rotation.png
    Expected Result: Smooth 3D rotation effect on card hover
    Evidence: .sisyphus/evidence/task-4-3d-card-rotation.png

  Scenario: Category tags show enhanced particle effects
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, tools page loaded
    Steps:
      1. Navigate to: http://localhost:3001/tools
      2. Locate: Category filter tags
      3. Click: on a category tag to activate
      4. Assert: Tag shows enhanced glow effect as per Genesis spec
      5. Assert: Subtle particle animation appears around active tag
      6. Screenshot: .sisyphus/evidence/task-4-enhanced-category-tags.png
    Expected Result: Category tags have enhanced visual feedback
    Evidence: .sisyphus/evidence/task-4-enhanced-category-tags.png

  Scenario: Skeleton loading follows Genesis aesthetic
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, tools page in loading state
    Steps:
      1. Navigate to: http://localhost:3001/tools
      2. Force loading state: tools are still fetching
      3. Locate: Skeleton elements
      4. Assert: Skeletons use glass-standard class with Genesis colors
      5. Assert: Mask animation uses Cyan/Purple cycling as specified
      6. Screenshot: .sisyphus/evidence/task-4-genesis-skeleton.png
    Expected Result: Loading skeletons follow Genesis aesthetic guidelines
    Evidence: .sisyphus/evidence/task-4-genesis-skeleton.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] Performance metrics for 3D transform smoothness
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 5. Immerse Labs Showcase with Real-time Data Visualization

  **What to do**:
  - Enhance online counter with more sophisticated pulsing animation
  - Implement glitch card effects with more complex interference patterns
  - Create live data visualization for active experiments
  - Add immersive background effects that react to data changes

  **Must NOT do**:
  - Compromise existing labs functionality or data display
  - Remove current Genesis aesthetic elements

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves complex real-time visualizations and animation effects
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Needed for creating sophisticated real-time visualization
    - `react-best-practices`: Important for efficient real-time data updates
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a UI/UX task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (after Waves 1-2 complete)
  - **Blocks**: [8] (Final integration depends on this)
  - **Blocked By**: [1, 2, 3, 4] (Need global components from Wave 4)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/labs/page.tsx` - Current labs showcase implementation
  - `frontend/src/components/lab/LabCard.tsx` - Assuming lab card component exists

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/lab.ts:Lab` - Lab data structure definitions
  - `frontend/src/components/types.ts:LabCardProps` - Component prop types

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:2.3` - Glitch card specifications in Labs section
  - `docs/design/ui-ux-spec.md:2.4` - Online counter specifications

  **External References** (libraries and frameworks):
  - Official docs: `https://developer.mozilla.org/en-US/docs/Web/API/WebSocket_API` - For real-time data
  - Example repo: `github.com/chartjs/Chart.js` - For live data visualization
  - Framer Motion: `https://framer.com/motion` - For optimized animations

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/app/labs/page.tsx`: Baseline for understanding current labs implementation
  - `docs/design/ui-ux-spec.md:2.3`: Provides exact specifications for glitch card effects
  - `docs/design/ui-ux-spec.md:2.4`: Details the online counter enhancement requirements

  **Technical Implementation**:
  - Use Web Animations API for precise control over counter animations
  - Implement CSS filters for glitch effects with GPU acceleration
  - Use D3.js or similar for performant live data visualizations

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Online counter shows enhanced pulsing animation
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, labs page loaded, WebSocket connected
    Steps:
      1. Navigate to: http://localhost:3001/labs
      2. Locate: Online counter component
      3. Observe: Pulsing animation for 10 seconds
      4. Assert: Pulse cycles through Cyan/Purple colors as specified
      5. Assert: JetBrains Mono font is used as specified
      6. Screenshot: .sisyphus/evidence/task-5-enhanced-counter.png
    Expected Result: Online counter has sophisticated Genesis-style pulsing
    Evidence: .sisyphus/evidence/task-5-enhanced-counter.png

  Scenario: Glitch card shows complex interference on hover
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, labs page loaded
    Steps:
      1. Navigate to: http://localhost:3001/labs
      2. Hover over: first lab card
      3. Assert: Card shows brief (50ms) glitch interference effect
      4. Assert: Image brightness increases by 20% during hover
      5. Assert: Effect is consistent across all lab cards
      6. Screenshot: .sisyphus/evidence/task-5-glitch-card-effect.png
    Expected Result: Cards show enhanced glitch effects with consistent behavior
    Evidence: Screenshot of glitch effect in action

  Scenario: Live data visualization updates with WebSocket data
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, labs page loaded, WebSocket connected
    Steps:
      1. Navigate to: http://localhost:3001/labs
      2. Simulate: WebSocket data update (via injected script)
      3. Assert: Visualization updates in real-time without lag
      4. Assert: Smooth animations between data transitions
      5. Screenshot: .sisyphus/evidence/task-5-live-visualization.png
    Expected Result: Live data visualization responds instantly to WebSocket updates
    Evidence: Screenshot showing live data visualization
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] Performance metrics for real-time updates
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 6. Refine Global Components with Consistent Genesis Enhancements

  **What to do**:
  - Update navigation bar with enhanced magnetic interaction patterns
  - Implement global glassmorphism improvements with elevated effects
  - Enhance typography across all pages with refined sizing and spacing
  - Create consistent animation timing across all pages using spring constants

  **Must NOT do**:
  - Break existing responsive layouts
  - Remove current Genesis aesthetic elements

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves comprehensive global styling and animation refinements
  - **Skills**: [`ui-ux-pro-max`, `react-best-practices`]
    - `ui-ux-pro-max`: Needed for creating consistent visual design across global components
    - `react-best-practices`: Important for consistent component architecture
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed as this is a UI/UX task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential after Waves 1-2-3)
  - **Blocks**: [8] (Final integration depends on this)
  - **Blocked By**: [1, 2, 3, 4, 5] (Depends on all individual page enhancements)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/components/layout/GenesisLayout.tsx` - Current global layout
  - `frontend/src/app/globals.css` - Current global CSS and Genesis tokens
  - `frontend/src/components/ui/*` - Current UI components if they exist

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/global.ts:LayoutProps` - Global layout types if applicable

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for consistent setup

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:1.2` - Physical-level glassmorphism specifications
  - `docs/design/ui-ux-spec.md:1.3` - Typography architecture specifications
  - `docs/design/ui-ux-spec.md:3.1` - Magnetic interaction specifications

  **External References** (libraries and frameworks):
  - Official docs: `https://tailwindcss.com/docs` - For advanced utility classes
  - Framer Motion: `https://framer.com/motion` - For consistent animation parameters
  - Shadcn/UI: `https://ui.shadcn.com` - For standardized component implementations

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/components/layout/GenesisLayout.tsx`: Baseline for understanding global layout structure
  - `docs/design/ui-ux-spec.md:1.2`: Critical for maintaining consistent glassmorphism across all pages
  - `docs/design/ui-ux-spec.md:3.1`: Provides foundation for global magnetic interaction implementation

  **Technical Implementation**:
  - Use React context for consistent theming across components
  - Implement CSS custom properties for Genesis design tokens
  - Create reusable hooks for magnetic interactions

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Navigation bar shows consistent magnetic interaction
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, any page loaded
    Steps:
      1. Navigate to: http://localhost:3001/agents
      2. Move mouse: toward navigation items
      3. Assert: Items show magnetic attraction within 20px range
      4. Navigate to: http://localhost:3001/blog
      5. Repeat magnetic interaction test
      6. Verify: Consistent behavior across all pages
      7. Screenshot: .sisyphus/evidence/task-6-magnetic-nav.png
    Expected Result: Consistent magnetic navigation across all pages
    Evidence: .sisyphus/evidence/task-6-magnetic-nav.png

  Scenario: Global glassmorphism follows elevated specifications
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, multiple pages loaded
    Steps:
      1. Navigate to: http://localhost:3001/agents
      2. Inspect: Glass card elements CSS properties
      3. Assert: Cards use elevated glass class as specified
      4. Navigate to: http://localhost:3001/tools
      5. Repeat inspection for consistency
      6. Screenshot: .sisyphus/evidence/task-6-elevated-glass.png
    Expected Result: Consistent elevated glassmorphism across all pages
    Evidence: .sisyphus/evidence/task-6-elevated-glass.png

  Scenario: Typography follows consistent Genesis scale
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, multiple pages loaded
    Steps:
      1. Navigate to: http://localhost:3001
      2. Inspect: Typography elements' font families and sizes
      3. Assert: Headers use Outfit font as specified
      4. Assert: Body text uses Inter font as specified
      5. Assert: Monospace uses JetBrains Mono as specified
      6. Navigate to: http://localhost:3001/blog
      7. Verify: Consistent typography scale applied
      8. Screenshot: .sisyphus/evidence/task-6-typography-scale.png
    Expected Result: Consistent typography implementation across all pages
    Evidence: Screenshot showing typography consistency
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] DOM inspections for consistent CSS properties
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 7. Optimize Performance with Advanced Techniques

  **What to do**:
  - Implement code splitting for improved initial load time
  - Optimize animations with React 19 concurrent features
  - Add performance monitoring and optimization metrics
  - Implement lazy loading for offscreen animations

  **Must NOT do**:
  - Compromise visual quality for performance
  - Remove essential animations that define Genesis aesthetic

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `general`
    - Reason: Task involves performance optimization across the entire application
  - **Skills**: [`react-best-practices`]
    - `react-best-practices`: Essential for optimizing React 19 performance patterns
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Not primarily visual in nature
    - `git-master`: Not needed as this is a performance task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential after Task 6)
  - **Blocks**: [8] (Final integration depends on this)
  - **Blocked By**: [6] (Depends on global component refinements)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/app/layout.tsx` - Current app structure for code splitting
  - `frontend/src/app/page.tsx` - Animation patterns to optimize
  - `frontend/next.config.ts` - Current Next.js configuration

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/performance.ts` - Performance metric types if they exist

  **Test References** (testing patterns to follow):
  - `frontend/src/test/setup.ts:test-utils` - Testing utilities for performance tests
  - `frontend/vitest.config.ts` - Current test configuration

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:1.4` - Performance constraints (LCP < 1.5s)
  - `docs/design/ui-ux-spec.md:1.5` - Animation frame rate requirements

  **External References** (libraries and frameworks):
  - Official docs: `https://react.dev/reference/react/lazy` - For code splitting
  - Official docs: `https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading` - Next.js lazy loading
  - Lighthouse: `https://web.dev/lighthouse-whats-new-11-0/` - Performance metrics

  **WHY Each Reference Matters** (explain the relevance):
  - `docs/design/ui-ux-spec.md:1.4`: Critical performance benchmark that must be achieved
  - `frontend/next.config.ts`: Baseline for understanding current optimization setup
  - `frontend/src/app/page.tsx`: Animation patterns that need to be optimized for performance

  **Technical Implementation**:
  - Use Next.js 15's built-in code splitting and dynamic imports
  - Implement React 19 concurrent features for smoother rendering
  - Use Intersection Observer for efficient lazy loading

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Initial load time meets LCP < 1.5s requirement
    Tool: interactive_bash (lighthouse)
    Preconditions: Production build running locally
    Steps:
      1. Build: Next.js production build
      2. Serve: Production build on local server
      3. Run: lighthouse audit on home page
      4. Assert: LCP < 1.5s as specified in UI/UX spec
      5. Assert: Overall performance score > 90
      6. Save: Report to .sisyphus/evidence/lighthouse-report.json
    Expected Result: Load performance meets Genesis standards
    Evidence: Lighthouse performance report

  Scenario: Animations maintain 60fps under load
    Tool: Playwright (playwright skill) + Performance monitoring
    Preconditions: Local server running with performance monitoring
    Steps:
      1. Navigate to: http://localhost:3001
      2. Start FPS monitoring: for 30 seconds
      3. Perform: Multiple simultaneous interactions (mouse movements, clicks)
      4. Assert: Average FPS > 55 during intensive interaction
      5. Assert: No dropped frames exceed 16ms
      6. Log: Performance metrics to .sisyphus/evidence/performance-all-pages.log
    Expected Result: Smooth animation performance under user interaction
    Evidence: Performance log file with FPS measurements

  Scenario: Lazy loading works for offscreen elements
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, page with scrollable content
    Steps:
      1. Navigate to: http://localhost:3001/blog
      2. Load: Page with multiple blog cards
      3. Inspect: Network panel for resource loading
      4. Assert: Offscreen elements are lazily loaded when scrolled into view
      5. Assert: No resources loaded for elements below fold initially
      6. Log: Resource loading sequence to .sisyphus/evidence/lazy-load-sequence.log
    Expected Result: Efficient resource loading for scrollable content
    Evidence: Resource loading sequence log
  ```

  **Evidence to Capture**:
  - [ ] Lighthouse performance reports
  - [ ] Performance logs for animation smoothness
  - [ ] Resource loading sequences
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: NO (grouped with other tasks)

- [ ] 8. Cross-Page Integration and Final Testing

  **What to do**:
  - Conduct full integration test across all pages
  - Verify consistent navigation and transitions
  - Execute end-to-end user journey scenarios
  - Validate responsive behavior across all breakpoints

  **Must NOT do**:
  - Pass this task without verifying all previous functionality
  - Skip cross-page consistency checks

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Task involves comprehensive visual and interaction verification
  - **Skills**: [`playwright`, `react-best-practices`]
    - `playwright`: Essential for comprehensive end-to-end testing
    - `react-best-practices`: Needed to verify implementation quality
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Covered by playwright for verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (final sequential integration)
  - **Blocks**: None (final task)
  - **Blocked By**: [1, 2, 3, 4, 5, 6, 7] (Depends on all previous tasks)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/components/layout/GenesisLayout.tsx` - Integration point for navigation
  - All previous task implementations for comprehensive testing

  **API/Type References** (contracts to implement against):
  - All type definitions used throughout the app

  **Test References** (testing patterns to follow):
  - `frontend/src/test/e2e/*` - End-to-end test patterns if they exist
  - `frontend/vitest.config.ts` - Testing configuration

  **Documentation References** (specs and requirements):
  - `docs/design/ui-ux-spec.md:5` - Development acceptance red lines
  - `docs/design/ui-ux-spec.md:7` - Responsive layout standards

  **External References** (libraries and frameworks):
  - Playwright: `https://playwright.dev/docs/intro` - For end-to-end testing
  - Axe-core: `https://github.com/dequelabs/axe-core` - For accessibility testing
  - Puppeteer: `https://pptr.dev` - For browser automation if needed

  **WHY Each Reference Matters** (explain the relevance):
  - `docs/design/ui-ux-spec.md:5`: Defines critical acceptance criteria for Genesis implementation
  - `docs/design/ui-ux-spec.md:7`: Specifies responsive behavior standards to verify
  - All previous implementations: Integration task must verify consistency across all prior work

  **Technical Implementation**:
  - Use comprehensive end-to-end testing with Playwright
  - Implement accessibility testing with axe-core
  - Run responsive testing across multiple device emulations

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: User can navigate seamlessly between all pages
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, all pages enhanced
    Steps:
      1. Navigate to: http://localhost:3001
      2. Click: Navigation link to /agents
      3. Assert: Smooth transition, correct page loads
      4. Click: Navigation link to /tools
      5. Assert: Smooth transition, correct page loads
      6. Continue: Through all navigation paths
      7. Verify: Consistent Genesis aesthetic maintained
      8. Screenshot: .sisyphus/evidence/task-8-navigation-flow.png
    Expected Result: Seamless navigation experience with consistent aesthetic
    Evidence: Screenshot showing navigation flow

  Scenario: Responsive behavior works across all breakpoints
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, all pages enhanced
    Steps:
      1. Set viewport: to 375px (mobile)
      2. Test: Layout integrity on home page
      3. Set viewport: to 768px (tablet)
      4. Test: Layout integrity on tools page
      5. Set viewport: to 1024px (desktop)
      6. Test: Layout integrity on labs page
      7. Assert: Responsive guidelines followed per spec
      8. Screenshot: .sisyphus/evidence/task-8-responsive-check.png
    Expected Result: Proper responsive behavior at all breakpoints
    Evidence: Screenshot showing responsive layout

  Scenario: End-to-end user journey works as expected
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, all pages enhanced
    Steps:
      1. Start at: http://localhost:3001 (home page)
      2. Journey: Discover agents → Browse tools → Read blog → Visit labs
      3. Interact: With key elements on each page
      4. Assert: All interactions work as designed
      5. Assert: Performance remains consistent
      6. Assert: Visual aesthetic remains cohesive
      7. Screenshot: .sisyphus/evidence/task-8-user-journey.png
    Expected Result: Complete user journey functions perfectly with enhanced Genesis aesthetic
    Evidence: Screenshot of final stage of user journey
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for UI scenarios
  - [ ] Performance metrics across all pages
  - [ ] Accessibility compliance reports
  - [ ] Each evidence file named: task-{N}-{scenario-slug}.{ext}

  **Commit**: YES (final commit for Genesis UI Refactor V2.0)
  - Message: `feat(ui): Genesis UI Refactor v2.0 with enhanced particle physics, magnetic interactions, and performance optimizations`
  - Files: All modified frontend files
  - Pre-commit: `npm test`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| Final (8) | `feat(ui): Genesis UI refactor v2.0 with enhanced aesthetic and performance` | frontend/src/**/* | npm test |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: successful build with no errors
npm run test   # Expected: all tests pass
npm run lint   # Expected: no linting errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] Performance benchmarks met (LCP < 1.5s)
- [ ] All pages maintain Genesis aesthetic
- [ ] All interactions follow UI/UX spec
- [ ] Responsive behavior works at all breakpoints