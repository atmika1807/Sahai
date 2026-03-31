from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.mood import MoodLog

router = APIRouter(prefix='/mood', tags=['mood'])

class MoodCreate(BaseModel):
    score: int
    note: Optional[str] = None

def log_to_dict(l):
    return {'id': l.id, 'score': l.score, 'note': l.note, 'created_at': l.created_at.isoformat()}

@router.get('')
def list_logs(limit: int = 30, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(MoodLog).filter(MoodLog.user_id == current_user.id).order_by(MoodLog.created_at.desc()).limit(limit).all()
    return [log_to_dict(l) for l in logs]

@router.post('')
def log_mood(body: MoodCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if body.score < 1 or body.score > 5:
        raise HTTPException(status_code=400, detail='Score must be 1-5')
    log = MoodLog(user_id=current_user.id, score=body.score, note=body.note)
    db.add(log); db.commit(); db.refresh(log)
    return log_to_dict(log)

@router.delete('/{log_id}')
def delete_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log = db.query(MoodLog).filter(MoodLog.id == log_id, MoodLog.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail='Not found')
    db.delete(log); db.commit()
    return {'ok': True}
