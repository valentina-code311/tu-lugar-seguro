import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Mail, Phone, MessageSquare, Clock, MapPin, FileText, Check, X, RefreshCw, UserRound, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { useUpdateAppointment, formatAppointmentDate, formatTime, STATUS_CONFIG, type Appointment, type AppointmentStatus } from "@/features/agenda/hooks/useAppointments";
import { usePatientByEmail, useCreatePatient } from "@/features/pacientes/hooks/usePatients";

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetailModal({ appointment, onClose }: Props) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const updateMutation = useUpdateAppointment();
  const { data: patient, isLoading: loadingPatient } = usePatientByEmail(appointment?.client_email);
  const createPatient = useCreatePatient();

  const handleOpen = () => setNotes(appointment?.admin_notes ?? "");

  const handleStatusChange = async (status: AppointmentStatus) => {
    if (!appointment) return;
    await updateMutation.mutateAsync({ id: appointment.id, status });
    toast.success("Estado actualizado");
    onClose();
  };

  const handleSaveNotes = async () => {
    if (!appointment) return;
    await updateMutation.mutateAsync({ id: appointment.id, admin_notes: notes });
    toast.success("Notas guardadas");
  };

  const handleGoToPatient = (patientId: string) => {
    onClose();
    navigate(`/admin/pacientes/${patientId}`);
  };

  const handleCreatePatient = async () => {
    if (!appointment) return;
    const newPatient = await createPatient.mutateAsync({
      full_name: appointment.client_name,
      email: appointment.client_email,
      phone: appointment.client_phone ?? undefined,
      pronouns: appointment.client_pronouns ?? undefined,
      is_active: true,
    });
    onClose();
    navigate(`/admin/pacientes/${newPatient.id}`);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto" onOpenAutoFocus={handleOpen}>
        {appointment && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {appointment.client_name}
                {appointment.client_pronouns && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({appointment.client_pronouns})
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Status + request date */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATUS_CONFIG[appointment.status].badgeClass}`}>
                  {STATUS_CONFIG[appointment.status].label}
                </span>
                <span className="text-xs text-muted-foreground">
                  Solicitada el {format(new Date(appointment.created_at), "d 'de' MMM yyyy", { locale: es })}
                </span>
              </div>

              {/* Appointment details */}
              <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="capitalize">{formatAppointmentDate(appointment.appointment_date)}</span>
                </div>
                <div className="flex gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}</span>
                </div>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{appointment.modality === "online" ? "Online" : "Presencial"}</span>
                </div>
                <div className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{appointment.services?.name ?? "Servicio no disponible"}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-sm">
                <p className="font-medium text-foreground">Datos de contacto</p>
                <a href={`mailto:${appointment.client_email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Mail className="h-4 w-4" />
                  {appointment.client_email}
                </a>
                {appointment.client_phone && (
                  <a href={`https://wa.me/${appointment.client_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Phone className="h-4 w-4" />
                    {appointment.client_phone}
                  </a>
                )}
              </div>

              {/* Client message */}
              {appointment.client_message && (
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Mensaje del cliente
                  </p>
                  <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
                    {appointment.client_message}
                  </p>
                </div>
              )}

              {/* Admin notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Notas internas</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas privadas sobre esta cita..." rows={3} />
                <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={updateMutation.isPending}>
                  Guardar notas
                </Button>
              </div>

              {/* Historia clínica */}
              <div className="space-y-3 border-t border-border pt-4">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <UserRound className="h-4 w-4" />
                  Historia clínica
                </p>
                {loadingPatient ? (
                  <div className="h-14 animate-pulse rounded-xl bg-muted" />
                ) : patient ? (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{patient.full_name}</p>
                      <p className="text-xs text-muted-foreground">Paciente registrado</p>
                    </div>
                    <Button size="sm" onClick={() => handleGoToPatient(patient.id)}>
                      Ver historial <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No hay paciente registrado con este correo.
                    </p>
                    <Button size="sm" variant="outline" onClick={handleCreatePatient} disabled={createPatient.isPending}>
                      {createPatient.isPending ? "Creando..." : "+ Crear paciente desde esta cita"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Status actions */}
              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">Cambiar estado</p>
                <div className="flex flex-wrap gap-2">
                  {appointment.status === "pending" && (
                    <Button size="sm" onClick={() => handleStatusChange("confirmed")} disabled={updateMutation.isPending}>
                      <Check className="mr-1 h-4 w-4" /> Confirmar
                    </Button>
                  )}
                  {appointment.status === "confirmed" && (
                    <Button size="sm" onClick={() => handleStatusChange("completed")} disabled={updateMutation.isPending}>
                      <Check className="mr-1 h-4 w-4" /> Marcar completada
                    </Button>
                  )}
                  {appointment.status === "cancelled" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange("pending")} disabled={updateMutation.isPending}>
                      <RefreshCw className="mr-1 h-4 w-4" /> Reactivar
                    </Button>
                  )}
                  {appointment.status !== "cancelled" && (
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange("cancelled")} disabled={updateMutation.isPending}>
                      <X className="mr-1 h-4 w-4" /> Cancelar cita
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
