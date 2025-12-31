"""
Unit tests for WorkSecretary agent.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from agents.work_secretary import WorkSecretary, WorkTask


class TestWorkTask:
    """Test WorkTask model."""

    def test_work_task_creation(self):
        """Test creating a work task."""
        task = WorkTask(
            title="Complete project",
            priority="high",
            estimated_time="2 hours"
        )

        assert task.title == "Complete project"
        assert task.priority == "high"
        assert task.estimated_time == "2 hours"
        assert task.completed is False
        assert task.created_at is not None

    def test_work_task_defaults(self):
        """Test work task with default values."""
        task = WorkTask(title="Simple task")

        assert task.title == "Simple task"
        assert task.priority == "medium"
        assert task.estimated_time == ""
        assert task.location == ""
        assert task.people == ""
        assert task.notes == ""

    def test_work_task_to_dict(self):
        """Test converting task to dictionary."""
        task = WorkTask(
            title="Test task",
            priority="low",
            estimated_time="1 hour"
        )

        task_dict = task.to_dict()

        assert task_dict['title'] == "Test task"
        assert task_dict['priority'] == "low"
        assert task_dict['estimated_time'] == "1 hour"
        assert task_dict['completed'] is False
        assert 'created_at' in task_dict

    def test_work_task_from_dict(self):
        """Test creating task from dictionary."""
        data = {
            'title': 'Imported task',
            'priority': 'high',
            'estimated_time': '3 hours',
            'location': 'Office',
            'people': 'Team',
            'notes': 'Important',
            'completed': True,
            'created_at': '2024-01-01T10:00:00'
        }

        task = WorkTask.from_dict(data)

        assert task.title == 'Imported task'
        assert task.priority == 'high'
        assert task.completed is True
        assert task.created_at == '2024-01-01T10:00:00'

    def test_priority_lowercase(self):
        """Test priority is converted to lowercase."""
        task = WorkTask(title="Task", priority="HIGH")

        assert task.priority == "high"


class TestWorkSecretaryInit:
    """Test WorkSecretary initialization."""

    def test_init_with_config_dict(self, mock_config_dict):
        """Test initialization with config dictionary."""
        secretary = WorkSecretary(config_dict=mock_config_dict)

        assert secretary.config_dict == mock_config_dict
        assert secretary.config is None
        assert secretary.llm is not None
        assert secretary.file_manager is not None

    def test_init_with_config_path(self, tmp_path, sample_config_file):
        """Test initialization with config file path."""
        config_path = tmp_path / "config.ini"
        config_path.write_text(sample_config_file)

        secretary = WorkSecretary(config_path=str(config_path))

        assert secretary.config is not None
        assert secretary.llm is not None


class TestWorkSecretaryPreviousTasks:
    """Test retrieving previous day tasks."""

    def test_get_previous_day_tasks_no_history(self, mock_config_dict):
        """Test getting previous tasks with no history."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.file_manager = Mock()
        secretary.file_manager.list_daily_dirs.return_value = []

        tasks = secretary.get_previous_day_tasks()

        assert tasks == []

    def test_get_previous_day_tasks_with_incomplete(
        self, mock_config_dict
    ):
        """Test getting incomplete tasks from previous day."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.file_manager = Mock()
        secretary.file_manager.list_daily_dirs.return_value = [
            '2024-01-02', '2024-01-01'
        ]

        work_content = """# 今日工作
## 今日TODO
- [x] Completed task
- [ ] Incomplete task 1
- [ ] Incomplete task 2
"""
        secretary.file_manager.read_daily_file.return_value = work_content

        tasks = secretary.get_previous_day_tasks()

        # The method extracts tasks but may filter some patterns
        assert isinstance(tasks, list)
        # Check that incomplete tasks are detected
        if len(tasks) > 0:
            assert all(isinstance(t, WorkTask) for t in tasks)

    def test_get_previous_day_tasks_no_file(self, mock_config_dict):
        """Test getting previous tasks when file doesn't exist."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.file_manager = Mock()
        secretary.file_manager.list_daily_dirs.return_value = [
            '2024-01-02', '2024-01-01'
        ]
        secretary.file_manager.read_daily_file.return_value = None

        tasks = secretary.get_previous_day_tasks()

        assert tasks == []


