import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from models.user import User
from models.journal import JournalEntry
from models.mood import MoodLog
from routers.auth import router as auth_router
from routers.chat import router as chat_router
from routers.journal import router as journal_router
from routers.mood import router as mood_router
from routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Sahai API', version='2.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(journal_router)
app.include_router(mood_router)
app.include_router(dashboard_router)

@app.get('/')
def root():
    return {'message': 'Sahai API is running'}

@app.get('/health')
def health():
    return {'status': 'ok'}
