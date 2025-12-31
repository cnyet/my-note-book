"""
News Secretary Agent
Responsible for fetching and summarizing AI/technology news
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from integrations.llm.llm_client_v2 import create_llm_client
from utils.file_manager import FileManager
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import feedparser
import configparser


class NewsSecretary:
    """AI-powered news briefing secretary focused on AI/tech content."""

    def __init__(self, config_dict=None, config_path: str = "config/config.ini"):
        """
        Initialize the news secretary.

        Args:
            config_dict: Configuration dictionary (preferred)
            config_path: Path to config.ini file (fallback)
        """
        if config_dict:
            self.config_dict = config_dict
            self.config = None
        else:
            self.config = configparser.ConfigParser()
            self.config.read(config_path)
            self.config_dict = {
                'llm': dict(self.config['llm']) if 'llm' in self.config else {},
                'data': dict(self.config['data']) if 'data' in self.config else {},
                'news': dict(self.config['news']) if 'news' in self.config else {}
            }

        # Initialize LLM client
        self.llm = create_llm_client(config_path=config_path)

        # Initialize file manager
        self.file_manager = FileManager(self.config_dict.get('data', {}))

        # Get news sources from config
        news_config = self.config_dict.get('news', {})
        if 'sources' in news_config:
            sources_str = news_config['sources']
            self.sources = [s.strip() for s in sources_str.split('\n') if s.strip()]
        else:
            # Default sources
            self.sources = [
                'https://techcrunch.com/category/artificial-intelligence/',
                'https://www.theverge.com/ai-artificial-intelligence',
                'https://www.technologyreview.com/topic/artificial-intelligence/'
            ]

        # Get articles per summary
        self.articles_per_summary = int(news_config.get('articles_per_summary', 5))

    def fetch_techcrunch_ai(self) -> str:
        """Fetch AI news from TechCrunch"""
        try:
            url = "https://techcrunch.com/category/artificial-intelligence/"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            response = requests.get(url, headers=headers, timeout=30)
            soup = BeautifulSoup(response.content, 'html.parser')

            articles = []
            article_elements = soup.find_all('div', class_='wp-block-tc23-post-picker')[:3]

            for element in article_elements:
                title_elem = element.find('h2')
                link_elem = element.find('a', class_='wp-block-tc23-post-picker-title__link')

                if title_elem and link_elem:
                    title = title_elem.text.strip()
                    link = link_elem.get('href')

                    # Get brief content
                    content_elem = element.find('p')
                    content = content_elem.text.strip() if content_elem else ""

                    articles.append(f"**{title}**\n{link}\n{content}\n")

            return "\n".join(articles)

        except Exception as e:
            print(f"Error fetching from TechCrunch: {e}")
            return ""

    def fetch_the_verge_ai(self) -> str:
        """Fetch AI news from The Verge"""
        try:
            url = "https://www.theverge.com/ai-artificial-intelligence"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            response = requests.get(url, headers=headers, timeout=30)
            soup = BeautifulSoup(response.content, 'html.parser')

            articles = []
            article_elements = soup.find_all('div', class_='c-entry-box--compact')[:3]

            for element in article_elements:
                title_elem = element.find('h2')
                link_elem = element.find('a')

                if title_elem and link_elem:
                    title = title_elem.text.strip()
                    link = f"https://www.theverge.com{link_elem.get('href')}"

                    articles.append(f"**{title}**\n{link}\n")

            return "\n".join(articles)

        except Exception as e:
            print(f"Error fetching from The Verge: {e}")
            return ""

    def fetch_mit_news(self) -> str:
        """Fetch AI news from MIT Technology Review"""
        try:
            url = "https://www.technologyreview.com/topic/artificial-intelligence/"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            response = requests.get(url, headers=headers, timeout=30)
            soup = BeautifulSoup(response.content, 'html.parser')

            articles = []
            article_elements = soup.find_all('li', class_='stream-item')[:3]

            for element in article_elements:
                title_elem = element.find('h3')
                link_elem = element.find('a')

                if title_elem and link_elem:
                    title = title_elem.text.strip()
                    link = link_elem.get('href')

                    # Get summary
                    summary_elem = element.find('div', class_='dek')
                    summary = summary_elem.text.strip() if summary_elem else ""

                    articles.append(f"**{title}**\n{link}\n{summary}\n")

            return "\n".join(articles)

        except Exception as e:
            print(f"Error fetching from MIT Tech Review: {e}")
            return ""

    def collect_news(self) -> str:
        """
        Collect news from all sources

        Returns:
            str: Raw news content from all sources
        """
        print("📰 Collecting news from sources...")

        all_news = []

        print("→ TechCrunch AI...")
        techcrunch_news = self.fetch_techcrunch_ai()
        if techcrunch_news:
            all_news.append("## TechCrunch AI\n" + techcrunch_news)

        print("→ MIT Technology Review...")
        mit_news = self.fetch_mit_news()
        if mit_news:
            all_news.append("## MIT Technology Review AI\n" + mit_news)

        print("→ The Verge AI...")
        verge_news = self.fetch_the_verge_ai()
        if verge_news:
            all_news.append("## The Verge AI\n" + verge_news)

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

        For each article, provide:
        1. **Title** - Clear, adapted title in Chinese
        2. **Source** - Original publication
        3. **Link** - URL to full article
        4. **Summary** - 2-3 sentences highlighting key points in Chinese
        5. **Importance Score** - Rate 1-5 (5 being most important)
        6. **Key Takeaways** - 2-3 bullet points of why this matters

        Requirements:
        - Focus on practical AI developments, breakthroughs, and industry impact
        - Prioritize articles directly relevant to engineering and product development
        - Importance score should reflect combination of: innovation level, practical applicability, and strategic significance
        - Format in clean, professional Chinese with clear structure
        - Do not include sponsored content or press releases unless truly significant
        - If you have fewer articles than requested, include what's available

        End with a brief "Today's Overview" section summarizing the overall theme of today's news.
        """

        news_summary = self.llm.simple_chat(
            user_message=raw_news,
            system_prompt=system_prompt,
            max_tokens=4000,
            temperature=0.3
        )

        return news_summary

    def execute(self, save_to_file: bool = True) -> str:
        """
        Execute news collection and summary generation

        Args:
            save_to_file: Whether to save the summary to file

        Returns:
            str: Generated news summary
        """
        print("=" * 60)
        print("📺 News Secretary Starting...")
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

        # Add header with timestamp
        final_summary = f"""# 新闻简报 - {datetime.now().strftime("%Y年%m月%d日 %H:%M")}

{summary}

---
*Generated by AI Life Assistant*
"""

        # Save to file
        if save_to_file:
            success = self.file_manager.save_daily_file('news', final_summary)
            if success:
                today_dir = self.file_manager.get_today_dir()
                print(f"✅ News summary saved to {today_dir}/新闻简报.md")

        print("=" * 60)
        print("📰 News Secretary Completed!")
        print("=" * 60)

        return final_summary

    def run(self, save_to_file: bool = True) -> str:
        """
        Run the news secretary workflow (alias for execute).

        Args:
            save_to_file: Whether to save the briefing to file

        Returns:
            Generated news briefing in markdown format
        """
        return self.execute(save_to_file=save_to_file)


def main():
    """Command line interface for News Secretary"""
    print("Starting News Secretary...")

    try:
        secretary = NewsSecretary()
        summary = secretary.execute()

        # Print summary
        print("\n" + summary)

    except Exception as e:
        print(f"❌ Fatal error: {e}")


if __name__ == "__main__":
    main()
