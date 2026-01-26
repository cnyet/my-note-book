import feedparser
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sources = [
    ("TechCrunch", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    ("The Verge", "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml"),
    ("MIT Tech Review", "https://www.technologyreview.com/topic/artificial-intelligence/feed/")
]

def test_rss():
    print("🧪 Testing RSS Feeds...")
    for name, url in sources:
        try:
            print(f"\n📡 Fetching from {name}: {url}")
            feed = feedparser.parse(url)
            print(f"✅ Status: {feed.get('status', 'N/A')}")
            print(f"📊 Found {len(feed.entries)} entries")
            if feed.entries:
                for entry in feed.entries[:2]:
                    print(f"  - Title: {entry.title}")
                    print(f"  - Link: {entry.link}")
            else:
                print(f"⚠️ No entries found. Bozo alert! Let's check feed.bozo: {feed.get('bozo')}")
                if 'bozo_exception' in feed:
                    print(f"❌ Exception: {feed.bozo_exception}")
        except Exception as e:
            print(f"💥 Error fetching from {name}: {e}")

if __name__ == "__main__":
    test_rss()
