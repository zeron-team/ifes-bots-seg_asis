# app/chatbot/message_handler.py
from app.chatbot import whatsapp_client


def process_student_response(from_number, message_body):
    """Procesa el mensaje del alumno y determina la acción a seguir."""

    response_text = ""
    message_body = message_body.strip().lower()

    if message_body == 'a':
        response_text = "Entendido. A veces los temas nuevos cuestan. Aquí tienes material de repaso: [link]. Si aún tienes dudas, contacta a tu tutor."
    elif message_body == 'b':
        response_text = "Comprendo, la gestión del tiempo es clave. La fecha del recuperatorio es el [Fecha de Moodle]. ¡No te desanimes!"
    elif message_body == 'c':
        response_text = "Gracias por tu respuesta. Un tutor se pondrá en contacto contigo para conversar y buscar juntos una solución."
        # Aquí podrías agregar una lógica para marcar al alumno para atención humana en la BD
    else:
        response_text = "Respuesta no válida. Por favor, responde con una de las opciones (A, B, C)."

    if response_text:
        whatsapp_client.send_reply_message(from_number, response_text)