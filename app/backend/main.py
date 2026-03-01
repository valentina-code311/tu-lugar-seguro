import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import ocr, clinical, summary, email

load_dotenv()

app = FastAPI(title="Tu Lugar Seguro - Agentes IA")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8081")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:8081", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
app.include_router(clinical.router, prefix="/clinical", tags=["Clinical"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"])
app.include_router(email.router, prefix="/email", tags=["Email"])


@app.get("/health")
def health():
    return {"status": "ok"}
