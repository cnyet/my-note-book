# Draft: Revert requirement.md to PRD Format

## User Request Summary
Revert `docs/requirement.md` to a proper PRD format that focuses on REQUIREMENTS (what is needed) rather than IMPLEMENTATION (how to build it). Remove implementation-specific details that belong in implement-plan.md.

## What to Keep in requirement.md
- Project overview and positioning
- Target users
- Feature requirements (5 pages, admin functions)
- UI/UX design specifications
- High-level constraints (not specific technologies)
- User stories and acceptance criteria
- "已确认决策" section (but remove tech-specific items)

## What to Remove from requirement.md
1. **Section: 技术选型变更记录** (lines 10-19)
   - "Python 3.11+ + FastAPI"
   - "SQLite" / "SQLAlchemy"
   - "Prisma"
   - "Redis"
   - "Docker"
   - "Next.js 15.4" (keep "modern React framework")

2. **Section: 技术架构（明确化）** (lines 52-70)
   - Specific tech stack table
   - All implementation technology details

3. **Section: 后端API规范** (lines 385-456)
   - Python/Pydantic specifics
   - "Pydantic 模型"
   - "SQLAlchemy ORM"
   - "Python Bleach"

4. **Section: 数据库详细设计** (lines 459-604)
   - SQLite/SQLAlchemy specifics
   - Database schema with ORM annotations
   - "SQLite FTS5虚拟表"

5. **Section: 三种实现方案对比** (lines 607-725)
   - Implementation comparison
   - "方案A/B/C" analysis
   - Tech stack comparison tables

6. **Section: 项目实施计划** (lines 760-791)
   - "Phase 1/2/3/4" implementation phases
   - "Days 1-28" timeline
   - Task breakdowns with days

7. **Technical-specific details throughout:**
   - Specific programming languages
   - Framework names (FastAPI, SQLAlchemy, Pydantic, etc.)
   - Library names (Bleach, etc.)
   - Phase mentions with technical details

## Proper Separation
```
requirement.md (PRD):
- "The system shall support user authentication"
- "Database: lightweight, file-based solution preferred"
- "Timeline: approximately 3-4 weeks for MVP"

implement-plan.md:
- "Use Python FastAPI + SQLite"
- "Phase 1: Days 1-3, infrastructure setup"
- "Use SQLAlchemy ORM"
```

## Expected Outcome
- requirement.md should define WHAT the product needs (features, functionality, user stories)
- Remove specific tech stack details
- Remove implementation timelines and phases
- Keep high-level requirements, user needs, and feature specifications
- Add reference to implement-plan.md for implementation details

## Files to Reference
- Current requirement.md: `/Users/yet/ClaudeCode/work-agents/docs/requirement.md`
- implement-plan.md: `/Users/yet/ClaudeCode/work-agents/docs/implement/implement-plan.md`

## Acceptance Criteria for the Work
- [ ] "技术选型变更记录" section removed
- [ ] "技术架构（明确化）" section removed or replaced with high-level architecture description
- [ ] "后端API规范" section removed (should be in implement-plan.md)
- [ ] "数据库详细设计" section removed (should be in implement-plan.md)
- [ ] "三种实现方案对比" section removed
- [ ] "项目实施计划" section removed
- [ ] All specific technology mentions (Python, FastAPI, SQLite, SQLAlchemy, Pydantic, Bleach, etc.) removed
- [ ] Generic descriptions used instead: "modern React framework" instead of "Next.js 15.4", "lightweight database" instead of "SQLite"
- [ ] Added note: "For implementation details, see implement-plan.md"
- [ ] File structure and sections reorganized to be a proper PRD
