# app/crm/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class UserCRM(Base):
    __tablename__ = "users_crm"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)


class OutboundMessage(Base):
    __tablename__ = "outbound_messages"

    # --- LA LÍNEA CLAVE ---
    # Asegúrate de que primary_key=True esté aquí.
    id = Column(Integer, primary_key=True, index=True)

    message_sid = Column(String(40), unique=True, index=True)
    student_phone = Column(String(25), index=True)
    student_name = Column(String(100))
    template_sid = Column(String(40))
    reason = Column(String(50))
    course_name = Column(String(255), nullable=True)
    quiz_name = Column(String(255), nullable=True)
    status = Column(String(20), default='sent')
    sent_at = Column(DateTime, default=datetime.utcnow)
    contacted = Column(Boolean, default=False, nullable=False)

    # Esta relación permite acceder a los mensajes de respuesta desde un mensaje saliente.
    responses = relationship("InboundMessage", back_populates="original_message")


class InboundMessage(Base):
    __tablename__ = "inbound_messages"

    id = Column(Integer, primary_key=True, index=True)
    outbound_id = Column(Integer, ForeignKey("outbound_messages.id"))
    message_sid = Column(String(40), unique=True, index=True)
    student_phone = Column(String(25), index=True)
    message_body = Column(Text)
    received_at = Column(DateTime, default=datetime.utcnow)

    # Esta relación permite acceder al mensaje original desde una respuesta.
    # El uso de 'back_populates' en ambos lados mantiene la relación sincronizada.
    original_message = relationship("OutboundMessage", back_populates="responses")