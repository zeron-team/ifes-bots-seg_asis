# test_db.py
from app.moodle_integration import data_extractor

print("--- Probando solo la conexión a Moodle ---")
alumnos = data_extractor.get_students_for_follow_up()
print("--- Prueba finalizada ---")
if alumnos:
    print(f"Se encontraron {len(alumnos.get('approved',[]))} aprobados, {len(alumnos.get('disapproved',[]))} desaprobados y {len(alumnos.get('pending',[]))} pendientes.")