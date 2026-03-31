from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from core.database import Base

class MoodLog(Base):
    __tablename__ = 'mood_logs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
