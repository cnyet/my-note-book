from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os

from core.vector_memory import VectorMemory

router = APIRouter(prefix="/api/plugins", tags=["plugins"])


# LobeChat Plugin Manifest
@router.get("/manifest.json")
async def get_manifest():
    return {
        "schemaVersion": 1,
        "identifier": "ai-life-assistant-skills",
        "author": "Sisyphus",
        "createdAt": "2026-01-26",
        "meta": {
            "avatar": "🤖",
            "title": "Assistant Skills",
            "description": "Skills for searching codebase and personal knowledge base.",
        },
        "api": [
            {
                "url": "http://host.docker.internal:8000/api/plugins/search_knowledge",
                "name": "search_knowledge",
                "description": "Search personal knowledge base including news, work logs and health data",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Search query"},
                        "agent_type": {
                            "type": "string",
                            "enum": [
                                "news",
                                "work",
                                "outfit",
                                "life",
                                "review",
                                "general",
                            ],
                            "description": "Filter by agent type",
                        },
                    },
                    "required": ["query"],
                },
            },
            {
                "url": "http://host.docker.internal:8000/api/plugins/search_codebase",
                "name": "search_codebase",
                "description": "Search the local codebase for code patterns",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "pattern": {
                            "type": "string",
                            "description": "Regex pattern to search",
                        }
                    },
                    "required": ["pattern"],
                },
            },
        ],
        "ui": {"url": "https://chat-plugins.lobehub.com/iframe", "height": 200},
    }


class CodeSearchRequest(BaseModel):
    pattern: str


@router.post("/search_codebase")
async def search_codebase(request: CodeSearchRequest):
    """
    Search codebase using grep
    """
    import subprocess

    try:
        # Search in backend and frontend
        cmd = [
            "grep",
            "-r",
            "--exclude-dir=node_modules",
            "--exclude-dir=.next",
            "-E",
            request.pattern,
            ".",
        ]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(
                os.path.dirname(
                    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                )
            ),
        )
        return {"result": result.stdout[:2000]}  # Limit to 2000 chars
    except Exception as e:
        return {"error": str(e)}


class SearchRequest(BaseModel):
    query: str
    agent_type: str = "general"


@router.post("/search_knowledge")
async def search_knowledge(request: SearchRequest):
    """
    Search personal context/memory
    """
    try:
        memory = VectorMemory()
        context = memory.get_context_for_llm(
            request.query,
            agent_type=request.agent_type if request.agent_type != "general" else None,
        )
        return {"result": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
