import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/shared/integrations/supabase/client";

export interface Taller {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;   // "YYYY-MM-DD"
  event_time: string;   // "HH:MM:SS"
  location: string | null;
  image_url: string | null;
  purpose: string | null;
  experience: string | null;
  price: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inscripcion {
  id: string;
  taller_id: string;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

export interface TallerWithInscripciones extends Taller {
  taller_inscripciones: Inscripcion[];
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function tallerDateTime(taller: Taller): Date {
  return new Date(`${taller.event_date}T${taller.event_time}`);
}

export function isFutureTaller(taller: Taller): boolean {
  return tallerDateTime(taller) > new Date();
}

/** Registration closes 5 hours before the event */
export function isRegistrationOpen(taller: Taller): boolean {
  const cutoff = new Date(tallerDateTime(taller).getTime() - 5 * 60 * 60 * 1000);
  return new Date() < cutoff;
}

// ── Public queries ────────────────────────────────────────────────────────────

export function usePublishedTalleres() {
  return useQuery({
    queryKey: ["talleres", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talleres")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true })
        .order("event_time", { ascending: true });
      if (error) throw error;
      return data as Taller[];
    },
  });
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export function useAdminTalleres() {
  return useQuery({
    queryKey: ["admin", "talleres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talleres")
        .select("*, taller_inscripciones(count)")
        .order("event_date", { ascending: false })
        .order("event_time", { ascending: false });
      if (error) throw error;
      return data as (Taller & { taller_inscripciones: [{ count: number }] })[];
    },
  });
}

export function useAdminTaller(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "talleres", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talleres")
        .select("*, taller_inscripciones(*)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as TallerWithInscripciones;
    },
    enabled: !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export type TallerPayload = Omit<Taller, "id" | "created_at" | "updated_at">;

export function useSaveTaller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<TallerPayload> & { id?: string }) => {
      if (id) {
        const { data, error } = await supabase
          .from("talleres")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as Taller;
      } else {
        const { data, error } = await supabase
          .from("talleres")
          .insert(payload as TallerPayload)
          .select()
          .single();
        if (error) throw error;
        return data as Taller;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talleres"] });
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] });
      toast.success("Taller guardado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteTaller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("talleres").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talleres"] });
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] });
      toast.success("Taller eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useInscripcionesByTaller(tallerId: string | null) {
  return useQuery({
    queryKey: ["admin", "talleres", tallerId, "inscripciones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("taller_inscripciones")
        .select("*")
        .eq("taller_id", tallerId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Inscripcion[];
    },
    enabled: !!tallerId,
  });
}

export function useInscribirse() {
  return useMutation({
    mutationFn: async (payload: Omit<Inscripcion, "id" | "created_at">) => {
      const { error } = await supabase.from("taller_inscripciones").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => toast.success("¡Inscripción exitosa! Te esperamos."),
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadTallerImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("talleres").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("talleres").getPublicUrl(path).data.publicUrl;
}
