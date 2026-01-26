"""
Configuration Loader Module - v2.0
Prioritizes environment variables and supports standardized .env usage.
"""

import os
import configparser
import logging
from typing import Any, Optional, Dict

logger = logging.getLogger(__name__)


class ConfigLoader:
    """Enhanced configuration loader for the AI Life Assistant system"""

    def __init__(self, config_path: str = "backend/config/config.ini"):
        self.config_path = config_path
        self.config = configparser.ConfigParser()
        self.loaded = False

        # 1. Try to load config.ini
        if os.path.exists(config_path):
            try:
                self.config.read(config_path, encoding="utf-8")
                self.loaded = True
                logger.debug(f"Loaded config from {config_path}")
            except Exception as e:
                logger.error(f"Failed to load config from {config_path}: {e}")
        else:
            logger.warning(
                f"Config file not found at {config_path}. Falling back to ENV."
            )

    def get(self, section: str, key: str, default: Any = None) -> Any:
        """
        Get config value with ENV priority.
        Convention: SECTION_KEY (e.g., LLM_API_KEY)
        """
        env_key = f"{section.upper()}_{key.upper()}"
        env_val = os.environ.get(env_key)

        if env_val is not None:
            return env_val

        if not self.loaded:
            return default

        try:
            return self.config.get(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError):
            return default

    def get_section(self, section: str) -> Dict[str, str]:
        """
        Returns an entire section as a dictionary.
        Includes environment variables that match the section prefix.
        """
        data = {}
        # 1. Load from file if available
        if self.loaded and self.config.has_section(section):
            data.update(dict(self.config.items(section)))

        # 2. Layer in environment variables (e.g., LLM_*)
        prefix = f"{section.upper()}_"
        for env_key, env_val in os.environ.items():
            if env_key.startswith(prefix):
                key = env_key[len(prefix) :].lower()
                data[key] = env_val

        return data

    def has_section(self, section: str) -> bool:
        # Check environment first
        prefix = f"{section.upper()}_"
        if any(k.startswith(prefix) for k in os.environ.keys()):
            return True
        return self.loaded and self.config.has_section(section)
