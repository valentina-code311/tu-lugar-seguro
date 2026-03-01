import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Clock, Video, MapPin, FileText, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/shared/components/Breadcrumb";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePatient, useUpdatePatient } from "@/features/pacientes/hooks/usePatients";
import { backendPost } from "@/shared/lib/backendFetch";
import { usePatientSessions, useCreateSession, type ClinicalSession } from "@/features/pacientes/hooks/useClinicalSessions";
import { usePatientAppointments, formatTime, STATUS_CONFIG } from "@/features/agenda/hooks/useAppointments";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8082";

export default function AdminPacienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: patient, isLoading: loadingPatient } = usePatient(id);
  const { data: sessions, isLoading: loadingSessions } = usePatientSessions(id);
  const { data: appointments = [], isLoading: loadingAppointments } = usePatientAppointments(id);
  const updateMutation = useUpdatePatient();
  const createSession = useCreateSession();

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    session_date: new Date().toISOString().split("T")[0],
    session_time: "09:00",
    modality: "online" as "online" | "presencial",
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  function startEdit() {
    if (!patient) return;
    setEditForm({
      full_name: patient.full_name,
      preferred_name: patient.preferred_name || "",
      document_id: patient.document_id || "",
      age: patient.age?.toString() || "",
      phone: patient.phone || "",
      email: patient.email || "",
      pronouns: patient.pronouns || "",
      occupation: patient.occupation || "",
      education: patient.education || "",
      city: patient.city || "",
      referral_source: patient.referral_source || "",
      notes: patient.notes || "",
    });
    setEditMode(true);
  }

  async function saveEdit() {
    if (!patient) return;
    await updateMutation.mutateAsync({
      id: patient.id,
      ...editForm,
      age: editForm.age ? Number(editForm.age) : null,
    });
    setEditMode(false);
  }

  async function handleCreateSession() {
    if (!id) return;
    const nextNumber = (sessions?.length || 0) + 1;
    const newSession = await createSession.mutateAsync({
      patient_id: id,
      session_date: sessionForm.session_date,
      session_time: sessionForm.session_time,
      modality: sessionForm.modality,
      session_number: nextNumber,
      status: "draft",
    });
    setNewSessionOpen(false);
    navigate(`/admin/sesiones/${newSession.id}`);
  }

  async function handleCreateSessionFromAppointment(appointmentId: string, date: string | null, time: string | null, modality: "online" | "presencial" | null) {
    if (!id) return;
    const nextNumber = (sessions?.length || 0) + 1;
    const newSession = await createSession.mutateAsync({
      patient_id: id,
      appointment_id: appointmentId,
      session_date: date ?? new Date().toISOString().split("T")[0],
      session_time: time ?? "09:00",
      modality: modality ?? "online",
      session_number: nextNumber,
      status: "draft",
    });
    navigate(`/admin/sesiones/${newSession.id}`);
  }

  async function handleSummary() {
    if (!id) return;
    setLoadingSummary(true);
    setSummaryOpen(true);
    setSummaryText("");
    try {
      const data = await backendPost(`${BACKEND_URL}/summary/sessions`, { patient_id: id }, 90_000) as { summary: string };
      setSummaryText(data.summary);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al generar resumen");
      setSummaryOpen(false);
    } finally {
      setLoadingSummary(false);
    }
  }

  function statusBadge(status: string) {
    const variants: Record<string, string> = {
      draft: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800",
    };
    const labels: Record<string, string> = {
      draft: "Borrador",
      completed: "Completada",
      sent: "Enviada",
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${variants[status] || "bg-muted text-muted-foreground"}`}>
        {labels[status] || status}
      </span>
    );
  }

  if (loadingPatient) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Paciente no encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px] shrink-0" onClick={() => navigate("/admin/pacientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <Breadcrumb items={[
            { label: "Pacientes", to: "/admin/pacientes" },
            { label: patient.full_name },
          ]} />
          <h1 className="font-display text-2xl font-bold text-foreground">{patient.full_name}</h1>
          {patient.preferred_name && patient.preferred_name !== patient.full_name && (
            <p className="text-sm text-muted-foreground">Conocido/a como: {patient.preferred_name}</p>
          )}
        </div>
        <Button variant="outline" onClick={handleSummary}>
          <Sparkles className="mr-2 h-4 w-4" />
          Resumen preparación
        </Button>
        {!editMode && (
          <Button variant="outline" onClick={startEdit}>
            Editar datos
          </Button>
        )}
      </div>

      {/* Patient info card */}
      <div className="rounded-xl border border-border bg-card p-6">
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["full_name", "Nombre completo"],
                ["preferred_name", "Nombre preferido"],
                ["document_id", "Documento ID"],
                ["age", "Edad"],
                ["phone", "Teléfono"],
                ["email", "Email"],
                ["pronouns", "Pronombres"],
                ["occupation", "Ocupación"],
                ["education", "Educación"],
                ["city", "Ciudad"],
                ["referral_source", "Fuente de referencia"],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Input
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="col-span-2 space-y-1.5">
                <Label>Notas</Label>
                <Textarea
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:grid-cols-3">
            {[
              ["Documento", patient.document_id],
              ["Edad", patient.age ? `${patient.age} años` : null],
              ["Pronombres", patient.pronouns],
              ["Teléfono", patient.phone],
              ["Email", patient.email],
              ["Ciudad", patient.city],
              ["Ocupación", patient.occupation],
              ["Educación", patient.education],
              ["Referencia", patient.referral_source],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium text-foreground">{value}</dd>
              </div>
            ))}
            {patient.notes && (
              <div className="col-span-2 md:col-span-3">
                <dt className="text-muted-foreground">Notas</dt>
                <dd className="text-foreground">{patient.notes}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Linked appointments */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Citas vinculadas ({appointments.length})
        </h2>
        {loadingAppointments && (
          <div className="space-y-2">
            {[1, 2].map((n) => <div key={n} className="h-14 animate-pulse rounded-lg bg-muted" />)}
          </div>
        )}
        {!loadingAppointments && appointments.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No hay citas asignadas a este paciente.</p>
        )}
        {!loadingAppointments && appointments.length > 0 && (
          <div className="space-y-2">
            {appointments.map((appt) => {
              const session = appt.clinical_sessions?.[0];
              return (
                <div key={appt.id} className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{appt.appointment_date}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(appt.start_time)} – {formatTime(appt.end_time)}</span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[appt.status].badgeClass}`}>
                        {STATUS_CONFIG[appt.status].label}
                      </span>
                      <span className="text-xs text-muted-foreground">{appt.modality === "online" ? "Online" : "Presencial"}</span>
                    </div>
                    {appt.services && (
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.services.name}</p>
                    )}
                  </div>
                  {session ? (
                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/sesiones/${session.id}`)}>
                      Ver sesión {session.session_number}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleCreateSessionFromAppointment(appt.id, appt.appointment_date, appt.start_time, appt.modality)} disabled={createSession.isPending}>
                      Crear sesión
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sessions list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Sesiones ({sessions?.length || 0})
          </h2>
          <Button onClick={() => setNewSessionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva sesión
          </Button>
        </div>

        {loadingSessions && (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!loadingSessions && (
          <div className="space-y-2">
            {sessions?.map((session: ClinicalSession) => (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => navigate(`/admin/sesiones/${session.id}`)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {session.session_number || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      Sesión {session.session_number}
                    </span>
                    {statusBadge(session.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {session.session_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.session_date}
                      </span>
                    )}
                    {session.session_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.session_time}
                      </span>
                    )}
                    {session.modality && (
                      <span className="flex items-center gap-1">
                        {session.modality === "online"
                          ? <Video className="h-3 w-3" />
                          : <MapPin className="h-3 w-3" />}
                        {session.modality}
                      </span>
                    )}
                  </div>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}

            {sessions?.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground">No hay sesiones todavía.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setNewSessionOpen(true)}>
                  Crear primera sesión
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New session dialog */}
      <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva sesión</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={sessionForm.session_date}
                onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hora</Label>
              <Input
                type="time"
                value={sessionForm.session_time}
                onChange={(e) => setSessionForm({ ...sessionForm, session_time: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Modalidad</Label>
              <Select
                value={sessionForm.modality}
                onValueChange={(v) => setSessionForm({ ...sessionForm, modality: v as "online" | "presencial" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSessionOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateSession} disabled={createSession.isPending}>
              {createSession.isPending ? "Creando..." : "Crear e ir al editor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary modal */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resumen de preparación</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] py-2">
            {loadingSummary ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Generando resumen con IA...
              </div>
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-foreground">
                {summaryText}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSummaryOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
