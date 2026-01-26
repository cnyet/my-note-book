import requests
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class OllamaClient:
    """
    Client for Ollama API
    """

    def __init__(
        self, base_url: str = "http://localhost:11434", model: str = "deepseek-r1"
    ):
        self.base_url = base_url
        self.model = model

    def send_message(self, messages: List[Dict[str, str]], stream: bool = False) -> str:
        """
        Send a message to Ollama
        """
        url = f"{self.base_url}/api/chat"
        payload = {"model": self.model, "messages": messages, "stream": stream}

        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()

            if stream:
                full_content = ""
                for line in response.iter_lines():
                    if line:
                        chunk = json.loads(line)
                        if "message" in chunk and "content" in chunk["message"]:
                            full_content += chunk["message"]["content"]
                        if chunk.get("done"):
                            break
                return full_content
            else:
                data = response.json()
                content = data.get("message", {}).get("content", "")
                return content

        except Exception as e:
            logger.error(f"Ollama error: {str(e)}")
            raise e
