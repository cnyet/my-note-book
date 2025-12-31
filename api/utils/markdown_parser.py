"""
Markdown parsing utilities for secretary content.
Extracts structured data from markdown files.
"""
import re
from typing import List, Dict, Optional, Any
from datetime import datetime


class MarkdownParser:
    """Parser for extracting structured data from markdown content."""
    
    @staticmethod
    def extract_title(content: str) -> Optional[str]:
        """Extract the main title (first # heading) from markdown."""
        match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        return match.group(1).strip() if match else None
    
    @staticmethod
    def extract_date_from_title(content: str) -> Optional[str]:
        """Extract date from title if present."""
        # Match patterns like "2025年12月30日" or "2025-12-30"
        match = re.search(r'(\d{4})[年-](\d{1,2})[月-](\d{1,2})[日]?', content)
        if match:
            year, month, day = match.groups()
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        return None
    
    @staticmethod
    def extract_sections(content: str) -> Dict[str, str]:
        """
        Extract sections from markdown based on ## headings.
        
        Returns:
            Dict mapping section titles to their content
        """
        sections = {}
        current_section = None
        current_content = []
        
        for line in content.split('\n'):
            # Check for ## heading
            if line.startswith('## '):
                # Save previous section
                if current_section:
                    sections[current_section] = '\n'.join(current_content).strip()
                
                # Start new section
                current_section = line[3:].strip()
                current_content = []
            elif current_section:
                current_content.append(line)
        
        # Save last section
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()
        
        return sections
    
    @staticmethod
    def extract_tasks(content: str) -> List[Dict[str, Any]]:
        """
        Extract tasks from markdown checklist format.
        
        Supports formats like:
        - [ ] Task title
        - [x] Completed task
        - [ ] **Task title** - Description
        """
        tasks = []
        task_pattern = r'- \[([ x])\]\s+(.+)'
        
        for match in re.finditer(task_pattern, content, re.MULTILINE):
            completed = match.group(1) == 'x'
            task_text = match.group(2).strip()
            
            # Try to extract title and description
            if ' - ' in task_text:
                parts = task_text.split(' - ', 1)
                title = parts[0].strip('*').strip()
                description = parts[1].strip()
            else:
                title = task_text.strip('*').strip()
                description = ""
            
            # Try to extract priority
            priority = "medium"
            if "高优先级" in content[:content.find(task_text)] or "🚨" in content[:content.find(task_text)]:
                priority = "high"
            elif "低优先级" in content[:content.find(task_text)] or "📝" in content[:content.find(task_text)]:
                priority = "low"
            
            # Try to extract time estimate
            time_match = re.search(r'(\d+)\s*(minutes?|mins?|小时|hours?)', description, re.IGNORECASE)
            estimated_time = None
            if time_match:
                time_value = int(time_match.group(1))
                time_unit = time_match.group(2).lower()
                if 'hour' in time_unit or '小时' in time_unit:
                    estimated_time = time_value * 60
                else:
                    estimated_time = time_value
            
            tasks.append({
                "title": title,
                "description": description,
                "completed": completed,
                "priority": priority,
                "estimated_time": estimated_time
            })
        
        return tasks
    
    @staticmethod
    def extract_list_items(content: str, section: Optional[str] = None) -> List[str]:
        """
        Extract list items from markdown.
        
        Args:
            content: Markdown content
            section: Optional section name to extract from
            
        Returns:
            List of items
        """
        if section:
            sections = MarkdownParser.extract_sections(content)
            content = sections.get(section, "")
        
        items = []
        for line in content.split('\n'):
            # Match bullet points (-, *, +)
            if re.match(r'^\s*[-*+]\s+', line):
                item = re.sub(r'^\s*[-*+]\s+', '', line).strip()
                items.append(item)
        
        return items
    
    @staticmethod
    def extract_key_value_pairs(content: str) -> Dict[str, str]:
        """
        Extract key-value pairs from markdown.
        
        Supports formats like:
        - **Key**: Value
        - Key: Value
        """
        pairs = {}
        pattern = r'\*?\*?([^:*]+)\*?\*?:\s*(.+)'
        
        for match in re.finditer(pattern, content, re.MULTILINE):
            key = match.group(1).strip()
            value = match.group(2).strip()
            pairs[key] = value
        
        return pairs
    
    @staticmethod
    def extract_tables(content: str) -> List[List[str]]:
        """
        Extract markdown tables.
        
        Returns:
            List of rows, where each row is a list of cell values
        """
        tables = []
        in_table = False
        current_table = []
        
        for line in content.split('\n'):
            if '|' in line and not line.strip().startswith('|---'):
                # Table row
                cells = [cell.strip() for cell in line.split('|')[1:-1]]
                current_table.append(cells)
                in_table = True
            elif in_table and '|' not in line:
                # End of table
                if current_table:
                    tables.append(current_table)
                current_table = []
                in_table = False
        
        # Add last table if exists
        if current_table:
            tables.append(current_table)
        
        return tables
    
    @staticmethod
    def get_snippet(content: str, max_length: int = 200) -> str:
        """
        Get a short snippet from content for preview.
        
        Args:
            content: Full content
            max_length: Maximum length of snippet
            
        Returns:
            Truncated snippet
        """
        # Remove markdown formatting
        text = re.sub(r'[#*`\[\]()]', '', content)
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Truncate
        if len(text) > max_length:
            text = text[:max_length].rsplit(' ', 1)[0] + '...'
        return text
