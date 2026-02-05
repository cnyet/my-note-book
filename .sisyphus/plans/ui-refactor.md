# UI Refactoring Plan for work-agents

## TL;DR

> **Quick Summary**: Comprehensive refactor of the work-agents UI to address current design issues and incorporate modern design patterns from reference sites
> 
> **Deliverables**: 
> - Updated design system with new visual assets
> - Enhanced UI components across all pages
> - Improved user experience with better visual hierarchy
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Design system → Component update → Integration

## Quality Assurance Procedures

### Skill Requirements
- Use `ui-ux-pro-max-skill` for frontend beautification
- Use `react-best-practices` skill for code logic
- Reference specific design assets and specifications

### Oracle Reviews
- Oracle performs review after each page completion
- Visual engineering agent comparisons for acceptance
- Console error-free requirements enforced
- Layout, component, typography, interaction, and event binding validation
- Quality gatekeeping by Oracle

---

## Context

### Original Request
Refactor the current UI of the work-agents project to address dissatisfaction with the current implementation and improve visual appeal using references from checkmarx.dev and clawdbotai.co.

### Interview Summary
**Key Discussions**:
- Current implementation uses Genesis UI system with dark theme and glassmorphism
- Identified issues with current UI that need addressing
- Need for modern, visually appealing design patterns
- Inspiration from checkmarx.dev and clawdbotai.co

**Research Findings**:
- Current UI has glassmorphism, animations, and dark theme applied
- TypeScript typing improvements have been implemented
- Framer Motion animations and particle effects are in place
- Consistent design language exists but needs enhancement

**Metis Review**
**Identified Gaps** (addressed):
- Detailed design requirements need clarification
- Visual references require specific implementation guidelines
- Scope of changes needs to be defined clearly

---

## Work Objectives

### Core Objective
Redesign and refactor the UI of the work-agents platform to create a more visually appealing and engaging user experience that aligns with modern design trends seen on checkmarx.dev and clawdbotai.co.

### Concrete Deliverables
- Updated design system with new color palette, typography, and visual components
- Refactored home page with enhanced visual presentation
- Improved agent listings with better cards and visual hierarchy
- Modernized blog and tools pages with consistent styling
- Enhanced labs and admin interfaces with improved UX
- Updated animations and transitions for better engagement

### Definition of Done
- [ ] All pages have been updated with new design system
- [ ] Visual elements reflect modern design patterns
- [ ] Consistent styling across all pages
- [ ] Animations and transitions are smooth and engaging
- [ ] All functional elements remain operational

### Must Have
- Modern, visually appealing design
- Consistent application across all pages
- Improved visual hierarchy and information architecture
- Enhanced user engagement through visual elements
- Maintain all existing functionality

### Must NOT Have (Guardrails)
- Breaking existing functionality
- Significant performance degradation
- Unnecessary complexity in implementation
- Inconsistent design elements across pages
- Removal of essential user interface elements

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
- **Infrastructure exists**: Not specified
- **Automated tests**: None
- **Framework**: None

### If TDD Enabled

Each TODO follows RED-GREEN-REFACTOR:

