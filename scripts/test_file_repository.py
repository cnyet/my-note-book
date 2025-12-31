"""Test script for FileRepository and MarkdownParser."""
import sys
from pathlib import Path
from datetime import date

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.repositories.file_repository import FileRepository
from api.utils.markdown_parser import MarkdownParser


def test_file_repository():
    """Test FileRepository functionality."""
    print("=" * 60)
    print("Testing FileRepository")
    print("=" * 60)
    
    repo = FileRepository()
    
    # Test reading work file
    test_date = date(2025, 12, 30)
    print(f"\n1. Testing file existence for work on {test_date}")
    exists = repo.file_exists("work", test_date)
    print(f"   File exists: {exists}")
    
    if exists:
        print(f"\n2. Reading work content for {test_date}")
        try:
            content = repo.read_content("work", test_date)
            print(f"   Content length: {len(content)} characters")
            print(f"   First 200 chars: {content[:200]}...")
        except Exception as e:
            print(f"   Error: {e}")
    
    # Test listing available dates
    print(f"\n3. Listing available dates for work")
    dates = repo.list_available_dates("work")
    print(f"   Found {len(dates)} dates with content:")
    for d in dates[:5]:  # Show first 5
        print(f"   - {d}")
    
    # Test latest date
    print(f"\n4. Getting latest date for work")
    latest = repo.get_latest_date("work")
    print(f"   Latest date: {latest}")
    
    print("\n" + "=" * 60)


def test_markdown_parser():
    """Test MarkdownParser functionality."""
    print("=" * 60)
    print("Testing MarkdownParser")
    print("=" * 60)
    
    repo = FileRepository()
    test_date = date(2025, 12, 30)
    
    try:
        content = repo.read_content("work", test_date)
        parser = MarkdownParser()
        
        # Test title extraction
        print("\n1. Extracting title")
        title = parser.extract_title(content)
        print(f"   Title: {title}")
        
        # Test date extraction
        print("\n2. Extracting date from title")
        date_str = parser.extract_date_from_title(content)
        print(f"   Date: {date_str}")
        
        # Test section extraction
        print("\n3. Extracting sections")
        sections = parser.extract_sections(content)
        print(f"   Found {len(sections)} sections:")
        for section_name in sections.keys():
            print(f"   - {section_name}")
        
        # Test task extraction
        print("\n4. Extracting tasks")
        tasks = parser.extract_tasks(content)
        print(f"   Found {len(tasks)} tasks:")
        for i, task in enumerate(tasks[:3], 1):  # Show first 3
            print(f"   {i}. {task['title']}")
            print(f"      Priority: {task['priority']}, Completed: {task['completed']}")
            if task['estimated_time']:
                print(f"      Estimated time: {task['estimated_time']} minutes")
        
        # Test snippet extraction
        print("\n5. Extracting snippet")
        snippet = parser.get_snippet(content, max_length=150)
        print(f"   Snippet: {snippet}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    test_file_repository()
    print("\n")
    test_markdown_parser()
    print("\n✅ Tests completed!")
