# app/crm/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Schemas para Mensajes ---
class InboundMessage(BaseModel):
    message_body: str
    received_at: datetime
    class Config:
        from_attributes = True

class OutboundMessage(BaseModel):
    id: int
    student_phone: str
    student_name: str
    reason: str
    status: str
    sent_at: datetime
    contacted: bool
    responses: List[InboundMessage] = []
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_sent: int
    total_responses: int
    contacted_students_count: int
    pending_contact_students_count: int # <-- NUEVO KPI
    response_rate: float

# --- Schemas para Autenticación ---
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None