#!/usr/bin/env python3
"""
Link Reference Scanner and Updater

This module provides functionality to scan and update all internal references
to documentation files after they have been migrated to the new docs/ structure.
"""

import os
import re
import logging
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path
import configparser


@dataclass
class LinkReference:
    """Represents a link reference found in a file"""
    file_path: str
    line_number: int
    original_link: str
    updated_link: str
    link_type: str  # 'markdown', 'config', 'code_comment'


class LinkUpdater:
    """Main class for scanning and updating link references"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.migration_map = self._build_migration_map()
        self.reverse_migration_map = {v: k for k, v in self.migration_map.items()}
        
        # Patterns for different types of links
        self.link_patterns = {
            'markdown': [
                r'\[([^\]]+)\]\(([^)]+\.md)\)',  # [text](file.md)
                r'\[([^\]]+)\]\(([^)]+\.md)#([^)]+)\)',  # [text](file.md#anchor)
            ],
            'inline_code': [
                r'`([^`]+\.md)`',  # `file.md`
            ],
            'quoted': [
                r'"([^"]+\.md)"',  # "file.md"
                r"'([^']+\.md)'",  # 'file.md'
            ]
        }
        
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
    
    def find_markdown_links(self, content: str, file_path: str) -> List[LinkReference]:
        """Find all markdown links in content"""
        references = []
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Check for markdown links
            for pattern in self.link_patterns['markdown']:
                matches = re.finditer(pattern, line)
                for match in matches:
                    link_text = match.group(1)
                    link_path = match.group(2)
                    
                    # Check if this link needs updating
                    updated_path = self._get_updated_link_path(link_path, file_path)
                    if updated_path != link_path:
                        references.append(LinkReference(
                            file_path=file_path,
                            line_number=line_num,
                            original_link=match.group(0),
                            updated_link=f"[{link_text}]({updated_path})",
                            link_type='markdown'
                        ))
            
            # Check for inline code references
            for pattern in self.link_patterns['inline_code']:
                matches = re.finditer(pattern, line)
                for match in matches:
                    link_path = match.group(1)
                    updated_path = self._get_updated_link_path(link_path, file_path)
                    if updated_path != link_path:
                        references.append(LinkReference(
                            file_path=file_path,
                            line_number=line_num,
                            original_link=match.group(0),
                            updated_link=f"`{updated_path}`",
                            link_type='inline_code'
                        ))
            
            # Check for quoted references
            for pattern in self.link_patterns['quoted']:
                matches = re.finditer(pattern, line)
                for match in matches:
                    link_path = match.group(1)
                    updated_path = self._get_updated_link_path(link_path, file_path)
                    if updated_path != link_path:
                        quote_char = match.group(0)[0]  # Get the quote character
                        references.append(LinkReference(
                            file_path=file_path,
                            line_number=line_num,
                            original_link=match.group(0),
                            updated_link=f"{quote_char}{updated_path}{quote_char}",
                            link_type='quoted'
                        ))
        
        return references
    
    def _get_updated_link_path(self, original_path: str, current_file: str) -> str:
        """Get the updated path for a link based on migration mapping"""
        # Handle anchors (file.md#anchor)
        anchor = ""
        if "#" in original_path:
            original_path, anchor = original_path.split("#", 1)
            anchor = "#" + anchor
        
        # Check if this is a file that was migrated
        if original_path in self.migration_map:
            new_path = self.migration_map[original_path]
            
            # Calculate relative path from current file to new location
            current_dir = Path(current_file).parent
            target_path = Path(new_path)
            
            try:
                relative_path = os.path.relpath(target_path, current_dir)
                return relative_path + anchor
            except ValueError:
                # If relative path calculation fails, use absolute path
                return new_path + anchor
        
        return original_path + anchor
    
    def scan_file_for_links(self, file_path: str) -> List[LinkReference]:
        """Scan a single file for documentation links"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return self.find_markdown_links(content, file_path)
            
        except Exception as e:
            self.logger.error(f"Failed to scan file {file_path}: {e}")
            return []
    
    def update_markdown_links(self, file_path: str, references: List[LinkReference]) -> bool:
        """Update markdown links in a specific file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Sort references by line number in reverse order to avoid offset issues
            references.sort(key=lambda x: x.line_number, reverse=True)
            
            lines = content.split('\n')
            
            for ref in references:
                if ref.file_path == file_path:
                    line_idx = ref.line_number - 1
                    if 0 <= line_idx < len(lines):
                        lines[line_idx] = lines[line_idx].replace(
                            ref.original_link, ref.updated_link
                        )
            
            # Write updated content back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
            
            self.logger.info(f"Updated {len(references)} links in {file_path}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to update links in {file_path}: {e}")
            return False
    
    def update_configuration_files(self) -> bool:
        """Update configuration file references"""
        try:
            config_files = ["config/config.ini", "config/config_glm.ini"]
            
            for config_file in config_files:
                config_path = self.base_dir / config_file
                if not config_path.exists():
                    continue
                
                # Read configuration file
                config = configparser.ConfigParser()
                config.read(config_path)
                
                # Update aboutme_path if it references a migrated file
                if config.has_section('data') and config.has_option('data', 'aboutme_path'):
                    current_path = config.get('data', 'aboutme_path')
                    if current_path in self.migration_map:
                        new_path = self.migration_map[current_path]
                        config.set('data', 'aboutme_path', new_path)
                        
                        # Write updated configuration
                        with open(config_path, 'w') as f:
                            config.write(f)
                        
                        self.logger.info(f"Updated {config_file}: aboutme_path -> {new_path}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to update configuration files: {e}")
            return False
    
    def scan_and_update_all_references(self, dry_run: bool = False) -> bool:
        """Scan all files and update references"""
        try:
            all_references = []
            
            # Scan markdown files in docs directory
            docs_dir = self.base_dir / "docs"
            if docs_dir.exists():
                for md_file in docs_dir.rglob("*.md"):
                    references = self.scan_file_for_links(str(md_file))
                    all_references.extend(references)
            
            # Scan root README.md
            root_readme = self.base_dir / "README.md"
            if root_readme.exists():
                references = self.scan_file_for_links(str(root_readme))
                all_references.extend(references)
            
            # Scan Python files for documentation references
            python_files = [
                "main.py",
                "utils/file_manager.py",
                "utils/weather_client.py",
                "agents/news_secretary.py",
                "agents/work_secretary.py",
                "agents/outfit_secretary.py",
                "agents/life_secretary.py",
                "agents/review_secretary.py"
            ]
            
            for py_file in python_files:
                py_path = self.base_dir / py_file
                if py_path.exists():
                    references = self.scan_file_for_links(str(py_path))
                    all_references.extend(references)
            
            if dry_run:
                self.logger.info(f"DRY RUN: Found {len(all_references)} references to update")
                for ref in all_references:
                    self.logger.info(f"  {ref.file_path}:{ref.line_number} - {ref.original_link} -> {ref.updated_link}")
                return True
            
            # Group references by file
            references_by_file = {}
            for ref in all_references:
                if ref.file_path not in references_by_file:
                    references_by_file[ref.file_path] = []
                references_by_file[ref.file_path].append(ref)
            
            # Update each file
            success_count = 0
            for file_path, file_references in references_by_file.items():
                if self.update_markdown_links(file_path, file_references):
                    success_count += 1
            
            # Update configuration files
            if self.update_configuration_files():
                success_count += 1
            
            self.logger.info(f"Updated references in {success_count} files")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to scan and update references: {e}")
            return False
    
    def validate_links(self) -> bool:
        """Validate that all updated links resolve correctly"""
        try:
            broken_links = []
            
            # Check all markdown files for broken links
            for md_file in self.base_dir.rglob("*.md"):
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all markdown links
                for pattern in self.link_patterns['markdown']:
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        link_path = match.group(2)
                        
                        # Skip external links
                        if link_path.startswith(('http://', 'https://', 'mailto:')):
                            continue
                        
                        # Handle anchors
                        if "#" in link_path:
                            link_path = link_path.split("#")[0]
                        
                        # Check if file exists
                        if link_path.endswith('.md'):
                            target_path = md_file.parent / link_path
                            if not target_path.exists():
                                broken_links.append(f"{md_file}:{match.group(0)}")
            
            if broken_links:
                self.logger.error(f"Found {len(broken_links)} broken links:")
                for link in broken_links:
                    self.logger.error(f"  {link}")
                return False
            
            self.logger.info("All links validated successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Link validation failed: {e}")
            return False


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Update documentation links")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Show what would be updated without making changes")
    parser.add_argument("--validate", action="store_true",
                       help="Validate that all links resolve correctly")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for link updates (default: current directory)")
    
    args = parser.parse_args()
    
    updater = LinkUpdater(args.base_dir)
    
    if args.validate:
        success = updater.validate_links()
    else:
        success = updater.scan_and_update_all_references(dry_run=args.dry_run)
    
    if success:
        print("Link update completed successfully!")
    else:
        print("Link update failed!")
        exit(1)