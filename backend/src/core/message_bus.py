from typing import List, Dict, Any, Callable
import asyncio
import uuid
import logging

logger = logging.getLogger("message_bus")


class MessageBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, topic: str, callback: Callable):
        if topic not in self.subscribers:
            self.subscribers[topic] = []
        self.subscribers[topic].append(callback)

    async def publish(self, topic: str, message: Any, correlation_id: str = None):
        cid = correlation_id or str(uuid.uuid4())

        # Ensure message is a dict and has correlation_id
        if isinstance(message, dict):
            message["correlation_id"] = cid

        logger.info(f"Topic: {topic} | CID: {cid} | Publishing message")

        if topic in self.subscribers:
            tasks = [
                asyncio.create_task(callback(message))
                for callback in self.subscribers[topic]
            ]
            await asyncio.gather(*tasks)


message_bus = MessageBus()
