# run_job.py
print("--- PUNTO DE CONTROL 1: El script run_job.py ha comenzado. ---")

try:
    print("--- PUNTO DE CONTROL 2: Intentando importar 'data_extractor'. ---")
    from app.moodle_integration import data_extractor
    print("--- ÉXITO: 'data_extractor' importado. ---")

    print("--- PUNTO DE CONTROL 3: Intentando importar 'whatsapp_client'. ---")
    from app.chatbot import whatsapp_client
    print("--- ÉXITO: 'whatsapp_client' importado. ---")

    print("--- PUNTO DE CONTROL 4: Intentando importar 'json'. ---")
    import json
    print("--- ÉXITO: 'json' importado. ---")

    def run_daily_follow_up():
        print("--- PUNTO DE CONTROL 5: La función run_daily_follow_up ha sido llamada. ---")

        print("--- PUNTO DE CONTROL 6: Llamando a data_extractor para obtener alumnos. ---")
        students_to_process = data_extractor.get_students_for_follow_up()
        print(f"--- ÉXITO: Se obtuvieron los datos. {len(students_to_process.get('disapproved',[]))} desaprobados encontrados. ---")

        # --- Aquí iría el resto del código para enviar mensajes ---
        # Por ahora lo dejamos fuera para aislar el problema.

        print("--- PUNTO DE CONTROL 7: La función ha terminado. ---")

    if __name__ == "__main__":
        print("--- PUNTO DE CONTROL 8: Entrando en el bloque main. ---")
        run_daily_follow_up()
        print("--- PUNTO DE CONTROL 9: Saliendo del bloque main. ---")

except Exception as e:
    print(f"\n--- !!! ERROR CRÍTICO DETECTADO !!! ---")
    print(f"El script falló. Error: {e}")
    import traceback
    traceback.print_exc()