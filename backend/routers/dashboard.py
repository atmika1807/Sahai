from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.journal import JournalEntry
from models.mood import MoodLog

router = APIRouter(prefix='/dashboard', tags=['dashboard'])

@router.get('/stats')
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = current_user.id
    journal_count = db.query(func.count(JournalEntry.id)).filter(JournalEntry.user_id == uid).scalar()
    mood_count = db.query(func.count(MoodLog.id)).filter(MoodLog.user_id == uid).scalar()
    streak = 0
    today = date.today()
    for i in range(365):
        day = today - timedelta(days=i)
        has_log = db.query(MoodLog).filter(MoodLog.user_id == uid, func.date(MoodLog.created_at) == day).first()
        if has_log:
            streak += 1
        else:
            break
    return {'journal_count': journal_count, 'mood_count': mood_count, 'chat_count': 0, 'streak': streak}
