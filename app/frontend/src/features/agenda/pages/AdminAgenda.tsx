import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, addWeeks, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAdminAppointmentsByWeek, useAdminBlockedDatesByWeek, type Appointment } from "@/features/agenda/hooks/useAppointments";
import { WeekGrid } from "@/features/agenda/components/WeekGrid";
import { DayList } from "@/features/agenda/components/DayList";
import { AppointmentDetailModal } from "@/features/agenda/components/AppointmentDetailModal";
import { CreateAppointmentModal } from "@/features/agenda/components/CreateAppointmentModal";

const WEEK_START = { weekStartsOn: 1 as const }; // Monday

const AdminAgenda = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), WEEK_START)
  );
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [slotForNew, setSlotForNew] = useState<{ date: string; hour: number } | null>(null);

  const weekFrom = format(currentWeekStart, "yyyy-MM-dd");
  const weekTo = format(addDays(currentWeekStart, 6), "yyyy-MM-dd");

  const { data: appointments = [], isLoading } = useAdminAppointmentsByWeek(weekFrom, weekTo);
  const { data: blockedDates = [] } = useAdminBlockedDatesByWeek(weekFrom, weekTo);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const isCurrentWeek =
    format(startOfWeek(new Date(), WEEK_START), "yyyy-MM-dd") === weekFrom;

  const weekLabel = `${format(currentWeekStart, "d 'de' MMM", { locale: es })} — ${format(addDays(currentWeekStart, 6), "d 'de' MMM yyyy", { locale: es })}`;

  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), WEEK_START));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex shrink-0 flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Agenda</h1>
          <p className="mt-0.5 text-sm text-muted-foreground capitalize">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoy
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentWeekStart((d) => addWeeks(d, -1))}
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentWeekStart((d) => addWeeks(d, 1))}
            aria-label="Semana siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Desktop: week grid */}
      <div className="hidden md:block w-full">
        <WeekGrid
          weekDays={weekDays}
          appointments={appointments}
          blockedDates={blockedDates}
          isLoading={isLoading}
          onAppointmentClick={setSelectedAppt}
          onSlotClick={(date, hour) => setSlotForNew({ date, hour })}
        />
      </div>

      {/* Mobile: day list */}
      <div className="md:hidden flex-1 overflow-y-auto">
        <DayList
          weekDays={weekDays}
          appointments={appointments}
          isLoading={isLoading}
          onAppointmentClick={setSelectedAppt}
          onSlotClick={(date, hour) => setSlotForNew({ date, hour })}
        />
      </div>

      <AppointmentDetailModal
        appointment={selectedAppt}
        onClose={() => setSelectedAppt(null)}
      />
      <CreateAppointmentModal
        slot={slotForNew}
        onClose={() => setSlotForNew(null)}
      />
    </div>
  );
};

export default AdminAgenda;
