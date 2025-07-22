# app/jobs/student_follow_up.py
import json
from app.moodle_integration import data_extractor
from app.chatbot import whatsapp_client

# IDs de tus plantillas de Twilio. ¡Debes crearlas primero!
TEMPLATE_APROBADO_SID = 'HX3a00d1b81d18d5a2fa726922a63d722f'
TEMPLATE_DESAPROBADO_SID = 'HX7270d5d761a2d1156c86acb3f8eef59a'


def run_daily_follow_up():
    """Función principal que orquesta el seguimiento diario."""
    print("Iniciando job de seguimiento diario de alumnos...")

    students_to_process = data_extractor.get_students_for_follow_up()

    # Procesar aprobados
    for student in students_to_process.get("approved", []):
        variables = {
            "1": student['firstname'],
            "2": student['quiz_name']
        }
        whatsapp_client.send_template_message(
            to_number=student['whatsapp_phone'],
            template_sid=TEMPLATE_APROBADO_SID,
            template_vars=json.dumps(variables)
        )

    # Procesar desaprobados
    for student in students_to_process.get("disapproved", []):
        variables = {
            "1": student['firstname'],
            "2": student['quiz_name']
        }
        whatsapp_client.send_template_message(
            to_number=student['whatsapp_phone'],
            template_sid=TEMPLATE_DESAPROBADO_SID,
            template_vars=json.dumps(variables)
        )

    print("Job de seguimiento diario completado.")


# Esto permite ejecutar el script directamente para pruebas
if __name__ == '__main__':
    run_daily_follow_up()