**Task Structure:**
1. **RED**: Write failing test first
   - Test file: `[path].test.ts`
   - Test command: `bun test [file]`
   - Expected: FAIL (test exists, implementation doesn't)
2. **GREEN**: Implement minimum code to pass
   - Command: `bun test [file]`
   - Expected: PASS
3. **REFACTOR**: Clean up while keeping green
   - Command: `bun test [file]`
   - Expected: PASS (still)

**Test Setup Task (if infrastructure doesn't exist):**
- [ ] 0. Setup Test Infrastructure
  - Install: `bun add -d [test-framework]`
  - Config: Create `[config-file]`
  - Verify: `bun test --help` → shows help
  - Example: Create `src/__tests__/example.test.ts`
  - Verify: `bun test` → 1 test passes

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> Whether TDD is enabled or not, EVERY task MUST include Agent-Executed QA Scenarios.
> - **With TDD**: QA scenarios complement unit tests at integration/E2E level
> - **Without TDD**: QA scenarios are the PRIMARY verification method
>
> These describe how the executing agent DIRECTLY verifies the deliverable
> by running it — opening browsers, executing commands, sending API requests.
> The agent performs what a human tester would do, but automated via tools.

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Frontend/UI** | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| **TUI/CLI** | interactive_bash (tmux) | Run command, send keystrokes, validate output |
| **API/Backend** | Bash (curl/httpie) | Send requests, parse responses, assert fields |
| **Library/Module** | Bash (bun/node REPL) | Import, call functions, compare output |
| **Config/Infra** | Bash (shell commands) | Apply config, run state checks, validate |

**Each Scenario MUST Follow This Format:**

```
Scenario: [Descriptive name — what user action/flow is being verified]
  Tool: [Playwright / interactive_bash / Bash]
  Preconditions: [What must be true before this scenario runs]
  Steps:
    1. [Exact action with specific selector/command/endpoint]
    2. [Next action with expected intermediate state]
    3. [Assertion with exact expected value]
  Expected Result: [Concrete, observable outcome]
  Failure Indicators: [What would indicate failure]
  Evidence: [Screenshot path / output capture / response body path]
```

**Scenario Detail Requirements:**
- **Selectors**: Specific CSS selectors (`.login-button`, not "the login button")
- **Data**: Concrete test data (`"test@example.com"`, not `"[email]"`)
- **Assertions**: Exact values (`text contains "Welcome back"`, not "verify it works")
- **Timing**: Include wait conditions where relevant (`Wait for .dashboard (timeout: 10s)`)
- **Negative Scenarios**: At least ONE failure/error scenario per feature
- **Evidence Paths**: Specific file paths (`.sisyphus/evidence/task-N-scenario-name.png`)

**Anti-patterns (NEVER write scenarios like this):**
- ❌ "Verify the login page works correctly"
- ❌ "Check that the API returns the right data"
- ❌ "Test the form validation"
- ❌ "User opens browser and confirms..."

**Write scenarios like this instead:**
- ✅ `Navigate to /login → Fill input[name="email"] with "test@example.com" → Fill input[name="password"] with "Pass123!" → Click button[type="submit"] → Wait for /dashboard → Assert h1 contains "Welcome"`
- ✅ `POST /api/users {"name":"Test","email":"new@test.com"} → Assert status 201 → Assert response.id is UUID → GET /api/users/{id} → Assert name equals "Test"`
- ✅ `Run ./cli --config test.yaml → Wait for "Loaded" in stdout → Send "q" → Assert exit code 0 → Assert stdout contains "Goodbye"`

**Evidence Requirements:**
- Screenshots: `.sisyphus/evidence/` for all UI verifications
- Terminal output: Captured for CLI/TUI verifications
- Response bodies: Saved for API verifications
- All evidence referenced by specific file path in acceptance criteria

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately):
├── Task 1: Design System Creation
└── Task 2: Home Page Refactor

Wave 2 (After Wave 1):
├── Task 3: Agents Page Refactor
├── Task 4: Blog Page Refactor
├── Task 5: Tools Page Refactor
└── Task 6: Labs Page Refactor

Wave 3 (After Wave 2):
└── Task 7: Admin Pages Refactor
└── Task 8: Final Integration Testing

Critical Path: Task 1 → Task 2 → Task 7 → Task 8
Parallel Speedup: ~60% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5, 6, 7 | None |
| 2 | 1 | 8 | 3, 4, 5, 6 |
| 3 | 1 | 8 | 2, 4, 5, 6 |
| 4 | 1 | 8 | 2, 3, 5, 6 |
| 5 | 1 | 8 | 2, 3, 4, 6 |
| 6 | 1 | 8 | 2, 3, 4, 5 |
| 7 | 1 | 8 | 2, 3, 4, 5, 6 |
| 8 | 2, 3, 4, 5, 6, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"], run_in_background=false) |
| 2 | 3, 4, 5, 6 | dispatch parallel after Wave 1 completes |
| 3 | 7, 8 | final integration tasks |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Create New Design System

  **What to do**:
  - Research checkmarx.dev and clawdbotai.co for design inspiration
  - Define new color palette based on modern design principles
  - Establish typography hierarchy and font pairings
  - Create reusable UI components and patterns
  - Document design guidelines for consistent application

  **Must NOT do**:
  - Create overly complex components that hurt performance
  - Ignore accessibility standards
  - Deviate from responsive design principles

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: This task focuses on UI/UX design aspects including color palettes, typography, and visual components
- **Skills**: [`frontend-ui-ux`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Perfect for creating a cohesive design system with attention to visual aesthetics and user experience
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `playwright`: Not needed for design system creation, only for testing later
     - `git-master`: Not relevant for design system creation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (must complete first)
  - **Blocks**: Tasks 2-8 (all other tasks)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/components/GenesisCard.tsx` - Current card implementation to refactor
  - `frontend/src/styles/global.css` - Current global styling to replace
  - `frontend/src/lib/utils.ts` - Utility functions that may need updating

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Type definitions that may affect UI display
  - `frontend/src/app/layout.tsx` - Root layout that will use new design system

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

**Documentation References** (specs and requirements):
   - None - Design references come from checkmarx.dev and clawdbotai.co
   - Explicit design references: checkmarx.dev and clawdbotai.co included as primary design inspiration sources

  **External References** (libraries and frameworks):
- Official docs: `https://tailwindcss.com` - For new utility classes
    - Example repo: `github.com/vercel/next-learn/dashboard` - Reference implementation
    - Design inspiration: checkmarx.dev and clawdbotai.co
    - Specific design references: checkmarx.dev and clawdbotai.co explicitly included as design references

  **WHY Each Reference Matters** (explain the relevance):
  - `GenesisCard.tsx`: The current design system implementation that needs to be replaced with new patterns
  - `global.css`: Contains existing styling that will be updated with new design system
- Layout files: Will need to be updated to import and use new design system components

   **Acceptance Criteria**:

   > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
   > Every criterion MUST be verifiable by running a command or using a tool.
   > REPLACE all placeholders with actual values from task context.
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle
   
   **Quality Assurance Procedures**:
   - Oracle performs review after completion
   - Visual engineering agent comparisons for acceptance
   - Console error-free requirements enforced
   - Layout, component, typography, interaction, and event binding validation
   - Quality gatekeeping by Oracle

  **If TDD (tests enabled):**
  - [ ] Design system components created: new components in `frontend/src/components/design-system/`
  - [ ] Color palette defined: new Tailwind configuration in `tailwind.config.ts`
  - [ ] Typography hierarchy established: new font classes in global styles
  - [ ] Component documentation created: in `docs/design-system.md`

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Design system components are properly exported
    Tool: Bash (node REPL)
    Preconditions: New design system files created
    Steps:
      1. Node REPL: Import design system component
      2. Verify component properties match new design guidelines
      3. Check that CSS variables exist for new color palette
    Expected Result: All design system components import successfully and have correct properties
    Evidence: Verification output captured

  Scenario: New color palette is properly configured
    Tool: Bash (shell commands)
    Preconditions: Tailwind config updated with new colors
    Steps:
      1. Check tailwind.config.ts for new color definitions
      2. Verify color names follow consistent naming convention
      3. Confirm accessibility contrast ratios meet WCAG standards
    Expected Result: New color palette properly defined and accessible
    Evidence: Configuration file output
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for design system examples
  - [ ] Configuration files showing new color/typography definitions
  - [ ] Each evidence file named: task-1-design-system-components.{ext}

  **Commit**: YES
  - Message: `feat(design): create new design system inspired by modern UI trends`
  - Files: `frontend/src/components/design-system/*`, `tailwind.config.ts`, `frontend/src/styles/design-system.css`
  - Pre-commit: `npm run lint`

- [ ] 2. Refactor Home Page

  **What to do**:
  - Apply new design system to the home page
  - Redesign hero section with modern visual patterns
  - Update feature highlights with improved visual hierarchy
  - Enhance animations and transitions for better engagement
  - Implement responsive layouts for all screen sizes

  **Must NOT do**:
  - Break existing navigation or functionality
  - Remove important content or CTAs
  - Increase page load time significantly

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the home page
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating a visually attractive and user-friendly home page
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 3-7, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/page.tsx` - Current home page implementation to refactor
  - `frontend/src/components/HeroSection.tsx` - Current hero component
  - `frontend/src/components/FeatureHighlight.tsx` - Feature display components

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Data types for home page content
  - `frontend/src/lib/api/home.ts` - API calls for home page data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check home page examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main entry point that needs complete visual overhaul
  - `HeroSection.tsx`: Key component to redesign with modern visual patterns
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New home page component created: `frontend/src/app/page.tsx`
  - [ ] Updated styling applied: using new design system classes
  - [ ] npm run dev → Home page loads with new design
  - [ ] All links and functionality preserved

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Home page renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Wait for: main content visible (timeout: 5s)
      3. Assert: New design system classes applied to main elements
      4. Assert: Hero section displays with modern styling
      5. Screenshot: .sisyphus/evidence/task-2-home-new-design.png
    Expected Result: Home page displays with new design system applied
    Evidence: .sisyphus/evidence/task-2-home-new-design.png

  Scenario: Responsive layout works on mobile
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Emulate mobile: viewport 375x812
      2. Navigate to: http://localhost:3000/
      3. Verify: Navigation menu adapts to mobile layout
      4. Assert: Content remains readable and accessible
      5. Screenshot: .sisyphus/evidence/task-2-home-mobile.png
    Expected Result: Mobile layout maintains usability and visual appeal
    Evidence: .sisyphus/evidence/task-2-home-mobile.png

  Scenario: Interactive elements function properly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Click: Primary CTA button in hero section
      3. Assert: Navigation occurs as expected
      4. Navigate back: Verify return to home page
      5. Hover: Over interactive elements
      6. Assert: Visual feedback matches design system
      7. Screenshot: .sisyphus/evidence/task-2-home-interactions.png
    Expected Result: All interactive elements function correctly with new design
    Evidence: .sisyphus/evidence/task-2-home-interactions.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for desktop/mobile views
  - [ ] Interaction testing evidence
  - [ ] Each evidence file named: task-2-home-page-redesign.{ext}

  **Commit**: YES
  - Message: `feat(home): refactor home page with new design system`
  - Files: `frontend/src/app/page.tsx`, `frontend/src/components/HeroSection.tsx`, `frontend/src/components/FeatureHighlight.tsx`
  - Pre-commit: `npm run lint`

- [ ] 3. Refactor Agents Page

  **What to do**:
  - Apply new design system to the agents page
  - Redesign agent cards with improved visual hierarchy
  - Update filtering and sorting UI with modern controls
  - Enhance hover and selection states for better UX
  - Optimize for both desktop and mobile viewing

  **Must NOT do**:
  - Change agent functionality or core features
  - Break existing search/filter capabilities
  - Reduce information density unnecessarily

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the agents page
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating visually attractive agent cards and controls
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 2, 4-7, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/agents/page.tsx` - Current agents page implementation
  - `frontend/src/components/AgentCard.tsx` - Current card design to improve
  - `frontend/src/components/AgentFilter.tsx` - Current filter controls

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Agent data types
  - `frontend/src/lib/api/agents.ts` - API calls for agent data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check product listing examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main agents page that needs visual overhaul
  - `AgentCard.tsx`: Key component to redesign with modern styling
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New agents page component: `frontend/src/app/agents/page.tsx`
  - [ ] Updated agent cards: `frontend/src/components/AgentCard.tsx`
  - [ ] npm run dev → Agents page loads with new design
  - [ ] All filtering and sorting still works

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Agents page renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/agents
      2. Wait for: agent cards visible (timeout: 5s)
      3. Assert: New design system classes applied to agent cards
      4. Assert: Filter controls display with modern styling
      5. Screenshot: .sisyphus/evidence/task-3-agents-new-design.png
    Expected Result: Agents page displays with new design system applied
    Evidence: .sisyphus/evidence/task-3-agents-new-design.png

  Scenario: Agent cards have improved visual hierarchy
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/agents
      2. Verify: Card titles are more prominent with better typography
      3. Verify: Important metrics are visually emphasized
      4. Assert: Visual separation between different information elements
      5. Screenshot: .sisyphus/evidence/task-3-agent-card-details.png
    Expected Result: Agent cards show clear visual hierarchy and organization
    Evidence: .sisyphus/evidence/task-3-agent-card-details.png

  Scenario: Filtering and sorting work with new UI
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/agents
      2. Click: Filter control to open options
      3. Assert: Filter options appear with new design
      4. Select: A filter option
      5. Wait for: Results to update (timeout: 3s)
      6. Assert: Results are filtered as expected
      7. Click: Sort control
      8. Assert: Sort options appear with new design
      9. Select: Sort option
      10. Assert: Results are sorted as expected
      11. Screenshot: .sisyphus/evidence/task-3-filter-sort-functionality.png
    Expected Result: All filtering and sorting functions work with new UI
    Evidence: .sisyphus/evidence/task-3-filter-sort-functionality.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for agent cards and filtering
  - [ ] Functionality testing evidence
  - [ ] Each evidence file named: task-3-agents-page-redesign.{ext}

  **Commit**: YES
  - Message: `feat(agents): refactor agents page with new design system`
  - Files: `frontend/src/app/agents/page.tsx`, `frontend/src/components/AgentCard.tsx`, `frontend/src/components/AgentFilter.tsx`
  - Pre-commit: `npm run lint`

- [ ] 4. Refactor Blog Page

  **What to do**:
  - Apply new design system to the blog page
  - Redesign blog cards with modern visual presentation
  - Update categorization and tagging UI with improved navigation
  - Enhance reading experience with better typography
  - Add visual elements that encourage engagement

  **Must NOT do**:
  - Alter blog content or authorship information
  - Break existing blog post links or SEO attributes
  - Change core blog functionality

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the blog page
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating an engaging blog browsing experience
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 2, 3, 5, 6, 7, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/blog/page.tsx` - Current blog page implementation
  - `frontend/src/components/BlogCard.tsx` - Current blog card design
  - `frontend/src/components/BlogTagCloud.tsx` - Current tag display

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Blog data types
  - `frontend/src/lib/api/blog.ts` - API calls for blog data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check blog listing examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main blog page that needs visual overhaul
  - `BlogCard.tsx`: Key component to redesign with modern styling
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New blog page component: `frontend/src/app/blog/page.tsx`
  - [ ] Updated blog cards: `frontend/src/components/BlogCard.tsx`
  - [ ] npm run dev → Blog page loads with new design
  - [ ] All categorization and filtering still works

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Blog page renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/blog
      2. Wait for: blog cards visible (timeout: 5s)
      3. Assert: New design system classes applied to blog cards
      4. Assert: Tag cloud displays with modern styling
      5. Screenshot: .sisyphus/evidence/task-4-blog-new-design.png
    Expected Result: Blog page displays with new design system applied
    Evidence: .sisyphus/evidence/task-4-blog-new-design.png

  Scenario: Blog cards have engaging visual design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/blog
      2. Verify: Card images are displayed attractively
      3. Verify: Titles use improved typography
      4. Assert: Reading time and metadata are clearly presented
      5. Screenshot: .sisyphus/evidence/task-4-blog-card-details.png
    Expected Result: Blog cards are visually appealing and informative
    Evidence: .sisyphus/evidence/task-4-blog-card-details.png

  Scenario: Tag filtering works with new UI
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/blog
      2. Click: A tag from the tag cloud
      3. Wait for: Results to update (timeout: 3s)
      4. Assert: Results are filtered by selected tag
      5. Click: Reset or clear filter
      6. Assert: All posts are displayed again
      7. Screenshot: .sisyphus/evidence/task-4-tag-filtering.png
    Expected Result: Tag filtering works correctly with new UI
    Evidence: .sisyphus/evidence/task-4-tag-filtering.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for blog cards and filtering
  - [ ] Functionality testing evidence
  - [ ] Each evidence file named: task-4-blog-page-redesign.{ext}

  **Commit**: YES
  - Message: `feat(blog): refactor blog page with new design system`
  - Files: `frontend/src/app/blog/page.tsx`, `frontend/src/components/BlogCard.tsx`, `frontend/src/components/BlogTagCloud.tsx`
  - Pre-commit: `npm run lint`

- [ ] 5. Refactor Tools Page

  **What to do**:
  - Apply new design system to the tools page
  - Redesign tool cards with improved visual hierarchy
  - Update categorization system with modern navigation
  - Enhance tool descriptions and usage indicators
  - Add visual elements that highlight important tools

  **Must NOT do**:
  - Modify tool functionality or core behavior
  - Remove important usage information or documentation
  - Break existing tool access or integration points

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the tools page
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating an effective tools browsing experience
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 2, 3, 4, 6, 7, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/tools/page.tsx` - Current tools page implementation
  - `frontend/src/components/ToolCard.tsx` - Current tool card design
  - `frontend/src/components/ToolCategoryFilter.tsx` - Current category system

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Tool data types
  - `frontend/src/lib/api/tools.ts` - API calls for tool data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check tools/product listing examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main tools page that needs visual overhaul
  - `ToolCard.tsx`: Key component to redesign with modern styling
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New tools page component: `frontend/src/app/tools/page.tsx`
  - [ ] Updated tool cards: `frontend/src/components/ToolCard.tsx`
  - [ ] npm run dev → Tools page loads with new design
  - [ ] All categorization and filtering still works

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Tools page renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/tools
      2. Wait for: tool cards visible (timeout: 5s)
      3. Assert: New design system classes applied to tool cards
      4. Assert: Category filters display with modern styling
      5. Screenshot: .sisyphus/evidence/task-5-tools-new-design.png
    Expected Result: Tools page displays with new design system applied
    Evidence: .sisyphus/evidence/task-5-tools-new-design.png

  Scenario: Tool cards show improved visual hierarchy
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/tools
      2. Verify: Tool names are prominently displayed
      3. Verify: Usage metrics are clearly visible
      4. Assert: Category tags are visually distinct
      5. Screenshot: .sisyphus/evidence/task-5-tool-card-details.png
    Expected Result: Tool cards show clear visual hierarchy and organization
    Evidence: .sisyphus/evidence/task-5-tool-card-details.png

  Scenario: Category filtering works with new UI
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/tools
      2. Click: A category filter
      3. Wait for: Results to update (timeout: 3s)
      4. Assert: Results are filtered by selected category
      5. Click: Reset or clear filter
      6. Assert: All tools are displayed again
      7. Screenshot: .sisyphus/evidence/task-5-category-filtering.png
    Expected Result: Category filtering works correctly with new UI
    Evidence: .sisyphus/evidence/task-5-category-filtering.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for tool cards and filtering
  - [ ] Functionality testing evidence
  - [ ] Each evidence file named: task-5-tools-page-redesign.{ext}

  **Commit**: YES
  - Message: `feat(tools): refactor tools page with new design system`
  - Files: `frontend/src/app/tools/page.tsx`, `frontend/src/components/ToolCard.tsx`, `frontend/src/components/ToolCategoryFilter.tsx`
  - Pre-commit: `npm run lint`

- [ ] 6. Refactor Labs Page

  **What to do**:
  - Apply new design system to the labs page
  - Redesign lab cards with modern experimental aesthetics
  - Update status indicators with clearer visual design
  - Enhance experimental feature previews
  - Add visual elements that convey innovation and experimentation

  **Must NOT do**:
  - Change experimental functionality or core features
  - Break any existing lab feature access
  - Compromise the experimental nature of the labs

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the labs page
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating an innovative design for experimental features
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 2, 3, 4, 5, 7, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/labs/page.tsx` - Current labs page implementation
  - `frontend/src/components/LabCard.tsx` - Current lab card design
  - `frontend/src/components/LabStatusIndicator.tsx` - Current status display

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Lab data types
  - `frontend/src/lib/api/labs.ts` - API calls for lab data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check experimental UI examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main labs page that needs visual overhaul
  - `LabCard.tsx`: Key component to redesign with modern experimental styling
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New labs page component: `frontend/src/app/labs/page.tsx`
  - [ ] Updated lab cards: `frontend/src/components/LabCard.tsx`
  - [ ] npm run dev → Labs page loads with new design
  - [ ] All status indicators and functionality still work

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Labs page renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000/labs
      2. Wait for: lab cards visible (timeout: 5s)
      3. Assert: New design system classes applied to lab cards
      4. Assert: Status indicators display with modern styling
      5. Screenshot: .sisyphus/evidence/task-6-labs-new-design.png
    Expected Result: Labs page displays with new design system applied
    Evidence: .sisyphus/evidence/task-6-labs-new-design.png

  Scenario: Lab cards convey experimental nature
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/labs
      2. Verify: Experimental status is visually distinct
      3. Verify: Innovation badges or indicators are present
      4. Assert: Hover states provide additional preview info
      5. Screenshot: .sisyphus/evidence/task-6-lab-card-experimental.png
    Expected Result: Lab cards clearly convey experimental nature and innovation
    Evidence: .sisyphus/evidence/task-6-lab-card-experimental.png

  Scenario: Status indicators work with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/labs
      2. Verify: Status indicators (active, experimental, deprecated) are clearly visible
      3. Assert: Different statuses have distinct visual representations
      4. Click: On a lab to view details
      5. Assert: Detailed status information is displayed correctly
      6. Screenshot: .sisyphus/evidence/task-6-status-indicators.png
    Expected Result: All status indicators work correctly with new design
    Evidence: .sisyphus/evidence/task-6-status-indicators.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for lab cards and status indicators
  - [ ] Functionality testing evidence
  - [ ] Each evidence file named: task-6-labs-page-redesign.{ext}

  **Commit**: YES
  - Message: `feat(labs): refactor labs page with new design system`
  - Files: `frontend/src/app/labs/page.tsx`, `frontend/src/components/LabCard.tsx`, `frontend/src/components/LabStatusIndicator.tsx`
  - Pre-commit: `npm run lint`

- [ ] 7. Refactor Admin Pages

  **What to do**:
  - Apply new design system to all admin pages
  - Redesign admin dashboards with improved data visualization
  - Update form controls with modern styling
  - Enhance administrative workflows with better UX
  - Maintain security and access controls while improving UI

  **Must NOT do**:
  - Compromise security measures or access controls
  - Break administrative functionality or data integrity
  - Remove important monitoring or management capabilities

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on redesigning the visual appearance of the admin pages
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`]
     - `frontend-ui-ux`: Essential for creating efficient administrative interfaces
     - `playwright`: Needed for testing the redesigned UI components and interactions
     - `ui-ux-pro-max-skill`: For advanced frontend beautification and modern UI patterns
     - `react-best-practices`: For proper code logic implementation with industry best practices
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for UI changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with tasks 2, 3, 4, 5, 6, after task 1)
  - **Blocks**: Task 8 (integration testing)
  - **Blocked By**: Task 1 (design system)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `frontend/src/app/admin/page.tsx` - Current admin dashboard implementation
  - `frontend/src/app/admin/users/page.tsx` - Current user management
  - `frontend/src/app/admin/settings/page.tsx` - Current settings interface
  - `frontend/src/components/AdminCard.tsx` - Current admin card design
  - `frontend/src/components/AdminForm.tsx` - Current admin form controls

  **API/Type References** (contracts to implement against):
  - `frontend/src/types/index.ts` - Admin data types
  - `frontend/src/lib/api/admin.ts` - API calls for admin data

  **Test References** (testing patterns to follow):
  - N/A - No existing UI tests to reference

  **Documentation References** (specs and requirements):
  - Design system from Task 1
  - Inspiration from checkmarx.dev and clawdbotai.co

  **External References** (libraries and frameworks):
  - Official docs: `https://framer.com/motion` - For animations
  - Example repo: Check admin dashboard examples from reference sites

  **WHY Each Reference Matters** (explain the relevance):
  - `page.tsx`: Main admin pages that need visual overhaul
  - `AdminCard.tsx` and `AdminForm.tsx`: Key components to redesign with modern styling
  - API files: Must maintain same data contracts while changing visuals

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] New admin dashboard component: `frontend/src/app/admin/page.tsx`
  - [ ] Updated admin pages: `frontend/src/app/admin/users/page.tsx`, `frontend/src/app/admin/settings/page.tsx`
  - [ ] npm run dev → Admin pages load with new design
  - [ ] All admin functionality still works properly

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: Admin dashboard renders with new design
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000, authenticated as admin
    Steps:
      1. Navigate to: http://localhost:3000/admin
      2. Wait for: dashboard content visible (timeout: 5s)
      3. Assert: New design system classes applied to dashboard elements
      4. Assert: Data visualizations display with modern styling
      5. Screenshot: .sisyphus/evidence/task-7-admin-dashboard-new-design.png
    Expected Result: Admin dashboard displays with new design system applied
    Evidence: .sisyphus/evidence/task-7-admin-dashboard-new-design.png

  Scenario: Admin forms have improved UX
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, authenticated as admin
    Steps:
      1. Navigate to: http://localhost:3000/admin/users
      2. Click: Add new user button
      3. Verify: Form controls display with modern styling
      4. Fill: Required fields with test data
      5. Assert: Validation messages appear appropriately
      6. Submit: The form
      7. Assert: Success or error feedback is clear and styled properly
      8. Screenshot: .sisyphus/evidence/task-7-admin-form-ux.png
    Expected Result: Admin forms provide excellent user experience with new design
    Evidence: .sisyphus/evidence/task-7-admin-form-ux.png

  Scenario: Administrative functions work correctly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, authenticated as admin
    Steps:
      1. Navigate to: http://localhost:3000/admin
      2. Access: Various admin functions (user management, settings, etc.)
      3. Perform: Standard admin operations (create, update, delete)
      4. Assert: Operations complete successfully
      5. Verify: Changes are reflected in the UI
      6. Screenshot: .sisyphus/evidence/task-7-admin-functionality.png
    Expected Result: All administrative functions work correctly with new design
    Evidence: .sisyphus/evidence/task-7-admin-functionality.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for admin dashboards and forms
  - [ ] Functionality testing evidence
  - [ ] Each evidence file named: task-7-admin-pages-redesign.{ext}

  **Commit**: YES
  - Message: `feat(admin): refactor admin pages with new design system`
  - Files: `frontend/src/app/admin/*.tsx`, `frontend/src/components/Admin*.tsx`
  - Pre-commit: `npm run lint`

