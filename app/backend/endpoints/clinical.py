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


class FillRequest(BaseModel):
    session_id: str


CLINICAL_PROMPT = """Eres un asistente especializado en psicología clínica.
A continuación encontrarás el texto extraído de notas escritas a mano durante una sesión terapéutica.

NOTAS DE SESIÓN:
{ocr_text}

Basándote ÚNICAMENTE en la información presente en las notas, completa la siguiente estructura de historia clínica en formato JSON.
Si no hay información para un campo, usa null o array vacío según corresponda.
NO inventes información que no esté en las notas.

Devuelve ÚNICAMENTE el JSON válido, sin texto adicional:

{{
  "motivo_consulta": {{
    "texto_paciente": null,
    "inicio_evolucion": null,
    "desencadenantes": null
  }},
  "historia_problema": {{
    "sintomas": null,
    "impacto_score": null,
    "areas": [],
    "estrategias": null,
    "factores": null
  }},
  "tamizajes": {{
    "phq_score": null,
    "phq_items": null,
    "otros": null
  }},
  "riesgo_seguridad": {{
    "ideacion": null,
    "frecuencia": null,
    "plan": null,
    "medios": null,
    "intencion": null,
    "protectores": null,
    "acciones": []
  }},
  "antecedentes": {{
    "salud_mental": null,
    "salud_medica": null,
    "sustancias": null,
    "eventos": null
  }},
  "contexto_psicosocial": {{
    "familia": null,
    "relaciones": null,
    "factores_contexto": null,
    "recursos": null
  }},
  "observaciones_clinicas": {{
    "apariencia": null,
    "actitud": null,
    "afecto": null,
    "lenguaje": null,
    "pensamiento": null,
    "orientacion": null,
    "insight": null
  }},
  "formulacion_clinica": {{
    "patrones": null,
    "creencias": null,
    "ciclo": null,
    "necesidades": null
  }},
  "objetivos": [],
  "intervenciones": {{
    "psicoeducacion": null,
    "regulacion": null,
    "patrones": null,
    "limites": null,
    "otros": null
  }},
  "plan": {{
    "plan_semana": null,
    "tarea": null,
    "proxima_fecha": null,
    "proxima_hora": null,
    "proxima_foco": null
  }},
  "cierre_administrativo": {{
    "pago_realizado": null,
    "pago_metodo": null,
    "reserva": null,
    "consentimiento": null,
    "observaciones": null
  }}
}}"""


@router.post("/fill")
async def fill_clinical_history(request: FillRequest):
    sb = get_supabase()
    client = get_anthropic()

    # Get all OCR texts for the session
    res = (
        sb.table("session_uploads")
        .select("ocr_text, file_name")
        .eq("session_id", request.session_id)
        .eq("is_processed", True)
        .execute()
    )
    uploads = res.data

    if not uploads:
        raise HTTPException(
            status_code=404,
            detail="No hay texto extraído para esta sesión. Ejecuta primero el OCR."
        )

    # Concatenate all OCR texts
    combined_text = "\n\n---\n\n".join(
        f"[Archivo: {u.get('file_name', 'sin nombre')}]\n{u['ocr_text']}"
        for u in uploads
        if u.get("ocr_text")
    )

    if not combined_text.strip():
        raise HTTPException(status_code=400, detail="Los textos OCR están vacíos")

    # Call Claude to fill the clinical history
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        messages=[
            {
                "role": "user",
                "content": CLINICAL_PROMPT.format(ocr_text=combined_text),
            }
        ],
    )

    response_text = message.content[0].text.strip()

    # Strip markdown code block if present
    if response_text.startswith("```"):
        lines = response_text.split("\n")
        response_text = "\n".join(lines[1:-1])

    try:
        clinical_data = json.loads(response_text)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Claude devolvió JSON inválido: {e}\nRespuesta: {response_text[:500]}"
        )

    return clinical_data
