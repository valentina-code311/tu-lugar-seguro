import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useServices } from "@/shared/hooks/useServices";
import { useAdminCreateAppointment, useAdminBlockSlot } from "@/features/agenda/hooks/useAppointments";

interface Slot {
  date: string;
  hour: number;
}

interface Props {
  slot: Slot | null;
  onClose: () => void;
}

type Mode = "appointment" | "block";

export function CreateAppointmentModal({ slot, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("appointment");
  const { data: services = [] } = useServices();
  const createAppt = useAdminCreateAppointment();
  const blockSlot = useAdminBlockSlot();

  // Appointment fields
  const [serviceId, setServiceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [modality, setModality] = useState<"online" | "presencial">("online");
  const [apptMessage, setApptMessage] = useState("");

  // Block fields
  const [blockAllDay, setBlockAllDay] = useState(false);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  // Pre-fill time when slot changes
  useEffect(() => {
    if (slot) {
      const h = slot.hour.toString().padStart(2, "0");
      setStartTime(`${h}:00`);
      setBlockStart(`${h}:00`);
      setEndTime("");
    }
    // Reset form on new slot
    setServiceId("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setApptMessage("");
    setBlockAllDay(false);
    setBlockEnd("");
    setBlockReason("");
    setMode("appointment");
  }, [slot]);

  // Auto-calc end time when service changes
  useEffect(() => {
    if (!serviceId || !startTime) return;
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + svc.duration_minutes;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    setEndTime(`${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`);
  }, [serviceId, startTime, services]);

  const handleCreateAppt = async () => {
    if (!slot || !serviceId || !clientName || !clientEmail || !startTime || !endTime) return;
    await createAppt.mutateAsync({
      service_id: serviceId,
      appointment_date: slot.date,
      start_time: startTime + ":00",
      end_time: endTime + ":00",
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone || undefined,
      client_message: apptMessage || undefined,
      modality,
    });
    onClose();
  };

  const handleBlock = async () => {
    if (!slot) return;
    if (!blockAllDay && (!blockStart || !blockEnd)) return;
    await blockSlot.mutateAsync({
      blocked_date: slot.date,
      start_time: blockAllDay ? undefined : blockStart + ":00",
      end_time: blockAllDay ? undefined : blockEnd + ":00",
      reason: blockReason || undefined,
    });
    onClose();
  };

  const dateLabel = slot
    ? format(new Date(slot.date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })
    : "";

  const apptValid = serviceId && clientName && clientEmail && startTime && endTime;
  const blockValid = blockAllDay || (blockStart && blockEnd);

  return (
    <Dialog open={!!slot} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display capitalize">{dateLabel}</DialogTitle>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === "appointment" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setMode("appointment")}
          >
            Nueva cita
          </button>
          <button
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === "block" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setMode("block")}
          >
            Bloquear horario
          </button>
        </div>

        {/* ── Create appointment ── */}
        {mode === "appointment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Inicio</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fin</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Servicio</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Nombre del paciente</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre completo"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Teléfono <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Modalidad</Label>
              <Select value={modality} onValueChange={(v) => setModality(v as "online" | "presencial")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Notas <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Textarea
                value={apptMessage}
                onChange={(e) => setApptMessage(e.target.value)}
                placeholder="Motivo de consulta, notas previas..."
                rows={2}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleCreateAppt}
              disabled={!apptValid || createAppt.isPending}
            >
              {createAppt.isPending ? "Guardando..." : "Crear cita"}
            </Button>
          </div>
        )}

        {/* ── Block slot ── */}
        {mode === "block" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="all-day"
                type="checkbox"
                checked={blockAllDay}
                onChange={(e) => setBlockAllDay(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <Label htmlFor="all-day">Bloquear día completo</Label>
            </div>

            {!blockAllDay && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Inicio</Label>
                  <Input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Fin</Label>
                  <Input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Razón <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ej. Vacaciones, cita médica..."
              />
            </div>

            <Button
              className="w-full"
              onClick={handleBlock}
              disabled={!blockValid || blockSlot.isPending}
            >
              {blockSlot.isPending ? "Bloqueando..." : "Bloquear horario"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
