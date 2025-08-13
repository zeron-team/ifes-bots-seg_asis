# app/moodle_integration/data_extractor.py
import sqlalchemy
from app import config
from app.moodle_integration import queries


def get_students_for_follow_up():
    """
    Se conecta a la BD de Moodle y obtiene 3 listas: aprobados, desaprobados y pendientes.
    """
    students = {"approved": [], "disapproved": [], "pending": []}

    try:
        db_uri = (
            f"mysql+mysqlconnector://{config.DB_USER}:{config.DB_PASSWORD}@"
            f"{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
        )
        engine = sqlalchemy.create_engine(db_uri)

        with engine.connect() as connection:
            # 1. Obtener aprobados y desaprobados
            results_graded = connection.execute(sqlalchemy.text(queries.GET_RECENT_QUIZ_RESULTS))
            for row in results_graded:
                student_data = dict(row._mapping)
                student_data['whatsapp_phone'] = 'whatsapp:+5491135665266'  # ¡Número de prueba fijo!

                if student_data['final_grade'] >= student_data['passing_grade']:
                    students["approved"].append(student_data)
                else:
                    students["disapproved"].append(student_data)

            # 2. Obtener pendientes
            results_pending = connection.execute(sqlalchemy.text(queries.GET_PENDING_QUIZ_STUDENTS))
            for row in results_pending:
                student_data = dict(row._mapping)
                student_data['whatsapp_phone'] = 'whatsapp:+5491135665266'  # ¡Número de prueba fijo!
                students["pending"].append(student_data)

        print(
            f"Procesados: {len(students['approved'])} aprobados, "
            f"{len(students['disapproved'])} desaprobados, "
            f"{len(students['pending'])} pendientes."
        )
        return students

    except Exception as e:
        print(f"Error al conectar o extraer datos de Moodle: {e}")
        return students