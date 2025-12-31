#!/usr/bin/env python3
"""
Configuration File Update System

This module provides functionality to update configuration files after
documentation migration, ensuring all file paths remain valid.
"""

import os
import logging
import configparser
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import shutil


@dataclass
class ConfigUpdate:
    """Represents a configuration update operation"""
    config_file: str
    section: str
    option: str
    old_value: str
    new_value: str


class ConfigurationUpdater:
    """Main class for updating configuration files after documentation migration"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.migration_map = self._build_migration_map()
        self.config_files = [
            "config/config.ini",
            "config/config_glm.ini"
        ]
        
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
    
    def create_backup(self, config_file: str) -> bool:
        """Create a backup of a configuration file"""
        try:
            config_path = self.base_dir / config_file
            if not config_path.exists():
                self.logger.warning(f"Configuration file not found: {config_file}")
                return False
            
            backup_path = config_path.with_suffix(config_path.suffix + '.backup')
            shutil.copy2(config_path, backup_path)
            self.logger.info(f"Created backup: {backup_path}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to create backup for {config_file}: {e}")
            return False
    
    def restore_backup(self, config_file: str) -> bool:
        """Restore a configuration file from backup"""
        try:
            config_path = self.base_dir / config_file
            backup_path = config_path.with_suffix(config_path.suffix + '.backup')
            
            if not backup_path.exists():
                self.logger.error(f"Backup file not found: {backup_path}")
                return False
            
            shutil.copy2(backup_path, config_path)
            self.logger.info(f"Restored from backup: {config_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to restore backup for {config_file}: {e}")
            return False
    
    def scan_config_file(self, config_file: str) -> List[ConfigUpdate]:
        """Scan a configuration file for paths that need updating"""
        updates = []
        
        try:
            config_path = self.base_dir / config_file
            if not config_path.exists():
                self.logger.warning(f"Configuration file not found: {config_file}")
                return updates
            
            config = configparser.ConfigParser()
            config.read(config_path)
            
            # Check all sections and options for file paths
            for section_name in config.sections():
                section = config[section_name]
                for option_name in section:
                    value = section[option_name]
                    
                    # Check if this value is a file path that needs updating
                    if value in self.migration_map:
                        new_value = self.migration_map[value]
                        updates.append(ConfigUpdate(
                            config_file=config_file,
                            section=section_name,
                            option=option_name,
                            old_value=value,
                            new_value=new_value
                        ))
                        self.logger.info(f"Found update needed: {config_file}[{section_name}].{option_name}: {value} -> {new_value}")
            
            return updates
            
        except Exception as e:
            self.logger.error(f"Failed to scan config file {config_file}: {e}")
            return updates
    
    def apply_config_update(self, update: ConfigUpdate) -> bool:
        """Apply a single configuration update"""
        try:
            config_path = self.base_dir / update.config_file
            
            # Read the configuration file
            config = configparser.ConfigParser()
            config.read(config_path)
            
            # Verify the current value matches what we expect
            if not config.has_section(update.section):
                self.logger.error(f"Section [{update.section}] not found in {update.config_file}")
                return False
            
            if not config.has_option(update.section, update.option):
                self.logger.error(f"Option {update.option} not found in [{update.section}] of {update.config_file}")
                return False
            
            current_value = config.get(update.section, update.option)
            if current_value != update.old_value:
                self.logger.warning(f"Current value '{current_value}' doesn't match expected '{update.old_value}' in {update.config_file}")
                # Continue anyway, but log the discrepancy
            
            # Update the value
            config.set(update.section, update.option, update.new_value)
            
            # Write the updated configuration back to file
            with open(config_path, 'w') as f:
                config.write(f)
            
            self.logger.info(f"Updated {update.config_file}[{update.section}].{update.option}: {update.old_value} -> {update.new_value}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to apply config update: {e}")
            return False
    
    def validate_config_paths(self, config_file: str) -> bool:
        """Validate that all file paths in a configuration file exist"""
        try:
            config_path = self.base_dir / config_file
            if not config_path.exists():
                self.logger.warning(f"Configuration file not found: {config_file}")
                return False
            
            config = configparser.ConfigParser()
            config.read(config_path)
            
            validation_errors = []
            
            # Check specific known file path options
            file_path_options = [
                ('data', 'aboutme_path'),
                # Add more file path options here as needed
            ]
            
            for section_name, option_name in file_path_options:
                if config.has_section(section_name) and config.has_option(section_name, option_name):
                    file_path = config.get(section_name, option_name)
                    full_path = self.base_dir / file_path
                    
                    if not full_path.exists():
                        validation_errors.append(f"[{section_name}].{option_name}: {file_path} does not exist")
            
            if validation_errors:
                self.logger.error(f"Validation errors in {config_file}:")
                for error in validation_errors:
                    self.logger.error(f"  {error}")
                return False
            
            self.logger.info(f"Configuration validation passed for {config_file}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to validate config file {config_file}: {e}")
            return False
    
    def update_all_configurations(self, dry_run: bool = False) -> bool:
        """Update all configuration files with new documentation paths"""
        try:
            all_updates = []
            
            # Scan all configuration files for updates needed
            for config_file in self.config_files:
                updates = self.scan_config_file(config_file)
                all_updates.extend(updates)
            
            if not all_updates:
                self.logger.info("No configuration updates needed")
                return True
            
            if dry_run:
                self.logger.info(f"DRY RUN: Would apply {len(all_updates)} configuration updates:")
                for update in all_updates:
                    self.logger.info(f"  {update.config_file}[{update.section}].{update.option}: {update.old_value} -> {update.new_value}")
                return True
            
            # Create backups before making changes
            backup_success = True
            for config_file in set(update.config_file for update in all_updates):
                if not self.create_backup(config_file):
                    backup_success = False
            
            if not backup_success:
                self.logger.error("Failed to create all backups, aborting updates")
                return False
            
            # Apply all updates
            success_count = 0
            for update in all_updates:
                if self.apply_config_update(update):
                    success_count += 1
                else:
                    self.logger.error(f"Failed to apply update: {update}")
            
            if success_count != len(all_updates):
                self.logger.error(f"Only {success_count}/{len(all_updates)} updates succeeded, rolling back...")
                # Restore from backups
                for config_file in set(update.config_file for update in all_updates):
                    self.restore_backup(config_file)
                return False
            
            # Validate all updated configurations
            validation_success = True
            for config_file in set(update.config_file for update in all_updates):
                if not self.validate_config_paths(config_file):
                    validation_success = False
            
            if not validation_success:
                self.logger.error("Configuration validation failed after updates, rolling back...")
                # Restore from backups
                for config_file in set(update.config_file for update in all_updates):
                    self.restore_backup(config_file)
                return False
            
            self.logger.info(f"Successfully updated {len(all_updates)} configuration entries")
            return True
            
        except Exception as e:
            self.logger.error(f"Configuration update process failed: {e}")
            return False
    
    def cleanup_backups(self) -> bool:
        """Remove backup files after successful migration"""
        try:
            for config_file in self.config_files:
                config_path = self.base_dir / config_file
                backup_path = config_path.with_suffix(config_path.suffix + '.backup')
                
                if backup_path.exists():
                    backup_path.unlink()
                    self.logger.info(f"Removed backup: {backup_path}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup backups: {e}")
            return False


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Update configuration files after documentation migration")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Show what would be updated without making changes")
    parser.add_argument("--validate", action="store_true",
                       help="Validate configuration file paths")
    parser.add_argument("--cleanup", action="store_true",
                       help="Remove backup files")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for configuration updates (default: current directory)")
    
    args = parser.parse_args()
    
    updater = ConfigurationUpdater(args.base_dir)
    
    if args.validate:
        success = all(updater.validate_config_paths(config_file) for config_file in updater.config_files)
    elif args.cleanup:
        success = updater.cleanup_backups()
    else:
        success = updater.update_all_configurations(dry_run=args.dry_run)
    
    if success:
        print("Configuration update completed successfully!")
    else:
        print("Configuration update failed!")
        exit(1)