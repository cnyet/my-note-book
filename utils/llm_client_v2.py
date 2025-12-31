"""
Universal LLM Client Wrapper for Life Assistant System
Supports multiple LLM providers: GLM (智谱AI), Claude (Anthropic)
"""

import os
from typing import List, Dict, Optional, Union, Any
from utils.config_loader import ConfigLoader


def create_llm_client(
    config: Optional[ConfigLoader] = None, 
    config_path: str = "config/config.ini"
) -> Union[Any, None]:
    """
    Factory function to create LLM client based on configuration

    Args:
        config: ConfigLoader instance
        config_path: Path to config file (used if config is None)

    Returns:
        LLM client instance
    """
    # Load configuration if not provided
    if config is None:
        config = ConfigLoader(config_path)

    # Get provider from config
    provider = config.get('llm', 'provider', 'anthropic').lower()

    if provider == 'glm':
        from utils.glm_client import GLMClient
        api_key = config.get('llm', 'api_key', '')
        base_url = config.get('llm', 'base_url', 'https://open.bigmodel.cn/api/paas/v4')
        return GLMClient(api_key=api_key, base_url=base_url)

    elif provider in ['anthropic', 'claude']:
        from utils.llm_client import LLMClient
        api_key = config.get('llm', 'api_key', '')
        model = config.get('llm', 'main_model', 'claude-3-5-sonnet-20241022')
        return LLMClient(api_key=api_key, model=model)

    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")


# For backward compatibility
class LLMClientUniversal:
    """
    Universal LLM Client that automatically selects provider based on config
    """

    def __init__(self, config_path: str = "config/config.ini") -> None:
        """
        Initialize the universal LLM client

        Args:
            config_path: Path to configuration file
        """
        self.config = ConfigLoader(config_path)
        self.client = create_llm_client(self.config)

    def __getattr__(self, name: str) -> Any:
        """Delegate method calls to the underlying client"""
        return getattr(self.client, name)

    def get_provider(self) -> str:
        """Get the current provider name"""
        provider: str = self.config.get('llm', 'provider', 'anthropic')
        return provider

    def switch_provider(self, provider: str, **kwargs: Any) -> None:
        """
        Switch to a different provider

        Args:
            provider: Provider name ('glm' or 'anthropic')
            **kwargs: Provider-specific arguments
        """
        if provider.lower() == 'glm':
            from utils.glm_client import GLMClient
            self.client = GLMClient(**kwargs)
        elif provider.lower() in ['anthropic', 'claude']:
            from utils.llm_client import LLMClient
            self.client = LLMClient(**kwargs)
        else:
            raise ValueError(f"Unsupported provider: {provider}")


# Export the universal client as default
LLMClient = LLMClientUniversal