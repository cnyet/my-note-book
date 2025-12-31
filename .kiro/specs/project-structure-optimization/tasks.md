# Implementation Plan: Project Structure Optimization

## Overview

This implementation plan provides a step-by-step guide to restructure the AI Life Assistant project from its current organic structure to an optimized monorepo organization. The migration will be performed in phases to minimize risk and ensure all functionality is preserved.

## Tasks

- [x] 1. Preparation and Backup
  - Create full backup of current project state
  - Document current directory structure
  - Create migration tracking spreadsheet
  - Set up rollback mechanism
  - _Requirements: 10.1, 10.5_

- [-] 2. Create New Directory Structure
  - [x] 2.1 Create backend directory structure
    - Create `backend/src/` with subdirectories (agents, api, cli, core, integrations, utils)
    - Create `backend/tests/` with subdirectories (unit, integration, fixtures)
    - Create `backend/config/`, `backend/alembic/`, `backend/scripts/`
    - Create `backend/requirements/` directory
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 2.2 Create frontend directory structure
    - Rename `web-app/` to `frontend/`
    - Verify all subdirectories are intact
    - Update package.json name field
    - _Requirements: 3.1_
  
  - [x] 2.3 Create shared directories
    - Create `docs/` with subdirectories (getting-started, architecture, api, guides, agents, migration)
    - Create `scripts/` with subdirectories (setup, dev, build, test, deploy, utils)
    - Create `config/` for shared configuration
    - _Requirements: 6.1, 7.1, 5.1_
  
  - [ ] 2.4 Update .gitignore
    - Add new artifact directories to .gitignore
    - Add environment-specific files
    - Add IDE-specific files (except templates)
    - _Requirements: 8.2, 12.5_

- [-] 3. Migrate Backend Source Code
  - [x] 3.1 Move agent modules
    - Move `agents/*.py` to `backend/src/agents/`
    - Rename files to match new convention (news_secretary.py → news.py)
    - Create `backend/src/agents/__init__.py`
    - Create `backend/src/agents/base.py` for shared functionality
    - _Requirements: 2.2_
  
  - [x] 3.2 Move API code
    - Move `api/*` to `backend/src/api/`
    - Preserve subdirectory structure (routes, models, schemas, services, repositories)
    - Update `backend/src/api/main.py` entry point
    - _Requirements: 2.2_
  
  - [x] 3.3 Move CLI code
    - Move `main.py` to `backend/src/cli/main.py`
    - Create `backend/src/cli/commands/` for command modules
    - Update CLI entry point configuration
    - _Requirements: 2.2_
  
  - [x] 3.4 Move core utilities
    - Move config-related utils to `backend/src/core/`
    - Move logging utils to `backend/src/core/`
    - Move database utils to `backend/src/core/`
    - Create `backend/src/core/__init__.py`
    - _Requirements: 2.2_
  
  - [x] 3.5 Move integrations
    - Move LLM clients to `backend/src/integrations/llm/`
    - Move weather clients to `backend/src/integrations/weather/`
    - Move image generation to `backend/src/integrations/image/`
    - Create base classes for each integration type
    - _Requirements: 2.2_
  
  - [x] 3.6 Move remaining utilities
    - Move general utilities to `backend/src/utils/`
    - Organize by purpose (file_manager, validators, etc.)
    - _Requirements: 2.2_

- [ ] 4. Update Backend Import Paths
  - [ ] 4.1 Update agent imports
    - Update imports in agent modules
    - Update imports in API routes that use agents
    - Update imports in CLI commands
    - _Requirements: 10.3_
  
  - [ ] 4.2 Update API imports
    - Update imports in route modules
    - Update imports in service modules
    - Update imports in repository modules
    - Update imports in model modules
    - _Requirements: 10.3_
  
  - [ ] 4.3 Update core imports
    - Update config loading imports
    - Update logging imports
    - Update database imports
    - _Requirements: 10.3_
  
  - [ ] 4.4 Update integration imports
    - Update LLM client imports
    - Update weather client imports
    - Update image generation imports
    - _Requirements: 10.3_
  
  - [ ] 4.5 Create import validation script
    - Write script to check all imports resolve
    - Run validation and fix any issues
    - _Requirements: 10.3, 10.4_

- [ ] 5. Migrate Backend Tests
  - [ ] 5.1 Move test files
    - Merge `test/` and `tests/` directories
    - Move all tests to `backend/tests/`
    - Organize into `unit/` and `integration/` subdirectories
    - _Requirements: 4.1, 4.2_
  
  - [ ] 5.2 Move test fixtures
    - Move fixtures to `backend/tests/fixtures/`
    - Update fixture imports in conftest.py
    - _Requirements: 4.3_
  
  - [ ] 5.3 Update test imports
    - Update imports in all test files
    - Update fixture references
    - Update conftest.py
    - _Requirements: 10.3_
  
  - [ ] 5.4 Update pytest configuration
    - Move pytest.ini to `backend/`
    - Update test discovery paths
    - Update coverage configuration
    - _Requirements: 4.4_
  
  - [ ] 5.5 Run backend tests
    - Execute full test suite
    - Fix any failing tests
    - Verify coverage reports
    - _Requirements: 10.4_

