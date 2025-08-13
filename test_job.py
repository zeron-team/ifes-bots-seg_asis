# run_job.py
from app.moodle_integration import data_extractor
import json # Importamos json para imprimir bonito

print("--- INICIANDO PRUEBA DE DIAGNÓSTICO ---")

# 1. Obtenemos los datos de Moodle
students_to_process = data_extractor.get_students_for_follow_up()

# 2. Imprimimos los datos encontrados antes de hacer nada más
print("\n--- DATOS EXTRAÍDOS DE MOODLE ---")
if not students_to_process.get("approved") and not students_to_process.get("disapproved") and not students_to_process.get("pending"):
    print("¡No se encontraron alumnos para procesar! Revisa la consulta SQL o el rango de fechas.")
else:
    # Usamos json.dumps para mostrar los datos de forma legible
    print(json.dumps(students_to_process, indent=2, default=str))
print("-------------------------------------\n")

# Si quieres, puedes comentar el resto del código para que no envíe mensajes durante esta prueba
# from app.chatbot import whatsapp_client
# ... (el resto de tu código de envío) ...

print("--- PRUEBA DE DIAGNÓSTICO FINALIZADA ---")