"""
Chat API Routes - v2.0
Handles the global floating AI chat functionality.
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
import asyncio
import logging

from api.database import get_db
from core.vector_memory import VectorMemory
from integrations.llm.llm_client_v2 import create_llm_client

router = APIRouter(prefix="/api/chat", tags=["chat"])
logger = logging.getLogger(__name__)


class ChatRequest(BaseModel):
    message: str
    agent_type: str = "general"  # news, work, outfit, life, review, general


@router.post("")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Global chat endpoint for the floating AI window.
    Supports context awareness and memory retrieval.
    """
    memory = VectorMemory()
    llm = create_llm_client()

    if not llm:
        raise HTTPException(
            status_code=500, detail="LLM client could not be initialized"
        )

    # 1. Retrieve relevant context from memory
    context = memory.get_context_for_llm(
        request.message,
        agent_type=request.agent_type if request.agent_type != "general" else None,
    )

    # 2. Prepare system prompt based on agent type
    system_prompts = {
        "general": "你是一个全能的私人生活助理，能够访问用户的历史记录、工作计划、穿搭建议和健康数据。",
        "news": "你现在是新闻秘书，专注于为用户解答科技与 AI 领域的相关问题。",
        "work": "你现在是工作秘书，专注于帮助用户管理任务、规划日程和提高效率。",
        "outfit": "你现在是穿搭秘书，专注于根据天气和场合为用户提供着装建议。",
        "life": "你现在是生活秘书，专注于用户的健康、饮食和作息管理。",
        "review": "你现在是复盘秘书，专注于帮助用户总结反思、发现习惯和个人成长。",
    }

    system_prompt = system_prompts.get(request.agent_type, system_prompts["general"])

    async def chat_generator():
        messages = [
            {
                "role": "system",
                "content": f"{system_prompt}\n\n相关背景信息：\n{context}",
            },
            {"role": "user", "content": request.message},
        ]

        # Simulate streaming (if LLM client supports it, use that instead)
        # For now, we do a single call and stream the characters or words
        try:
            full_response = await asyncio.to_thread(llm.send_message, messages=messages)

            # Stream the response back in chunks
            chunk_size = 5
            for i in range(0, len(full_response), chunk_size):
                chunk = full_response[i : i + chunk_size]
                yield f"data: {json.dumps({'content': chunk})}\n\n"
                await asyncio.sleep(0.01)

            yield 'data: {"status": "completed"}\n\n'

        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(chat_generator(), media_type="text/event-stream")