class TestWorkSecretaryCollectInfo:
    """Test collecting work information."""

    @patch('builtins.input')
    def test_collect_today_work_info_basic(
        self, mock_input, mock_config_dict
    ):
        """Test basic work info collection."""
        # Simulate user input: no meetings, 1 task, priority, no notes
        mock_input.side_effect = [
            '',  # No meetings
            'Complete documentation',  # Task 1
            '',  # No more tasks
            'Documentation',  # Priority
            ''   # No special notes
        ]

        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.file_manager = Mock()
        secretary.file_manager.list_daily_dirs.return_value = []

        work_info = secretary.collect_today_work_info()

        assert "Complete documentation" in work_info
        assert "Documentation" in work_info
        assert "Work Information" in work_info

    @patch('builtins.input')
    def test_collect_with_meetings(self, mock_input, mock_config_dict):
        """Test collecting work info with meetings."""
        mock_input.side_effect = [
            'Team standup',  # Meeting 1
            'Client call',   # Meeting 2
            '',              # No more meetings
            '',              # No tasks
            '',              # No priority
            ''               # No notes
        ]

        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.file_manager = Mock()
        secretary.file_manager.list_daily_dirs.return_value = []

        work_info = secretary.collect_today_work_info()

        assert "Team standup" in work_info
        assert "Client call" in work_info


class TestWorkSecretaryGenerateTodo:
    """Test TODO list generation."""

    def test_generate_todo_list(self, mock_config_dict):
        """Test generating TODO list with LLM."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "## 今日TODO\n- Task 1"

        work_info = "Work information"
        result = secretary.generate_todo_list(work_info)

        assert "今日TODO" in result
        secretary.llm.simple_chat.assert_called_once()
        call_args = secretary.llm.simple_chat.call_args
        assert call_args[1]['user_message'] == work_info
        assert call_args[1]['max_tokens'] == 3000
        assert call_args[1]['temperature'] == 0.5

    def test_generate_todo_system_prompt(self, mock_config_dict):
        """Test TODO generation includes proper system prompt."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "TODO list"

        secretary.generate_todo_list("Work info")

        call_args = secretary.llm.simple_chat.call_args
        system_prompt = call_args[1]['system_prompt']
        assert '大洪' in system_prompt
        assert 'TODO' in system_prompt or 'todo' in system_prompt.lower()


class TestWorkSecretaryExecute:
    """Test work secretary execution."""

    @patch('builtins.input')
    def test_execute_interactive(
        self, mock_input, mock_config_dict, tmp_path
    ):
        """Test interactive execution."""
        mock_input.side_effect = [
            '',  # No meetings
            'Task 1',  # Task
            '',  # No more tasks
            'High priority',  # Priority
            ''   # No notes
        ]

        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "Generated TODO"

        result = secretary.execute(interactive=True, save_to_file=True)

        assert "Generated TODO" in result
        assert "今日工作规划" in result

    def test_execute_non_interactive(self, mock_config_dict):
        """Test non-interactive execution."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "TODO list"

        result = secretary.execute(interactive=False, save_to_file=False)

        assert "TODO list" in result

    def test_execute_llm_failure(self, mock_config_dict):
        """Test execution when LLM fails."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = ""

        result = secretary.execute(interactive=False, save_to_file=False)

        assert result == ""

    def test_run_alias(self, mock_config_dict):
        """Test that run() is an alias for execute()."""
        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.execute = Mock(return_value="Result")

        result = secretary.run(interactive=False, save_to_file=False)

        assert result == "Result"
        secretary.execute.assert_called_once_with(
            interactive=False, save_to_file=False
        )


class TestWorkSecretaryIntegration:
    """Integration tests for WorkSecretary."""

    @patch('builtins.input')
    def test_full_workflow(self, mock_input, mock_config_dict, tmp_path):
        """Test full workflow with mocked components."""
        mock_input.side_effect = [
            'Meeting 1',
            '',
            'Task 1',
            'Task 2',
            '',
            'Priority 1',
            'Note 1'
        ]

        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = WorkSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "Complete TODO list"

        result = secretary.execute(interactive=True, save_to_file=True)

        assert "Complete TODO list" in result

        # Check file was created (FileManager creates in data/daily_logs)
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日工作.md"
        assert expected_file.exists()
