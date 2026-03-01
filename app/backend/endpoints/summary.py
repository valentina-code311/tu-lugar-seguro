import os
import json
import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

router = APIRouter()


def get_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    return create_client(url, key)


def get_anthropic():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY no configurado")
    return anthropic.Anthropic(api_key=api_key)


class SummaryRequest(BaseModel):
    patient_id: str
    next_session_date: str | None = None


class SummaryResponse(BaseModel):
    summary: str


@router.post("/sessions", response_model=SummaryResponse)
async def generate_session_summary(request: SummaryRequest):
    sb = get_supabase()
    client = get_anthropic()

    # Get patient info
    patient_res = sb.table("patients").select("*").eq("id", request.patient_id).single().execute()
    if not patient_res.data:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    patient = patient_res.data

    # Get last 10 sessions (completed or saved)
    sessions_res = (
        sb.table("clinical_sessions")
        .select("*")
        .eq("patient_id", request.patient_id)
        .neq("status", "draft")
        .order("session_date", desc=True)
        .limit(10)
        .execute()
    )
    sessions = sessions_res.data

    if not sessions:
        # Try with any status
        sessions_res = (
            sb.table("clinical_sessions")
            .select("*")
            .eq("patient_id", request.patient_id)
            .order("session_date", desc=True)
            .limit(10)
            .execute()
        )
        sessions = sessions_res.data

    if not sessions:
        raise HTTPException(
            status_code=404,
            detail="No hay sesiones previas para este paciente"
        )

    # Build sessions summary for the prompt
    sessions_text = ""
    for i, session in enumerate(reversed(sessions), 1):
        sessions_text += f"\n--- SESIÓN {session.get('session_number', i)} ({session.get('session_date', 'fecha desconocida')}) ---\n"

        if session.get("motivo_consulta"):
            mc = session["motivo_consulta"]
            if isinstance(mc, str):
                mc = json.loads(mc)
            sessions_text += f"Motivo: {mc.get('texto_paciente', '')}\n"

        if session.get("objetivos"):
            objetivos = session["objetivos"]
            if objetivos:
                sessions_text += f"Objetivos: {', '.join(objetivos)}\n"

        if session.get("plan"):
            plan = session["plan"]
            if isinstance(plan, str):
                plan = json.loads(plan)
            sessions_text += f"Plan: {plan.get('plan_semana', '')} | Tarea: {plan.get('tarea', '')}\n"

        if session.get("formulacion_clinica"):
            fc = session["formulacion_clinica"]
            if isinstance(fc, str):
                fc = json.loads(fc)
            sessions_text += f"Patrones: {fc.get('patrones', '')}\n"

        if session.get("intervenciones"):
            interv = session["intervenciones"]
            if isinstance(interv, str):
                interv = json.loads(interv)
            otros = interv.get("otros", "")
            if otros:
                sessions_text += f"Intervenciones: {otros}\n"

    next_date_text = f"La próxima sesión está programada para: {request.next_session_date}" if request.next_session_date else ""

    prompt = f"""Eres un asistente de preparación para sesiones de psicología clínica.

PACIENTE: {patient.get('preferred_name') or patient.get('full_name')} ({patient.get('age', '')} años)
{next_date_text}

HISTORIAL DE SESIONES (de más antigua a más reciente):
{sessions_text}

Genera un resumen de preparación para la próxima sesión que incluya:

1. **Patrones observados**: Temas y patrones recurrentes identificados en las sesiones
2. **Objetivos pendientes**: Objetivos terapéuticos que aún están en proceso
3. **Tareas asignadas**: Tareas enviadas al paciente para revisar seguimiento
4. **Temas sugeridos**: 3-5 temas específicos a explorar en la próxima sesión basados en el historial
5. **Notas de continuidad**: Elementos importantes a retomar o dar seguimiento

Sé específico y basado en la información proporcionada. Usa un tono clínico pero accesible."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    return SummaryResponse(summary=message.content[0].text)