- [ ] 6. Migrate Backend Configuration
  - [ ] 6.1 Move configuration files
    - Move `config/*.ini` to `backend/config/`
    - Create environment-specific configs (dev, prod, test)
    - Move `aboutme.md` to `config/` (shared)
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.2 Update configuration loading
    - Update config paths in `backend/src/core/config.py`
    - Add environment detection logic
    - Test configuration loading
    - _Requirements: 5.3_
  
  - [ ] 6.3 Move database migrations
    - Move `alembic/` to `backend/alembic/`
    - Move `alembic.ini` to `backend/`
    - Update alembic.ini paths
    - Test migrations
    - _Requirements: 2.5_
  
  - [ ] 6.4 Update dependency files
    - Split `requirements.txt` into `backend/requirements/` files
    - Create base.txt, dev.txt, prod.txt, test.txt
    - Update installation documentation
    - _Requirements: 9.1, 9.2, 9.4_

- [ ] 7. Migrate Frontend
  - [x] 7.1 Rename web-app directory
    - Rename `web-app/` to `frontend/`
    - Update package.json name field
    - Update README references
    - _Requirements: 3.1_
  
  - [x] 7.2 Update frontend configuration
    - Update next.config.ts if needed
    - Update tsconfig.json paths if needed
    - Update package.json scripts
    - _Requirements: 3.2_
  
  - [ ] 7.3 Verify frontend structure
    - Check all imports still resolve
    - Verify path aliases work
    - Test development server
    - _Requirements: 3.3_
  
  - [ ] 7.4 Run frontend tests
    - Execute frontend test suite
    - Fix any failing tests
    - Verify build process
    - _Requirements: 10.4_

- [ ] 8. Migrate Documentation
  - [ ] 8.1 Create docs structure
    - Create all documentation subdirectories
    - Create README.md index
    - _Requirements: 6.1, 6.2_
  
  - [ ] 8.2 Move existing documentation
    - Move relevant .md files from root to `docs/`
    - Organize by topic (getting-started, architecture, guides)
    - Keep README.md, LICENSE, CONTRIBUTING.md in root
    - _Requirements: 6.3_
  
  - [ ] 8.3 Create migration documentation
    - Document the new structure
    - Create migration guide for developers
    - Document import path changes
    - Update CHANGELOG
    - _Requirements: 6.4, 10.1_
  
  - [ ] 8.4 Update documentation links
    - Update all internal documentation links
    - Update README references
    - Verify no broken links
    - _Requirements: 6.3_

- [ ] 9. Reorganize Scripts
  - [ ] 9.1 Categorize existing scripts
    - Identify purpose of each script
    - Determine target directory (setup, dev, build, test, deploy, utils)
    - _Requirements: 7.2_
  
  - [ ] 9.2 Move and rename scripts
    - Move scripts to appropriate subdirectories
    - Rename for clarity if needed
    - Update script permissions (chmod +x)
    - _Requirements: 7.1, 7.4_
  
  - [ ] 9.3 Update script paths
    - Update paths in scripts to reference new structure
    - Update relative imports
    - Test each script
    - _Requirements: 7.3_
  
  - [ ] 9.4 Create wrapper scripts
    - Create `scripts/dev/start-all.sh` (combines backend + frontend)
    - Create `scripts/test/test-all.sh`
    - Update quick-start.sh
    - _Requirements: 7.2_
  
  - [ ] 9.5 Document scripts
    - Create `scripts/README.md`
    - Document each script's purpose and usage
    - Add examples
    - _Requirements: 7.3_

- [ ] 10. Clean Up Root Directory
  - [ ] 10.1 Move remaining files
    - Move obsolete .py files to backend/scripts/ or delete
    - Move logs to data/logs/ or delete
    - Organize remaining config files
    - _Requirements: 1.1, 1.2_
  
  - [ ] 10.2 Update root README
    - Rewrite README for new structure
    - Add quick start guide
    - Link to detailed documentation
    - _Requirements: 6.3_
  
  - [ ] 10.3 Create CONTRIBUTING.md
    - Document contribution workflow
    - Explain new structure
    - Add development guidelines
    - _Requirements: 6.4_
  
  - [ ] 10.4 Verify root directory
    - Ensure only essential files remain
    - Check .gitignore coverage
    - Verify clean `git status`
    - _Requirements: 1.1, 1.3_

