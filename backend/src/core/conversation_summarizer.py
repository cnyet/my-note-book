"""
Conversation Summarizer Engine for AI Life Assistant v2.0
Handles compression of dialogue history into actionable summaries.
"""
import json
from typing import List, Dict, Optional
from datetime import date
from integrations.llm.llm_client_v2 import LLMClient
from api.database import SessionLocal
from api.models.conversation_summaries import ConversationSummary

class ConversationSummarizer:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    def generate_and_save_summary(self, agent_type: str, messages: List[Dict], target_date: Optional[date] = None):
        """Generate a summary of the current dialogue turn and save to DB."""
        if not messages:
            return
            
        summary_date = target_date or date.today()
        
        prompt = f"""请从以下对话中提取关键信息：
        1. 用户的主要请求/问题
        2. 助理的关键建议/决策
        3. 达成的共识或待办事项
        4. 重要细节（时间、地点、数量等）

        对话内容：
        {json.dumps(messages[-5:], ensure_ascii=False)}

        请用中文总结，结构清晰，分为“摘要”、“决策”和“行动点”："""

        # Fix: handle string response from GLMClient
        response = self.llm.send_message([{"role": "user", "content": prompt}])
        summary_text = response if isinstance(response, str) else response.get('content', '')

        # Save to DB
        db = SessionLocal()
        try:
            new_summary = ConversationSummary(
                agent_type=agent_type,
                summary_date=summary_date,
                content_summary=summary_text,
                key_decisions="", 
                action_items=""
            )
            db.add(new_summary)
            db.commit()
        except Exception as e:
            print(f"Warning: Failed to save summary to DB: {e}")
        finally:
            db.close()
        
        return summary_text
