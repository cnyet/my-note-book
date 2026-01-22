"""
Context Bus Module - v2.0
Provides a shared state for a single execution run, allowing agents to share data.
"""
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class ContextBus:
    """
    A shared data bus for a single daily run.
    """
    def __init__(self):
        self._store: Dict[str, Any] = {}

    def set(self, key: str, value: Any):
        """Set a value in the context bus."""
        logger.debug(f"ContextBus: Setting '{key}'")
        self._store[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        """Get a value from the context bus."""
        return self._store.get(key, default)

    def get_all(self) -> Dict[str, Any]:
        """Return all shared data."""
        return self._store.copy()

    def clear(self):
        """Clear the bus for a fresh run."""
        self._store.clear()
