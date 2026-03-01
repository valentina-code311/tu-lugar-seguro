import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/shared/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Calendar, CalendarCheck, ChevronLeft, ChevronRight, Loader2, Sprout, MessageCircle } from "lucide-react";
import { useServices, formatPrice } from "@/shared/hooks/useServices";
import { useBookAppointment, useBookedSlots, BookedSlot } from "@/features/agenda/hooks/useAppointments";

// ── Time slot generation (30-min blocks) ─────────────────────────────────────

interface TimeSlot {
  display: string; // "9:00 AM"
  time24: string;  // "09:00:00"
}

const TIME_SLOTS: TimeSlot[] = (() => {
  const slots: TimeSlot[] = [];

  function pushSlot(h: number, m: number) {
    const period = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push({
      display: `${h12}:${String(m).padStart(2, "0")} ${period}`,
      time24: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
    });
  }

  // Morning: 9:00 – 11:30
  for (let h = 9; h <= 11; h++) {
    pushSlot(h, 0);
    pushSlot(h, 30);
  }
  // Afternoon: 14:00 – 16:30
  for (let h = 14; h <= 16; h++) {
    pushSlot(h, 0);
    pushSlot(h, 30);
  }

  return slots;
})();

// ── Availability helpers ──────────────────────────────────────────────────────

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function addMinutesToTime24(time24: string, minutes: number): string {
  const total = timeToMinutes(time24) + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`;
}

/**
 * A 30-min slot is blocked if it overlaps with any existing appointment.
 * Overlap condition: slotStart < bookEnd && slotStart + 30 > bookStart
 */
function isSlotBooked(slot: TimeSlot, booked: BookedSlot[]): boolean {
  const slotStart = timeToMinutes(slot.time24);
  const slotEnd = slotStart + 30;
  return booked.some(({ start_time, end_time }) => {
    const s = timeToMinutes(start_time);
    const e = timeToMinutes(end_time);
    return slotStart < e && slotEnd > s;
  });
}

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// ── Component ─────────────────────────────────────────────────────────────────

const Agenda = () => {
  const [searchParams] = useSearchParams();
  const { data: services } = useServices();
  const bookMutation = useBookAppointment();

  // Calendar state
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form state
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [modality, setModality] = useState<"online" | "presencial">("online");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-select service from query param (?servicio=uuid)
  useEffect(() => {
    const sp = searchParams.get("servicio");
    if (sp) setSelectedService(sp);
  }, [searchParams]);

  // Calendar helpers
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const dateStr = selectedDate
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    : null;

  // Fetch booked slots for selected date
  const { data: bookedSlots = [], isLoading: loadingSlots } = useBookedSlots(dateStr);

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayMidnight || isWeekend;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !selectedService || !dateStr) return;

    const durationMinutes = services?.find(s => s.id === selectedService)?.duration_minutes ?? 60;
    const endTime = addMinutesToTime24(selectedSlot.time24, durationMinutes);

    await bookMutation.mutateAsync({
      service_id: selectedService,
      appointment_date: dateStr,
      start_time: selectedSlot.time24,
      end_time: endTime,
      client_name: name.trim(),
      client_email: email.trim(),
      client_phone: phone.trim() || undefined,
      client_message: notes.trim() || undefined,
      modality,
      consent_accepted: consent,
    });

    setSubmitted(true);
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <Layout>
        <section className="flex flex-1 items-center justify-center bg-background py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md text-center space-y-6 px-4"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CalendarCheck className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">¡Reserva enviada!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tu solicitud fue recibida. En breve me pondré en contacto contigo para confirmar la cita.
            </p>
            <p className="text-sm text-muted-foreground">
              Revisa tu correo: <span className="font-medium text-foreground">{email}</span>
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setSelectedDate(null);
                setSelectedSlot(null);
                setName(""); setEmail(""); setPhone(""); setNotes("");
                setConsent(false);
              }}
            >
              Hacer otra reserva
            </Button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────

  const canSubmit =
    !!selectedDate && !!selectedSlot && !!selectedService &&
    name.trim() && email.trim() && consent;

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Reserva tu cita
            </span>
            <div className="mt-6 mx-2 text-muted-foreground">
              <p>
                Selecciona el servicio, fecha y hora que mejor se adapte a ti.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-12 px-4 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">

            {/* ── Calendar ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card/80 p-6 shadow-lg"
            >
              {/* Month navigation */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold capitalize text-primary">{monthName}</h3>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysOfWeek.map((d) => (
                  <div key={d} className="py-2 text-xs font-medium text-muted-foreground">{d}</div>
                ))}
                {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const disabled = isDayDisabled(day);
                  const selected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={disabled}
                      onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                      className={`rounded-lg py-2 text-sm transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground font-semibold"
                          : disabled
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : "text-foreground hover:bg-primary/15"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Horarios disponibles:</h4>
                    {loadingSlots && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot) => {
                      const booked = isSlotBooked(slot, bookedSlots);
                      const selected = selectedSlot?.time24 === slot.time24;
                      return (
                        <button
                          key={slot.time24}
                          type="button"
                          disabled={booked || loadingSlots}
                          onClick={() => setSelectedSlot(slot)}
                          title={booked ? "No disponible" : undefined}
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                            booked
                              ? "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed line-through"
                              : selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          {slot.display}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground/60">
                    Los horarios tachados ya están reservados
                  </p>
                </div>
              )}
            </motion.div>

            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card/80 p-6 shadow-lg"
            >
              <h3 className="mb-6 font-display text-lg font-semibold text-primary">Datos de la reserva</h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Service */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Servicio *</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — {formatPrice(s.price)}</option>
                    ))}
                  </select>
                </div>

                {/* Name + Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Nombre *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="bg-background/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="bg-background/60"
                      required
                    />
                  </div>
                </div>

                {/* Phone + Modality */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 123 4567"
                      className="bg-background/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Modalidad *</label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as "online" | "presencial")}
                      className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none"
                    >
                      <option value="online">Online</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Notas (opcional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="¿Algo que quieras comentarme antes de la sesión?"
                    className="bg-background/60"
                    rows={3}
                  />
                </div>

                {/* Summary */}
                {selectedDate && selectedSlot && (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm space-y-1">
                    <p className="font-semibold text-foreground">Resumen:</p>
                    <p className="text-muted-foreground">
                      {services?.find(s => s.id === selectedService)?.name ?? "Servicio por confirmar"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedDate} de {monthName} · {selectedSlot.display} · {modality}
                    </p>
                  </div>
                )}

                {/* Consent */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    required
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Acepto el tratamiento de mis datos personales para la gestión de esta cita. *
                  </span>
                </label>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={!canSubmit || bookMutation.isPending}
                >
                  {bookMutation.isPending
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Calendar className="h-4 w-4" />
                  }
                  {bookMutation.isPending ? "Enviando..." : "Confirmar reserva"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-primary/90 py-5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <h1 className="text-lg text-primary-foreground">
              Este agendamiento no es para emergencias.
              <br />
              Si estás en riesgo o necesitas ayuda inmediata, contacta: 106 (orientación en salud mental) o 123 (emergencias).
              <br />
              Política de privacidad · Marco ético
            </h1>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Agenda;
