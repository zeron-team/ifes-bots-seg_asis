# app/crm/crud.py
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, extract
from . import models
from typing import Optional


# ... (Las funciones de User y Mensajes Individuales no necesitan cambios, pero se incluyen para que el archivo esté completo)

def get_user_by_username(db: Session, username: str):
    return db.query(models.UserCRM).filter(models.UserCRM.username == username).first()


def create_user(db: Session, user: models.UserCRM):
    # Asumimos que el schema UserCreate ya ha sido validado
    from . import auth
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.UserCRM(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def log_outbound_message(db: Session, msg_sid: str, phone: str, name: str, template: str, reason: str, course_name: str,
                         quiz_name: str):
    db_message = models.OutboundMessage(
        message_sid=msg_sid,
        student_phone=phone,
        student_name=name,
        template_sid=template,
        reason=reason,
        course_name=course_name,
        quiz_name=quiz_name
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def log_inbound_message(db: Session, from_number: str, msg_body: str, msg_sid: str):
    last_outbound = db.query(models.OutboundMessage) \
        .filter(models.OutboundMessage.student_phone == from_number) \
        .order_by(models.OutboundMessage.sent_at.desc()) \
        .first()
    if not last_outbound:
        return None
    db_message = models.InboundMessage(
        outbound_id=last_outbound.id,
        message_sid=msg_sid,
        student_phone=from_number,
        message_body=msg_body,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def toggle_contacted_status(db: Session, message_id: int):
    db_message = db.query(models.OutboundMessage).filter(models.OutboundMessage.id == message_id).first()
    if not db_message:
        return None
    db_message.contacted = not db_message.contacted
    db.commit()
    db.refresh(db_message)
    return db_message


# --- CRUD PARA EL DASHBOARD (SECCIÓN CORREGIDA) ---

def get_dashboard_stats(db: Session, year: Optional[int] = None, month: Optional[int] = None):
    # Construye una base de consulta filtrada
    outbound_query = db.query(models.OutboundMessage)
    if year:
        outbound_query = outbound_query.filter(extract('year', models.OutboundMessage.sent_at) == year)
    if month:
        outbound_query = outbound_query.filter(extract('month', models.OutboundMessage.sent_at) == month)

    total_sent = outbound_query.count()

    # Filtra las respuestas basándose en los IDs de los mensajes salientes filtrados
    outbound_ids = [m.id for m in outbound_query.all()]
    total_responses = db.query(models.InboundMessage).filter(
        models.InboundMessage.outbound_id.in_(outbound_ids)).count()

    # Reutiliza la consulta filtrada para los demás contadores
    contacted_students_count = outbound_query.filter(models.OutboundMessage.contacted == True).with_entities(
        func.count(func.distinct(models.OutboundMessage.student_name))).scalar() or 0
    total_students_messaged = outbound_query.with_entities(
        func.count(func.distinct(models.OutboundMessage.student_name))).scalar() or 0

    pending_contact_students_count = total_students_messaged - contacted_students_count
    response_rate = (total_responses / total_sent * 100) if total_sent > 0 else 0

    return {
        "total_sent": total_sent,
        "total_responses": total_responses,
        "contacted_students_count": contacted_students_count,
        "pending_contact_students_count": pending_contact_students_count,
        "response_rate": round(response_rate, 2)
    }


def get_conversations(db: Session, skip: int = 0, limit: int = 10, name_filter: Optional[str] = None,
                      year: Optional[int] = None, month: Optional[int] = None):
    # Construye una subconsulta para obtener los nombres de los alumnos de la página actual
    base_query = db.query(models.OutboundMessage.student_name).distinct()

    if year:
        base_query = base_query.filter(extract('year', models.OutboundMessage.sent_at) == year)
    if month:
        base_query = base_query.filter(extract('month', models.OutboundMessage.sent_at) == month)
    if name_filter:
        base_query = base_query.filter(models.OutboundMessage.student_name.ilike(f"%{name_filter}%"))

    student_names_subquery = base_query.group_by(models.OutboundMessage.student_name) \
        .order_by(func.max(models.OutboundMessage.sent_at).desc()) \
        .offset(skip).limit(limit).subquery()

    # Construye la consulta principal para obtener todas las conversaciones de esos alumnos
    main_query = db.query(models.OutboundMessage) \
        .filter(models.OutboundMessage.student_name.in_(student_names_subquery)) \
        .options(selectinload(models.OutboundMessage.responses)) \
        .order_by(models.OutboundMessage.sent_at.desc())

    return main_query.all()


def get_conversations_count(db: Session, name_filter: Optional[str] = None, year: Optional[int] = None,
                            month: Optional[int] = None):
    query = db.query(func.count(func.distinct(models.OutboundMessage.student_name)))

    if year:
        query = query.filter(extract('year', models.OutboundMessage.sent_at) == year)
    if month:
        query = query.filter(extract('month', models.OutboundMessage.sent_at) == month)
    if name_filter:
        query = query.filter(models.OutboundMessage.student_name.ilike(f"%{name_filter}%"))

    return query.scalar() or 0