- [ ] 11. Update CI/CD and Deployment
  - [ ] 11.1 Update GitHub workflows
    - Update paths in `.github/workflows/`
    - Update test commands
    - Update build commands
    - _Requirements: 12.1_
  
  - [ ] 11.2 Update Docker configuration
    - Update `docker-compose.yml` paths
    - Update Dockerfile paths if they exist
    - Test Docker build
    - _Requirements: 9.3_
  
  - [ ] 11.3 Update deployment scripts
    - Update paths in deployment scripts
    - Test deployment process in staging
    - Document deployment changes
    - _Requirements: 7.2_

- [ ] 12. Validation and Testing
  - [ ] 12.1 Run full test suite
    - Run all backend unit tests
    - Run all backend integration tests
    - Run all frontend tests
    - Verify 100% pass rate
    - _Requirements: 10.4_
  
  - [ ] 12.2 Test development workflow
    - Test backend development server
    - Test frontend development server
    - Test hot reload functionality
    - Test debugging setup
    - _Requirements: 12.2_
  
  - [ ] 12.3 Test build process
    - Build backend package
    - Build frontend production bundle
    - Verify build artifacts
    - _Requirements: 9.3_
  
  - [ ] 12.4 Test CLI functionality
    - Test all CLI commands
    - Verify agent execution
    - Test configuration loading
    - _Requirements: 10.2_
  
  - [ ] 12.5 Test API functionality
    - Test all API endpoints
    - Verify authentication
    - Test agent integration
    - _Requirements: 10.2_
  
  - [ ] 12.6 Manual testing
    - Navigate new structure
    - Verify IDE integration
    - Check documentation accessibility
    - Test common developer tasks
    - _Requirements: 12.3, 12.4_

- [ ] 13. Create Migration Script
  - [ ] 13.1 Write migration script
    - Create `scripts/migrate-structure.py`
    - Implement file moving logic
    - Implement import rewriting logic
    - Add progress tracking
    - _Requirements: 10.1_
  
  - [ ] 13.2 Add validation checks
    - Verify all files moved
    - Check for missing files
    - Validate new structure
    - _Requirements: 10.4_
  
  - [ ] 13.3 Implement rollback
    - Create backup before migration
    - Implement rollback logic
    - Test rollback functionality
    - _Requirements: 10.5_
  
  - [ ] 13.4 Add dry-run mode
    - Implement --dry-run flag
    - Show what would be changed
    - Generate migration report
    - _Requirements: 10.1_
  
  - [ ] 13.5 Test migration script
    - Test on a copy of the project
    - Verify all files moved correctly
    - Verify imports updated correctly
    - Test rollback
    - _Requirements: 10.2, 10.4, 10.5_

- [ ] 14. Finalization
  - [ ] 14.1 Update all documentation
    - Verify all docs are up to date
    - Check for broken links
    - Update screenshots if any
    - _Requirements: 6.4_
  
  - [ ] 14.2 Create migration announcement
    - Write migration guide for team
    - Document breaking changes
    - Provide migration timeline
    - _Requirements: 10.1_
  
  - [ ] 14.3 Tag release
    - Create git tag for migration
    - Update version numbers
    - Create release notes
    - _Requirements: 10.1_
  
  - [ ] 14.4 Archive old structure
    - Create archive branch
    - Document archive location
    - Set branch protection
    - _Requirements: 10.5_

- [ ] 15. Post-Migration Monitoring
  - Monitor for issues in first week
  - Collect feedback from team
  - Address any problems quickly
  - Update documentation based on feedback
  - _Requirements: 10.2_

## Notes

- **Backup First**: Always create a full backup before starting migration
- **Test Frequently**: Run tests after each major change
- **Incremental Approach**: Complete one phase before moving to the next
- **Communication**: Keep team informed of progress and any issues
- **Rollback Ready**: Be prepared to rollback if critical issues arise
- **Documentation**: Document all changes and decisions
- **Validation**: Validate structure and functionality at each step

## Estimated Timeline

- **Phase 1-2 (Preparation & Structure)**: 1 day
- **Phase 3-6 (Backend Migration)**: 2-3 days
- **Phase 7 (Frontend Migration)**: 0.5 day
- **Phase 8-10 (Docs & Scripts)**: 1 day
- **Phase 11-12 (CI/CD & Testing)**: 1 day
- **Phase 13-14 (Script & Finalization)**: 1 day
- **Phase 15 (Monitoring)**: 1 week

**Total**: ~7-8 days of focused work + 1 week monitoring

## Success Criteria

- ✅ All files moved to new locations
- ✅ All imports resolve correctly
- ✅ All tests pass (100%)
- ✅ Development workflow works smoothly
- ✅ Build process succeeds
- ✅ Deployment process works
- ✅ Documentation is complete and accurate
- ✅ Team can navigate new structure easily
- ✅ No functionality lost or broken
- ✅ Rollback capability verified
