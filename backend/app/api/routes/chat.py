from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_values: Optional[dict[str, str]] = None


@router.get("/greeting")
def get_greeting():
    try:
        message = chat_service.get_greeting()
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/message")
def send_message(request: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        result = chat_service.process_message(messages, request.current_values)
        return {
            "message": result.reply,
            "extracted_values": result.extracted_values,
            "is_complete": result.is_complete,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
