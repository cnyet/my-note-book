# Architectural Decisions: Orchestration-First Paradigm

## Core Decision: Orchestration-First Architecture

- **Primary Shift**: Move from individual agent autonomy to centralized orchestration control
- **Rationale**: Enable coordinated multi-agent workflows while maintaining individual agent capabilities
- **Impact**: Allows complex task decomposition and parallel execution across specialized agents

## Documentation Separation Strategy

- **Tracking Layer** (implement-plan.md): Strategic planning, milestone tracking, dependency management
- **Execution Layer** (openspec/): Implementation specifications, change protocols, technical procedures
- **Advantage**: Clear separation between "what to achieve" and "how to implement"

## Language Standardization Decision

- **English-Only Project Context**: Eliminate multilingual complexity for improved LLM processing density
- **Reasoning**: Higher token efficiency and reduced translation ambiguity in AI-assisted development
- **Scope**: All architectural documents, technical specifications, and inter-agent communication protocols

## Governance Hardening: Mandatory Priority Hierarchy

Implementation of a strict evaluation order for capability usage:

1. **Specialized Skills** (`playwright`, `git-master`, `frontend-ui-ux`, `prompt-optimization`, etc.)
2. **Specialized Agents** (`oracle`, `librarian`, `metis`, `prometheus`) via `delegate_task()`
3. **Integrated Tools** (LSP, AST-grep, WebFetch, Google Search) for research and refactoring
4. **Direct Implementation** (only when no specialized capability exists)

This hierarchy ensures optimal resource utilization and prevents reinvention of existing capabilities.

## Automatic Persistence Protocol Implementation

Mandatory pre-compaction synchronization process implemented to preserve valuable insights during long-form conversations:

- **Semantic Scan**: Agents perform systematic review of conversation history before executing compaction skills
- **Crystallized Knowledge Extraction**: Identification of significant decision points, breakthrough moments, and technical considerations
- **Knowledge Preservation**: Automatic persistence of insights to `.sisyphus/notepads/` directory to prevent context loss
- **Protocol Enforcement**: Mandatory execution before any session compaction or task transition

## Tooling Evolution: Skill Substitution

- **Physical Deletion**: Complete removal of legacy `ui-design-skill` from the system
- **Capability Enhancement**: Total replacement with more sophisticated `ui-ux-pro-max-skill` offering advanced functionality
- **Migration Impact**: Ensured backward compatibility while enabling enhanced UI/UX capabilities

## Project Alignment: Documentation Renaming

Transformation of the root `README.md` from a simple tool aggregator to comprehensive "Modern AI Multi-Agent Orchestration Platform" documentation, reflecting the evolved architecture and capabilities of the system.
