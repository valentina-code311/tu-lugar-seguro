import { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Sparkles, Send, Save, X, Image, ChevronDown, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useSession, useUpdateSession, useSessionUploads, useUploadSessionFile, useDeleteUpload } from "@/hooks/useClinicalSessions";
import { backendPost } from "@/lib/backendFetch";
import { usePatient } from "@/hooks/usePatients";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8082";

// ── Accordion section ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-sm text-foreground">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AdminSesionEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading } = useSession(id);
  const { data: uploads } = useSessionUploads(id);
  const updateSession = useUpdateSession();
  const uploadFile = useUploadSessionFile();
  const deleteUpload = useDeleteUpload();

  const { data: patient } = usePatient(session?.patient_id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [emailAddr, setEmailAddr] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [extractingOcr, setExtractingOcr] = useState(false);
  const [fillingAI, setFillingAI] = useState(false);

  // Local editable form — initialized from session when loaded
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [formInit, setFormInit] = useState(false);

  if (session && !formInit) {
    setForm({
      session_date: session.session_date || "",
      session_time: session.session_time || "",
      modality: session.modality || "online",
      session_number: session.session_number || "",
      status: session.status || "draft",
      motivo_consulta: session.motivo_consulta || {},
      historia_problema: session.historia_problema || {},
      tamizajes: session.tamizajes || {},
      riesgo_seguridad: session.riesgo_seguridad || {},
      antecedentes: session.antecedentes || {},
      contexto_psicosocial: session.contexto_psicosocial || {},
      observaciones_clinicas: session.observaciones_clinicas || {},
      formulacion_clinica: session.formulacion_clinica || {},
      objetivos: session.objetivos || [],
      intervenciones: session.intervenciones || {},
      plan: session.plan || {},
      cierre_administrativo: session.cierre_administrativo || {},
    });
    if (session.patient_id) {
      // Pre-fill email if patient has email
    }
    setFormInit(true);
  }

  const setSection = useCallback((section: string, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown> || {}),
        [key]: value,
      },
    }));
  }, []);

  function getSection(section: string): Record<string, string> {
    return (form[section] as Record<string, string>) || {};
  }

  async function handleSave(status?: string) {
    if (!id) return;
    const payload = { ...form, id };
    if (status) payload.status = status;
    await updateSession.mutateAsync(payload as Parameters<typeof updateSession.mutateAsync>[0]);
    toast.success("Sesión guardada");
  }

  // Drag and drop
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (!id) return;
    Array.from(e.dataTransfer.files).forEach((file) => {
      uploadFile.mutate({ sessionId: id, file });
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!id || !e.target.files) return;
    Array.from(e.target.files).forEach((file) => {
      uploadFile.mutate({ sessionId: id, file });
    });
    e.target.value = "";
  }

  async function handleExtractOcr() {
    if (!uploads || uploads.length === 0) {
      toast.error("No hay archivos subidos");
      return;
    }
    setExtractingOcr(true);
    try {
      await backendPost(`${BACKEND_URL}/ocr/extract`, {
        session_id: id,
        upload_ids: uploads.map((u) => u.id),
      }, 120_000); // OCR puede tomar hasta 2 min con varias imágenes
      toast.success("Texto extraído correctamente");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al extraer texto");
    } finally {
      setExtractingOcr(false);
    }
  }

  async function handleFillAI() {
    setFillingAI(true);
    try {
      const data = await backendPost(`${BACKEND_URL}/clinical/fill`, { session_id: id }, 90_000) as Record<string, unknown>;
      setForm((prev) => ({
        ...prev,
        motivo_consulta: data.motivo_consulta || prev.motivo_consulta,
        historia_problema: data.historia_problema || prev.historia_problema,
        tamizajes: data.tamizajes || prev.tamizajes,
        riesgo_seguridad: data.riesgo_seguridad || prev.riesgo_seguridad,
        antecedentes: data.antecedentes || prev.antecedentes,
        contexto_psicosocial: data.contexto_psicosocial || prev.contexto_psicosocial,
        observaciones_clinicas: data.observaciones_clinicas || prev.observaciones_clinicas,
        formulacion_clinica: data.formulacion_clinica || prev.formulacion_clinica,
        objetivos: (data.objetivos as string[])?.length ? data.objetivos : prev.objetivos,
        intervenciones: data.intervenciones || prev.intervenciones,
        plan: data.plan || prev.plan,
        cierre_administrativo: data.cierre_administrativo || prev.cierre_administrativo,
      }));
      toast.success("Historia clínica pre-llenada con IA. Revisa y guarda.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al llenar con IA");
    } finally {
      setFillingAI(false);
    }
  }

  async function handleSendEmail() {
    if (!emailAddr || !id) return;
    setSendingEmail(true);
    try {
      await backendPost(`${BACKEND_URL}/email/clinical-history`, {
        session_id: id,
        patient_email: emailAddr,
        patient_name: patient?.full_name || "Paciente",
      }, 30_000);
      toast.success("Historia clínica enviada por email");
      setSendEmailOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al enviar email");
    } finally {
      setSendingEmail(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!session) {
    return <div className="text-center py-16 text-muted-foreground">Sesión no encontrada.</div>;
  }

  const mc = getSection("motivo_consulta");
  const hp = getSection("historia_problema");
  const tam = getSection("tamizajes");
  const rs = getSection("riesgo_seguridad");
  const ant = getSection("antecedentes");
  const ctx = getSection("contexto_psicosocial");
  const obs = getSection("observaciones_clinicas");
  const fc = getSection("formulacion_clinica");
  const interv = getSection("intervenciones");
  const plan = getSection("plan");
  const cierre = getSection("cierre_administrativo");
  const objetivos = (form.objetivos as string[]) || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => session.patient_id && navigate(`/admin/pacientes/${session.patient_id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-foreground">
            Sesión {form.session_number as number || "?"}
            {patient && <span className="text-muted-foreground font-normal ml-2">— {patient.full_name}</span>}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave()}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Guardar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEmailAddr(patient?.email || "");
              setSendEmailOpen(true);
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Enviar al paciente
          </Button>
        </div>
      </div>

      {/* Session metadata */}
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Fecha">
            <Input
              type="date"
              value={(form.session_date as string) || ""}
              onChange={(e) => setForm({ ...form, session_date: e.target.value })}
            />
          </Field>
          <Field label="Hora">
            <Input
              type="time"
              value={(form.session_time as string) || ""}
              onChange={(e) => setForm({ ...form, session_time: e.target.value })}
            />
          </Field>
          <Field label="Modalidad">
            <Select
              value={(form.modality as string) || "online"}
              onValueChange={(v) => setForm({ ...form, modality: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Estado">
            <Select
              value={(form.status as string) || "draft"}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* Uploads section */}
      <div className="rounded-xl border border-border bg-background p-5 space-y-4">
        <h2 className="font-medium text-sm text-foreground">Notas de la sesión</h2>

        {/* Drop zone */}
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Arrastra imágenes aquí o <span className="text-primary underline">selecciona archivos</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP, PDF · máx. 50 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Uploaded files */}
        {uploads && uploads.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="relative group rounded-lg border border-border overflow-hidden bg-muted">
                <div className="aspect-square flex items-center justify-center">
                  {upload.file_url.match(/\.(jpg|jpeg|png|webp|heic)$/i) ? (
                    <img
                      src={upload.file_url}
                      alt={upload.file_name || "nota"}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-white text-xs truncate">{upload.file_name}</p>
                </div>
                {upload.is_processed && (
                  <Badge className="absolute top-1 right-8 text-xs bg-green-600">OCR</Badge>
                )}
                <button
                  className="absolute top-1 right-1 rounded bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteUpload.mutate({ id: upload.id, sessionId: session.id })}
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExtractOcr}
            disabled={extractingOcr || !uploads?.length}
          >
            {extractingOcr ? (
              <><Sparkles className="mr-1.5 h-3.5 w-3.5 animate-spin" />Extrayendo...</>
            ) : (
              <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Extraer texto (OCR)</>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleFillAI}
            disabled={fillingAI}
          >
            {fillingAI ? (
              <><Sparkles className="mr-1.5 h-3.5 w-3.5 animate-spin" />Llenando con IA...</>
            ) : (
              <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Llenar historia con IA</>
            )}
          </Button>
        </div>
      </div>

      {/* Clinical sections A–L */}

      <Section title="A. Motivo de consulta">
        <Field label="Texto del paciente">
          <Textarea rows={3} value={mc.texto_paciente || ""} onChange={(e) => setSection("motivo_consulta", "texto_paciente", e.target.value)} />
        </Field>
        <Field label="Inicio y evolución">
          <Textarea rows={2} value={mc.inicio_evolucion || ""} onChange={(e) => setSection("motivo_consulta", "inicio_evolucion", e.target.value)} />
        </Field>
        <Field label="Desencadenantes">
          <Textarea rows={2} value={mc.desencadenantes || ""} onChange={(e) => setSection("motivo_consulta", "desencadenantes", e.target.value)} />
        </Field>
      </Section>

      <Section title="B. Historia del problema">
        <Field label="Síntomas">
          <Textarea rows={3} value={hp.sintomas || ""} onChange={(e) => setSection("historia_problema", "sintomas", e.target.value)} />
        </Field>
        <Field label="Impacto (0–10)">
          <Input type="number" min={0} max={10} value={hp.impacto_score || ""} onChange={(e) => setSection("historia_problema", "impacto_score", e.target.value)} />
        </Field>
        <Field label="Áreas afectadas">
          <Input value={hp.areas || ""} onChange={(e) => setSection("historia_problema", "areas", e.target.value)} placeholder="Ej: trabajo, relaciones, sueño" />
        </Field>
        <Field label="Estrategias previas">
          <Textarea rows={2} value={hp.estrategias || ""} onChange={(e) => setSection("historia_problema", "estrategias", e.target.value)} />
        </Field>
        <Field label="Factores">
          <Textarea rows={2} value={hp.factores || ""} onChange={(e) => setSection("historia_problema", "factores", e.target.value)} />
        </Field>
      </Section>

      <Section title="C. Tamizajes">
        <Field label="PHQ score">
          <Input type="number" value={tam.phq_score || ""} onChange={(e) => setSection("tamizajes", "phq_score", e.target.value)} />
        </Field>
        <Field label="PHQ ítems">
          <Textarea rows={2} value={tam.phq_items || ""} onChange={(e) => setSection("tamizajes", "phq_items", e.target.value)} />
        </Field>
        <Field label="Otros tamizajes">
          <Textarea rows={2} value={tam.otros || ""} onChange={(e) => setSection("tamizajes", "otros", e.target.value)} />
        </Field>
      </Section>

      <Section title="D. Riesgo y seguridad">
        <Field label="Ideación suicida">
          <Input value={rs.ideacion || ""} onChange={(e) => setSection("riesgo_seguridad", "ideacion", e.target.value)} />
        </Field>
        <Field label="Frecuencia">
          <Input value={rs.frecuencia || ""} onChange={(e) => setSection("riesgo_seguridad", "frecuencia", e.target.value)} />
        </Field>
        <Field label="Plan">
          <Input value={rs.plan || ""} onChange={(e) => setSection("riesgo_seguridad", "plan", e.target.value)} />
        </Field>
        <Field label="Medios">
          <Input value={rs.medios || ""} onChange={(e) => setSection("riesgo_seguridad", "medios", e.target.value)} />
        </Field>
        <Field label="Intención">
          <Input value={rs.intencion || ""} onChange={(e) => setSection("riesgo_seguridad", "intencion", e.target.value)} />
        </Field>
        <Field label="Factores protectores">
          <Textarea rows={2} value={rs.protectores || ""} onChange={(e) => setSection("riesgo_seguridad", "protectores", e.target.value)} />
        </Field>
        <Field label="Acciones tomadas">
          <Textarea rows={2} value={rs.acciones || ""} onChange={(e) => setSection("riesgo_seguridad", "acciones", e.target.value)} />
        </Field>
      </Section>

      <Section title="E. Antecedentes">
        <Field label="Salud mental">
          <Textarea rows={2} value={ant.salud_mental || ""} onChange={(e) => setSection("antecedentes", "salud_mental", e.target.value)} />
        </Field>
        <Field label="Salud médica">
          <Textarea rows={2} value={ant.salud_medica || ""} onChange={(e) => setSection("antecedentes", "salud_medica", e.target.value)} />
        </Field>
        <Field label="Sustancias">
          <Textarea rows={2} value={ant.sustancias || ""} onChange={(e) => setSection("antecedentes", "sustancias", e.target.value)} />
        </Field>
        <Field label="Eventos significativos">
          <Textarea rows={2} value={ant.eventos || ""} onChange={(e) => setSection("antecedentes", "eventos", e.target.value)} />
        </Field>
      </Section>

      <Section title="F. Contexto psicosocial">
        <Field label="Familia">
          <Textarea rows={2} value={ctx.familia || ""} onChange={(e) => setSection("contexto_psicosocial", "familia", e.target.value)} />
        </Field>
        <Field label="Relaciones">
          <Textarea rows={2} value={ctx.relaciones || ""} onChange={(e) => setSection("contexto_psicosocial", "relaciones", e.target.value)} />
        </Field>
        <Field label="Factores contextuales">
          <Textarea rows={2} value={ctx.factores_contexto || ""} onChange={(e) => setSection("contexto_psicosocial", "factores_contexto", e.target.value)} />
        </Field>
        <Field label="Recursos">
          <Textarea rows={2} value={ctx.recursos || ""} onChange={(e) => setSection("contexto_psicosocial", "recursos", e.target.value)} />
        </Field>
      </Section>

      <Section title="G. Observaciones clínicas">
        {(["apariencia", "actitud", "afecto", "lenguaje", "pensamiento", "orientacion", "insight"] as const).map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <Input value={obs[k] || ""} onChange={(e) => setSection("observaciones_clinicas", k, e.target.value)} />
          </Field>
        ))}
      </Section>

      <Section title="H. Formulación clínica">
        <Field label="Patrones">
          <Textarea rows={2} value={fc.patrones || ""} onChange={(e) => setSection("formulacion_clinica", "patrones", e.target.value)} />
        </Field>
        <Field label="Creencias">
          <Textarea rows={2} value={fc.creencias || ""} onChange={(e) => setSection("formulacion_clinica", "creencias", e.target.value)} />
        </Field>
        <Field label="Ciclo">
          <Textarea rows={2} value={fc.ciclo || ""} onChange={(e) => setSection("formulacion_clinica", "ciclo", e.target.value)} />
        </Field>
        <Field label="Necesidades">
          <Textarea rows={2} value={fc.necesidades || ""} onChange={(e) => setSection("formulacion_clinica", "necesidades", e.target.value)} />
        </Field>
      </Section>

      <Section title="I. Objetivos terapéuticos">
        <div className="space-y-2">
          {(objetivos.length > 0 ? objetivos : ["", "", ""]).map((obj, i) => (
            <Field key={i} label={`Objetivo ${i + 1}`}>
              <Input
                value={obj}
                onChange={(e) => {
                  const updated = [...(objetivos.length > 0 ? objetivos : ["", "", ""])];
                  updated[i] = e.target.value;
                  setForm((prev) => ({ ...prev, objetivos: updated }));
                }}
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="J. Intervenciones">
        {(["psicoeducacion", "regulacion", "patrones", "limites", "otros"] as const).map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <Textarea rows={2} value={interv[k] || ""} onChange={(e) => setSection("intervenciones", k, e.target.value)} />
          </Field>
        ))}
      </Section>

      <Section title="K. Plan">
        <Field label="Plan para la semana">
          <Textarea rows={2} value={plan.plan_semana || ""} onChange={(e) => setSection("plan", "plan_semana", e.target.value)} />
        </Field>
        <Field label="Tarea asignada">
          <Input value={plan.tarea || ""} onChange={(e) => setSection("plan", "tarea", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Próxima sesión - fecha">
            <Input type="date" value={plan.proxima_fecha || ""} onChange={(e) => setSection("plan", "proxima_fecha", e.target.value)} />
          </Field>
          <Field label="Próxima sesión - hora">
            <Input type="time" value={plan.proxima_hora || ""} onChange={(e) => setSection("plan", "proxima_hora", e.target.value)} />
          </Field>
        </div>
        <Field label="Foco próxima sesión">
          <Textarea rows={2} value={plan.proxima_foco || ""} onChange={(e) => setSection("plan", "proxima_foco", e.target.value)} />
        </Field>
      </Section>

      <Section title="L. Cierre administrativo">
        <Field label="Pago realizado">
          <Input value={cierre.pago_realizado || ""} onChange={(e) => setSection("cierre_administrativo", "pago_realizado", e.target.value)} />
        </Field>
        <Field label="Método de pago">
          <Input value={cierre.pago_metodo || ""} onChange={(e) => setSection("cierre_administrativo", "pago_metodo", e.target.value)} placeholder="Transferencia, efectivo..." />
        </Field>
        <Field label="Reserva próxima sesión">
          <Input value={cierre.reserva || ""} onChange={(e) => setSection("cierre_administrativo", "reserva", e.target.value)} />
        </Field>
        <Field label="Consentimiento">
          <Input value={cierre.consentimiento || ""} onChange={(e) => setSection("cierre_administrativo", "consentimiento", e.target.value)} />
        </Field>
        <Field label="Observaciones administrativas">
          <Textarea rows={2} value={cierre.observaciones || ""} onChange={(e) => setSection("cierre_administrativo", "observaciones", e.target.value)} />
        </Field>
      </Section>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex justify-end gap-2 -mx-6 lg:-mx-8 px-6 lg:px-8">
        <Button variant="outline" onClick={() => handleSave("draft")}>
          <Save className="mr-1.5 h-4 w-4" />
          Guardar borrador
        </Button>
        <Button onClick={() => handleSave("completed")}>
          Marcar como completada
        </Button>
      </div>

      {/* Send email dialog */}
      <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enviar al paciente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Se enviará la historia clínica de esta sesión al email indicado.
            </p>
            <Field label="Email del paciente">
              <Input
                type="email"
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
                placeholder="paciente@email.com"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendEmailOpen(false)}>Cancelar</Button>
            <Button onClick={handleSendEmail} disabled={sendingEmail || !emailAddr}>
              {sendingEmail ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
