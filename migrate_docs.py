#!/usr/bin/env python3
"""
AI Life Assistant Documentation Migration Script

This script provides a user-friendly interface for migrating the project's
documentation from scattered files to an organized docs/ directory structure.

Usage:
    python migrate_docs.py                    # Interactive mode
    python migrate_docs.py --preview          # Preview changes
    python migrate_docs.py --execute          # Execute migration
    python migrate_docs.py --rollback         # Rollback migration
    python migrate_docs.py --status           # Check status
"""

import sys
import os
from pathlib import Path

# Add utils directory to path for imports
sys.path.insert(0, str(Path(__file__).parent / "utils"))

from utils.migration_orchestrator import MigrationOrchestrator


def print_banner():
    """Print the application banner"""
    print("=" * 70)
    print("🤖 AI Life Assistant - Documentation Migration Tool")
    print("=" * 70)
    print()


def print_migration_info():
    """Print information about what the migration will do"""
    print("📋 Migration Overview:")
    print("=" * 50)
    print()
    print("This migration will reorganize your documentation files into a")
    print("professional directory structure:")
    print()
    print("📁 docs/")
    print("  ├── 📄 README.md                    # Main documentation index")
    print("  ├── 📁 project/                     # Project overview & planning")
    print("  │   ├── 📄 README.md")
    print("  │   ├── 📄 concept.md               # 构想.md")
    print("  │   ├── 📄 phase1-summary.md        # PHASE1_SUMMARY.md")
    print("  │   ├── 📄 phase2-plan.md           # PHASE2_PLAN.md")
    print("  │   ├── 📄 phase2-summary.md        # PHASE2_SUMMARY.md")
    print("  │   └── 📄 web-app-requirements.md  # WEB_APP_REQUIREMENTS.md")
    print("  ├── 📁 guides/                      # User guides & tutorials")
    print("  │   ├── 📄 README.md")
    print("  │   ├── 📄 quickstart.md            # QUICKSTART.md")
    print("  │   └── 📄 user-profile.md          # aboutme.md")
    print("  ├── 📁 development/                 # Development documentation")
    print("  │   ├── 📄 README.md")
    print("  │   ├── 📄 claude-guide.md          # CLAUDE.md")
    print("  │   ├── 📄 glm-integration.md       # GLM_INTEGRATION_GUIDE.md")
    print("  │   └── 📄 rules.md                 # rules.md")
    print("  └── 📁 technical/                   # Technical specifications")
    print("      └── 📄 README.md")
    print()
    print("✅ Benefits:")
    print("  • Professional documentation structure")
    print("  • Easy navigation with README files in each section")
    print("  • Automatic link updates to maintain functionality")
    print("  • Configuration file updates for seamless operation")
    print("  • Full backup and rollback capability")
    print()


def confirm_action(message: str) -> bool:
    """Get user confirmation for an action"""
    while True:
        response = input(f"{message} (y/n): ").lower().strip()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Please enter 'y' for yes or 'n' for no.")


def show_menu():
    """Show the interactive menu"""
    print("🎯 Choose an action:")
    print("=" * 30)
    print("1. 👀 Preview migration (dry run)")
    print("2. 🚀 Execute migration")
    print("3. ↩️  Rollback migration")
    print("4. 📊 Check migration status")
    print("5. ❌ Exit")
    print()


def handle_preview(orchestrator: MigrationOrchestrator):
    """Handle preview/dry run"""
    print("\n🔍 Previewing Migration Changes...")
    print("=" * 50)
    
    success = orchestrator.execute_full_migration(dry_run=True)
    
    if success:
        print("\n✅ Preview completed successfully!")
        print("\nThe migration looks good. All files and references have been")
        print("validated and the migration should complete without issues.")
        print("\nChoose option 2 from the menu to execute the migration.")
    else:
        print("\n❌ Preview failed!")
        print("Please check the error messages above and fix any issues")
        print("before attempting the migration.")


def handle_execute(orchestrator: MigrationOrchestrator):
    """Handle migration execution"""
    print("\n🚀 Executing Documentation Migration...")
    print("=" * 50)
    
    print("⚠️  IMPORTANT: This will modify your files!")
    print("A complete backup will be created before any changes are made.")
    print()
    
    if not confirm_action("Are you sure you want to proceed with the migration?"):
        print("Migration cancelled.")
        return
    
    print("\n🔄 Starting migration process...")
    success = orchestrator.execute_full_migration(dry_run=False)
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("=" * 50)
        print("✅ Your documentation has been reorganized into the docs/ directory")
        print("✅ All links and references have been updated")
        print("✅ Configuration files have been updated")
        print("✅ Navigation README files have been created")
        print()
        print("📁 You can now explore your new documentation structure:")
        print("   • Main index: docs/README.md")
        print("   • Project docs: docs/project/")
        print("   • User guides: docs/guides/")
        print("   • Development docs: docs/development/")
        print()
        print("🔧 Your AI Life Assistant system will continue to work normally")
        print("   with all file paths automatically updated.")
    else:
        print("\n❌ Migration failed!")
        print("=" * 30)
        print("The system has automatically rolled back all changes.")
        print("Your files are in their original state.")
        print("Please check the error messages above and try again.")


