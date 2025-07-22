Chatbot de Seguimiento para Alumnos de Moodle
Este proyecto implementa un sistema de chatbot automatizado a través de WhatsApp para realizar un seguimiento proactivo del rendimiento de los alumnos en una plataforma Moodle. El sistema identifica a los alumnos que han rendido exámenes y, según su resultado (aprobados, desaprobados) o su ausencia (pendientes), inicia una conversación para ofrecer apoyo, recolectar información y motivarlos.

⚙️ Tecnologías Utilizadas
Backend: Python 3.10+

Framework Web: FastAPI

Servidor ASGI: Uvicorn

Base de Datos (LMS): MySQL/MariaDB (para Moodle)

ORM / Conector DB: SQLAlchemy

API de Mensajería: Twilio WhatsApp API

Automatización: Cron Jobs (Linux/macOS)

📂 Estructura del Proyecto
El proyecto está organizado en módulos con responsabilidades bien definidas:

chatbot_moodle_fastapi/
├── app/
│   ├── chatbot/
│   │   ├── message_handler.py  # Lógica para procesar respuestas.
│   │   └── whatsapp_client.py  # Cliente para enviar mensajes vía Twilio.
│   ├── jobs/
│   │   └── student_follow_up.py  # Tarea principal que se ejecuta diariamente.
│   └── moodle_integration/
│       ├── data_extractor.py   # Extrae y clasifica datos de la BD de Moodle.
│       └── queries.py          # Almacena las consultas SQL.
│
├── main.py                     # Entrypoint del servidor web FastAPI.
├── run_job.py                  # Script para ejecutar el job manualmente.
├── .env                        # Archivo de configuración y credenciales.
└── requirements.txt            # Lista de dependencias de Python.
🚀 Puesta en Marcha (RUN)
Sigue estos pasos para configurar y ejecutar el proyecto en un entorno de desarrollo.

1. Configuración del Entorno
Bash

# 1. Clona el repositorio y navega a la carpeta
git clone <tu-repositorio>
cd chatbot_moodle_fastapi

# 2. Crea y activa un entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: .\venv\Scripts\activate

# 3. Instala las dependencias
pip install -r requirements.txt
2. Variables de Entorno
Crea un archivo llamado .env en la raíz del proyecto y copia el siguiente contenido, reemplazando los valores con tus credenciales reales.

Fragmento de código

# Credenciales de Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base de Datos de Moodle
DB_USER=usuario_de_tu_bd
DB_PASSWORD=la_contraseña
DB_HOST=ip_o_host_de_la_bd
DB_PORT=3306
DB_NAME=moodle_replica
3. Ejecución
Necesitarás tres terminales separadas para correr el sistema completo en modo de desarrollo.

Terminal 1: Iniciar el Servidor Web

Bash

uvicorn main:app --reload
Terminal 2: Iniciar ngrok
Este comando crea un túnel público a tu servidor local para que Twilio pueda enviarte las respuestas de los usuarios.

Bash

ngrok http 8000
Copia la URL https://... que genera ngrok y configúrala en el webhook de tu Messaging Service en la consola de Twilio.

Terminal 3: Ejecutar el Job Manualmente
Este comando simula la ejecución diaria para probar el envío de los mensajes iniciales.

Bash

python run_job.py
🔄 Procesos y Conexiones
Job Automatizado (Cron Job): El sistema se inicia con un cron job que ejecuta run_job.py una vez al día.

Fragmento de código

# Se ejecuta todos los días a las 9:00 AM
0 9 * * * /ruta/al/proyecto/venv/bin/python /ruta/al/proyecto/run_job.py
Extracción de Datos: El script se conecta a la base de datos de Moodle, ejecuta las consultas para obtener alumnos aprobados, desaprobados y pendientes.

Envío de Mensajes Iniciales: Usando el Messaging Service SID, el sistema envía las plantillas de WhatsApp correspondientes a cada grupo de alumnos a través de la API de Twilio.

Recepción de Respuestas: Cuando un alumno responde, WhatsApp envía el mensaje a Twilio. Twilio lo reenvía al webhook configurado en el Messaging Service (tu URL de ngrok).

Procesamiento y Respuesta: El servidor FastAPI recibe la petición en el endpoint /whatsapp, la procesa usando el message_handler y envía una respuesta de texto libre de vuelta al alumno a través del mismo Messaging Service.
