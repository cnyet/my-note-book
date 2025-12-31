"""
AI Life Assistant - Main Orchestrator
Central hub for coordinating all secretarial agents
"""

import sys
import os
import argparse
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(__file__))

from agents.news_secretary import NewsSecretary
from agents.work_secretary import WorkSecretary
from agents.outfit_secretary import OutfitSecretary
from agents.life_secretary import LifeSecretary
from agents.review_secretary import ReviewSecretary
from utils.file_manager import FileManager
import configparser


class LifeAssistant:
    def __init__(self):
        """Initialize the Life Assistant orchestrator"""
        self.config = configparser.ConfigParser()
        self.config.read("config/config.ini")
        self.file_manager = FileManager()

        # Convert config to dictionary for agents
        self.config_dict = {
            'llm': dict(self.config['llm']) if 'llm' in self.config else {},
            'data': dict(self.config['data']) if 'data' in self.config else {},
            'weather': dict(self.config['weather']) if 'weather' in self.config else {}
        }

        print("=" * 70)
        print("🤖 AI Life Assistant Team - Ready to Serve You, 大洪!")
        print("=" * 70)

    def show_menu(self):
        """Display main menu"""
        print("\n" + "=" * 70)
        print("📋 Main Menu - Select an Agent")
        print("=" * 70)
        print("1️⃣  News Secretary   (新闻秘书) - Get AI/tech news briefing")
        print("2️⃣  Work Secretary   (工作秘书) - Plan your work day")
        print("3️⃣  Outfit Secretary (穿搭秘书) - Get weather-based outfit advice")
        print("4️⃣  Life Secretary   (生活秘书) - Manage diet, exercise & schedule")
        print("5️⃣  Review Secretary (复盘秘书) - Evening reflection & analysis")
        print("6️⃣  Run All Morning Routine")
        print("7️⃣  Run Full Daily Routine (morning + evening)")
        print("8️⃣  List Today's Files")
        print("9️⃣  View Previous Logs")
        print("0️⃣  Exit")
        print("=" * 70)

    def show_previous_logs(self):
        """Show list of previous log directories"""
        print("\n📂 Recent Work Logs:")
        print("=" * 70)

        daily_dirs = self.file_manager.list_daily_dirs(limit=20)
        if not daily_dirs:
            print("No previous logs found.")
            return

        for i, day_dir in enumerate(daily_dirs[:10], 1):
            print(f"\n{i}. {day_dir}")

            # Show what files exist for this day
            files = ['work', 'news', 'outfit', 'life', 'review']
            file_names = {
                'work': 'Work plan',
                'news': 'News briefing',
                'outfit': 'Outfit advice',
                'life': 'Life plan',
                'review': 'Daily review'
            }

            for file_type in files:
                content = self.file_manager.read_daily_file(file_type, day_dir)
                if content:
                    print(f"   ✓ {file_names[file_type]}")

    def run_news_secretary(self):
        """Run the News Secretary agent"""
        try:
            print("\n🤖 Starting News Secretary...")
            news_agent = NewsSecretary(self.config_dict)
            summary = news_agent.run()

            print("\n" + summary)

        except Exception as e:
            print(f"❌ Error running News Secretary: {e}")

    def run_work_secretary(self):
        """Run the Work Secretary agent"""
        try:
            print("\n💼 Starting Work Secretary...")
            work_agent = WorkSecretary(self.config_dict)
            todo_list = work_agent.run()

            print("\n" + todo_list)

        except Exception as e:
            print(f"❌ Error running Work Secretary: {e}")

    def run_outfit_secretary(self):
        """Run the Outfit Secretary agent"""
        try:
            print("\n👔 Starting Outfit Secretary...")
            outfit_agent = OutfitSecretary(self.config_dict)
            recommendation = outfit_agent.run()

            print("\n" + recommendation)

        except Exception as e:
            print(f"❌ Error running Outfit Secretary: {e}")

    def run_life_secretary(self):
        """Run the Life Secretary agent"""
        try:
            print("\n🌱 Starting Life Secretary...")
            life_agent = LifeSecretary(self.config_dict)
            plan = life_agent.run()

            print("\n" + plan)

        except Exception as e:
            print(f"❌ Error running Life Secretary: {e}")

    def run_review_secretary(self):
        """Run the Review Secretary agent"""
        try:
            print("\n🌙 Starting Review Secretary...")
            review_agent = ReviewSecretary(self.config_dict)
            review = review_agent.run()

            print("\n" + review)

        except Exception as e:
            print(f"❌ Error running Review Secretary: {e}")

    def run_morning_routine(self):
        """Run complete morning routine"""
        print("\n" + "=" * 70)
        print("🌅 Starting Complete Morning Routine")
        print("=" * 70)

        # Step 1: News
        print("\n📰 Phase 1: News Briefing")
        print("-" * 70)
        try:
            news_agent = NewsSecretary(self.config_dict)
            news_summary = news_agent.run()
        except Exception as e:
            print(f"❌ News Secretary failed: {e}")

        # Step 2: Outfit
        print("\n👔 Phase 2: Outfit Recommendation")
        print("-" * 70)
        try:
            outfit_agent = OutfitSecretary(self.config_dict)
            outfit_recommendation = outfit_agent.run()
        except Exception as e:
            print(f"❌ Outfit Secretary failed: {e}")

        # Step 3: Work Planning
        print("\n💼 Phase 3: Work Planning")
        print("-" * 70)
        try:
            work_agent = WorkSecretary(self.config_dict)
            work_plan = work_agent.run()
        except Exception as e:
            print(f"❌ Work Secretary failed: {e}")

        # Step 4: Life Management
        print("\n🌱 Phase 4: Life Management")
        print("-" * 70)
        try:
            life_agent = LifeSecretary(self.config_dict)
            life_plan = life_agent.run()
        except Exception as e:
            print(f"❌ Life Secretary failed: {e}")

        print("\n" + "=" * 70)
        print("✨ Morning Routine Completed!")
        print("=" * 70)

        today_dir = self.file_manager.get_today_dir()
        print(f"\n📁 All files saved to: {today_dir}")

    def run_full_daily_routine(self):
        """Run complete daily routine (morning + evening)"""
        print("\n" + "=" * 70)
        print("🌅 Starting Full Daily Routine")
        print("=" * 70)

        # Morning Routine
        print("\n🌅 Morning Phase")
        print("-" * 70)
        self.run_morning_routine()

        # Wait for user confirmation to continue with evening review
        input("\n⏸️  Press Enter when you're ready for the evening review...")

        # Evening Review
        print("\n🌙 Evening Phase")
        print("-" * 70)
        print("\n🌙 Starting Evening Review...")
        try:
            review_agent = ReviewSecretary(self.config_dict)
            review = review_agent.run()
        except Exception as e:
            print(f"❌ Review Secretary failed: {e}")

        print("\n" + "=" * 70)
        print("🎊 Full Daily Routine Completed!")
        print("=" * 70)

        today_dir = self.file_manager.get_today_dir()
        print(f"\n📁 All files saved to: {today_dir}")

    def list_today_files(self):
        """List files created today"""
        today_dir = self.file_manager.get_today_dir()

        if not os.path.exists(today_dir):
            print("No files created today yet.")
            return

        print(f"\n📁 Today's Files ({os.path.basename(today_dir)}):")
        print("=" * 70)

        files = os.listdir(today_dir)
        if not files:
            print("No files yet today.")
            return

        for file in sorted(files):
            filepath = os.path.join(today_dir, file)
            size = os.path.getsize(filepath)
            print(f"  • {file} ({size} bytes)")

    def interactive_menu(self):
        """Run interactive menu mode"""
        while True:
            self.show_menu()

            try:
                choice = input("\nSelect option (0-9): ").strip()

                if choice == "1":
                    self.run_news_secretary()
                elif choice == "2":
                    self.run_work_secretary()
                elif choice == "3":
                    self.run_outfit_secretary()
                elif choice == "4":
                    self.run_life_secretary()
                elif choice == "5":
                    self.run_review_secretary()
                elif choice == "6":
                    self.run_morning_routine()
                elif choice == "7":
                    self.run_full_daily_routine()
                elif choice == "8":
                    self.list_today_files()
                elif choice == "9":
                    self.show_previous_logs()
                elif choice == "0":
                    print("\n👋 Goodbye! Have a productive day!")
                    break
                else:
                    print("\n❌ Invalid choice. Please select 0-9.")

                input("\nPress Enter to continue...")

            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="AI Life Assistant - Your Personal Secretarial Team")
    parser.add_argument(
        '--step', '-s',
        choices=['news', 'work', 'outfit', 'life', 'review', 'morning', 'full', 'menu'],
        help='Run specific agent or routine: news, work, outfit, life, review, morning, full (all day), or menu (interactive)',
        default='menu'
    )
    parser.add_argument(
        '--list', '-l',
        action='store_true',
        help='List today\'s files'
    )
    parser.add_argument(
        '--history', '-H',
        action='store_true',
        help='Show history of log directories'
    )
    parser.add_argument(
        '--interactive', '-i',
        action='store_true',
        help='Run selected agent in interactive mode (where supported)'
    )

    args = parser.parse_args()

    try:
        assistant = LifeAssistant()

        if args.list:
            assistant.list_today_files()
        elif args.history:
            assistant.show_previous_logs()
        elif args.step == 'news':
            assistant.run_news_secretary()
        elif args.step == 'work':
            assistant.run_work_secretary()
        elif args.step == 'outfit':
            if args.interactive:
                outfit_agent = OutfitSecretary(assistant.config_dict)
                outfit_agent.interactive_mode()
            else:
                assistant.run_outfit_secretary()
        elif args.step == 'life':
            if args.interactive:
                life_agent = LifeSecretary(assistant.config_dict)
                life_agent.interactive_mode()
            else:
                assistant.run_life_secretary()
        elif args.step == 'review':
            if args.interactive:
                review_agent = ReviewSecretary(assistant.config_dict)
                review_agent.run(interactive=True)
            else:
                assistant.run_review_secretary()
        elif args.step == 'morning':
            assistant.run_morning_routine()
        elif args.step == 'full':
            assistant.run_full_daily_routine()
        elif args.step == 'menu':
            assistant.interactive_menu()

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
