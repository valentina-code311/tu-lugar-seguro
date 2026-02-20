import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  FileText,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useAdminAppointments,
  useUpdateAppointment,
  formatAppointmentDate,
  formatTime,
  STATUS_CONFIG,
  type Appointment,
  type AppointmentStatus,
} from "@/hooks/useAppointments";

const FILTER_TABS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "confirmed", label: "Confirmadas" },
  { key: "completed", label: "Completadas" },
  { key: "cancelled", label: "Canceladas" },
] as const;

const AdminAgenda = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | AppointmentStatus>("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");

  const { data: appointments, isLoading } = useAdminAppointments(activeFilter);
  const updateMutation = useUpdateAppointment();

  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Split into upcoming (today+) and past, sorted appropriately
  const upcoming = (appointments ?? []).filter((a) => a.appointment_date >= todayStr);
  const past = (appointments ?? [])
    .filter((a) => a.appointment_date < todayStr)
    .reverse(); // flip ASC → DESC so most recent past is first

  const handleOpen = (appt: Appointment) => {
    setSelected(appt);
    setNotes(appt.admin_notes ?? "");
  };

  const handleClose = () => {
    setSelected(null);
    setNotes("");
  };

  const handleStatusChange = async (status: AppointmentStatus) => {
    if (!selected) return;
    await updateMutation.mutateAsync({ id: selected.id, status });
    toast.success("Estado actualizado");
    handleClose();
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    const updated = await updateMutation.mutateAsync({
      id: selected.id,
      admin_notes: notes,
    });
    setSelected(updated);
    toast.success("Notas guardadas");
  };

  const AppointmentCard = ({ appt, index }: { appt: Appointment; index: number }) => {
    const cfg = STATUS_CONFIG[appt.status];
    return (
      <motion.div
        key={appt.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="flex cursor-pointer items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-primary/40"
        onClick={() => handleOpen(appt)}
      >
        {/* Date column */}
        <div className="w-14 flex-none text-center">
          <div className="font-display text-2xl font-bold leading-none text-primary">
            {format(new Date(appt.appointment_date + "T00:00:00"), "d")}
          </div>
          <div className="text-xs capitalize text-muted-foreground">
            {format(new Date(appt.appointment_date + "T00:00:00"), "MMM", { locale: es })}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(appt.appointment_date + "T00:00:00"), "yyyy")}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px self-stretch bg-border" />

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-semibold text-foreground">{appt.client_name}</span>
            {appt.client_pronouns && (
              <span className="text-xs text-muted-foreground">({appt.client_pronouns})</span>
            )}
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.badgeClass}`}
            >
              {cfg.label}
            </span>
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            {appt.services?.name ?? "Servicio eliminado"}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {appt.modality === "online" ? "Online" : "Presencial"}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {appt.client_email}
            </span>
            {appt.client_phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {appt.client_phone}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderGroup = (label: string, items: Appointment[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {label} ({items.length})
        </h2>
        <div className="space-y-3">
          {items.map((appt, i) => (
            <AppointmentCard key={appt.id} appt={appt} index={i} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Agenda</h1>
        <p className="mt-1 text-muted-foreground">Gestiona las citas agendadas por tus clientes.</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === tab.key
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-surface text-muted-foreground hover:border-primary/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-8">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        )}

        {!isLoading && appointments?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">No hay citas en esta categoría.</p>
          </div>
        )}

        {!isLoading && appointments && appointments.length > 0 && (
          <>
            {renderGroup("Próximas", upcoming)}
            {renderGroup("Anteriores", past)}
          </>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {selected.client_name}
                  {selected.client_pronouns && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({selected.client_pronouns})
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Status + request date */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATUS_CONFIG[selected.status].badgeClass}`}
                  >
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Solicitada el{" "}
                    {format(new Date(selected.created_at), "d 'de' MMM yyyy", { locale: es })}
                  </span>
                </div>

                {/* Appointment details */}
                <div className="space-y-2 rounded-xl border border-border bg-background p-4 text-sm">
                  <div className="flex gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="capitalize">{formatAppointmentDate(selected.appointment_date)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      {formatTime(selected.start_time)} – {formatTime(selected.end_time)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selected.modality === "online" ? "Online" : "Presencial"}</span>
                  </div>
                  <div className="flex gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selected.services?.name ?? "Servicio no disponible"}</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-foreground">Datos de contacto</p>
                  <a
                    href={`mailto:${selected.client_email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-4 w-4" />
                    {selected.client_email}
                  </a>
                  {selected.client_phone && (
                    <a
                      href={`https://wa.me/${selected.client_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-4 w-4" />
                      {selected.client_phone}
                    </a>
                  )}
                </div>

                {/* Client message */}
                {selected.client_message && (
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Mensaje del cliente
                    </p>
                    <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                      {selected.client_message}
                    </p>
                  </div>
                )}

                {/* Admin notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Notas internas</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas privadas sobre esta cita..."
                    rows={3}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveNotes}
                    disabled={updateMutation.isPending}
                  >
                    Guardar notas
                  </Button>
                </div>

                {/* Status actions */}
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground">Cambiar estado</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange("confirmed")}
                        disabled={updateMutation.isPending}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Confirmar
                      </Button>
                    )}
                    {selected.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange("completed")}
                        disabled={updateMutation.isPending}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Marcar completada
                      </Button>
                    )}
                    {selected.status === "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange("pending")}
                        disabled={updateMutation.isPending}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Reactivar
                      </Button>
                    )}
                    {selected.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange("cancelled")}
                        disabled={updateMutation.isPending}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancelar cita
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAgenda;
