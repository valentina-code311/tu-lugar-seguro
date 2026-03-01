import { useRef, useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { Appointment, BlockedDate, AppointmentStatus } from "@/features/agenda/hooks/useAppointments";

const HOUR_HEIGHT = 48; // px per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const STATUS_CARD: Record<AppointmentStatus, { card: string; border: string }> = {
  pending:   { card: "bg-yellow-50 text-yellow-900",  border: "border-l-yellow-400" },
  confirmed: { card: "bg-blue-50 text-blue-900",      border: "border-l-blue-500"   },
  completed: { card: "bg-green-50 text-green-900",    border: "border-l-green-500"  },
  cancelled: { card: "bg-red-50 text-red-800 opacity-60", border: "border-l-red-400" },
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

interface Props {
  weekDays: Date[];
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  isLoading: boolean;
  onAppointmentClick: (appt: Appointment) => void;
  onSlotClick: (date: string, hour: number) => void;
}

export function WeekGrid({
  weekDays,
  appointments,
  blockedDates,
  isLoading,
  onAppointmentClick,
  onSlotClick,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = Math.max(0, (nowMinutes / 60 - 1.5) * HOUR_HEIGHT);
      scrollRef.current.scrollTop = scrollTo;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update current time indicator every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full border border-border rounded-xl overflow-hidden bg-card">
      {/* Day header row */}
      <div className="flex shrink-0 border-b border-border bg-card">
        {/* Spacer for time column */}
        <div className="w-14 shrink-0 border-r border-border/50" />
        {weekDays.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`flex-1 min-w-0 py-2 text-center border-l border-border/50 ${today ? "bg-primary/5" : ""}`}
            >
              <div className={`text-[11px] font-semibold uppercase tracking-wider ${today ? "text-primary" : "text-muted-foreground"}`}>
                {format(day, "EEE", { locale: es })}
              </div>
              <div className={`text-xl font-bold leading-none mt-0.5 ${today ? "h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto" : "text-foreground"}`}>
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="flex" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
            {/* Time labels column */}
            <div className="w-14 shrink-0 relative select-none border-r border-border/50">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute right-2 text-[11px] text-muted-foreground tabular-nums"
                  style={{ top: `${hour * HOUR_HEIGHT - 8}px` }}
                >
                  {hour === 0 ? "" : `${hour.toString().padStart(2, "0")}:00`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const dayAppts = appointments.filter((a) => a.appointment_date === dayStr);
              const dayBlocked = blockedDates.filter((b) => b.blocked_date === dayStr);
              const today = isToday(day);

              return (
                <div
                  key={dayStr}
                  className={`flex-1 min-w-0 relative border-l border-border/50 ${today ? "bg-primary/[0.02]" : ""}`}
                >
                  {/* Hour grid lines + click zones */}
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full border-b border-border/25 cursor-pointer hover:bg-primary/[0.04] transition-colors"
                      style={{ top: `${hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                      onClick={() => onSlotClick(dayStr, hour)}
                    />
                  ))}

                  {/* Blocked slots */}
                  {dayBlocked.map((b) => {
                    const isFullDay = !b.start_time || !b.end_time;
                    const top = isFullDay ? 0 : (timeToMinutes(b.start_time!) / 60) * HOUR_HEIGHT;
                    const height = isFullDay
                      ? 24 * HOUR_HEIGHT
                      : ((timeToMinutes(b.end_time!) - timeToMinutes(b.start_time!)) / 60) * HOUR_HEIGHT;
                    return (
                      <div
                        key={b.id}
                        className="absolute inset-x-0 z-[1] border-l-2 border-muted-foreground/30 bg-muted/50 px-1.5 py-1 overflow-hidden"
                        style={{ top: `${top}px`, height: `${height}px` }}
                        title={b.reason ?? "Bloqueado"}
                      >
                        <p className="text-[11px] text-muted-foreground truncate">{b.reason ?? "Bloqueado"}</p>
                      </div>
                    );
                  })}

                  {/* Current time indicator */}
                  {today && (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none"
                      style={{ top: `${(nowMinutes / 60) * HOUR_HEIGHT}px` }}
                    >
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 -ml-[5px]" />
                        <div className="flex-1 border-t-2 border-red-500" />
                      </div>
                    </div>
                  )}

                  {/* Appointment cards */}
                  {dayAppts.map((appt) => {
                    const startMin = timeToMinutes(appt.start_time);
                    const endMin = timeToMinutes(appt.end_time);
                    const heightPx = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT - 2, 28);
                    const compact = heightPx < 52;
                    const { card, border } = STATUS_CARD[appt.status];

                    return (
                      <div
                        key={appt.id}
                        className={`absolute z-10 rounded border-l-[3px] shadow-sm cursor-pointer overflow-hidden px-1.5 py-1 transition-all hover:brightness-95 hover:shadow-md ${card} ${border}`}
                        style={{
                          top: `${(startMin / 60) * HOUR_HEIGHT + 1}px`,
                          height: `${heightPx}px`,
                          left: "2px",
                          right: "2px",
                        }}
                        onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt); }}
                      >
                        {compact ? (
                          <p className="text-[11px] font-medium truncate leading-none">
                            {appt.start_time.slice(0, 5)} · {appt.client_name}
                          </p>
                        ) : (
                          <>
                            <p className="text-[10px] leading-none opacity-75">
                              {appt.start_time.slice(0, 5)}–{appt.end_time.slice(0, 5)}
                              {" · "}
                              {appt.modality === "online" ? "🌐" : "📍"}
                            </p>
                            <p className="text-xs font-semibold leading-snug truncate mt-0.5">
                              {appt.client_name}
                            </p>
                            {heightPx >= 68 && (
                              <p className="text-[10px] leading-none truncate opacity-75 mt-0.5">
                                {appt.services?.name}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
