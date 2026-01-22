"""
CLI Entry Point - v2.0
Supports orchestrated flows via ChiefOfStaff.
"""
import argparse
import sys
import os
import logging

# Setup path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from core.chief_of_staff import ChiefOfStaff
from agents.news_agent import NewsAgent
from agents.work_agent import WorkAgent
from agents.review_agent import ReviewAgent

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="AI Life Assistant v2.0 CLI")
    parser.add_argument(
        "--step", 
        choices=["news", "work", "review", "morning", "evening", "full"],
        required=True,
        help="Specific secretary or orchestrated flow to run"
    )
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")
    
    args = parser.parse_args()
    cos = ChiefOfStaff()

    try:
        if args.step == "news":
            NewsAgent().execute()
        elif args.step == "work":
            WorkAgent().execute(interactive=args.interactive)
        elif args.step == "review":
            ReviewAgent().execute()
        elif args.step == "morning":
            cos.run_morning_flow()
        elif args.step == "evening":
            cos.run_evening_flow()
        elif args.step == "full":
            cos.run_full_day()
            
        print(f"\n✅ Execution of '{args.step}' completed successfully.")

    except Exception as e:
        logger.error(f"CLI execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
