# app/crm/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Lee las credenciales del .env
DB_USER = os.getenv('CRM_DB_USER')
DB_PASSWORD = os.getenv('CRM_DB_PASSWORD')
DB_HOST = os.getenv('CRM_DB_HOST')
DB_PORT = os.getenv('CRM_DB_PORT')
DB_NAME = os.getenv('CRM_DB_NAME')

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependencia para inyectar la sesión de BD en las rutas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()