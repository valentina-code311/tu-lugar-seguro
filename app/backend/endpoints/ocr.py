import os
import base64
import httpx
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


class OCRRequest(BaseModel):
    session_id: str
    upload_ids: list[str]


class OCRResult(BaseModel):
    upload_id: str
    ocr_text: str


class OCRResponse(BaseModel):
    results: list[OCRResult]


@router.post("/extract", response_model=OCRResponse)
async def extract_text(request: OCRRequest):
    sb = get_supabase()
    client = get_anthropic()

    # Fetch uploads
    res = sb.table("session_uploads").select("*").in_("id", request.upload_ids).execute()
    uploads = res.data
    if not uploads:
        raise HTTPException(status_code=404, detail="No se encontraron uploads")

    results = []

    async with httpx.AsyncClient(timeout=60.0) as http:
        for upload in uploads:
            file_url = upload["file_url"]

            # Download image
            try:
                resp = await http.get(file_url)
                resp.raise_for_status()
                image_data = base64.standard_b64encode(resp.content).decode("utf-8")
                content_type = resp.headers.get("content-type", "image/jpeg")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error al descargar imagen: {e}")

            # OCR via Claude Vision
            message = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=4096,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": content_type,
                                    "data": image_data,
                                },
                            },
                            {
                                "type": "text",
                                "text": (
                                    "Extrae todo el texto escrito en esta imagen de notas clínicas psicológicas. "
                                    "Preserva la estructura, listas, puntuación y saltos de línea tal como aparecen. "
                                    "Si hay palabras ilegibles, indícalo con [ilegible]. "
                                    "Devuelve únicamente el texto extraído, sin comentarios adicionales."
                                ),
                            },
                        ],
                    }
                ],
            )

            ocr_text = message.content[0].text

            # Update in DB
            sb.table("session_uploads").update(
                {"ocr_text": ocr_text, "is_processed": True}
            ).eq("id", upload["id"]).execute()

            results.append(OCRResult(upload_id=upload["id"], ocr_text=ocr_text))

    return OCRResponse(results=results)
