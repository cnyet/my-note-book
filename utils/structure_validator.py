#!/usr/bin/env python3
"""
Directory Structure Validator

This module provides functionality to validate the documentation directory
structure and ensure compliance with the defined organization standards.
"""

import os
import logging
from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass
from pathlib import Path
import re


@dataclass
class ValidationRule:
    """Represents a validation rule for directory structure"""
    rule_name: str
    description: str
    severity: str  # 'error', 'warning', 'info'


@dataclass
class ValidationResult:
    """Result of a validation check"""
    rule: ValidationRule
    passed: bool
    message: str
    file_path: Optional[str] = None


class DirectoryStructureValidator:
    """Main class for validating documentation directory structure"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir).resolve()
        self.docs_dir = self.base_dir / "docs"
        self.expected_structure = self._define_expected_structure()
        self.validation_rules = self._define_validation_rules()
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def _define_expected_structure(self) -> Dict[str, Dict]:
        """Define the expected documentation directory structure"""
        return {
            "docs": {
                "type": "directory",
                "required": True,
                "children": {
                    "README.md": {"type": "file", "required": True},
                    "project": {
                        "type": "directory",
                        "required": True,
                        "children": {
                            "README.md": {"type": "file", "required": True},
                            "concept.md": {"type": "file", "required": True},
                            "phase1-summary.md": {"type": "file", "required": True},
                            "phase2-plan.md": {"type": "file", "required": True},
                            "phase2-summary.md": {"type": "file", "required": True},
                            "web-app-requirements.md": {"type": "file", "required": True}
                        }
                    },
                    "guides": {
                        "type": "directory",
                        "required": True,
                        "children": {
                            "README.md": {"type": "file", "required": True},
                            "quickstart.md": {"type": "file", "required": True},
                            "user-profile.md": {"type": "file", "required": True}
                        }
                    },
                    "development": {
                        "type": "directory",
                        "required": True,
                        "children": {
                            "README.md": {"type": "file", "required": True},
                            "claude-guide.md": {"type": "file", "required": True},
                            "glm-integration.md": {"type": "file", "required": True},
                            "rules.md": {"type": "file", "required": True}
                        }
                    },
                    "technical": {
                        "type": "directory",
                        "required": True,
                        "children": {
                            "README.md": {"type": "file", "required": True}
                        }
                    }
                }
            }
        }
    
    def _define_validation_rules(self) -> List[ValidationRule]:
        """Define validation rules for the documentation structure"""
        return [
            ValidationRule(
                rule_name="max_nesting_depth",
                description="Directory nesting should not exceed 3 levels",
                severity="error"
            ),
            ValidationRule(
                rule_name="required_directories",
                description="All required directories must exist",
                severity="error"
            ),
            ValidationRule(
                rule_name="required_files",
                description="All required files must exist",
                severity="error"
            ),
            ValidationRule(
                rule_name="readme_in_directories",
                description="Each directory should have a README.md file",
                severity="warning"
            ),
            ValidationRule(
                rule_name="valid_file_names",
                description="File names should follow naming conventions",
                severity="warning"
            ),
            ValidationRule(
                rule_name="no_empty_directories",
                description="Directories should not be empty",
                severity="warning"
            ),
            ValidationRule(
                rule_name="markdown_file_format",
                description="Markdown files should have proper format",
                severity="info"
            )
        ]
    
    def validate_nesting_depth(self) -> List[ValidationResult]:
        """Validate that directory nesting doesn't exceed maximum depth"""
        results = []
        rule = next(r for r in self.validation_rules if r.rule_name == "max_nesting_depth")
        
        try:
            max_depth = 3
            violations = []
            
            for root, dirs, files in os.walk(self.docs_dir):
                relative_path = Path(root).relative_to(self.docs_dir)
                depth = len(relative_path.parts)
                
                if depth > max_depth:
                    violations.append(str(relative_path))
            
            if violations:
                results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message=f"Directories exceed max depth of {max_depth}: {', '.join(violations)}"
                ))
            else:
                results.append(ValidationResult(
                    rule=rule,
                    passed=True,
                    message=f"All directories within max depth of {max_depth}"
                ))
            
        except Exception as e:
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate nesting depth: {e}"
            ))
        
        return results
    
    def validate_required_structure(self) -> List[ValidationResult]:
        """Validate that all required directories and files exist"""
        results = []
        
        def check_structure(expected: Dict, current_path: Path, parent_name: str = ""):
            for name, spec in expected.items():
                item_path = current_path / name
                
                if spec["type"] == "directory":
                    rule = next(r for r in self.validation_rules if r.rule_name == "required_directories")
                    
                    if spec.get("required", False) and not item_path.exists():
                        results.append(ValidationResult(
                            rule=rule,
                            passed=False,
                            message=f"Required directory missing: {item_path.relative_to(self.base_dir)}",
                            file_path=str(item_path.relative_to(self.base_dir))
                        ))
                    elif item_path.exists() and item_path.is_dir():
                        # Check children if directory exists
                        if "children" in spec:
                            check_structure(spec["children"], item_path, name)
                
                elif spec["type"] == "file":
                    rule = next(r for r in self.validation_rules if r.rule_name == "required_files")
                    
                    if spec.get("required", False) and not item_path.exists():
                        results.append(ValidationResult(
                            rule=rule,
                            passed=False,
                            message=f"Required file missing: {item_path.relative_to(self.base_dir)}",
                            file_path=str(item_path.relative_to(self.base_dir))
                        ))
        
        try:
            check_structure(self.expected_structure, self.base_dir)
            
            # Add success results if no failures found
            if not any(not r.passed for r in results):
                dir_rule = next(r for r in self.validation_rules if r.rule_name == "required_directories")
                file_rule = next(r for r in self.validation_rules if r.rule_name == "required_files")
                
                results.append(ValidationResult(
                    rule=dir_rule,
                    passed=True,
                    message="All required directories exist"
                ))
                results.append(ValidationResult(
                    rule=file_rule,
                    passed=True,
                    message="All required files exist"
                ))
            
        except Exception as e:
            rule = next(r for r in self.validation_rules if r.rule_name == "required_directories")
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate required structure: {e}"
            ))
        
        return results
    
    def validate_readme_files(self) -> List[ValidationResult]:
        """Validate that each directory has a README.md file"""
        results = []
        rule = next(r for r in self.validation_rules if r.rule_name == "readme_in_directories")
        
        try:
            missing_readmes = []
            
            for root, dirs, files in os.walk(self.docs_dir):
                # Skip the root docs directory as it's checked separately
                if Path(root) == self.docs_dir:
                    continue
                
                if "README.md" not in files:
                    relative_path = Path(root).relative_to(self.base_dir)
                    missing_readmes.append(str(relative_path))
            
            if missing_readmes:
                results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message=f"Directories missing README.md: {', '.join(missing_readmes)}"
                ))
            else:
                results.append(ValidationResult(
                    rule=rule,
                    passed=True,
                    message="All directories have README.md files"
                ))
            
        except Exception as e:
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate README files: {e}"
            ))
        
        return results
    
    def validate_file_names(self) -> List[ValidationResult]:
        """Validate that file names follow naming conventions"""
        results = []
        rule = next(r for r in self.validation_rules if r.rule_name == "valid_file_names")
        
        try:
            # Define naming patterns
            valid_patterns = [
                r'^[a-z0-9]+(-[a-z0-9]+)*\.md$',  # kebab-case for markdown files
                r'^README\.md$',  # README files
                r'^[A-Z_]+\.md$'  # UPPERCASE files (legacy)
            ]
            
            invalid_files = []
            
            for root, dirs, files in os.walk(self.docs_dir):
                for file in files:
                    if file.endswith('.md'):
                        valid = any(re.match(pattern, file) for pattern in valid_patterns)
                        if not valid:
                            relative_path = Path(root) / file
                            invalid_files.append(str(relative_path.relative_to(self.base_dir)))
            
            if invalid_files:
                results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message=f"Files with invalid names: {', '.join(invalid_files)}"
                ))
            else:
                results.append(ValidationResult(
                    rule=rule,
                    passed=True,
                    message="All file names follow naming conventions"
                ))
            
        except Exception as e:
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate file names: {e}"
            ))
        
        return results
    
    def validate_empty_directories(self) -> List[ValidationResult]:
        """Validate that directories are not empty"""
        results = []
        rule = next(r for r in self.validation_rules if r.rule_name == "no_empty_directories")
        
        try:
            empty_dirs = []
            
            for root, dirs, files in os.walk(self.docs_dir):
                # Check if directory is empty (no files and no subdirectories with files)
                has_content = False
                
                # Check for files in current directory
                if files:
                    has_content = True
                
                # Check for content in subdirectories
                if not has_content:
                    for subdir in dirs:
                        subdir_path = Path(root) / subdir
                        if any(subdir_path.rglob('*')):
                            has_content = True
                            break
                
                if not has_content and Path(root) != self.docs_dir:
                    relative_path = Path(root).relative_to(self.base_dir)
                    empty_dirs.append(str(relative_path))
            
            if empty_dirs:
                results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message=f"Empty directories found: {', '.join(empty_dirs)}"
                ))
            else:
                results.append(ValidationResult(
                    rule=rule,
                    passed=True,
                    message="No empty directories found"
                ))
            
        except Exception as e:
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate empty directories: {e}"
            ))
        
        return results
    
    def validate_markdown_format(self) -> List[ValidationResult]:
        """Validate that markdown files have proper format"""
        results = []
        rule = next(r for r in self.validation_rules if r.rule_name == "markdown_file_format")
        
        try:
            format_issues = []
            
            for root, dirs, files in os.walk(self.docs_dir):
                for file in files:
                    if file.endswith('.md'):
                        file_path = Path(root) / file
                        
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read().strip()
                            
                            # Check if file is empty
                            if not content:
                                relative_path = file_path.relative_to(self.base_dir)
                                format_issues.append(f"{relative_path}: Empty file")
                                continue
                            
                            # Check if file starts with a heading
                            if not content.startswith('#'):
                                relative_path = file_path.relative_to(self.base_dir)
                                format_issues.append(f"{relative_path}: No heading at start")
                            
                        except Exception as e:
                            relative_path = file_path.relative_to(self.base_dir)
                            format_issues.append(f"{relative_path}: Read error - {e}")
            
            if format_issues:
                results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message=f"Markdown format issues: {'; '.join(format_issues)}"
                ))
            else:
                results.append(ValidationResult(
                    rule=rule,
                    passed=True,
                    message="All markdown files have proper format"
                ))
            
        except Exception as e:
            results.append(ValidationResult(
                rule=rule,
                passed=False,
                message=f"Failed to validate markdown format: {e}"
            ))
        
        return results
    
    def run_all_validations(self) -> List[ValidationResult]:
        """Run all validation checks"""
        all_results = []
        
        try:
            # Check if docs directory exists first
            if not self.docs_dir.exists():
                rule = ValidationRule(
                    rule_name="docs_directory_exists",
                    description="Documentation directory must exist",
                    severity="error"
                )
                all_results.append(ValidationResult(
                    rule=rule,
                    passed=False,
                    message="Documentation directory 'docs' does not exist"
                ))
                return all_results
            
            # Run all validation checks
            validation_methods = [
                self.validate_nesting_depth,
                self.validate_required_structure,
                self.validate_readme_files,
                self.validate_file_names,
                self.validate_empty_directories,
                self.validate_markdown_format
            ]
            
            for method in validation_methods:
                try:
                    results = method()
                    all_results.extend(results)
                except Exception as e:
                    self.logger.error(f"Validation method {method.__name__} failed: {e}")
            
        except Exception as e:
            self.logger.error(f"Validation process failed: {e}")
        
        return all_results
    
    def generate_validation_report(self, results: List[ValidationResult]) -> str:
        """Generate a formatted validation report"""
        report_lines = []
        report_lines.append("# Documentation Structure Validation Report")
        report_lines.append("")
        
        # Summary
        total_checks = len(results)
        passed_checks = sum(1 for r in results if r.passed)
        failed_checks = total_checks - passed_checks
        
        report_lines.append(f"## Summary")
        report_lines.append(f"- Total checks: {total_checks}")
        report_lines.append(f"- Passed: {passed_checks}")
        report_lines.append(f"- Failed: {failed_checks}")
        report_lines.append("")
        
        # Group results by severity
        errors = [r for r in results if not r.passed and r.rule.severity == "error"]
        warnings = [r for r in results if not r.passed and r.rule.severity == "warning"]
        info_issues = [r for r in results if not r.passed and r.rule.severity == "info"]
        
        if errors:
            report_lines.append("## ❌ Errors")
            for result in errors:
                report_lines.append(f"- **{result.rule.rule_name}**: {result.message}")
            report_lines.append("")
        
        if warnings:
            report_lines.append("## ⚠️ Warnings")
            for result in warnings:
                report_lines.append(f"- **{result.rule.rule_name}**: {result.message}")
            report_lines.append("")
        
        if info_issues:
            report_lines.append("## ℹ️ Information")
            for result in info_issues:
                report_lines.append(f"- **{result.rule.rule_name}**: {result.message}")
            report_lines.append("")
        
        # Passed checks
        passed_results = [r for r in results if r.passed]
        if passed_results:
            report_lines.append("## ✅ Passed Checks")
            for result in passed_results:
                report_lines.append(f"- **{result.rule.rule_name}**: {result.message}")
            report_lines.append("")
        
        return "\n".join(report_lines)
    
    def validate_structure(self, generate_report: bool = False) -> bool:
        """Main validation method"""
        try:
            self.logger.info("Starting documentation structure validation...")
            
            results = self.run_all_validations()
            
            # Check if validation passed
            has_errors = any(not r.passed and r.rule.severity == "error" for r in results)
            
            # Log results
            for result in results:
                if result.passed:
                    self.logger.info(f"✅ {result.rule.rule_name}: {result.message}")
                else:
                    if result.rule.severity == "error":
                        self.logger.error(f"❌ {result.rule.rule_name}: {result.message}")
                    elif result.rule.severity == "warning":
                        self.logger.warning(f"⚠️ {result.rule.rule_name}: {result.message}")
                    else:
                        self.logger.info(f"ℹ️ {result.rule.rule_name}: {result.message}")
            
            # Generate report if requested
            if generate_report:
                report = self.generate_validation_report(results)
                report_path = self.base_dir / "validation_report.md"
                with open(report_path, 'w', encoding='utf-8') as f:
                    f.write(report)
                self.logger.info(f"Validation report saved to: {report_path}")
            
            if has_errors:
                self.logger.error("Documentation structure validation failed")
                return False
            else:
                self.logger.info("Documentation structure validation passed")
                return True
            
        except Exception as e:
            self.logger.error(f"Structure validation failed: {e}")
            return False


if __name__ == "__main__":
    # Command line interface for testing
    import argparse
    
    parser = argparse.ArgumentParser(description="Validate documentation directory structure")
    parser.add_argument("--report", action="store_true",
                       help="Generate a validation report file")
    parser.add_argument("--base-dir", default=".", 
                       help="Base directory for validation (default: current directory)")
    
    args = parser.parse_args()
    
    validator = DirectoryStructureValidator(args.base_dir)
    success = validator.validate_structure(generate_report=args.report)
    
    if success:
        print("Documentation structure validation passed!")
    else:
        print("Documentation structure validation failed!")
        exit(1)