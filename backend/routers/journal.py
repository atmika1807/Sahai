from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.journal import JournalEntry
from services.claude_service import analyze_journal

router = APIRouter(prefix='/journal', tags=['journal'])

class JournalCreate(BaseModel):
    title: Optional[str] = 'Untitled'
    content: str

def entry_to_dict(e):
    return {'id': e.id, 'title': e.title, 'content': e.content, 'sentiment': e.sentiment, 'ai_insight': e.ai_insight, 'created_at': e.created_at.isoformat()}

@router.get('')
def list_entries(limit: int = 50, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.created_at.desc()).limit(limit).all()
    return [entry_to_dict(e) for e in entries]

@router.post('')
def create_entry(body: JournalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        insight, sentiment = analyze_journal(body.content)
    except Exception:
        insight, sentiment = '', 'neutral'
    entry = JournalEntry(user_id=current_user.id, title=body.title or 'Untitled', content=body.content, sentiment=sentiment, ai_insight=insight)
    db.add(entry); db.commit(); db.refresh(entry)
    return entry_to_dict(entry)

@router.get('/{entry_id}')
def get_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail='Entry not found')
    return entry_to_dict(entry)

@router.delete('/{entry_id}')
def delete_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail='Entry not found')
    db.delete(entry); db.commit()
    return {'ok': True}
