"""
Configuration Loader Module
Handles loading and accessing configuration from config.ini
"""

import os
import configparser
from typing import Any, Optional

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


class ConfigLoader:
    """Configuration loader for the AI Life Assistant system"""

    def __init__(self, config_path: str = "config/config.ini"):
        """
        Initialize the configuration loader

        Args:
            config_path: Path to the config.ini file
        """
        self.config_path = config_path
        self.config = configparser.ConfigParser()
        self.loaded = False

        # Try to load the config
        if os.path.exists(config_path):
            try:
                self.config.read(config_path, encoding="utf-8")
                self.loaded = True
            except Exception as e:
                print(f"Warning: Failed to load config from {config_path}: {e}")

    def get(self, section: str, key: str, default: Any = None) -> Any:
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

    def getint(self, section: str, key: str, default: int = 0) -> int:
        """
        Get an integer configuration value

        Args:
            section: Section name in config
            key: Key name in section
            default: Default value if not found

        Returns:
            Integer value or default
        """
        if not self.loaded:
            return default

        try:
            return self.config.getint(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
            return default

    def getfloat(self, section: str, key: str, default: float = 0.0) -> float:
        """
        Get a float configuration value

        Args:
            section: Section name in config
            key: Key name in section
            default: Default value if not found

        Returns:
            Float value or default
        """
        if not self.loaded:
            return default

        try:
            return self.config.getfloat(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
            return default

    def getboolean(self, section: str, key: str, default: bool = False) -> bool:
        """
        Get a boolean configuration value

        Args:
            section: Section name in config
            key: Key name in section
            default: Default value if not found

        Returns:
            Boolean value or default
        """
        if not self.loaded:
            return default

        try:
            return self.config.getboolean(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
            return default

    def get_section(self, section: str) -> dict:
        """
        Get all key-value pairs in a section

        Args:
            section: Section name

        Returns:
            Dictionary of section contents
        """
        if not self.loaded or not self.config.has_section(section):
            return {}

        return dict(self.config.items(section))

    def has_section(self, section: str) -> bool:
        """
        Check if a section exists

        Args:
            section: Section name

        Returns:
            True if section exists
        """
        if not self.loaded:
            return False

        return self.config.has_section(section)

    def has_option(self, section: str, key: str) -> bool:
        """
        Check if an option exists in a section

        Args:
            section: Section name
            key: Option key

        Returns:
            True if option exists
        """
        if not self.loaded:
            return False

        return self.config.has_option(section, key)
