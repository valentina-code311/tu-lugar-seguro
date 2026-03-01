import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { STATUS_CONFIG, type Appointment } from "@/features/agenda/hooks/useAppointments";

interface Props {
  weekDays: Date[];
  appointments: Appointment[];
  isLoading: boolean;
  onAppointmentClick: (appt: Appointment) => void;
  onSlotClick: (date: string, hour: number) => void;
}

export function DayList({ weekDays, appointments, isLoading, onAppointmentClick, onSlotClick }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {weekDays.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayAppts = appointments
          .filter((a) => a.appointment_date === dayStr)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));
        const today = isToday(day);

        return (
          <div
            key={dayStr}
            className={`rounded-xl border bg-card overflow-hidden ${today ? "border-primary/50" : "border-border"}`}
          >
            {/* Day header */}
            <div
              className={`flex items-center justify-between px-4 py-3 ${today ? "bg-primary/5" : "bg-muted/30"}`}
            >
              <span className={`text-sm font-semibold capitalize ${today ? "text-primary" : "text-foreground"}`}>
                {format(day, "EEEE d 'de' MMMM", { locale: es })}
                {today && <span className="ml-2 text-xs font-normal">(hoy)</span>}
              </span>
              <div className="flex items-center gap-2">
                {dayAppts.length > 0 && (
                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${today ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {dayAppts.length}
                  </span>
                )}
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => onSlotClick(dayStr, 9)}
                  title="Agregar cita o bloqueo"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Appointment rows */}
            {dayAppts.length === 0 ? (
              <p className="px-4 py-2.5 text-xs text-muted-foreground">Sin citas</p>
            ) : (
              <div className="divide-y divide-border">
                {dayAppts.map((appt) => {
                  const cfg = STATUS_CONFIG[appt.status];
                  return (
                    <button
                      key={appt.id}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors min-h-[44px]"
                      onClick={() => onAppointmentClick(appt)}
                    >
                      <span className="font-mono text-sm text-muted-foreground shrink-0 w-11">
                        {appt.start_time.slice(0, 5)}
                      </span>
                      <span className="font-medium text-sm text-foreground truncate flex-1">
                        {appt.client_name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[90px] hidden sm:block">
                        {appt.services?.name}
                      </span>
                      <span className="shrink-0 text-xs font-medium">
                        {appt.modality === "online" ? "🌐" : "📍"}
                      </span>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.badgeClass}`}>
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