- [ ] 8. Final Integration Testing

  **What to do**:
  - Conduct comprehensive testing of all refactored pages
  - Verify consistent design system application across all pages
  - Test responsive layouts on different screen sizes
  - Validate all interactive elements and animations
  - Ensure cross-browser compatibility

  **Must NOT do**:
  - Introduce new design inconsistencies
  - Break functionality that was working in previous tasks
  - Miss testing any of the refactored pages

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: Focus on validating the visual consistency across all pages
- **Skills**: [`frontend-ui-ux`, `playwright`, `ui-ux-pro-max-skill`, `react-best-practices`, `oracle`]
     - `frontend-ui-ux`: Needed to validate the overall design coherence
     - `playwright`: Essential for comprehensive automated testing
     - `ui-ux-pro-max-skill`: For advanced frontend beautification validation
     - `react-best-practices`: For code quality validation
     - `oracle`: For comprehensive review and validation of all refactored pages
   - **Skills Evaluated but Omitted**:
     - `git-master`: Not relevant for testing

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final integration task)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 2, 3, 4, 5, 6, 7 (all page refactors)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - All refactored pages from previous tasks
  - New design system components
  - Updated global styles

  **API/Type References** (contracts to implement against):
  - All API files that serve the refactored pages
  - Type definitions that affect UI display

