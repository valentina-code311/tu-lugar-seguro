import os
import json
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
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


class EmailRequest(BaseModel):
    session_id: str
    patient_email: str
    patient_name: str


def format_jsonb(data, fields: dict) -> str:
    """Format a JSONB dict into HTML list items."""
    if not data:
        return "<p><em>Sin información registrada</em></p>"
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            return f"<p>{data}</p>"
    items = []
    for key, label in fields.items():
        val = data.get(key)
        if val is not None and val != "" and val != [] and val != {}:
            if isinstance(val, list):
                val = ", ".join(str(v) for v in val)
            items.append(f"<li><strong>{label}:</strong> {val}</li>")
    return f"<ul>{''.join(items)}</ul>" if items else "<p><em>Sin información registrada</em></p>"


def build_html(session: dict, patient: dict) -> str:
    pname = patient.get("preferred_name") or patient.get("full_name", "Paciente")

    def s(key):
        val = session.get(key, {})
        if isinstance(val, str):
            try:
                return json.loads(val)
            except Exception:
                return {}
        return val or {}

    motivo = s("motivo_consulta")
    historia = s("historia_problema")
    riesgo = s("riesgo_seguridad")
    antecedentes = s("antecedentes")
    contexto = s("contexto_psicosocial")
    obs = s("observaciones_clinicas")
    formulacion = s("formulacion_clinica")
    intervenciones = s("intervenciones")
    plan = s("plan")
    cierre = s("cierre_administrativo")
    objetivos = session.get("objetivos") or []

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Georgia, serif; color: #2d2d2d; max-width: 800px; margin: 0 auto; padding: 20px; }}
    h1 {{ color: #5b3a8e; border-bottom: 2px solid #5b3a8e; padding-bottom: 8px; }}
    h2 {{ color: #5b3a8e; margin-top: 24px; font-size: 1.1em; }}
    .header-info {{ background: #f9f5ff; border-left: 4px solid #5b3a8e; padding: 12px 16px; margin-bottom: 24px; }}
    .section {{ margin-bottom: 20px; border: 1px solid #e5e0f0; border-radius: 6px; padding: 12px 16px; }}
    ul {{ padding-left: 20px; }}
    li {{ margin-bottom: 4px; }}
    .footer {{ margin-top: 32px; font-size: 0.85em; color: #777; border-top: 1px solid #ddd; padding-top: 12px; }}
  </style>
</head>
<body>
  <h1>Historia Clínica Psicológica</h1>

  <div class="header-info">
    <strong>Paciente:</strong> {patient.get('full_name', pname)}<br>
    <strong>Sesión N°:</strong> {session.get('session_number', '-')}<br>
    <strong>Fecha:</strong> {session.get('session_date', '-')} {session.get('session_time', '') or ''}<br>
    <strong>Modalidad:</strong> {session.get('modality', '-')}<br>
    <strong>Estado:</strong> {session.get('status', '-')}
  </div>

  <div class="section">
    <h2>A. Motivo de Consulta</h2>
    {format_jsonb(motivo, {{'texto_paciente': 'Texto del paciente', 'inicio_evolucion': 'Inicio/evolución', 'desencadenantes': 'Desencadenantes'}})}
  </div>

  <div class="section">
    <h2>B. Historia del Problema</h2>
    {format_jsonb(historia, {{'sintomas': 'Síntomas', 'impacto_score': 'Impacto (0-10)', 'areas': 'Áreas afectadas', 'estrategias': 'Estrategias previas', 'factores': 'Factores'}})}
  </div>

  <div class="section">
    <h2>D. Riesgo y Seguridad</h2>
    {format_jsonb(riesgo, {{'ideacion': 'Ideación', 'frecuencia': 'Frecuencia', 'plan': 'Plan', 'protectores': 'Factores protectores', 'acciones': 'Acciones tomadas'}})}
  </div>

  <div class="section">
    <h2>E. Antecedentes</h2>
    {format_jsonb(antecedentes, {{'salud_mental': 'Salud mental', 'salud_medica': 'Salud médica', 'sustancias': 'Sustancias', 'eventos': 'Eventos significativos'}})}
  </div>

  <div class="section">
    <h2>F. Contexto Psicosocial</h2>
    {format_jsonb(contexto, {{'familia': 'Familia', 'relaciones': 'Relaciones', 'factores_contexto': 'Factores contextuales', 'recursos': 'Recursos'}})}
  </div>

  <div class="section">
    <h2>G. Observaciones Clínicas</h2>
    {format_jsonb(obs, {{'apariencia': 'Apariencia', 'actitud': 'Actitud', 'afecto': 'Afecto', 'lenguaje': 'Lenguaje', 'pensamiento': 'Pensamiento', 'orientacion': 'Orientación', 'insight': 'Insight'}})}
  </div>

  <div class="section">
    <h2>H. Formulación Clínica</h2>
    {format_jsonb(formulacion, {{'patrones': 'Patrones', 'creencias': 'Creencias', 'ciclo': 'Ciclo', 'necesidades': 'Necesidades'}})}
  </div>

  <div class="section">
    <h2>I. Objetivos Terapéuticos</h2>
    {'<ul>' + ''.join(f'<li>{o}</li>' for o in objetivos) + '</ul>' if objetivos else '<p><em>Sin objetivos registrados</em></p>'}
  </div>

  <div class="section">
    <h2>J. Intervenciones</h2>
    {format_jsonb(intervenciones, {{'psicoeducacion': 'Psicoeducación', 'regulacion': 'Regulación emocional', 'patrones': 'Trabajo con patrones', 'limites': 'Límites', 'otros': 'Otros'}})}
  </div>

  <div class="section">
    <h2>K. Plan</h2>
    {format_jsonb(plan, {{'plan_semana': 'Plan para la semana', 'tarea': 'Tarea asignada', 'proxima_fecha': 'Próxima sesión', 'proxima_hora': 'Hora', 'proxima_foco': 'Foco próxima sesión'}})}
  </div>

  <div class="section">
    <h2>L. Cierre Administrativo</h2>
    {format_jsonb(cierre, {{'pago_realizado': 'Pago realizado', 'pago_metodo': 'Método de pago', 'consentimiento': 'Consentimiento', 'observaciones': 'Observaciones'}})}
  </div>

  <div class="footer">
    Este documento es confidencial y ha sido generado desde Tu Lugar Seguro.
  </div>
</body>
</html>"""


@router.post("/clinical-history")
async def send_clinical_history(request: EmailRequest):
    sb = get_supabase()

    # Fetch session
    session_res = (
        sb.table("clinical_sessions")
        .select("*")
        .eq("id", request.session_id)
        .single()
        .execute()
    )
    if not session_res.data:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    session = session_res.data

    # Fetch patient
    patient_res = (
        sb.table("patients")
        .select("*")
        .eq("id", session["patient_id"])
        .single()
        .execute()
    )
    patient = patient_res.data or {}

    html_content = build_html(session, patient)

    # SMTP config
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    if not smtp_user or not smtp_password:
        raise HTTPException(status_code=500, detail="SMTP no configurado")

    # Build email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Historia Clínica - Sesión N° {session.get('session_number', '')} | Tu Lugar Seguro"
    msg["From"] = smtp_from
    msg["To"] = request.patient_email

    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            start_tls=True,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar email: {e}")

    return {"message": f"Historia clínica enviada a {request.patient_email}"}
