# app/chatbot/message_handler.py
import json
from app.chatbot import whatsapp_client

# --- SIDs REALES DE TUS PLANTILLAS ---
TEMPLATE_RESPUESTA_A_SID = 'HX23519724d7f42e30cbcd5e6295cbf853' # respuesta_ayuda_dificultad
TEMPLATE_RESPUESTA_B_SID = 'HX1419c071ea999ca73c5b365b2c49f248' # respuesta_falta_tiempo
TEMPLATE_RESPUESTA_C_SID = 'HX881f331fd7606f3ca4beeee5ab59186e' # respuesta_otro_motivo

def process_student_response(from_number, message_body):
    """
    Procesa el mensaje del alumno y envía una PLANTILLA como respuesta.
    """
    message_body = message_body.strip().lower()

    if message_body == 'a':
        variables = {"1": "https://tu-instituto.com/material-repaso"}
        # NOTA: Estas respuestas de plantilla no se están registrando en el CRM
        # porque no tenemos el 'student_name' ni un 'reason' claro aquí.
        # Esto es algo que se podría mejorar en el futuro si es necesario.
        whatsapp_client.send_template_message(
            to_number=from_number,
            template_sid=TEMPLATE_RESPUESTA_A_SID,
            template_vars=json.dumps(variables),
            student_name="Alumno", # Nombre genérico
            reason="Respuesta-A" # Motivo genérico
        )
    elif message_body == 'b':
        variables = {"1": "10 de Agosto"}
        whatsapp_client.send_template_message(
            to_number=from_number,
            template_sid=TEMPLATE_RESPUESTA_B_SID,
            template_vars=json.dumps(variables),
            student_name="Alumno",
            reason="Respuesta-B"
        )
    elif message_body == 'c':
        whatsapp_client.send_template_message(
            to_number=from_number,
            template_sid=TEMPLATE_RESPUESTA_C_SID,
            template_vars=json.dumps({}),
            student_name="Alumno",
            reason="Respuesta-C"
        )
    else:
        # Aquí se llama a la función que faltaba
        whatsapp_client.send_reply_message(
            from_number,
            "Respuesta no válida. Por favor, responde con una de las opciones (A, B, o C)."
        )