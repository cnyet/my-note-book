"""
Base Agent Module - AI Life Assistant v2.0 (DB-Only Storage)
Implements an abstract base class for all secretary agents with standardized 
lifecycle: collect -> process -> save_to_db.
Markdown files are no longer saved locally.
"""
import os
import sys
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict, Any, List

# Ensure parent directory is in path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from integrations.llm.llm_client_v2 import create_llm_client, LLMClient
from core.config_loader import ConfigLoader
from core.data_synchronizer import DataSynchronizer
from core.vector_memory import VectorMemory

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """
    Abstract Base Class for all agents.
    Provides standardized initialization, logging, and DB-only execution flow.
    """
    
    def __init__(
        self,
        name: str,
        config_path: str = "backend/config/config.ini",
        config_dict: Optional[Dict[str, Any]] = None,
    ):
        self.name = name
        self.config_path = config_path
        
        # 1. Initialize Configuration
        if config_dict:
            self.config_dict = config_dict
        else:
            config_loader = ConfigLoader(config_path)
            # Standard sections to load
            sections = ["llm", "data", "user", "system", self.name.lower()]
            self.config_dict = {}
            for section in sections:
                if config_loader.has_section(section):
                    self.config_dict[section] = config_loader.get_section(section)
                else:
                    self.config_dict[section] = {}

        # 2. Initialize Core Services
        self.llm: LLMClient = create_llm_client(config_path=config_path)
        self.synchronizer = DataSynchronizer()
        self.memory = VectorMemory()
        
        logger.info(f"Initialized {self.name} Agent (DB-Only Mode)")

    @abstractmethod
    def _collect_data(self, **kwargs) -> Any:
        """Step 1: Gather raw data from sources (RSS, API, Files, etc.)"""
        pass

    @abstractmethod
    def _process_with_llm(self, raw_data: Any, historical_context: str = "", **kwargs) -> str:
        """Step 2: Transform raw data into structured insight using LLM"""
        pass

    def _save_to_db(self, content: str) -> bool:
        """Step 3: Save results directly to DB, skipping filesystem"""
        if not content:
            logger.warning(f"No content to save for {self.name}")
            return False
            
        logger.info(f"Saving {self.name} results to database...")
        # Standardize sync logic: skip file save, go straight to DB sync
        return self.synchronizer.sync_log_to_db(self.name.lower(), content)

    def execute(self, save_to_file: bool = False, use_memory: bool = True, **kwargs) -> str:
        """
        The standardized execution pipeline for all agents.
        Modified to always save to DB and ignore save_to_file parameter for local files.
        """
        logger.info(f"--- {self.name} Agent: Starting Execution ---")
        
        try:
            # 1. Collection
            raw_data = self._collect_data(**kwargs)
            if not raw_data:
                logger.warning(f"No data collected by {self.name}")
                return ""

            # 2. Memory Retrieval (Optional)
            historical_context = ""
            if use_memory:
                query = str(raw_data)[:500] # Use first 500 chars as query
                historical_context = self.memory.get_context_for_llm(query, agent_type=self.name.lower())

            # 3. Processing (Now with historical context)
            result = self._process_with_llm(raw_data, historical_context=historical_context, **kwargs)
            if not result:
                logger.error(f"LLM failed to generate result for {self.name}")
                return ""

            # 4. DB Persistence (Skip local files)
            self._save_to_db(result)
                
            logger.info(f"--- {self.name} Agent: Execution Completed (Stored in DB) ---")
            return result
            
        except Exception as e:
            logger.error(f"Critical error in {self.name} execution: {str(e)}", exc_info=True)
            return f"Error: {str(e)}"

    def run(self, **kwargs) -> str:
        """Alias for execute to maintain backward compatibility"""
        return self.execute(**kwargs)
