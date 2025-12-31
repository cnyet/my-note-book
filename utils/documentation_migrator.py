#!/usr/bin/env python3
"""
Documentation Migration Utility

This module provides functionality to migrate scattered documentation files
into a well-organized docs/ directory structure while maintaining all
references and system functionality.
"""

import os
import shutil
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import hashlib


@dataclass
class MigrationConfig:
    """Configuration for a single file migration"""
    source_file: str
    destination_file: str
    update_references: bool = True
    preserve_original: bool = False


@dataclass
class DocumentationStructure:
    """Configuration for the entire documentation structure"""
    base_dir: str
    sections: Dict[str, List[str]]
    migration_map: Dict[str, str]
    
    def validate(self) -> bool:
        """Validate the documentation structure configuration"""
        # Check that all source files exist
        for source_file in self.migration_map.keys():
            if not os.path.exists(os.path.join(self.base_dir, source_file)):
                logging.error(f"Source file not found: {source_file}")
                return False
        return True


class DocumentationMigrator:
    """Main class for handling documentation migration"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.docs_dir = self.base_dir / "docs"
        self.migration_map = self._build_migration_map()
        self.backup_dir = self.base_dir / ".migration_backup"
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def _build_migration_map(self) -> Dict[str, str]:
        """Define source to destination mapping for all files"""
        return {
            "构想.md": "docs/project/concept.md",
            "PHASE1_SUMMARY.md": "docs/project/phase1-summary.md", 
            "PHASE2_PLAN.md": "docs/project/phase2-plan.md",
            "PHASE2_SUMMARY.md": "docs/project/phase2-summary.md",
            "WEB_APP_REQUIREMENTS.md": "docs/project/web-app-requirements.md",
            "QUICKSTART.md": "docs/guides/quickstart.md",
            "aboutme.md": "docs/guides/user-profile.md",
            "CLAUDE.md": "docs/development/claude-guide.md",
            "GLM_INTEGRATION_GUIDE.md": "docs/development/glm-integration.md",
            "rules.md": "docs/development/rules.md"
        }
    
    def create_directory_structure(self) -> bool:
        """Create the new docs directory structure"""
        try:
            directories = [
                "docs",
                "docs/project", 
                "docs/guides",
                "docs/development",
                "docs/technical"
            ]
            
            for directory in directories:
                dir_path = self.base_dir / directory
                dir_path.mkdir(parents=True, exist_ok=True)
                self.logger.info(f"Created directory: {directory}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to create directory structure: {e}")
            return False
    
    def create_backup(self) -> bool:
        """Create a backup of all files before migration"""
        try:
            if self.backup_dir.exists():
                shutil.rmtree(self.backup_dir)
            
            self.backup_dir.mkdir()
            
            # Backup all files that will be migrated
            for source_file in self.migration_map.keys():
                source_path = self.base_dir / source_file
                if source_path.exists():
                    backup_path = self.backup_dir / source_file
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source_path, backup_path)
                    self.logger.info(f"Backed up: {source_file}")
            
            # Also backup configuration files
            config_files = ["config/config.ini", "config/config_glm.ini"]
            for config_file in config_files:
                config_path = self.base_dir / config_file
                if config_path.exists():
                    backup_path = self.backup_dir / config_file
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(config_path, backup_path)
                    self.logger.info(f"Backed up config: {config_file}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to create backup: {e}")
            return False
    
    def validate_file_content(self, source_path: Path, dest_path: Path) -> bool:
        """Validate that file content is preserved after migration"""
        try:
            if not source_path.exists() or not dest_path.exists():
                return False
            
            # Compare file hashes to ensure content is identical
            with open(source_path, 'rb') as f:
                source_hash = hashlib.md5(f.read()).hexdigest()
            
            with open(dest_path, 'rb') as f:
                dest_hash = hashlib.md5(f.read()).hexdigest()
            
            return source_hash == dest_hash
            
        except Exception as e:
            self.logger.error(f"Failed to validate file content: {e}")
            return False
    
    def migrate_single_file(self, source_file: str, dest_file: str) -> bool:
        """Migrate a single file from source to destination"""
        try:
            source_path = self.base_dir / source_file
            dest_path = self.base_dir / dest_file
            
            if not source_path.exists():
                self.logger.warning(f"Source file not found: {source_file}")
                return False
            
            # Ensure destination directory exists
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy the file
            shutil.copy2(source_path, dest_path)
            
            # Validate content preservation
            if not self.validate_file_content(source_path, dest_path):
                self.logger.error(f"Content validation failed for: {source_file}")
                return False
            
            self.logger.info(f"Migrated: {source_file} -> {dest_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to migrate {source_file}: {e}")
            return False
    
    def migrate_files(self) -> bool:
        """Execute the file migration process"""
        try:
            success_count = 0
            total_count = len(self.migration_map)
            
            for source_file, dest_file in self.migration_map.items():
                if self.migrate_single_file(source_file, dest_file):
                    success_count += 1
                else:
                    self.logger.error(f"Failed to migrate: {source_file}")
            
            self.logger.info(f"Migration completed: {success_count}/{total_count} files")
            return success_count == total_count
            
        except Exception as e:
            self.logger.error(f"Migration process failed: {e}")
            return False
    
    def cleanup_source_files(self) -> bool:
        """Remove migrated files from their original locations"""
        try:
            for source_file in self.migration_map.keys():
                source_path = self.base_dir / source_file
                if source_path.exists():
                    source_path.unlink()
                    self.logger.info(f"Removed original file: {source_file}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup source files: {e}")
            return False
    
    def rollback_migration(self) -> bool:
        """Rollback changes if migration fails"""
        try:
            if not self.backup_dir.exists():
                self.logger.error("No backup found for rollback")
                return False
            
            # Restore all backed up files
            for backup_file in self.backup_dir.rglob("*"):
                if backup_file.is_file():
                    relative_path = backup_file.relative_to(self.backup_dir)
                    restore_path = self.base_dir / relative_path
                    restore_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(backup_file, restore_path)
                    self.logger.info(f"Restored: {relative_path}")
            
            # Remove the docs directory if it was created
            if self.docs_dir.exists():
                shutil.rmtree(self.docs_dir)
                self.logger.info("Removed docs directory")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Rollback failed: {e}")
            return False
    
    def validate_migration(self) -> bool:
        """Validate that migration was successful"""
        try:
            # Check that all destination files exist
            for source_file, dest_file in self.migration_map.items():
                dest_path = self.base_dir / dest_file
                if not dest_path.exists():
                    self.logger.error(f"Destination file missing: {dest_file}")
                    return False
            
            # Check directory structure compliance (max 3 levels)
            for root, dirs, files in os.walk(self.docs_dir):
                depth = len(Path(root).relative_to(self.docs_dir).parts)
                if depth > 3:
                    self.logger.error(f"Directory nesting too deep: {root}")
                    return False
            
            self.logger.info("Migration validation passed")
            return True
            
        except Exception as e:
            self.logger.error(f"Migration validation failed: {e}")
            return False
    
    def execute_migration(self, dry_run: bool = False) -> bool:
        """Execute the complete migration process"""
        try:
            self.logger.info("Starting documentation migration...")
            
            if dry_run:
                self.logger.info("DRY RUN MODE - No files will be modified")
                # Just validate the migration plan
                for source_file, dest_file in self.migration_map.items():
                    source_path = self.base_dir / source_file
                    if source_path.exists():
                        self.logger.info(f"Would migrate: {source_file} -> {dest_file}")
                    else:
                        self.logger.warning(f"Source file not found: {source_file}")
                return True
            
            # Step 1: Create backup
            if not self.create_backup():
                self.logger.error("Failed to create backup")
                return False
            
            # Step 2: Create directory structure
            if not self.create_directory_structure():
                self.logger.error("Failed to create directory structure")
                self.rollback_migration()
                return False
            
            # Step 3: Migrate files
            if not self.migrate_files():
                self.logger.error("File migration failed")
                self.rollback_migration()
                return False
            
            # Step 4: Validate migration
            if not self.validate_migration():
                self.logger.error("Migration validation failed")
                self.rollback_migration()
                return False
            
            self.logger.info("Documentation migration completed successfully!")
            return True
            
        except Exception as e:
            self.logger.error(f"Migration execution failed: {e}")
            self.rollback_migration()
            return False


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Migrate documentation files")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Show what would be migrated without making changes")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for migration (default: current directory)")
    
    args = parser.parse_args()
    
    migrator = DocumentationMigrator(args.base_dir)
    success = migrator.execute_migration(dry_run=args.dry_run)
    
    if success:
        print("Migration completed successfully!")
    else:
        print("Migration failed!")
        exit(1)