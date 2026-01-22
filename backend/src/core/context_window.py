"""
Sliding Window Context Manager for AI Life Assistant v2.0
Adheres to conversation-accuracy-skill specifications.
"""
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class ContextWindowManager:
    """
    Manages a sliding window of recent dialogue turns.
    Follows conversation-accuracy-skill:
    - ~10 messages (5 turns) maximum.
    - Preserves full detail for immediate continuity.
    """
    
    def __init__(self, max_messages: int = 10):
        self.max_messages = max_messages
        self.message_history: List[Dict] = []

    def add_message(self, role: str, content: str):
        """Add a message to history and prune if necessary."""
        self.message_history.append({"role": role, "content": content})
        
        # Pruning oldest messages if limit reached
        if len(self.message_history) > self.max_messages:
            pruned_count = len(self.message_history) - self.max_messages
            self.message_history = self.message_history[pruned_count:]
            logger.debug(f"Pruned {pruned_count} messages from sliding window.")

    def get_history(self) -> List[Dict]:
        """Return the current window of messages."""
        return self.message_history

    def clear(self):
        """Clear the history."""
        self.message_history = []