**Test References** (testing patterns to follow):
   - N/A - No existing UI tests to reference
 
**Documentation References** (specs and requirements):
    - Design system from Task 1
    - Inspiration from checkmarx.dev and clawdbotai.co
    - Explicit design references: checkmarx.dev and clawdbotai.co included as primary design inspiration sources

   **External References** (libraries and frameworks):
  - Official docs: `https://playwright.dev` - For testing automation
  - Browser compatibility guides for cross-browser testing

  **WHY Each Reference Matters** (explain the relevance):
  - All refactored pages: Need to verify the complete implementation
  - Design system: Must ensure consistent application across all pages
  - API and type files: Verify no breaking changes were introduced

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** — No human action permitted.
  > Every criterion MUST be verifiable by running a command or using a tool.
  > REPLACE all placeholders with actual values from task context.

  **If TDD (tests enabled):**
  - [ ] All pages load without errors: npm run dev, browse all pages
  - [ ] Consistent styling applied: visual inspection across all pages
  - [ ] No console errors: browser console clean on all pages
  - [ ] Responsive design works: mobile and tablet views tested

  **Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed):**

  ```
  Scenario: All pages have consistent design system application
    Tool: Playwright (playwright skill)
    Preconditions: All refactored pages are deployed locally
    Steps:
      1. Navigate to: http://localhost:3000/
      2. Assert: Home page uses new design system classes
      3. Navigate to: http://localhost:3000/agents
      4. Assert: Agents page uses new design system classes
      5. Navigate to: http://localhost:3000/blog
      6. Assert: Blog page uses new design system classes
      7. Navigate to: http://localhost:3000/tools
      8. Assert: Tools page uses new design system classes
      9. Navigate to: http://localhost:3000/labs
      10. Assert: Labs page uses new design system classes
      11. Navigate to: http://localhost:3000/admin
      12. Assert: Admin pages use new design system classes
      13. Compare: Visual consistency across all pages
      14. Screenshot: .sisyphus/evidence/task-8-consistency-check.png
    Expected Result: All pages consistently apply the new design system
    Evidence: .sisyphus/evidence/task-8-consistency-check.png

  Scenario: Responsive design works across all pages
    Tool: Playwright (playwright skill)
    Preconditions: All refactored pages are deployed locally
    Steps:
      1. Set viewport: 375x812 (mobile)
      2. Navigate to: http://localhost:3000/
      3. Assert: Mobile layout is functional and visually appealing
      4. Navigate to: http://localhost:3000/agents
      5. Assert: Mobile layout is functional and visually appealing
      6. Navigate to: http://localhost:3000/blog
      7. Assert: Mobile layout is functional and visually appealing
      8. Navigate to: http://localhost:3000/tools
      9. Assert: Mobile layout is functional and visually appealing
      10. Navigate to: http://localhost:3000/labs
      11. Assert: Mobile layout is functional and visually appealing
      12. Navigate to: http://localhost:3000/admin (if accessible on mobile)
      13. Assert: Mobile layout is functional (or appropriately responsive)
      14. Screenshot: .sisyphus/evidence/task-8-responsive-design.png
    Expected Result: All pages work properly on mobile viewports
    Evidence: .sisyphus/evidence/task-8-responsive-design.png

  Scenario: All interactive elements function properly
    Tool: Playwright (playwright skill)
    Preconditions: All refactored pages are deployed locally
    Steps:
      1. On each page: Test all buttons, links, and interactive elements
      2. Verify: Hover states work appropriately
      3. Verify: Click/tap targets respond correctly
      4. Verify: Forms submit and validate properly
      5. Verify: Animations play smoothly without jank
      6. Assert: No broken functionality across any page
      7. Screenshot: .sisyphus/evidence/task-8-interactive-elements.png
    Expected Result: All interactive elements function correctly across all pages
    Evidence: .sisyphus/evidence/task-8-interactive-elements.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots in .sisyphus/evidence/ for consistency and responsive checks
  - [ ] Cross-browser compatibility evidence
  - [ ] Each evidence file named: task-8-final-integration-testing.{ext}

  **Commit**: YES
  - Message: `feat(ui): complete UI refactor with new design system across all pages`
  - Files: All files modified in previous tasks
  - Pre-commit: `npm run lint && npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(design): create new design system inspired by modern UI trends` | `frontend/src/components/design-system/*`, `tailwind.config.ts`, `frontend/src/styles/design-system.css` | npm run lint |
| 2 | `feat(home): refactor home page with new design system` | `frontend/src/app/page.tsx`, `frontend/src/components/HeroSection.tsx`, `frontend/src/components/FeatureHighlight.tsx` | npm run lint |
| 3 | `feat(agents): refactor agents page with new design system` | `frontend/src/app/agents/page.tsx`, `frontend/src/components/AgentCard.tsx`, `frontend/src/components/AgentFilter.tsx` | npm run lint |
| 4 | `feat(blog): refactor blog page with new design system` | `frontend/src/app/blog/page.tsx`, `frontend/src/components/BlogCard.tsx`, `frontend/src/components/BlogTagCloud.tsx` | npm run lint |
| 5 | `feat(tools): refactor tools page with new design system` | `frontend/src/app/tools/page.tsx`, `frontend/src/components/ToolCard.tsx`, `frontend/src/components/ToolCategoryFilter.tsx` | npm run lint |
| 6 | `feat(labs): refactor labs page with new design system` | `frontend/src/app/labs/page.tsx`, `frontend/src/components/LabCard.tsx`, `frontend/src/components/LabStatusIndicator.tsx` | npm run lint |
| 7 | `feat(admin): refactor admin pages with new design system` | `frontend/src/app/admin/*.tsx`, `frontend/src/components/Admin*.tsx` | npm run lint |
| 8 | `feat(ui): complete UI refactor with new design system across all pages` | All modified files | npm run lint && npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run dev  # Expected: Development server starts without errors
npm run build  # Expected: Production build completes successfully
npm run lint  # Expected: No linting errors or warnings
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All pages consistently apply new design system
- [ ] All functionality preserved and working
- [ ] Responsive design works on all viewports
- [ ] No performance degradation introduced