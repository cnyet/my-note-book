from __future__ import annotations
import logging
from typing import Callable, List, Dict, Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from core.chief_of_staff import ChiefOfStaff

logger = logging.getLogger(__name__)

class AutomationHook:
    """
    Defines a trigger condition and an associated action.
    """
    def __init__(self, name: str, condition_func: Callable[..., bool], action_func: Callable[..., Any]):
        self.name = name
        self.condition_func = condition_func
        self.action_func = action_func

    def check_and_trigger(self, context: Dict[str, Any]) -> bool:
        if self.condition_func(context):
            logger.info(f"Triggering Hook: {self.name}")
            self.action_func(context)
            return True
        return False

class HookManager:
    """
    Registry for automation hooks.
    """
    def __init__(self, cos: ChiefOfStaff):
        self.cos = cos
        self.hooks: List[AutomationHook] = []
        self._setup_default_hooks()

    def _setup_default_hooks(self):
        """Register system-level default hooks."""
        
        # Hook 1: Extreme Weather Alert -> Outfit Re-planning
        def weather_alert_condition(ctx):
            weather_data = ctx.get("weather", {})
            return "alert" in weather_data or "storm" in weather_data.get("desc", "").lower()
            
        def trigger_outfit_update(ctx):
            logger.info("Executing Emergency Outfit Update due to weather alert.")
            # In v2.0 this would call the OutfitAgent specifically
            pass

        self.add_hook(AutomationHook("Weather Alert Trigger", weather_alert_condition, trigger_outfit_update))

        # Hook 2: Breaking News -> Work Task Insertion
        def breaking_news_condition(ctx):
            news = ctx.get("news_briefing", "")
            return "Breaking" in news or "紧急" in news
            
        def trigger_news_alert(ctx):
            logger.info("Breaking news detected. Notifying user via Context Bus.")
            ctx["urgent_notification"] = "Breaking news detected in briefing."

        self.add_hook(AutomationHook("Breaking News Trigger", breaking_news_condition, trigger_news_alert))

    def add_hook(self, hook: AutomationHook):
        self.hooks.append(hook)

    def process_hooks(self, context: Dict[str, Any]):
        """Runs all hooks against the current context."""
        for hook in self.hooks:
            hook.check_and_trigger(context)
