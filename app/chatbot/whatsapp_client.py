# app/chatbot/whatsapp_client.py
from twilio.rest import Client
from app import config
from app.crm import crud
from app.crm.database import get_db

client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)


# --- FUNCIÓN MODIFICADA ---
def send_template_message(to_number, template_sid, template_vars, student_name, reason, course_name, quiz_name):
    """Envía un mensaje de plantilla y lo registra en el CRM."""
    try:
        message = client.messages.create(
            messaging_service_sid=config.TWILIO_MESSAGING_SERVICE_SID,
            to=to_number,
            content_sid=template_sid,
            content_variables=template_vars
        )
        print(f"Mensaje de plantilla enviado a {to_number}. SID: {message.sid}")

        db = next(get_db())
        # Pasamos los nuevos datos para que se guarden en la base de datos
        crud.log_outbound_message(
            db=db,
            msg_sid=message.sid,
            phone=to_number,
            name=student_name,
            template=template_sid,
            reason=reason,
            course_name=course_name,
            quiz_name=quiz_name
        )
        db.close()

        return message.sid
    except Exception as e:
        print(f"Error al enviar plantilla a {to_number}: {e}")
        return None


def send_reply_message(to_number, body_text):
    """Envía un mensaje de texto libre (para casos como respuestas inválidas)."""
    try:
        message = client.messages.create(
            messaging_service_sid=config.TWILIO_MESSAGING_SERVICE_SID,
            to=to_number,
            body=body_text
        )
        print(f"Mensaje de respuesta enviado a {to_number}. SID: {message.sid}")
        return message.sid
    except Exception as e:
        print(f"Error al enviar respuesta a {to_number}: {e}")
        return None