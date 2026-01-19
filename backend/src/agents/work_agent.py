"""
Work Secretary Agent
Responsible for work task management, TODO tracking, and daily planning
"""

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from agents.base import BaseAgent
from datetime import datetime
import json


class WorkTask:
    """Simple work task model for individual activities."""

    def __init__(
        self,
        title: str,
        priority: str = "medium",
        estimated_time: str = "",
        location: str = "",
        people: str = "",
        notes: str = "",
    ):
        self.title = title
        self.priority = priority.lower()
        self.estimated_time = estimated_time
        self.location = location
        self.people = people
        self.notes = notes
        self.completed = False
        self.created_at = datetime.now().isoformat()

    def to_dict(self):
        return {
            "title": self.title,
            "priority": self.priority,
            "estimated_time": self.estimated_time,
            "location": self.location,
            "people": self.people,
            "notes": self.notes,
            "completed": self.completed,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data):
        task = cls(
            data["title"],
            data["priority"],
            data.get("estimated_time", ""),
            data.get("location", ""),
            data.get("people", ""),
            data.get("notes", ""),
        )
        task.completed = data.get("completed", False)
        task.created_at = data.get("created_at", datetime.now().isoformat())
        return task


class WorkAgent(BaseAgent):
    """AI-powered work task management and planning agent."""

    def __init__(self, **kwargs):
        super().__init__(name="Work", **kwargs)

    def get_previous_day_tasks(self) -> list:
        """
        Get incomplete tasks from previous day

        Returns:
            list: List of incomplete tasks
        """
        daily_dirs = self.file_manager.list_daily_dirs()
        if len(daily_dirs) < 2:
            return []

        previous_day = daily_dirs[1]  # Second newest
        work_content = self.file_manager.read_daily_file("work", previous_day)

        if not work_content:
            return []

        # Extract incomplete tasks from markdown
        incomplete_tasks = []
        lines = work_content.split("\n")
        in_todo_section = False

        for line in lines:
            if "## 今日TODO" in line or "## To-Do List" in line:
                in_todo_section = True
                continue
            if in_todo_section and line.startswith("## "):
                break
            if in_todo_section and "[ ]" in line:
                task_title = line.replace("[ ]", "").strip()
                if task_title and not task_title.startswith("-"):
                    incomplete_tasks.append(WorkTask(task_title))

        return incomplete_tasks

    def collect_today_work_info(self) -> str:
        """
        Interactive collection of today's work information

        Returns:
            str: Collected work information
        """
        print("\n" + "=" * 60)
        print("💼 Work Secretary: Let's plan your day!")
        print("=" * 60 + "\n")

        # Get previous incomplete tasks
        print("📋 Checking yesterday's incomplete tasks...")
        incomplete_tasks = self.get_previous_day_tasks()
        if incomplete_tasks:
            print(f"Found {len(incomplete_tasks)} incomplete tasks:\n")
            for i, task in enumerate(incomplete_tasks, 1):
                print(f"{i}. ⏳ {task.title}")
        else:
            print("No incomplete tasks from yesterday. Great!")

        print("\n" + "-" * 60 + "\n")

        # Collect today's meetings
        print("🗓️  Today's Meetings:")
        meetings = []
        meeting_count = 0
        while True:
            meeting = input(
                f"Meeting {meeting_count + 1} (or press Enter to skip): "
            ).strip()
            if not meeting:
                break
            meetings.append(meeting)
            meeting_count += 1

        print("\n" + "-" * 60 + "\n")

        # Collect main work tasks
        print("📌 Main Work Tasks:")
        print("(Please describe what needs to be done)")
        work_tasks = []
        task_count = 0
        while True:
            task = input(f"Task {task_count + 1} (or press Enter to finish): ").strip()
            if not task:
                break
            work_tasks.append(task)
            task_count += 1

        print("\n" + "-" * 60 + "\n")

        # Collect priorities and special instructions
        priorities = input("🎯 What's the highest priority today? ").strip()
        special_notes = input("📝 Any special instructions or reminders? ").strip()

        # Compile all information
        work_info = f"""# Work Information - {datetime.now().strftime("%Y-%m-%d %H:%M")}

## Previous Day Incomplete Tasks
{f"- " + "\n- ".join([t.title for t in incomplete_tasks]) if incomplete_tasks else "None - all tasks completed! ✨"}

## Today's Meetings
{f"1. " + "\n2. ".join(meetings) if meetings else "No scheduled meetings"}

## Main Work Tasks
{f"1. " + "\n2. ".join(work_tasks) if work_tasks else "No specific tasks defined"}

## Top Priority
{priorities if priorities else "Not specified"}

## Special Notes
{special_notes if special_notes else "None"}
"""

        return work_info

    def generate_todo_list(self, work_info: str) -> str:
        """
        Generate structured TODO list using LLM

        Args:
            work_info: Collected work information

        Returns:
            str: Structured TODO list in markdown
        """
        print("🤖 Analyzing with LLM to create optimized TODO list...")

        system_prompt = """
        You are a productivity expert and work planning specialist. You help 大洪 organize his work day efficiently.

        Based on the provided work information, create a structured and actionable TODO list. Each task should include:
        - Clear title and description
        - Priority level (High/Medium/Low)
        - Estimated time needed
        - Key points or sub-tasks

        Follow this structure:
        ## 今日TODO

        ### 🚨 高优先级
        - [ ] **Task Title** - Brief description
          - Priority: High
          - Est. Time: X hours/minutes
          - Key Points: Bullet points of what needs to be done

        ### ⚡ 中优先级
        - Similar format for medium priority

        ### 📝 低优先级/待办
        - Similar format for low priority

        ### 📊 今日工作概览
        - Total tasks: X
        - Est. Total Time: X hours
        - Recommended Time Blocks: Morning/Afternoon/Evening recommendations

        Consider:
        1. Balanced workload - don't overload the day
        2. Energy levels - important tasks in high-energy periods
        3. Meeting schedules - work around meeting times
        4. Dependencies - tasks that block others first
        5. Quick wins - include some easy completions for motivation
        6. Review 大洪's aboutme.md for context on his goals and work style
        """

        todo_content = self.llm.simple_chat(
            user_message=work_info,
            system_prompt=system_prompt,
            max_tokens=3000,
            temperature=0.5,
        )

        return todo_content

    def execute(self, interactive: bool = False, save_to_file: bool = True) -> str:
        """
        Execute work planning
        """
        print("=" * 60)
        print("💼 Work Agent Starting...")
        print("=" * 60)

        if interactive:
            work_info = self.collect_today_work_info()
        else:
            # Build work_info automatically for non-interactive mode
            incomplete_tasks = self.get_previous_day_tasks()
            work_info = f"""# Automatically Collected Work Information - {datetime.now().strftime("%Y-%m-%d %H:%M")}

## Previous Day Incomplete Tasks
{f"- " + "\n- ".join([t.title for t in incomplete_tasks]) if incomplete_tasks else "None - all tasks completed! ✨"}

## Note
This plan was generated automatically without additional user input. Focus on completing rollover tasks and common daily work items.
"""

        todo_list = self.generate_todo_list(work_info)

        if not todo_list:
            print("❌ Failed to generate TODO list")
            return ""

        # Save to file
        if save_to_file:
            success = self._save_log("work", todo_list, "今日工作规划")
            if success:
                today_dir = self.file_manager.get_today_dir()
                print(f"\n✅ Work plan saved to {today_dir}/今日工作.md")

        print("\n" + "=" * 60)
        print("✨ Work Planning Completed!")
        print("=" * 60)

        return todo_list

    def run(self, interactive: bool = False, save_to_file: bool = True) -> str:
        """
        Run the work agent workflow (alias for execute).
        """
        return self.execute(interactive=interactive, save_to_file=save_to_file)


def main():
    """Command line interface for Work Agent"""
    print("Starting Work Agent...")

    try:
        agent = WorkAgent()
        todo_list = agent.execute(interactive=True)

        # Print the TODO list
        print("\n" + todo_list)

    except Exception as e:
        print(f"❌ Fatal error: {e}")


if __name__ == "__main__":
    main()
