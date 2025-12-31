#!/usr/bin/env python3
"""
Migration Error Handler and Rollback System

This module provides comprehensive error handling and rollback functionality
for the documentation migration process, ensuring safe and recoverable operations.
"""

import os
import shutil
import logging
import traceback
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from pathlib import Path
from datetime import datetime
import json


@dataclass
class MigrationStep:
    """Represents a single migration step"""
    step_id: str
    step_name: str
    description: str
    executed: bool = False
    success: bool = False
    error_message: Optional[str] = None
    timestamp: Optional[datetime] = None
    rollback_data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MigrationState:
    """Tracks the overall migration state"""
    migration_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str = "in_progress"  # in_progress, completed, failed, rolled_back
    steps: List[MigrationStep] = field(default_factory=list)
    backup_location: Optional[str] = None
    error_count: int = 0
    warning_count: int = 0


class MigrationErrorHandler:
    """Main class for handling migration errors and rollbacks"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.backup_dir = self.base_dir / ".migration_backup"
        self.state_file = self.backup_dir / "migration_state.json"
        self.log_file = self.backup_dir / "migration.log"
        
        # Current migration state
        self.migration_state: Optional[MigrationState] = None
        
        # Setup logging
        self._setup_logging()
        self.logger = logging.getLogger(__name__)
    
    def _setup_logging(self):
        """Setup comprehensive logging for migration process"""
        # Ensure backup directory exists
        self.backup_dir.mkdir(exist_ok=True)
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(self.log_file),
                logging.StreamHandler()
            ]
        )
    
    def start_migration(self, migration_id: str = None) -> str:
        """Start a new migration process"""
        if migration_id is None:
            migration_id = f"migration_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        self.migration_state = MigrationState(
            migration_id=migration_id,
            start_time=datetime.now()
        )
        
        self.logger.info(f"Starting migration: {migration_id}")
        self._save_state()
        return migration_id
    
    def add_step(self, step_id: str, step_name: str, description: str) -> MigrationStep:
        """Add a migration step to track"""
        if not self.migration_state:
            raise RuntimeError("Migration not started. Call start_migration() first.")
        
        step = MigrationStep(
            step_id=step_id,
            step_name=step_name,
            description=description
        )
        
        self.migration_state.steps.append(step)
        self.logger.info(f"Added migration step: {step_id} - {step_name}")
        self._save_state()
        return step
    
    def execute_step(self, step_id: str, operation_func, *args, **kwargs) -> bool:
        """Execute a migration step with error handling"""
        if not self.migration_state:
            raise RuntimeError("Migration not started. Call start_migration() first.")
        
        # Find the step
        step = next((s for s in self.migration_state.steps if s.step_id == step_id), None)
        if not step:
            raise ValueError(f"Step not found: {step_id}")
        
        if step.executed:
            self.logger.warning(f"Step already executed: {step_id}")
            return step.success
        
        self.logger.info(f"Executing step: {step_id} - {step.step_name}")
        step.timestamp = datetime.now()
        step.executed = True
        
        try:
            # Execute the operation
            result = operation_func(*args, **kwargs)
            
            if isinstance(result, bool):
                step.success = result
            elif isinstance(result, tuple) and len(result) == 2:
                # Assume (success, rollback_data) tuple
                step.success, step.rollback_data = result
            else:
                # Assume success if no exception was raised
                step.success = True
                step.rollback_data = result if result is not None else {}
            
            if step.success:
                self.logger.info(f"Step completed successfully: {step_id}")
            else:
                self.logger.error(f"Step failed: {step_id}")
                self.migration_state.error_count += 1
            
        except Exception as e:
            step.success = False
            step.error_message = str(e)
            self.migration_state.error_count += 1
            
            self.logger.error(f"Step failed with exception: {step_id}")
            self.logger.error(f"Error: {e}")
            self.logger.error(f"Traceback: {traceback.format_exc()}")
        
        self._save_state()
        return step.success
    
    def create_comprehensive_backup(self) -> bool:
        """Create a comprehensive backup before migration"""
        try:
            self.logger.info("Creating comprehensive backup...")
            
            # Remove existing backup if it exists
            if self.backup_dir.exists():
                shutil.rmtree(self.backup_dir)
            
            self.backup_dir.mkdir()
            
            # Files to backup
            files_to_backup = [
                "构想.md", "PHASE1_SUMMARY.md", "PHASE2_PLAN.md", "PHASE2_SUMMARY.md",
                "WEB_APP_REQUIREMENTS.md", "QUICKSTART.md", "aboutme.md", "CLAUDE.md",
                "GLM_INTEGRATION_GUIDE.md", "rules.md", "README.md"
            ]
            
            # Configuration files to backup
            config_files = ["config/config.ini", "config/config_glm.ini"]
            
            # Backup documentation files
            for file_name in files_to_backup:
                file_path = self.base_dir / file_name
                if file_path.exists():
                    backup_path = self.backup_dir / "original_files" / file_name
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(file_path, backup_path)
                    self.logger.info(f"Backed up: {file_name}")
            
            # Backup configuration files
            for config_file in config_files:
                config_path = self.base_dir / config_file
                if config_path.exists():
                    backup_path = self.backup_dir / "original_configs" / config_file
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(config_path, backup_path)
                    self.logger.info(f"Backed up config: {config_file}")
            
            # Backup existing docs directory if it exists
            docs_dir = self.base_dir / "docs"
            if docs_dir.exists():
                backup_docs = self.backup_dir / "existing_docs"
                shutil.copytree(docs_dir, backup_docs)
                self.logger.info("Backed up existing docs directory")
            
            # Create backup manifest
            manifest = {
                "backup_time": datetime.now().isoformat(),
                "files_backed_up": files_to_backup,
                "config_files_backed_up": config_files,
                "docs_directory_existed": docs_dir.exists()
            }
            
            manifest_path = self.backup_dir / "backup_manifest.json"
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            if self.migration_state:
                self.migration_state.backup_location = str(self.backup_dir)
            
            self.logger.info(f"Comprehensive backup created at: {self.backup_dir}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to create comprehensive backup: {e}")
            return False
    
    def rollback_migration(self) -> bool:
        """Rollback the entire migration process"""
        try:
            self.logger.info("Starting migration rollback...")
            
            if not self.backup_dir.exists():
                self.logger.error("No backup found for rollback")
                return False
            
            # Load backup manifest
            manifest_path = self.backup_dir / "backup_manifest.json"
            if manifest_path.exists():
                with open(manifest_path, 'r') as f:
                    manifest = json.load(f)
            else:
                self.logger.warning("No backup manifest found, proceeding with best effort rollback")
                manifest = {}
            
            # Restore original files
            original_files_dir = self.backup_dir / "original_files"
            if original_files_dir.exists():
                for backup_file in original_files_dir.rglob("*"):
                    if backup_file.is_file():
                        relative_path = backup_file.relative_to(original_files_dir)
                        restore_path = self.base_dir / relative_path
                        restore_path.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(backup_file, restore_path)
                        self.logger.info(f"Restored: {relative_path}")
            
            # Restore configuration files
            original_configs_dir = self.backup_dir / "original_configs"
            if original_configs_dir.exists():
                for backup_file in original_configs_dir.rglob("*"):
                    if backup_file.is_file():
                        relative_path = backup_file.relative_to(original_configs_dir)
                        restore_path = self.base_dir / relative_path
                        restore_path.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(backup_file, restore_path)
                        self.logger.info(f"Restored config: {relative_path}")
            
            # Handle docs directory
            docs_dir = self.base_dir / "docs"
            existing_docs_backup = self.backup_dir / "existing_docs"
            
            if existing_docs_backup.exists():
                # Restore original docs directory
                if docs_dir.exists():
                    shutil.rmtree(docs_dir)
                shutil.copytree(existing_docs_backup, docs_dir)
                self.logger.info("Restored original docs directory")
            else:
                # Remove docs directory if it was created during migration
                if docs_dir.exists():
                    shutil.rmtree(docs_dir)
                    self.logger.info("Removed docs directory created during migration")
            
            # Update migration state
            if self.migration_state:
                self.migration_state.status = "rolled_back"
                self.migration_state.end_time = datetime.now()
                self._save_state()
            
            self.logger.info("Migration rollback completed successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Rollback failed: {e}")
            self.logger.error(f"Traceback: {traceback.format_exc()}")
            return False
    
    def complete_migration(self, success: bool = True) -> bool:
        """Mark migration as completed"""
        if not self.migration_state:
            raise RuntimeError("Migration not started. Call start_migration() first.")
        
        self.migration_state.status = "completed" if success else "failed"
        self.migration_state.end_time = datetime.now()
        
        if success:
            self.logger.info(f"Migration completed successfully: {self.migration_state.migration_id}")
        else:
            self.logger.error(f"Migration failed: {self.migration_state.migration_id}")
        
        self._save_state()
        return success
    
    def cleanup_backup(self) -> bool:
        """Clean up backup files after successful migration"""
        try:
            if not self.migration_state or self.migration_state.status != "completed":
                self.logger.warning("Cannot cleanup backup: migration not completed successfully")
                return False
            
            if self.backup_dir.exists():
                # Keep the log file and state file for reference
                log_backup = self.backup_dir / "migration.log.final"
                state_backup = self.backup_dir / "migration_state.json.final"
                
                if self.log_file.exists():
                    shutil.copy2(self.log_file, log_backup)
                if self.state_file.exists():
                    shutil.copy2(self.state_file, state_backup)
                
                # Remove the backup directory
                shutil.rmtree(self.backup_dir)
                
                # Create a minimal backup directory with just the final files
                self.backup_dir.mkdir()
                if log_backup.parent != self.backup_dir:
                    shutil.move(log_backup, self.backup_dir / "migration.log")
                if state_backup.parent != self.backup_dir:
                    shutil.move(state_backup, self.backup_dir / "migration_state.json")
                
                self.logger.info("Backup cleanup completed")
                return True
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup backup: {e}")
            return False
    
    def _save_state(self):
        """Save migration state to file"""
        if not self.migration_state:
            return
        
        try:
            self.backup_dir.mkdir(exist_ok=True)
            
            # Convert state to JSON-serializable format
            state_dict = {
                "migration_id": self.migration_state.migration_id,
                "start_time": self.migration_state.start_time.isoformat(),
                "end_time": self.migration_state.end_time.isoformat() if self.migration_state.end_time else None,
                "status": self.migration_state.status,
                "backup_location": self.migration_state.backup_location,
                "error_count": self.migration_state.error_count,
                "warning_count": self.migration_state.warning_count,
                "steps": [
                    {
                        "step_id": step.step_id,
                        "step_name": step.step_name,
                        "description": step.description,
                        "executed": step.executed,
                        "success": step.success,
                        "error_message": step.error_message,
                        "timestamp": step.timestamp.isoformat() if step.timestamp else None,
                        "rollback_data": step.rollback_data
                    }
                    for step in self.migration_state.steps
                ]
            }
            
            with open(self.state_file, 'w') as f:
                json.dump(state_dict, f, indent=2)
                
        except Exception as e:
            self.logger.error(f"Failed to save migration state: {e}")
    
    def load_state(self, migration_id: str = None) -> bool:
        """Load migration state from file"""
        try:
            if not self.state_file.exists():
                self.logger.warning("No migration state file found")
                return False
            
            with open(self.state_file, 'r') as f:
                state_dict = json.load(f)
            
            # Filter by migration_id if specified
            if migration_id and state_dict.get("migration_id") != migration_id:
                self.logger.warning(f"Migration ID mismatch: expected {migration_id}, found {state_dict.get('migration_id')}")
                return False
            
            # Reconstruct migration state
            self.migration_state = MigrationState(
                migration_id=state_dict["migration_id"],
                start_time=datetime.fromisoformat(state_dict["start_time"]),
                end_time=datetime.fromisoformat(state_dict["end_time"]) if state_dict["end_time"] else None,
                status=state_dict["status"],
                backup_location=state_dict.get("backup_location"),
                error_count=state_dict.get("error_count", 0),
                warning_count=state_dict.get("warning_count", 0)
            )
            
            # Reconstruct steps
            for step_dict in state_dict.get("steps", []):
                step = MigrationStep(
                    step_id=step_dict["step_id"],
                    step_name=step_dict["step_name"],
                    description=step_dict["description"],
                    executed=step_dict["executed"],
                    success=step_dict["success"],
                    error_message=step_dict.get("error_message"),
                    timestamp=datetime.fromisoformat(step_dict["timestamp"]) if step_dict["timestamp"] else None,
                    rollback_data=step_dict.get("rollback_data", {})
                )
                self.migration_state.steps.append(step)
            
            self.logger.info(f"Loaded migration state: {self.migration_state.migration_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to load migration state: {e}")
            return False
    
    def get_migration_summary(self) -> Dict[str, Any]:
        """Get a summary of the migration process"""
        if not self.migration_state:
            return {"error": "No migration state available"}
        
        total_steps = len(self.migration_state.steps)
        executed_steps = sum(1 for step in self.migration_state.steps if step.executed)
        successful_steps = sum(1 for step in self.migration_state.steps if step.success)
        failed_steps = sum(1 for step in self.migration_state.steps if step.executed and not step.success)
        
        duration = None
        if self.migration_state.end_time:
            duration = (self.migration_state.end_time - self.migration_state.start_time).total_seconds()
        
        return {
            "migration_id": self.migration_state.migration_id,
            "status": self.migration_state.status,
            "start_time": self.migration_state.start_time.isoformat(),
            "end_time": self.migration_state.end_time.isoformat() if self.migration_state.end_time else None,
            "duration_seconds": duration,
            "total_steps": total_steps,
            "executed_steps": executed_steps,
            "successful_steps": successful_steps,
            "failed_steps": failed_steps,
            "error_count": self.migration_state.error_count,
            "warning_count": self.migration_state.warning_count,
            "backup_location": self.migration_state.backup_location
        }


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Migration error handler and rollback system")
    parser.add_argument("--rollback", action="store_true",
                       help="Rollback the last migration")
    parser.add_argument("--cleanup", action="store_true",
                       help="Cleanup backup files after successful migration")
    parser.add_argument("--status", action="store_true",
                       help="Show migration status")
    parser.add_argument("--migration-id", 
                       help="Specific migration ID to work with")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for migration (default: current directory)")
    
    args = parser.parse_args()
    
    handler = MigrationErrorHandler(args.base_dir)
    
    if args.status:
        if handler.load_state(args.migration_id):
            summary = handler.get_migration_summary()
            print(json.dumps(summary, indent=2))
        else:
            print("No migration state found")
    elif args.rollback:
        if handler.load_state(args.migration_id):
            success = handler.rollback_migration()
            print("Rollback completed successfully!" if success else "Rollback failed!")
        else:
            print("No migration state found for rollback")
    elif args.cleanup:
        if handler.load_state(args.migration_id):
            success = handler.cleanup_backup()
            print("Cleanup completed successfully!" if success else "Cleanup failed!")
        else:
            print("No migration state found for cleanup")
    else:
        print("Please specify an action: --status, --rollback, or --cleanup")