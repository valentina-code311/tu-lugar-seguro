import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { services } from "@/data/mockData";

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const Agenda = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const monthName = today.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return (
    <Layout>
      <section className="bg-surface py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Agenda</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">Reserva tu cita</h1>
            <p className="mt-4 text-muted-foreground">Selecciona el servicio, fecha y hora que mejor se adapte a ti.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            {/* Calendar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold capitalize text-foreground">{monthName}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysOfWeek.map((d) => (
                  <div key={d} className="py-2 text-xs font-medium text-muted-foreground">{d}</div>
                ))}
                {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = day < today.getDate();
                  const isWeekend = new Date(today.getFullYear(), today.getMonth(), day).getDay() % 6 === 0;
                  return (
                    <button
                      key={day}
                      disabled={isPast || isWeekend}
                      onClick={() => setSelectedDate(day)}
                      className={`rounded-lg py-2 text-sm transition-colors ${
                        selectedDate === day
                          ? "bg-primary text-primary-foreground"
                          : isPast || isWeekend
                          ? "text-muted-foreground/40"
                          : "text-foreground hover:bg-cream"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold text-foreground">Horarios disponibles:</h4>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          selectedTime === time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-6 font-display text-lg font-semibold text-foreground">Datos de la reserva</h3>
              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Servicio</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} — {s.price}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
                    <Input placeholder="Tu nombre completo" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                    <Input type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
                  <Input placeholder="+57 300 123 4567" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Notas (opcional)</label>
                  <Textarea placeholder="¿Algo que quieras comentarme antes de la sesión?" rows={3} />
                </div>

                {selectedDate && selectedTime && (
                  <div className="rounded-xl bg-cream p-4">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Resumen:</span> {selectedDate} de {monthName} a las {selectedTime}
                    </p>
                  </div>
                )}

                <Button type="button" className="w-full gap-2" size="lg" disabled={!selectedDate || !selectedTime || !selectedService}>
                  <Calendar className="h-4 w-4" /> Confirmar reserva
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Agenda;
