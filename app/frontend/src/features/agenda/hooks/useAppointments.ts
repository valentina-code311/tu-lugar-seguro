import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/shared/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Appointment {
  id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_pronouns: string | null;
  client_email: string;
  client_phone: string | null;
  client_message: string | null;
  modality: "online" | "presencial";
  status: AppointmentStatus;
  admin_notes: string | null;
  consent_accepted: boolean;
  created_at: string;
  updated_at: string;
  services: { name: string; duration_minutes: number; price: number } | null;
}

// ── Public booking ────────────────────────────────────────────────────────────

interface BookAppointmentPayload {
  service_id: string;
  appointment_date: string;   // YYYY-MM-DD
  start_time: string;          // HH:MM:SS
  end_time: string;            // HH:MM:SS
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_message?: string;
  modality: "online" | "presencial";
  consent_accepted: boolean;
}

export interface BookedSlot {
  start_time: string; // HH:MM:SS
  end_time: string;   // HH:MM:SS
}

export function useBookedSlots(date: string | null) {
  return useQuery({
    queryKey: ["booked-slots", date],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_booked_slots", { p_date: date! });
      if (error) throw error;
      return (data ?? []) as BookedSlot[];
    },
    enabled: !!date,
  });
}

export function useBookAppointment() {
  return useMutation({
    mutationFn: async (payload: BookAppointmentPayload) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (err: Error) => toast.error(`Error al reservar: ${err.message}`),
  });
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export function useAdminAppointments(filter: "all" | AppointmentStatus = "all") {
  return useQuery({
    queryKey: ["admin", "appointments", filter],
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select("*, services(name, duration_minutes, price)")
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Appointment[];
    },
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: string } & Partial<{ status: AppointmentStatus; admin_notes: string }>) => {
      const { data, error } = await supabase
        .from("appointments")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*, services(name, duration_minutes, price)")
        .single();
      if (error) throw error;
      return data as Appointment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatTime(timeStr: string) {
  return timeStr.slice(0, 5);
}

export function formatAppointmentDate(dateStr: string) {
  return format(parseISO(dateStr + "T00:00:00"), "EEEE d 'de' MMMM yyyy", { locale: es });
}

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pendiente",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
  confirmed: {
    label: "Confirmada",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  completed: {
    label: "Completada",
    badgeClass:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  cancelled: {
    label: "Cancelada",
    badgeClass:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
};
