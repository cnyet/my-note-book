import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from api.database import SessionLocal
from api.repositories.news_repository import NewsRepository
from agents.news_agent import NewsAgent
from datetime import date

def test_save():
    print("🧪 Testing direct news article save...")
    db = SessionLocal()
    repo = NewsRepository(db)
    
    # 1. Create a dummy article
    try:
        article = repo.create_article(
            title="AI Test Article",
            source="Test Source",
            link="https://example.com/test",
            summary="This is a test summary",
            article_date=date.today()
        )
        print(f"✅ Created article: {article.title}")
        
        # 2. Verify it's in the DB
        count = db.query(NewsArticle).count()
        print(f"📊 Total articles in DB: {count}")
        
        # 3. List last 5
        latest = repo.get_latest_articles(limit=5)
        for a in latest:
            print(f"  - {a.title} ({a.source})")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    from api.models.agent_content import NewsArticle
    test_save()
