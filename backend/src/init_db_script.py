import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from api.database import init_db, engine
from api.models.agent_content import NewsArticle, ContentIndex, WorkTask, HealthMetric, DailyReflection

def run_init():
    print("🚀 Initializing database and creating tables...")
    try:
        init_db()
        print("✅ Database initialized successfully.")
        
        # Verify table existence
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"📊 Current tables in DB: {', '.join(tables)}")
        
        if 'news_articles' in tables:
            print("✨ news_articles table is READY.")
        else:
            print("❌ news_articles table is still MISSING.")
            
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    run_init()