def handle_rollback(orchestrator: MigrationOrchestrator):
    """Handle migration rollback"""
    print("\n↩️  Rolling Back Migration...")
    print("=" * 40)
    
    print("⚠️  This will restore all files to their original locations")
    print("and undo all migration changes.")
    print()
    
    if not confirm_action("Are you sure you want to rollback the migration?"):
        print("Rollback cancelled.")
        return
    
    success = orchestrator.rollback_migration()
    
    if success:
        print("\n✅ Rollback completed successfully!")
        print("All files have been restored to their original locations.")
    else:
        print("\n❌ Rollback failed!")
        print("Please check the error messages above.")


def handle_status(orchestrator: MigrationOrchestrator):
    """Handle status check"""
    print("\n📊 Migration Status")
    print("=" * 30)
    
    status = orchestrator.get_migration_status()
    
    if status.get("status") == "no_migration_found":
        print("No migration has been performed yet.")
        print("Choose option 1 to preview or option 2 to execute a migration.")
    else:
        print(f"Migration ID: {status.get('migration_id', 'Unknown')}")
        print(f"Status: {status.get('status', 'Unknown')}")
        print(f"Start Time: {status.get('start_time', 'Unknown')}")
        print(f"End Time: {status.get('end_time', 'Not completed')}")
        
        if status.get('duration_seconds'):
            print(f"Duration: {status['duration_seconds']:.2f} seconds")
        
        print(f"Total Steps: {status.get('total_steps', 0)}")
        print(f"Successful Steps: {status.get('successful_steps', 0)}")
        print(f"Failed Steps: {status.get('failed_steps', 0)}")
        
        if status.get('backup_location'):
            print(f"Backup Location: {status['backup_location']}")


def interactive_mode():
    """Run in interactive mode"""
    print_banner()
    print_migration_info()
    
    orchestrator = MigrationOrchestrator()
    
    while True:
        show_menu()
        
        try:
            choice = input("Enter your choice (1-5): ").strip()
            
            if choice == '1':
                handle_preview(orchestrator)
            elif choice == '2':
                handle_execute(orchestrator)
            elif choice == '3':
                handle_rollback(orchestrator)
            elif choice == '4':
                handle_status(orchestrator)
            elif choice == '5':
                print("\n👋 Goodbye!")
                break
            else:
                print("\n❌ Invalid choice. Please enter a number from 1-5.")
            
            if choice in ['1', '2', '3', '4']:
                input("\nPress Enter to continue...")
                print("\n" + "=" * 70 + "\n")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            input("Press Enter to continue...")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="AI Life Assistant Documentation Migration Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python migrate_docs.py                # Interactive mode
  python migrate_docs.py --preview      # Preview changes
  python migrate_docs.py --execute      # Execute migration
  python migrate_docs.py --rollback     # Rollback migration
  python migrate_docs.py --status       # Check status
        """
    )
    
    parser.add_argument("--preview", action="store_true",
                       help="Preview migration changes without executing")
    parser.add_argument("--execute", action="store_true", 
                       help="Execute the documentation migration")
    parser.add_argument("--rollback", action="store_true",
                       help="Rollback the migration")
    parser.add_argument("--status", action="store_true",
                       help="Show migration status")
    
    args = parser.parse_args()
    
    # If no arguments provided, run in interactive mode
    if not any([args.preview, args.execute, args.rollback, args.status]):
        interactive_mode()
        return
    
    # Non-interactive mode
    print_banner()
    orchestrator = MigrationOrchestrator()
    
    try:
        if args.preview:
            print("🔍 Previewing migration changes...\n")
            success = orchestrator.execute_full_migration(dry_run=True)
            if success:
                print("\n✅ Preview completed successfully!")
                print("Run with --execute to perform the migration.")
            else:
                print("\n❌ Preview failed!")
                sys.exit(1)
        
        elif args.execute:
            print("🚀 Executing documentation migration...\n")
            success = orchestrator.execute_full_migration(dry_run=False)
            if success:
                print("\n🎉 Migration completed successfully!")
            else:
                print("\n❌ Migration failed!")
                sys.exit(1)
        
        elif args.rollback:
            print("↩️  Rolling back migration...\n")
            success = orchestrator.rollback_migration()
            if success:
                print("\n✅ Rollback completed successfully!")
            else:
                print("\n❌ Rollback failed!")
                sys.exit(1)
        
        elif args.status:
            status = orchestrator.get_migration_status()
            print("📊 Migration Status:")
            print("=" * 30)
            for key, value in status.items():
                print(f"{key}: {value}")
    
    except KeyboardInterrupt:
        print("\n\n⚠️ Operation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()