from sqlalchemy import Column, Integer, String, DateTime, func
from core.database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True, default='')
    hashed_pw = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
