import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageCircle, Clock, CheckCircle, AlertTriangle, CalendarIcon, ArrowRight, Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { WHATSAPP_URL, WHATSAPP_NUMBER, EMAIL } from "@/lib/constants";
import { useServices, useAvailableSlots, useBlockedDates, useWeeklyAvailability } from "@/hooks/use-availability";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { TimeSlot } from "@/hooks/use-availability";

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    pronombres: "",
    correo: "",
    telefono: "",
    mensaje: "",
    modalidad: "online",
    consentimiento: false,
  });

  const { data: services = [] } = useServices();
  const selectedSvc = services.find((s) => s.id === selectedService);
  const duration = selectedSvc?.duration_minutes || 60;

  const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(selectedDate, duration);
  const { data: blockedDates = [] } = useBlockedDates();
  const { data: availableDays = [] } = useWeeklyAvailability();

  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().toDateString())) return true;
    if (!availableDays.includes(date.getDay())) return true;
    if (blockedDates.some((d) => d.toDateString() === date.toDateString())) return true;
    return false;
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !selectedService) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        service_id: selectedService,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        client_name: form.nombre.trim(),
        client_pronouns: form.pronombres.trim() || null,
        client_email: form.correo.trim(),
        client_phone: form.telefono.trim() || null,
        client_message: form.mensaje.trim() || null,
        modality: form.modalidad,
        consent_accepted: form.consentimiento,
      });

      if (error) throw error;
      setStep("success");
      toast({ title: "¡Reserva enviada!", description: "Recibirás confirmación pronto." });
    } catch {
      toast({ title: "Error al reservar", description: "Inténtalo de nuevo o escríbenos por WhatsApp.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const svcName = selectedSvc?.name || "";
    const dateStr = selectedDate ? format(selectedDate, "EEEE d 'de' MMMM", { locale: es }) : "";
    const timeStr = selectedSlot ? `${selectedSlot.start} – ${selectedSlot.end}` : "";
    const msg = `Hola Maryen, me gustaría agendar una sesión.\n\nServicio: ${svcName}\nFecha: ${dateStr}\nHorario: ${timeStr}\nNombre: ${form.nombre}\nPronombres: ${form.pronombres}\nModalidad: ${form.modalidad}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const resetAll = () => {
    setStep("select");
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setSelectedService("");
    setForm({ nombre: "", pronombres: "", correo: "", telefono: "", mensaje: "", modalidad: "online", consentimiento: false });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  return (
    <>
      <section className="py-16 md:py-24 bg-card" aria-labelledby="agenda-title">
        <div className="container max-w-4xl">
          <h1 id="agenda-title" className="text-4xl md:text-5xl font-bold mb-4">
            Agenda tu sesión
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl">
            Elige el servicio, fecha y horario que prefieras. También puedes escribirme directamente por WhatsApp.
          </p>

          {/* Success state */}
          {step === "success" && (
            <div className="rounded-xl border border-accent bg-accent/10 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Solicitud recibida!</h2>
              <p className="text-muted-foreground mb-2">
                Tu solicitud de sesión de <strong>{selectedSvc?.name}</strong> para el{" "}
                <strong>{selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</strong> a las{" "}
                <strong>{selectedSlot?.start}</strong> ha sido registrada.
              </p>
              <p className="text-muted-foreground mb-6">
                Confirmaré tu cita por correo o WhatsApp en las próximas 24h hábiles. Recuerda que la reserva se confirma con el 50% de anticipo.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={resetAll} className="px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                  Agendar otra sesión
                </button>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-4 h-4" /> Confirmar por WhatsApp
                </a>
              </div>
            </div>
          )}

          {step !== "success" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column: Service + Calendar + Slots */}
              <div className="space-y-6">
                {/* Step 1: Service */}
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                    Tipo de sesión
                  </h2>
                  <div className="space-y-2">
                    {services.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => {
                          setSelectedService(svc.id);
                          setSelectedSlot(null);
                          setStep("select");
                        }}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedService === svc.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-accent"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{svc.name}</p>
                            <p className="text-xs text-muted-foreground">{svc.duration_minutes} min</p>
                          </div>
                          <span className="text-sm font-bold text-primary">{formatPrice(svc.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Calendar */}
                {selectedService && (
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                      Fecha
                    </h2>
                    <div className="rounded-xl border border-border bg-card p-2 inline-block">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                          setSelectedDate(d);
                          setSelectedSlot(null);
                          setStep("select");
                        }}
                        disabled={isDateDisabled}
                        locale={es}
                        className="pointer-events-auto"
                        fromDate={new Date()}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Time slots */}
                {selectedDate && selectedService && (
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                      Horario disponible
                    </h2>
                    {slotsLoading ? (
                      <p className="text-sm text-muted-foreground">Cargando horarios…</p>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay horarios disponibles este día. Intenta otro día o escríbeme por WhatsApp.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.start}
                            onClick={() => handleSlotSelect(slot)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedSlot?.start === slot.start
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-accent hover:bg-accent/5"
                            }`}
                          >
                            {slot.start}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right column: Booking form or info */}
              <div>
                {step === "form" && selectedSlot && selectedSvc ? (
                  <div className="rounded-xl border border-border bg-secondary/50 p-6">
                    {/* Summary */}
                    <div className="rounded-lg bg-card border border-border p-4 mb-6">
                      <h3 className="font-semibold text-sm mb-2">Resumen</h3>
                      <p className="text-sm text-muted-foreground">
                        <strong>{selectedSvc.name}</strong><br />
                        {selectedDate && format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}<br />
                        {selectedSlot.start} – {selectedSlot.end} ({selectedSvc.duration_minutes} min)<br />
                        <strong>{formatPrice(selectedSvc.price)}</strong>
                      </p>
                    </div>

                    <h2 className="font-bold mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                      Tus datos
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre *</label>
                        <input id="nombre" type="text" required maxLength={100} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="pronombres" className="block text-sm font-medium mb-1">Pronombres</label>
                        <input id="pronombres" type="text" maxLength={50} placeholder="elle, ella, él" className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm" value={form.pronombres} onChange={(e) => setForm({ ...form, pronombres: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="correo" className="block text-sm font-medium mb-1">Correo electrónico *</label>
                        <input id="correo" type="email" required maxLength={255} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium mb-1">Teléfono / WhatsApp</label>
                        <input id="telefono" type="tel" maxLength={20} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="mensaje" className="block text-sm font-medium mb-1">Breve motivo de consulta</label>
                        <textarea id="mensaje" rows={2} maxLength={500} className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm resize-none" value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor="modalidad" className="block text-sm font-medium mb-1">Modalidad</label>
                        <select id="modalidad" className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm" value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}>
                          <option value="online">Online</option>
                          <option value="presencial">Presencial (Zona Norte, Cali)</option>
                        </select>
                      </div>
                      <div className="flex items-start gap-2">
                        <input id="consentimiento" type="checkbox" required checked={form.consentimiento} onChange={(e) => setForm({ ...form, consentimiento: e.target.checked })} className="mt-1 accent-cta" />
                        <label htmlFor="consentimiento" className="text-xs text-muted-foreground">
                          Acepto que mis datos sean utilizados para gestionar mi cita. Puedo ejercer mis derechos escribiendo a {EMAIL}.
                        </label>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                          {submitting ? "Enviando…" : "Confirmar reserva"}
                        </button>
                        <button type="button" onClick={handleWhatsApp} className="w-full py-3 rounded-lg border-2 border-cta text-cta font-semibold hover:bg-cta/10 transition-colors inline-flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4" /> Prefiero agendar por WhatsApp
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Info card */}
                    <div className="rounded-xl border border-border bg-secondary/50 p-6">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        Horarios de atención
                      </h2>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Lunes a viernes: 8:00 – 12:00 / 13:30 – 19:00</li>
                        <li>Sábados: 8:00 – 11:00</li>
                        <li className="text-xs">No se atiende domingos ni festivos.</li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border bg-secondary/50 p-6">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-accent" />
                        Reserva y cancelación
                      </h2>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>Reserva con el 50% anticipado (efectivo, Nequi o transferencia).</li>
                        <li><strong>Online:</strong> cancelar con ≥1 hora. <strong>Presencial:</strong> ≥3 horas.</li>
                        <li>Dentro de ventana: devolución parcial 40% o reprogramación.</li>
                        <li>Si la profesional cancela: reprogramación prioritaria o devolución total.</li>
                      </ul>
                    </div>

                    {/* WhatsApp direct */}
                    <div className="rounded-xl border border-accent bg-accent/5 p-6 text-center">
                      <h2 className="font-bold mb-2">¿Prefieres escribirme?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Si es tu primera vez o prefieres orientación, escríbeme directamente.
                      </p>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Escribir por WhatsApp
                      </a>
                      <p className="text-xs text-muted-foreground mt-3">Respondo en 24–48h hábiles.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-secondary border-t border-border">
        <div className="container max-w-4xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este agendamiento no es para emergencias. Si estás en riesgo o necesitas ayuda inmediata, contacta:{" "}
              <strong>106</strong> (orientación en salud mental) o <strong>123</strong> (emergencias).{" "}
              <Link to="/privacidad" className="underline hover:text-primary">Política de privacidad</Link> ·{" "}
              <Link to="/etica" className="underline hover:text-primary">Marco ético</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Agenda;
