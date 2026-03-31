from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.security import hash_password, verify_password, create_access_token, get_current_user
from models.user import User

router = APIRouter(prefix='/auth', tags=['auth'])

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str = ''

class LoginRequest(BaseModel):
    email: str
    password: str

def user_to_dict(u):
    return {'id': u.id, 'email': u.email, 'name': u.name}

@router.post('/register')
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail='Email already registered')
    user = User(email=body.email, name=body.name, hashed_pw=hash_password(body.password))
    db.add(user); db.commit(); db.refresh(user)
    token = create_access_token({'sub': str(user.id)})
    return {'access_token': token, 'token_type': 'bearer', 'user': user_to_dict(user)}

@router.post('/login')
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_pw):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    token = create_access_token({'sub': str(user.id)})
    return {'access_token': token, 'token_type': 'bearer', 'user': user_to_dict(user)}

@router.get('/me')
def me(current_user: User = Depends(get_current_user)):
    return user_to_dict(current_user)
