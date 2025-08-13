# main.py
from fastapi import FastAPI, Form, Response, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Optional
from app.chatbot import message_handler
from app.crm import crud, models, schemas, auth
from app.crm.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chatbot Moodle con CRM Dashboard")

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/whatsapp")
async def handle_whatsapp_message(
    Body: Annotated[str, Form()],
    From: Annotated[str, Form()],
    MessageSid: Annotated[str, Form()],
    db: Session = Depends(get_db)
):
    print(f"Webhook recibido de {From} con mensaje: {Body}")
    crud.log_inbound_message(db=db, from_number=From, msg_body=Body, msg_sid=MessageSid)
    message_handler.process_student_response(From, Body)
    return Response(status_code=204)

@app.post("/create_user", response_model=schemas.UserResponse, include_in_schema=False)
def create_user_for_dashboard(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    year: Optional[int] = None,
    month: Optional[int] = None,
    current_user: models.UserCRM = Depends(auth.get_current_active_user)
):
    return crud.get_dashboard_stats(db, year=year, month=month)

@app.get("/api/v1/dashboard/conversations")
def get_conversations_list(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    student_name: Optional[str] = None,
    year: Optional[int] = None,
    month: Optional[int] = None,
    current_user: models.UserCRM = Depends(auth.get_current_active_user)
):
    items = crud.get_conversations(db, skip=skip, limit=limit, name_filter=student_name, year=year, month=month)
    total = crud.get_conversations_count(db, name_filter=student_name, year=year, month=month)
    return {"items": items, "total": total}

@app.put("/api/v1/conversations/{message_id}/toggle_contacted", response_model=schemas.OutboundMessage)
def toggle_contacted(message_id: int, db: Session = Depends(get_db), current_user: models.UserCRM = Depends(auth.get_current_active_user)):
    updated_message = crud.toggle_contacted_status(db, message_id=message_id)
    if not updated_message:
        raise HTTPException(status_code=404, detail="Message not found")
    return updated_message

@app.get("/")
def read_root():
    return {"status": "Servidor del chatbot y API del CRM funcionando."}