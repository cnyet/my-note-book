"""
News Secretary Agent
Responsible for fetching and summarizing AI/technology news
"""

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from agents.base import BaseAgent
from datetime import datetime, date
import requests
from bs4 import BeautifulSoup
import feedparser
import re
from typing import List, Dict, Optional


class NewsAgent(BaseAgent):
    """AI-powered news briefing agent focused on AI/tech content."""

    def __init__(self, **kwargs):
        super().__init__(name="News", **kwargs)

        news_config = self.config_dict.get("news", {})
        if "sources" in news_config:
            sources_str = news_config["sources"]
            self.sources = [s.strip() for s in sources_str.split("\n") if s.strip()]
        else:
            self.sources = [
                "https://techcrunch.com/category/artificial-intelligence/",
                "https://www.theverge.com/ai-artificial-intelligence",
                "https://www.technologyreview.com/topic/artificial-intelligence/",
            ]

        self.articles_per_summary = int(news_config.get("articles_per_summary", 5))

    def fetch_techcrunch_ai(self) -> str:
        """Fetch AI news from TechCrunch using RSS feed"""
        try:
            # Use RSS feed instead of web scraping - more reliable
            url = "https://techcrunch.com/feed/"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }

            feed = feedparser.parse(url)
            articles = []

            # Filter for AI-related articles
            ai_keywords = [
                "ai",
                "artificial intelligence",
                "machine learning",
                "neural",
                "llm",
                "gpt",
                "openai",
                "claude",
            ]

            for entry in feed.entries[:10]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                summary = entry.get("summary", "") or entry.get("description", "")

                # Check if article is AI-related
                title_lower = title.lower()
                summary_lower = summary.lower()
                if any(
                    keyword in title_lower or keyword in summary_lower
                    for keyword in ai_keywords
                ):
                    # Clean HTML from summary
                    if summary:
                        summary = BeautifulSoup(summary, "html.parser").get_text()[:200]
                    articles.append(f"**{title}**\n{link}\n{summary}\n")

                    if len(articles) >= 5:
                        break

            return "\n".join(articles) if articles else ""

        except Exception as e:
            print(f"Error fetching from TechCrunch RSS: {e}")
            import traceback

            traceback.print_exc()
            return ""

    def fetch_the_verge_ai(self) -> str:
        """Fetch AI news from The Verge using RSS feed"""
        try:
            # Use RSS feed instead of web scraping
            url = "https://www.theverge.com/rss/index.xml"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }

            feed = feedparser.parse(url)
            articles = []

            # Filter for AI-related articles
            ai_keywords = [
                "ai",
                "artificial intelligence",
                "machine learning",
                "neural",
                "llm",
                "gpt",
                "openai",
                "claude",
                "chatbot",
            ]

            for entry in feed.entries[:15]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                summary = entry.get("summary", "") or entry.get("description", "")

                # Check if article is AI-related
                title_lower = title.lower()
                summary_lower = summary.lower()
                if any(
                    keyword in title_lower or keyword in summary_lower
                    for keyword in ai_keywords
                ):
                    # Clean HTML from summary
                    if summary:
                        summary = BeautifulSoup(summary, "html.parser").get_text()[:200]
                    articles.append(f"**{title}**\n{link}\n{summary}\n")

                    if len(articles) >= 5:
                        break

            return "\n".join(articles) if articles else ""

        except Exception as e:
            print(f"Error fetching from The Verge RSS: {e}")
            import traceback

            traceback.print_exc()
            return ""

    def fetch_mit_news(self) -> str:
        """Fetch AI news from MIT Technology Review using RSS feed"""
        try:
            # Use RSS feed - more reliable than web scraping
            url = "https://www.technologyreview.com/feed/"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }

            feed = feedparser.parse(url)
            articles = []

            # Filter for AI-related articles
            ai_keywords = [
                "ai",
                "artificial intelligence",
                "machine learning",
                "neural",
                "llm",
                "gpt",
                "openai",
                "claude",
                "deep learning",
            ]

            for entry in feed.entries[:15]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                summary = entry.get("summary", "") or entry.get("description", "")

                # Check if article is AI-related
                title_lower = title.lower()
                summary_lower = summary.lower()
                if any(
                    keyword in title_lower or keyword in summary_lower
                    for keyword in ai_keywords
                ):
                    # Clean HTML from summary
                    if summary:
                        summary = BeautifulSoup(summary, "html.parser").get_text()[:200]
                    articles.append(f"**{title}**\n{link}\n{summary}\n")

                    if len(articles) >= 5:
                        break

            return "\n".join(articles) if articles else ""

        except Exception as e:
            print(f"Error fetching from MIT Tech Review RSS: {e}")
            import traceback

            traceback.print_exc()
            return ""

    def _get_reddit_posts_data(self) -> List[Dict]:
        """Get Reddit posts as structured data (for direct database saving)"""
        try:
            # Reddit subreddits for AI/tech news
            subreddits = [
                "artificial",
                "MachineLearning",
                "technology",
                "singularity",
                "OpenAI",
                "ChatGPT",
            ]
            all_posts = []

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }

            for subreddit in subreddits[:3]:  # Limit to 3 subreddits
                try:
                    url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit=5"
                    response = requests.get(url, headers=headers, timeout=30)

                    if response.status_code == 200:
                        data = response.json()
                        posts = data.get("data", {}).get("children", [])

                        for post_data in posts:
                            post = post_data.get("data", {})

                            title = post.get("title", "")
                            link = post.get("url", "")
                            reddit_link = (
                                f"https://www.reddit.com{post.get('permalink', '')}"
                            )
                            selftext = post.get("selftext", "")
                            score = post.get("score", 0)
                            created_utc = post.get("created_utc")

                            # Get image/thumbnail
                            thumbnail = post.get("thumbnail", "")
                            preview_images = post.get("preview", {}).get("images", [])
                            image_url = None

                            if preview_images and len(preview_images) > 0:
                                image_url = (
                                    preview_images[0].get("source", {}).get("url", "")
                                )
                                # Reddit uses &amp; in URLs, need to decode
                                if image_url:
                                    image_url = image_url.replace("&amp;", "&")

                            # Use thumbnail if no preview image
                            if (
                                not image_url
                                and thumbnail
                                and thumbnail not in ["self", "default", "nsfw", ""]
                            ):
                                image_url = thumbnail

                            # Skip if no title or link
                            if not title or not link:
                                continue

                            # Create summary from selftext or use title
                            summary = selftext[:300] if selftext else title[:200]

                            all_posts.append(
                                {
                                    "title": title,
                                    "link": reddit_link,  # Use Reddit permalink
                                    "source_link": link,  # Original link
                                    "summary": summary,
                                    "image_url": image_url,
                                    "thumbnail": thumbnail
                                    if thumbnail not in ["self", "default", "nsfw", ""]
                                    else None,
                                    "score": score,
                                    "subreddit": subreddit,
                                    "created_utc": created_utc,
                                }
                            )

                            if len(all_posts) >= 10:
                                break

                except Exception as e:
                    print(f"Error fetching from r/{subreddit}: {e}")
                    continue

                if len(all_posts) >= 10:
                    break

            return all_posts

        except Exception as e:
            print(f"Error fetching Reddit posts data: {e}")
            import traceback

            traceback.print_exc()
            return []

    def fetch_reddit_news(self) -> str:
        """Fetch AI news from Reddit"""
        try:
            all_posts = self._get_reddit_posts_data()

            # Format posts for LLM
            formatted_posts = []
            for post in all_posts[:10]:
                post_str = f"**{post['title']}**\n"
                post_str += f"Link: {post['link']}\n"
                if post.get("source_link") and post["source_link"] != post["link"]:
                    post_str += f"Original: {post['source_link']}\n"
                if post.get("image_url"):
                    post_str += f"Image: {post['image_url']}\n"
                post_str += f"Summary: {post['summary']}\n"
                post_str += f"Score: {post['score']} | r/{post['subreddit']}\n"
                formatted_posts.append(post_str)

            return "\n\n".join(formatted_posts) if formatted_posts else ""

        except Exception as e:
            print(f"Error fetching from Reddit: {e}")
            import traceback

            traceback.print_exc()
            return ""

    def fetch_alternative_sources(self) -> str:
        """Fetch from alternative reliable RSS sources"""
        articles = []

        # Hacker News RSS (very reliable)
        try:
            url = "https://hnrss.org/newest?q=AI+OR+machine+learning+OR+artificial+intelligence"
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                if title and link:
                    articles.append(f"**{title}**\n{link}\n")
        except Exception as e:
            print(f"Error fetching from Hacker News RSS: {e}")

        # ArXiv AI RSS (research papers)
        try:
            url = "http://arxiv.org/rss/cs.AI"
            feed = feedparser.parse(url)
            for entry in feed.entries[:3]:
                title = entry.get("title", "").replace("Title: ", "")
                link = entry.get("link", "")
                summary = entry.get("summary", "")[:150] if entry.get("summary") else ""
                if title and link:
                    articles.append(f"**{title}**\n{link}\n{summary}\n")
        except Exception as e:
            print(f"Error fetching from ArXiv RSS: {e}")

        return "\n".join(articles) if articles else ""

    def fetch_aibase_news(self) -> str:
        """Fetch AI news from AI Base (aibase.com)"""
        try:
            url = "https://www.aibase.com/zh/news/"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Referer": "https://www.aibase.com/",
            }

            response = requests.get(url, headers=headers, timeout=30)
            response.encoding = "utf-8"
            soup = BeautifulSoup(response.content, "html.parser")

            articles = []
            seen_links = set()

            # Find all article links - AI Base uses links with /news/ pattern
            article_links = soup.find_all("a", href=re.compile(r"/news/\d+"))

            for link_elem in article_links[
                :20
            ]:  # Check more links to get unique articles
                if len(articles) >= 5:
                    break

                # Get full URL
                href = link_elem.get("href", "")
                if not href.startswith("http"):
                    full_link = f"https://www.aibase.com{href}"
                else:
                    full_link = href

                # Skip duplicates
                if full_link in seen_links:
                    continue
                seen_links.add(full_link)

                # Extract title - AI Base structure: link contains title text
                title = ""

                # Get all text from the link and its children
                link_text = link_elem.get_text(separator=" ", strip=True)

                # Clean up the text - remove common prefixes and noise
                title = re.sub(r"^刚刚\.AIbase\s*", "", link_text)
                title = re.sub(r"^AIbase\s*", "", title)
                title = re.sub(r"^\d+[小时天分钟]前\s*", "", title)
                title = re.sub(r"^\d+:\d+\s*", "", title)  # Remove time patterns

                # Try to find title in heading elements
                if not title or len(title) < 10:
                    title_elem = link_elem.find(
                        ["h1", "h2", "h3", "h4", "h5", "strong", "b"]
                    )
                    if title_elem:
                        title = title_elem.get_text(strip=True)

                # Look in parent for title
                if not title or len(title) < 10:
                    parent = link_elem.parent
                    for _ in range(2):
                        if not parent:
                            break
                        title_elem = parent.find(
                            ["h1", "h2", "h3", "h4"], recursive=False
                        )
                        if title_elem:
                            title = title_elem.get_text(strip=True)
                            break
                        parent = parent.parent if hasattr(parent, "parent") else None

                # Final cleanup
                title = title.strip()
                if not title or len(title) < 5:
                    continue

                # Extract summary/description - look for text after title
                summary = ""

                # Method 1: Look for description in the same container as link
                parent = link_elem.parent
                if parent:
                    # Get all text from parent, remove title
                    parent_text = parent.get_text(separator=" ", strip=True)
                    if title in parent_text:
                        # Extract text after title
                        parts = parent_text.split(title, 1)
                        if len(parts) > 1:
                            summary = parts[1].strip()
                            # Clean up summary
                            summary = re.sub(r"^刚刚\.AIbase\s*", "", summary)
                            summary = re.sub(r"^\d+[小时天分钟]前\s*", "", summary)

                # Method 2: Look for paragraph or div elements nearby
                if not summary or len(summary) < 20:
                    # Check siblings and parent's siblings
                    if parent:
                        # Look for next sibling with description
                        next_sibling = parent.find_next_sibling()
                        if next_sibling:
                            desc_text = next_sibling.get_text(strip=True)
                            if len(desc_text) > 20 and len(desc_text) < 500:
                                summary = desc_text

                        # Look for paragraph in parent
                        if not summary:
                            p_elem = parent.find("p", recursive=False)
                            if p_elem:
                                desc_text = p_elem.get_text(strip=True)
                                if desc_text != title and len(desc_text) > 20:
                                    summary = desc_text

                # Clean up summary
                if summary:
                    summary = summary[:300]  # Limit to 300 chars
                    # Remove image alt text patterns
                    summary = re.sub(r"!\[.*?\]\(.*?\)", "", summary)

                articles.append(f"**{title}**\n{full_link}\n{summary}\n")

            return "\n".join(articles) if articles else ""

        except Exception as e:
            print(f"Error fetching from AI Base: {e}")
            import traceback

            traceback.print_exc()
            return ""

    def collect_news(self) -> str:
        """
        Collect news from all sources

        Returns:
            str: Raw news content from all sources
        """
        print("📰 Collecting news from sources...")

        all_news = []

        print("→ Reddit (r/artificial, r/MachineLearning, etc.)...")
        reddit_news = self.fetch_reddit_news()
        if reddit_news:
            all_news.append("## Reddit AI Communities\n" + reddit_news)

        print("→ AI Base (aibase.com)...")
        aibase_news = self.fetch_aibase_news()
        if aibase_news:
            all_news.append("## AI Base\n" + aibase_news)

        print("→ TechCrunch AI (RSS)...")
        techcrunch_news = self.fetch_techcrunch_ai()
        if techcrunch_news:
            all_news.append("## TechCrunch AI\n" + techcrunch_news)

        print("→ MIT Technology Review (RSS)...")
        mit_news = self.fetch_mit_news()
        if mit_news:
            all_news.append("## MIT Technology Review AI\n" + mit_news)

        print("→ The Verge AI (RSS)...")
        verge_news = self.fetch_the_verge_ai()
        if verge_news:
            all_news.append("## The Verge AI\n" + verge_news)

        # Add alternative reliable sources if primary sources fail
        if not techcrunch_news and not mit_news and not verge_news:
            print("→ Adding alternative RSS sources...")
            alt_news = self.fetch_alternative_sources()
            if alt_news:
                all_news.append("## Alternative AI News Sources\n" + alt_news)

        return "\n\n".join(all_news)

    def generate_news_summary(self, raw_news: str) -> str:
        """
        Generate structured news summary using LLM

        Args:
            raw_news: Raw news content

        Returns:
            str: Formatted news summary
        """
        print("🤖 Generating summary with LLM...")

        system_prompt = f"""
        You are a professional news curator specializing in AI and technology news.
        You work for 大洪, a tech-savvy professional who needs to stay updated on AI developments.

        Analyze the provided news articles and create a structured briefing with exactly {self.articles_per_summary} most important articles.

        For each article, provide in the following EXACT format:
        
        ## Article [N]
        **Title:** [Title in Chinese]
        **Source:** [Source name]
        **Link:** [Full URL]
        **Image:** [Image URL if available, otherwise omit this line]
        **Summary:** [2-3 sentences in Chinese]
        **Importance Score:** [1-5]
        **Category:** [AI/Tech/Research/Startup]
        **Key Takeaways:**
        - [Takeaway 1]
        - [Takeaway 2]
        - [Takeaway 3]

        Requirements:
        - Focus on practical AI developments, breakthroughs, and industry impact
        - Prioritize articles directly relevant to engineering and product development
        - Importance score should reflect combination of: innovation level, practical applicability, and strategic significance
        - Format in clean, professional Chinese with clear structure
        - Do not include sponsored content or press releases unless truly significant
        - If you have fewer articles than requested, include what's available
        - Use the EXACT format above for each article

        End with a brief "## Today's Overview" section summarizing the overall theme of today's news.
        """

        news_summary = self.llm.simple_chat(
            user_message=raw_news,
            system_prompt=system_prompt,
            max_tokens=4000,
            temperature=0.3,
        )

        return news_summary

    def parse_articles_from_summary(self, summary: str) -> List[Dict]:
        """
        Parse articles from LLM-generated summary.

        Args:
            summary: Markdown formatted summary

        Returns:
            List of article dictionaries with keys: title, source, link, summary, importance_score, category, image_url
        """
        articles = []

        # Split by article markers
        article_pattern = r"##\s*Article\s*\d+"
        article_sections = re.split(article_pattern, summary)

        for section in article_sections[1:]:  # Skip first empty section
            article = {}

            # Extract Title
            title_match = re.search(
                r"\*\*Title:\*\*\s*(.+?)(?=\n|\*\*)", section, re.DOTALL
            )
            if title_match:
                article["title"] = title_match.group(1).strip()

            # Extract Source
            source_match = re.search(r"\*\*Source:\*\*\s*(.+?)(?=\n|\*\*)", section)
            if source_match:
                article["source"] = source_match.group(1).strip()

            # Extract Link
            link_match = re.search(r"\*\*Link:\*\*\s*(.+?)(?=\n|\*\*)", section)
            if link_match:
                article["link"] = link_match.group(1).strip()

            # Extract Image URL
            image_match = re.search(r"\*\*Image:\*\*\s*(.+?)(?=\n|\*\*|$)", section)
            if image_match:
                article["image_url"] = image_match.group(1).strip()

            # Extract Summary
            summary_match = re.search(
                r"\*\*Summary:\*\*\s*(.+?)(?=\n\*\*|$)", section, re.DOTALL
            )
            if summary_match:
                article["summary"] = summary_match.group(1).strip()

            # Extract Importance Score
            importance_match = re.search(r"\*\*Importance Score:\*\*\s*(\d+)", section)
            if importance_match:
                article["importance_score"] = int(importance_match.group(1))
            else:
                article["importance_score"] = 3  # Default

            # Extract Category
            category_match = re.search(r"\*\*Category:\*\*\s*(.+?)(?=\n|\*\*)", section)
            if category_match:
                article["category"] = category_match.group(1).strip()
            else:
                article["category"] = "Tech"  # Default

            # Only add if we have essential fields
            if article.get("title") and article.get("link"):
                articles.append(article)

        return articles

    def execute(self, save_to_file: bool = True, db_session=None) -> str:
        """
        Execute news collection and summary generation
        """
        print("=" * 60)
        print("📺 News Agent Starting...")
        print("=" * 60)

        # Collect news
        raw_news = self.collect_news()

        if not raw_news:
            print("❌ No news collected")
            return ""

        # Generate summary
        summary = self.generate_news_summary(raw_news)

        if not summary:
            print("❌ Failed to generate summary")
            return ""

        # Parse articles from summary and save to database
        # Also directly save Reddit posts (they have images)
        if db_session:
            try:
                from api.repositories.news_repository import NewsRepository
                from datetime import datetime as dt

                news_repo = NewsRepository(db_session)

                today = date.today()
                saved_count = 0

                # First, directly save Reddit posts (they already have structured data)
                print("→ Saving Reddit posts directly...")
                reddit_posts_data = self._get_reddit_posts_data()
                for post in reddit_posts_data[:10]:
                    existing = news_repo.get_article_by_link(post["link"], today)
                    if not existing:
                        try:
                            published_dt = None
                            if post.get("created_utc"):
                                published_dt = dt.fromtimestamp(post["created_utc"])

                            news_repo.create_article(
                                title=post["title"],
                                source=f"Reddit r/{post['subreddit']}",
                                link=post["link"],
                                summary=post.get("summary", ""),
                                image_url=post.get("image_url"),
                                thumbnail_url=post.get("thumbnail"),
                                importance_score=min(
                                    5, max(1, post.get("score", 0) // 100)
                                ),  # Convert score to 1-5
                                category="AI",
                                published_date=published_dt,
                                article_date=today,
                            )
                            saved_count += 1
                        except Exception as e:
                            print(f"⚠️  Error saving Reddit post: {e}")

                # Then parse and save articles from LLM summary
                articles = self.parse_articles_from_summary(summary)
                print(f"📝 Parsed {len(articles)} articles from summary")

                for article in articles:
                    # Check if article already exists
                    existing = news_repo.get_article_by_link(article["link"], today)
                    if not existing:
                        news_repo.create_article(
                            title=article["title"],
                            source=article.get("source", "Unknown"),
                            link=article["link"],
                            summary=article.get("summary"),
                            image_url=article.get("image_url"),
                            thumbnail_url=article.get("thumbnail_url"),
                            importance_score=article.get("importance_score", 3),
                            category=article.get("category", "Tech"),
                            article_date=today,
                        )
                        saved_count += 1
                    else:
                        print(f"⚠️  Article already exists: {article['title'][:50]}...")

                print(f"✅ Saved {saved_count} new articles to database")
            except Exception as e:
                print(f"⚠️  Failed to save articles to database: {e}")
                import traceback

                traceback.print_exc()

        # Save to file
        if save_to_file:
            success = self._save_log("news", summary, "新闻简报")
            if success:
                today_dir = self.file_manager.get_today_dir()
                print(f"✅ News summary saved to {today_dir}/新闻简报.md")

        print("=" * 60)
        print("📰 News Agent Completed!")
        print("=" * 60)

        return summary

    def run(self, save_to_file: bool = True, db_session=None) -> str:
        """
        Run the news agent workflow (alias for execute).
        """
        return self.execute(save_to_file=save_to_file, db_session=db_session)


def main():
    """Command line interface for News Agent"""
    print("Starting News Agent...")

    try:
        agent = NewsAgent()
        summary = agent.execute()

        # Print summary
        print("\n" + summary)

    except Exception as e:
        print(f"❌ Fatal error: {e}")


if __name__ == "__main__":
    main()
