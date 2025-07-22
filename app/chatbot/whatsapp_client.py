# app/chatbot/whatsapp_client.py
from twilio.rest import Client
from app import config

client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

def send_template_message(to_number, template_sid, template_vars):
    """Envía un mensaje de plantilla usando el Messaging Service."""
    try:
        message = client.messages.create(
            messaging_service_sid=config.TWILIO_MESSAGING_SERVICE_SID, # <-- CAMBIO CLAVE
            to=to_number,
            content_sid=template_sid,
            content_variables=template_vars
        )
        print(f"Mensaje de plantilla enviado a {to_number}. SID: {message.sid}")
        return message.sid
    except Exception as e:
        print(f"Error al enviar plantilla a {to_number}: {e}")
        return None

def send_reply_message(to_number, body_text):
    """Envía un mensaje de respuesta usando el Messaging Service."""
    try:
        message = client.messages.create(
            messaging_service_sid=config.TWILIO_MESSAGING_SERVICE_SID, # <-- CAMBIO CLAVE
            to=to_number,
            body=body_text
        )
        print(f"Mensaje de respuesta enviado a {to_number}. SID: {message.sid}")
        return message.sid
    except Exception as e:
        print(f"Error al enviar respuesta a {to_number}: {e}")
        return None