"""
Context Window Manager for AI Life Assistant v2.0
Handles sliding window logic and token-based pruning for short-term memory.
"""
from typing import List, Dict, Any
import json

class ContextWindowManager:
    def __init__(self, max_tokens: int = 4000, max_exchanges: int = 10):
        self.max_tokens = max_tokens
        self.max_exchanges = max_exchanges
        self.message_buffer: List[Dict[str, str]] = []

    def add_message(self, role: str, content: str):
        """Add a new message to the buffer and prune if necessary."""
        self.message_buffer.append({"role": role, "content": content})
        
        # Prune by exchange count first
        if len(self.message_buffer) > self.max_exchanges:
            self.message_buffer = self.message_buffer[-self.max_exchanges:]
            
        # Token-based pruning (approximate implementation)
        self._prune_by_token_limit()

    def _prune_by_token_limit(self):
        """Simple approximation: 1 token ~= 4 chars for English, 1 char for Chinese."""
        while self.message_buffer and self._estimate_tokens() > self.max_tokens:
            if len(self.message_buffer) > 1:
                # Keep system/instruction if it's the first message, otherwise prune oldest
                self.message_buffer.pop(0 if self.message_buffer[0]['role'] != 'system' else 1)
            else:
                break

    def _estimate_tokens(self) -> int:
        return sum(len(m['content']) for m in self.message_buffer)

    def get_context(self) -> List[Dict[str, str]]:
        """Return the current active context window."""
        return self.message_buffer

    def clear(self):
        """Clear the context window."""
        self.message_buffer = []
