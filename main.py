# main.py
from fastapi import FastAPI, Form, Response
from typing import Annotated
from app.chatbot import message_handler

app = FastAPI(title="Webhook Chatbot Moodle")

@app.post("/whatsapp")
async def handle_whatsapp_message(
    Body: Annotated[str, Form()],
    From: Annotated[str, Form()]
):
    """Recibe los mensajes de WhatsApp y los pasa al manejador."""
    print(f"Webhook recibido de {From} con mensaje: {Body}")
    message_handler.process_student_response(From, Body)
    return Response(status_code=204)

@app.get("/")
def read_root():
    return {"status": "Servidor del chatbot funcionando."}