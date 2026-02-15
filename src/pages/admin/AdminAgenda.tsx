import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Ban, RotateCcw, X as XIcon, Plus } from "lucide-react";

type Appointment = {
  id: string; appointment_date: string; start_time: string; end_time: string;
  client_name: string; client_email: string; client_phone: string | null;
  client_message: string | null; modality: string; status: string;
  admin_notes: string | null; service_id: string;
  service?: { name: string };
};

type BlockedSlot = {
  id: string; start_at: string; end_at: string; reason: string | null;
};

const AdminAgenda = () => {
  const qc = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [blockForm, setBlockForm] = useState({ start: "", end: "", reason: "" });
  const [showBlock, setShowBlock] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-appointments", dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name)")
        .eq("appointment_date", dateStr)
        .order("start_time");
      if (error) throw error;
      return (data || []).map((a: any) => ({ ...a, service: a.services })) as Appointment[];
    },
  });

  const { data: blockedSlots = [] } = useQuery({
    queryKey: ["admin-blocked-slots", dateStr],
    queryFn: async () => {
      const dayStart = `${dateStr}T00:00:00`;
      const dayEnd = `${dateStr}T23:59:59`;
      const { data, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .gte("start_at", dayStart)
        .lte("start_at", dayEnd)
        .order("start_at");
      if (error) throw error;
      return data as BlockedSlot[];
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-appointments"] }); toast({ title: "Cita cancelada – cupo liberado" }); },
  });

  const reschedule = useMutation({
    mutationFn: async () => {
      if (!rescheduleId || !newDate || !newStart || !newEnd) return;
      // Get the original appointment
      const { data: orig } = await supabase.from("appointments").select("*").eq("id", rescheduleId).single();
      if (!orig) throw new Error("Cita no encontrada");
      // Mark old as rescheduled
      await supabase.from("appointments").update({ status: "rescheduled" }).eq("id", rescheduleId);
      // Create new appointment
      const { error } = await supabase.from("appointments").insert({
        service_id: orig.service_id,
        appointment_date: newDate,
        start_time: newStart,
        end_time: newEnd,
        client_name: orig.client_name,
        client_email: orig.client_email,
        client_phone: orig.client_phone,
        client_message: orig.client_message,
        modality: orig.modality,
        consent_accepted: orig.consent_accepted,
        rescheduled_from_id: rescheduleId,
        status: "confirmed",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast({ title: "Cita reprogramada" });
      setRescheduleId(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const block = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("blocked_slots").insert({
        start_at: `${dateStr}T${blockForm.start}:00`,
        end_at: `${dateStr}T${blockForm.end}:00`,
        reason: blockForm.reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blocked-slots"] });
      toast({ title: "Horario bloqueado" });
      setShowBlock(false);
      setBlockForm({ start: "", end: "", reason: "" });
    },
  });

  const unblock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blocked-slots"] }); toast({ title: "Bloqueo eliminado" }); },
  });

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      await supabase.from("appointments").update({ admin_notes: notes }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-appointments"] }),
  });

  const activeAppts = appointments.filter(a => a.status !== "cancelled" && a.status !== "rescheduled");
  const pastAppts = appointments.filter(a => a.status === "cancelled" || a.status === "rescheduled");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agenda</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div>
          <div className="rounded-xl border border-border bg-card p-2">
            <Calendar mode="single" selected={selectedDate} onSelect={d => d && setSelectedDate(d)} locale={es} />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <button onClick={() => setShowBlock(!showBlock)} className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium">
            <Ban className="w-4 h-4" /> Bloquear horario
          </button>

          {showBlock && (
            <form onSubmit={e => { e.preventDefault(); block.mutate(); }} className="mt-3 space-y-2 rounded-lg border border-border p-3 bg-card">
              <div className="flex gap-2">
                <input type="time" required value={blockForm.start} onChange={e => setBlockForm({ ...blockForm, start: e.target.value })} className="flex-1 px-2 py-1 rounded border border-input bg-background text-sm" />
                <input type="time" required value={blockForm.end} onChange={e => setBlockForm({ ...blockForm, end: e.target.value })} className="flex-1 px-2 py-1 rounded border border-input bg-background text-sm" />
              </div>
              <input value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })} placeholder="Motivo (opcional)" className="w-full px-2 py-1 rounded border border-input bg-background text-sm" />
              <button type="submit" className="w-full py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium">Bloquear</button>
            </form>
          )}
        </div>

        {/* Day view */}
        <div className="lg:col-span-2 space-y-4">
          {/* Blocked slots */}
          {blockedSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bloqueados</h3>
              <div className="space-y-2">
                {blockedSlots.map(bs => (
                  <div key={bs.id} className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2">
                    <div>
                      <span className="text-sm font-medium">{bs.start_at.slice(11, 16)} – {bs.end_at.slice(11, 16)}</span>
                      {bs.reason && <span className="text-xs text-muted-foreground ml-2">{bs.reason}</span>}
                    </div>
                    <button onClick={() => unblock.mutate(bs.id)} className="p-1 rounded hover:bg-destructive/10"><XIcon className="w-4 h-4 text-destructive" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active appointments */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Citas ({activeAppts.length})
            </h3>
            {activeAppts.length === 0 && <p className="text-sm text-muted-foreground py-4">Sin citas este día.</p>}
            <div className="space-y-3">
              {activeAppts.map(a => (
                <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}</p>
                      <p className="text-sm text-muted-foreground">{a.service?.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === "confirmed" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-sm space-y-0.5 mb-3">
                    <p><strong>{a.client_name}</strong> · {a.modality}</p>
                    <p className="text-muted-foreground">{a.client_email}{a.client_phone ? ` · ${a.client_phone}` : ""}</p>
                    {a.client_message && <p className="text-muted-foreground italic">"{a.client_message}"</p>}
                  </div>

                  {/* Admin notes */}
                  <div className="mb-3">
                    <textarea
                      placeholder="Notas internas…"
                      defaultValue={a.admin_notes || ""}
                      onBlur={e => {
                        if (e.target.value !== (a.admin_notes || "")) {
                          updateNotes.mutate({ id: a.id, notes: e.target.value });
                        }
                      }}
                      className="w-full px-2 py-1 rounded border border-input bg-background text-xs resize-none"
                      rows={1}
                    />
                  </div>

                  {/* Reschedule form */}
                  {rescheduleId === a.id && (
                    <div className="rounded-lg border border-border p-3 mb-3 space-y-2">
                      <p className="text-xs font-medium">Reprogramar a:</p>
                      <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-2 py-1 rounded border border-input bg-background text-sm" />
                      <div className="flex gap-2">
                        <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className="flex-1 px-2 py-1 rounded border border-input bg-background text-sm" />
                        <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="flex-1 px-2 py-1 rounded border border-input bg-background text-sm" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => reschedule.mutate()} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs">Confirmar</button>
                        <button onClick={() => setRescheduleId(null)} className="px-3 py-1 rounded border border-border text-xs">Cancelar</button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {a.status !== "cancelled" && (
                      <>
                        <button onClick={() => { if (confirm("¿Cancelar cita? El cupo será liberado.")) cancel.mutate(a.id); }} className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                          <XIcon className="w-3 h-3 inline mr-1" />Cancelar
                        </button>
                        <button onClick={() => setRescheduleId(a.id)} className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium">
                          <RotateCcw className="w-3 h-3 inline mr-1" />Reprogramar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past/cancelled */}
          {pastAppts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Canceladas/Reprogramadas</h3>
              <div className="space-y-2">
                {pastAppts.map(a => (
                  <div key={a.id} className="rounded-lg border border-border bg-muted/50 px-4 py-2 opacity-60">
                    <p className="text-sm"><strong>{a.start_time.slice(0, 5)}</strong> · {a.client_name} · <span className="text-xs">{a.status}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAgenda;
