"""
AI Life Assistant - Main Orchestrator
Central hub for coordinating all AI agents
"""

import sys
import os
import argparse
from datetime import datetime, date
import configparser

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from agents.news_agent import NewsAgent
from agents.work_agent import WorkAgent
from agents.outfit_agent import OutfitAgent
from agents.life_agent import LifeAgent
from agents.review_agent import ReviewAgent
from utils.file_manager import FileManager
from core.coordinator import ChiefOfStaff

class LifeAssistant:
    def __init__(self):
        """Initialize the Life Assistant orchestrator"""
        self.config = configparser.ConfigParser()
        self.config.read("backend/config/config.ini")
        self.file_manager = FileManager()
        self.config_path = "backend/config/config.ini"

        self.config_dict = {
            "llm": dict(self.config["llm"]) if "llm" in self.config else {},
            "data": dict(self.config["data"]) if "data" in self.config else {},
            "weather": dict(self.config["weather"]) if "weather" in self.config else {},
        }

        print("=" * 70)
        print("🤖 AI Life Assistant v2.0 - Ready to Serve You, Dahong!")
        print("=" * 70)

    def show_menu(self):
        """Display main menu"""
        print("\n" + "=" * 70)
        print("📋 Main Menu - Select an Agent")
        print("=" * 70)
        print("1️⃣  News Agent   - Global awareness")
        print("2️⃣  Work Agent   - Strategic task planning")
        print("3️⃣  Outfit Agent - Personal presentation")
        print("4️⃣  Life Agent   - Health & Vitality")
        print("5️⃣  Review Agent - Growth & Reflection")
        print("6️⃣  🚀 Run Chief of Staff Pipeline (v2.0 synergy)")
        print("7️⃣  List Today's Files")
        print("8️⃣  View Previous Logs")
        print("0️⃣  Exit")
        print("=" * 70)

    def run_news_agent(self):
        try:
            agent = NewsAgent(config_path=self.config_path)
            print(agent.run())
        except Exception as e:
            print(f"❌ News Agent failed: {e}")

    def run_work_agent(self):
        try:
            agent = WorkAgent(config_path=self.config_path)
            print(agent.run())
        except Exception as e:
            print(f"❌ Work Agent failed: {e}")

    def run_outfit_agent(self, interactive=False):
        try:
            agent = OutfitAgent(config_path=self.config_path)
            if interactive:
                agent.interactive_mode()
            else:
                print(agent.run())
        except Exception as e:
            print(f"❌ Outfit Agent failed: {e}")

    def run_life_agent(self, interactive=False):
        try:
            agent = LifeAgent(config_path=self.config_path)
            if interactive:
                agent.interactive_mode()
            else:
                print(agent.run())
        except Exception as e:
            print(f"❌ Life Agent failed: {e}")

    def run_review_agent(self, interactive=False):
        try:
            agent = ReviewAgent(config_path=self.config_path)
            if interactive:
                agent.run(interactive=True)
            else:
                print(agent.run())
        except Exception as e:
            print(f"❌ Review Agent failed: {e}")

    def run_v2_pipeline(self):
        """Run the new v2 Chief of Staff Pipeline"""
        orchestrator = ChiefOfStaff(config_path=self.config_path)
        orchestrator.run_daily_pipeline()

    def interactive_menu(self):
        """Run interactive menu mode"""
        while True:
            self.show_menu()
            try:
                choice = input("\nSelect option (0-8): ").strip()
                if choice == "1": self.run_news_agent()
                elif choice == "2": self.run_work_agent()
                elif choice == "3": self.run_outfit_agent(interactive=True)
                elif choice == "4": self.run_life_agent(interactive=True)
                elif choice == "5": self.run_review_agent(interactive=True)
                elif choice == "6": self.run_v2_pipeline()
                elif choice == "7": self.list_files()
                elif choice == "8": self.show_history()
                elif choice == "0": break
                else: print("\n❌ Invalid choice.")
                input("\nPress Enter to continue...")
            except KeyboardInterrupt: break
            except Exception as e: print(f"\n❌ Error: {e}")

    def list_files(self):
        today_dir = self.file_manager.get_today_dir()
        if not os.path.exists(today_dir):
            print("No files created today.")
            return
        for file in sorted(os.listdir(today_dir)):
            print(f"  • {file}")

    def show_history(self):
        dirs = self.file_manager.list_daily_dirs(limit=5)
        for d in dirs: print(f" - {d}")

def main():
    parser = argparse.ArgumentParser(description="AI Life Assistant v2.0")
    parser.add_argument("--step", "-s", choices=["news", "work", "outfit", "life", "review", "pipeline", "menu"], default="menu")
    parser.add_argument("--interactive", "-i", action="store_true")
    args = parser.parse_args()

    assistant = LifeAssistant()
    if args.step == "pipeline": assistant.run_v2_pipeline()
    elif args.step == "news": assistant.run_news_agent()
    elif args.step == "work": assistant.run_work_agent()
    elif args.step == "outfit": assistant.run_outfit_agent(args.interactive)
    elif args.step == "life": assistant.run_life_agent(args.interactive)
    elif args.step == "review": assistant.run_review_agent(args.interactive)
    else: assistant.interactive_menu()

if __name__ == "__main__":
    main()
