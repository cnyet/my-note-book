"""
Conversation Summarizer Engine for AI Life Assistant v2.0
Adheres to conversation-accuracy-skill specifications.
"""
import json
import logging
from typing import List, Dict, Optional
from datetime import date
from integrations.llm.llm_client_v2 import LLMClient
from api.database import SessionLocal
from api.models.conversation_summaries import ConversationSummary

logger = logging.getLogger(__name__)

class ConversationSummarizer:
    """
    Engine to extract key information from dialogue to maintain accuracy.
    Follows conversation-accuracy-skill requirements:
    - 200 character limit for Chinese summary.
    - Priority: Facts > Decisions > Logic.
    """
    
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    def generate_and_save_summary(self, agent_type: str, messages: List[Dict], target_date: Optional[date] = None) -> Optional[Dict]:
        """
        Generate a structured summary and save to database.
        """
        if not messages:
            return None
            
        summary_date = target_date or date.today()
        
        # Skill-aligned Prompt
        prompt = f"""作为一名高级 AI 架构师，请从以下对话中提取核心精华，以维持长对话的准确性。
优先顺序：核心事实 > 关键决策 > 逻辑链条。

对话内容：
{json.dumps(messages[-10:], ensure_ascii=False)}

请用中文总结，严格按以下 JSON 格式输出：
{{
  "content_summary": "200字以内的核心事实总结",
  "key_decisions": "达成的共识或关键决策",
  "action_items": "待办事项或下一步行动"
}}
"""
        try:
            # Get response from LLM
            response = self.llm.send_message([{"role": "user", "content": prompt}])
            response_text = response if isinstance(response, str) else response.get('content', '')
            
            # Parse structured data
            # Find the first { and last } to handle potential markdown formatting in response
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end != 0:
                data = json.loads(response_text[start:end])
            else:
                data = {
                    "content_summary": response_text[:200],
                    "key_decisions": "",
                    "action_items": ""
                }

            # Save to DB
            db = SessionLocal()
            try:
                new_summary = ConversationSummary(
                    agent_type=agent_type,
                    summary_date=summary_date,
                    content_summary=data.get("content_summary", ""),
                    key_decisions=data.get("key_decisions", ""),
                    action_items=data.get("action_items", "")
                )
                db.add(new_summary)
                db.commit()
                logger.info(f"Saved conversation summary for {agent_type}")
            except Exception as e:
                db.rollback()
                logger.error(f"Failed to save summary to DB: {e}")
            finally:
                db.close()
            
            return data
        except Exception as e:
            logger.error(f"Summarizer failed: {e}")
            return None
