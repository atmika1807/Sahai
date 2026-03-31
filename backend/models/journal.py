from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from core.database import Base

class JournalEntry(Base):
    __tablename__ = 'journal_entries'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String, default='Untitled')
    content = Column(Text, nullable=False)
    sentiment = Column(String, nullable=True)
    ai_insight = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
