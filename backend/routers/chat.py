from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from core.security import get_current_user
from models.user import User
from services.claude_service import chat_with_claude

router = APIRouter(prefix='/chat', tags=['chat'])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@router.post('/message')
def send_message(body: ChatRequest, current_user: User = Depends(get_current_user)):
    msgs = [{'role': m.role, 'content': m.content} for m in body.messages]
    if not msgs or msgs[-1]['role'] != 'user':
        raise HTTPException(status_code=400, detail='Last message must be from user')
    try:
        reply = chat_with_claude(msgs)
        return {'reply': reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
