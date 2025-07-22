# app/moodle_integration/data_extractor.py
import sqlalchemy
from app import config
from app.moodle_integration import queries


def get_students_for_follow_up():
    """
    Se conecta a la BD de Moodle, ejecuta la consulta y clasifica a los alumnos.
    """
    students = {"approved": [], "disapproved": []}

    try:
        # Crea la cadena de conexión
        db_uri = (
            f"mysql+mysqlconnector://{config.DB_USER}:{config.DB_PASSWORD}@"
            f"{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
        )
        engine = sqlalchemy.create_engine(db_uri)

        with engine.connect() as connection:
            results = connection.execute(sqlalchemy.text(queries.GET_RECENT_QUIZ_RESULTS))

            for row in results:
                student_data = dict(row._mapping)  # Convierte la fila a un diccionario

                # Asigna el número de teléfono en formato correcto para WhatsApp
                #student_data['whatsapp_phone'] = f"whatsapp:{student_data['phone']}"
                student_data['whatsapp_phone'] = 'whatsapp:+5491164640871'  # ¡Número de prueba fijo!

                # Clasifica al alumno
                if student_data['final_grade'] >= student_data['passing_grade']:
                    students["approved"].append(student_data)
                else:
                    students["disapproved"].append(student_data)

            print(f"Procesados {len(students['approved'])} aprobados y {len(students['disapproved'])} desaprobados.")
            return students

    except Exception as e:
        print(f"Error al conectar o extraer datos de Moodle: {e}")
        return students