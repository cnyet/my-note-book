#!/usr/bin/env python3
"""
Main Migration Orchestrator

This module orchestrates the complete documentation migration process,
integrating all migration components with comprehensive error handling.
"""

import os
import sys
import logging
from typing import Dict, List, Optional, Tuple
from pathlib import Path

# Import all migration utilities
from documentation_migrator import DocumentationMigrator
from link_updater import LinkUpdater
from config_updater import ConfigurationUpdater
from docs_index_generator import DocumentationIndexGenerator
from structure_validator import DirectoryStructureValidator
from migration_error_handler import MigrationErrorHandler


class MigrationOrchestrator:
    """Main orchestrator for the documentation migration process"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        
        # Initialize all migration components
        self.migrator = DocumentationMigrator(str(self.base_dir))
        self.link_updater = LinkUpdater(str(self.base_dir))
        self.config_updater = ConfigurationUpdater(str(self.base_dir))
        self.index_generator = DocumentationIndexGenerator(str(self.base_dir))
        self.validator = DirectoryStructureValidator(str(self.base_dir))
        self.error_handler = MigrationErrorHandler(str(self.base_dir))
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def pre_migration_validation(self) -> bool:
        """Validate system state before migration"""
        self.logger.info("Running pre-migration validation...")
        
        try:
            # Check that all source files exist
            migration_map = self.migrator.migration_map
            missing_files = []
            
            for source_file in migration_map.keys():
                source_path = self.base_dir / source_file
                if not source_path.exists():
                    missing_files.append(source_file)
            
            if missing_files:
                self.logger.error(f"Missing source files: {', '.join(missing_files)}")
                return False
            
            # Check that configuration files exist
            for config_file in self.config_updater.config_files:
                config_path = self.base_dir / config_file
                if not config_path.exists():
                    self.logger.warning(f"Configuration file not found: {config_file}")
            
            # Check for existing docs directory
            docs_dir = self.base_dir / "docs"
            if docs_dir.exists():
                self.logger.warning("Documentation directory already exists - will be backed up")
            
            self.logger.info("Pre-migration validation completed")
            return True
            
        except Exception as e:
            self.logger.error(f"Pre-migration validation failed: {e}")
            return False
    
    def post_migration_validation(self) -> bool:
        """Validate system state after migration"""
        self.logger.info("Running post-migration validation...")
        
        try:
            # Validate directory structure
            if not self.validator.validate_structure():
                self.logger.error("Directory structure validation failed")
                return False
            
            # Validate that all files were migrated
            migration_map = self.migrator.migration_map
            for source_file, dest_file in migration_map.items():
                dest_path = self.base_dir / dest_file
                if not dest_path.exists():
                    self.logger.error(f"Migration failed: {dest_file} not found")
                    return False
            
            # Validate configuration files
            for config_file in self.config_updater.config_files:
                config_path = self.base_dir / config_file
                if config_path.exists():
                    if not self.config_updater.validate_config_paths(config_file):
                        self.logger.error(f"Configuration validation failed: {config_file}")
                        return False
            
            # Validate links
            if not self.link_updater.validate_links():
                self.logger.error("Link validation failed")
                return False
            
            self.logger.info("Post-migration validation completed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Post-migration validation failed: {e}")
            return False
    
    def execute_full_migration(self, dry_run: bool = False) -> bool:
        """Execute the complete migration process"""
        try:
            migration_id = self.error_handler.start_migration()
            self.logger.info(f"Starting full documentation migration: {migration_id}")
            
            if dry_run:
                self.logger.info("DRY RUN MODE - No files will be modified")
                return self._execute_dry_run()
            
            # Step 1: Pre-migration validation
            step1 = self.error_handler.add_step(
                "pre_validation", 
                "Pre-migration Validation",
                "Validate system state before migration"
            )
            
            if not self.error_handler.execute_step("pre_validation", self.pre_migration_validation):
                self.logger.error("Pre-migration validation failed")
                self.error_handler.complete_migration(success=False)
                return False
            
            # Step 2: Create comprehensive backup
            step2 = self.error_handler.add_step(
                "backup",
                "Create Backup", 
                "Create comprehensive backup of all files"
            )
            
            if not self.error_handler.execute_step("backup", self.error_handler.create_comprehensive_backup):
                self.logger.error("Backup creation failed")
                self.error_handler.complete_migration(success=False)
                return False
            
            # Step 3: Create directory structure
            step3 = self.error_handler.add_step(
                "create_dirs",
                "Create Directory Structure",
                "Create the new documentation directory structure"
            )
            
            if not self.error_handler.execute_step("create_dirs", self.migrator.create_directory_structure):
                self.logger.error("Directory structure creation failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 4: Migrate files
            step4 = self.error_handler.add_step(
                "migrate_files",
                "Migrate Files",
                "Move documentation files to new locations"
            )
            
            if not self.error_handler.execute_step("migrate_files", self.migrator.migrate_files):
                self.logger.error("File migration failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 5: Update configuration files
            step5 = self.error_handler.add_step(
                "update_configs",
                "Update Configuration Files",
                "Update configuration file paths"
            )
            
            if not self.error_handler.execute_step("update_configs", self.config_updater.update_all_configurations):
                self.logger.error("Configuration update failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 6: Update links and references
            step6 = self.error_handler.add_step(
                "update_links",
                "Update Links and References", 
                "Update all internal links and references"
            )
            
            if not self.error_handler.execute_step("update_links", self.link_updater.scan_and_update_all_references):
                self.logger.error("Link update failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 7: Generate documentation indices
            step7 = self.error_handler.add_step(
                "generate_indices",
                "Generate Documentation Indices",
                "Create README files for all documentation sections"
            )
            
            if not self.error_handler.execute_step("generate_indices", self.index_generator.create_all_indices):
                self.logger.error("Index generation failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 8: Post-migration validation
            step8 = self.error_handler.add_step(
                "post_validation",
                "Post-migration Validation",
                "Validate system state after migration"
            )
            
            if not self.error_handler.execute_step("post_validation", self.post_migration_validation):
                self.logger.error("Post-migration validation failed")
                self.error_handler.rollback_migration()
                return False
            
            # Step 9: Clean up source files
            step9 = self.error_handler.add_step(
                "cleanup_sources",
                "Clean Up Source Files",
                "Remove original files from root directory"
            )
            
            if not self.error_handler.execute_step("cleanup_sources", self.migrator.cleanup_source_files):
                self.logger.warning("Source file cleanup failed, but migration is complete")
                # Don't rollback for cleanup failure
            
            # Complete migration
            self.error_handler.complete_migration(success=True)
            
            # Generate summary
            summary = self.error_handler.get_migration_summary()
            self.logger.info(f"Migration completed successfully!")
            self.logger.info(f"Total steps: {summary['total_steps']}")
            self.logger.info(f"Successful steps: {summary['successful_steps']}")
            self.logger.info(f"Duration: {summary.get('duration_seconds', 0):.2f} seconds")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Migration orchestration failed: {e}")
            if hasattr(self, 'error_handler') and self.error_handler.migration_state:
                self.error_handler.rollback_migration()
            return False
    
    def _execute_dry_run(self) -> bool:
        """Execute a dry run of the migration process"""
        try:
            self.logger.info("=== DRY RUN: Pre-migration Validation ===")
            if not self.pre_migration_validation():
                return False
            
            self.logger.info("=== DRY RUN: File Migration ===")
            if not self.migrator.execute_migration(dry_run=True):
                return False
            
            self.logger.info("=== DRY RUN: Configuration Updates ===")
            if not self.config_updater.update_all_configurations(dry_run=True):
                return False
            
            self.logger.info("=== DRY RUN: Link Updates ===")
            if not self.link_updater.scan_and_update_all_references(dry_run=True):
                return False
            
            self.logger.info("=== DRY RUN: Index Generation ===")
            if not self.index_generator.create_all_indices(dry_run=True):
                return False
            
            self.logger.info("=== DRY RUN COMPLETED SUCCESSFULLY ===")
            return True
            
        except Exception as e:
            self.logger.error(f"Dry run failed: {e}")
            return False
    
    def rollback_migration(self) -> bool:
        """Rollback the migration process"""
        try:
            self.logger.info("Starting migration rollback...")
            
            # Load the latest migration state
            if not self.error_handler.load_state():
                self.logger.error("No migration state found for rollback")
                return False
            
            return self.error_handler.rollback_migration()
            
        except Exception as e:
            self.logger.error(f"Rollback failed: {e}")
            return False
    
    def get_migration_status(self) -> Dict:
        """Get the current migration status"""
        try:
            if self.error_handler.load_state():
                return self.error_handler.get_migration_summary()
            else:
                return {"status": "no_migration_found"}
                
        except Exception as e:
            self.logger.error(f"Failed to get migration status: {e}")
            return {"status": "error", "message": str(e)}


def main():
    """Command line interface for the migration orchestrator"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="AI Life Assistant Documentation Migration Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python migration_orchestrator.py --migrate --dry-run    # Preview migration
  python migration_orchestrator.py --migrate              # Execute migration
  python migration_orchestrator.py --rollback             # Rollback migration
  python migration_orchestrator.py --status               # Check status
        """
    )
    
    parser.add_argument("--migrate", action="store_true",
                       help="Execute the documentation migration")
    parser.add_argument("--dry-run", action="store_true",
                       help="Preview migration without making changes")
    parser.add_argument("--rollback", action="store_true",
                       help="Rollback the migration")
    parser.add_argument("--status", action="store_true",
                       help="Show migration status")
    parser.add_argument("--base-dir", default=".",
                       help="Base directory for migration (default: current directory)")
    
    args = parser.parse_args()
    
    if not any([args.migrate, args.rollback, args.status]):
        parser.print_help()
        return
    
    orchestrator = MigrationOrchestrator(args.base_dir)
    
    try:
        if args.migrate:
            success = orchestrator.execute_full_migration(dry_run=args.dry_run)
            if success:
                if args.dry_run:
                    print("\n✅ Dry run completed successfully!")
                    print("Run without --dry-run to execute the migration.")
                else:
                    print("\n✅ Documentation migration completed successfully!")
                    print("Your documentation has been reorganized into the docs/ directory.")
            else:
                print("\n❌ Migration failed!")
                sys.exit(1)
        
        elif args.rollback:
            success = orchestrator.rollback_migration()
            if success:
                print("\n✅ Migration rollback completed successfully!")
            else:
                print("\n❌ Rollback failed!")
                sys.exit(1)
        
        elif args.status:
            status = orchestrator.get_migration_status()
            print("\n📊 Migration Status:")
            print("=" * 50)
            for key, value in status.items():
                print(f"{key}: {value}")
    
    except KeyboardInterrupt:
        print("\n\n⚠️ Migration interrupted by user")
        print("You can rollback the migration using: python migration_orchestrator.py --rollback")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()