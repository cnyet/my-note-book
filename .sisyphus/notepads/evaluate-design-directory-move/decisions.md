# Directory Structure Decision: docs/design/ Location

**Date:** 2026-01-30

## Context
Evaluating proposal to move `docs/design/` directory to `frontend/` directory.

## Decision: Hybrid Approach (Partial Move)

**Chosen Option:** Option 1 - Move only UI design assets to frontend, keep technical docs in docs/

### What to Move
- `docs/design/assets/` → `frontend/design/assets/`
  - `components/` - Component design mockups
  - `pages/` - Page design mockups
  - `styles/` - Style specifications (colors, typography, icons)
  - `reference/` - Reference materials

### What to Keep in docs/design/
- `architecture.md` - System architecture design
- `database-schema.md` - Database design specifications
- `api-design.md` - API design specifications
- `ui-ux-spec.md` - High-level UI/UX design principles

## Rationale

### For Moving UI Design Assets
1. **Frontend Developer Workflow**: UI design assets are actively referenced during frontend implementation
2. **Discoverability**: Developers naturally look in `frontend/` for frontend-related resources
3. **Single Context**: Easy to have design assets and implementation code in the same mental model
4. **Parallel Updates**: Design iterations can be bundled with frontend code changes

### For Keeping Technical Docs in docs/
1. **Cross-Cutting Relevance**: Architecture, database, and API specs apply to entire project
2. **Backend Team Access**: Backend developers need these references without navigating into frontend
3. **Documentation Principle**: Centralized `docs/` folder is predictable for new contributors
4. **CI/CD Clarity**: `docs/` is correctly treated as non-deployable documentation

## Impact Analysis

### Development Workflow
- ✅ Frontend devs find UI design assets more easily
- ✅ Backend devs access technical specs from familiar location
- ⚠️ Need to update paths in documentation (README files link to assets)

### Team Collaboration
- ✅ Clearer separation: technical specs (docs/) vs. frontend assets (frontend/)
- ⚠️ New contributors need to understand dual-location approach

### Maintainability
- ✅ Single responsibility per directory
- ✅ Scalable as more design assets are added
- ✅ Easy to find relevant design resources

## Implementation Notes

If this decision is approved:
1. Create `frontend/design/` directory structure
2. Move only `docs/design/assets/` contents
3. Update links in `docs/design/README.md`
4. Update references in `docs/implement/implement-plan.md`
5. Consider adding `frontend/design/README.md` to explain purpose

## Status
**Decision Made** - Ready for implementation planning
