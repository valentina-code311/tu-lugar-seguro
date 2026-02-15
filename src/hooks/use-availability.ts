import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, addMinutes, format, isBefore, isEqual, parse } from "date-fns";

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
};

export type TimeSlot = {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
};

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });
}

export function useAvailableSlots(date: Date | undefined, serviceDuration: number) {
  const dateStr = date ? format(date, "yyyy-MM-dd") : null;
  const dayOfWeek = date ? date.getDay() : null;

  return useQuery({
    queryKey: ["available-slots", dateStr, serviceDuration],
    enabled: !!date && serviceDuration > 0,
    queryFn: async () => {
      if (dayOfWeek === null || !dateStr) return [];

      // Get weekly availability for this day
      const { data: availability, error: avErr } = await supabase
        .from("weekly_availability")
        .select("*")
        .eq("day_of_week", dayOfWeek)
        .eq("is_active", true);
      if (avErr) throw avErr;
      if (!availability || availability.length === 0) return [];

      // Check if date is fully blocked
      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("id")
        .eq("blocked_date", dateStr)
        .limit(1);
      if (blocked && blocked.length > 0) return [];

      // Get granular blocked slots for this date
      const dayStart = `${dateStr}T00:00:00`;
      const dayEnd = `${dateStr}T23:59:59`;
      const { data: blockedSlots } = await supabase
        .from("blocked_slots")
        .select("start_at, end_at")
        .gte("start_at", dayStart)
        .lte("start_at", dayEnd);
      const blockedRanges = (blockedSlots || []).map((bs) => ({
        start: bs.start_at.slice(11, 16),
        end: bs.end_at.slice(11, 16),
      }));

      // Get existing appointments for this date (not cancelled)
      const { data: appointments } = await supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("appointment_date", dateStr)
        .neq("status", "cancelled");

      const bookedSlots = (appointments || []).map((a) => ({
        start: a.start_time.slice(0, 5),
        end: a.end_time.slice(0, 5),
      }));

      // Generate slots from availability windows
      const slots: TimeSlot[] = [];
      for (const window of availability) {
        const winStart = parse(window.start_time.slice(0, 5), "HH:mm", new Date());
        const winEnd = parse(window.end_time.slice(0, 5), "HH:mm", new Date());

        let current = winStart;
        while (true) {
          const slotEnd = addMinutes(current, serviceDuration);
          if (isBefore(winEnd, slotEnd) && !isEqual(winEnd, slotEnd)) break;

          const slotStr = format(current, "HH:mm");
          const slotEndStr = format(slotEnd, "HH:mm");

          // Check overlap with booked
          const isBooked = bookedSlots.some((b) => {
            return slotStr < b.end && slotEndStr > b.start;
          });

          // Check overlap with blocked slots
          const isBlocked = blockedRanges.some((b) => {
            return slotStr < b.end && slotEndStr > b.start;
          });

          if (!isBooked && !isBlocked) {
            slots.push({ start: slotStr, end: slotEndStr });
          }

          current = addMinutes(current, 30); // 30min intervals
        }
      }

      return slots;
    },
  });
}

export function useBlockedDates() {
  return useQuery({
    queryKey: ["blocked-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_dates")
        .select("blocked_date");
      if (error) throw error;
      return (data || []).map((d) => new Date(d.blocked_date + "T00:00:00"));
    },
  });
}

export function useWeeklyAvailability() {
  return useQuery({
    queryKey: ["weekly-availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_availability")
        .select("day_of_week")
        .eq("is_active", true);
      if (error) throw error;
      return [...new Set((data || []).map((d) => d.day_of_week))];
    },
  });
}
