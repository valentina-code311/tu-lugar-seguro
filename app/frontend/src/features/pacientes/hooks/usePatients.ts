import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/shared/integrations/supabase/client";

export interface Patient {
  id: string;
  full_name: string;
  document_id: string | null;
  age: number | null;
  phone: string | null;
  email: string | null;
  preferred_name: string | null;
  pronouns: string | null;
  occupation: string | null;
  education: string | null;
  city: string | null;
  referral_source: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type PatientPayload = Omit<Patient, "id" | "created_at" | "updated_at">;

// ── Queries ────────────────────────────────────────────────────────────────────

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("is_active", true)
        .order("full_name", { ascending: true });
      if (error) throw error;
      return data as Patient[];
    },
  });
}

export function useAllPatients() {
  return useQuery({
    queryKey: ["admin", "patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("full_name", { ascending: true });
      if (error) throw error;
      return data as Patient[];
    },
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ["patient", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Patient;
    },
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PatientPayload> & { full_name: string }) => {
      const { data, error } = await supabase
        .from("patients")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["admin", "patients"] });
      toast.success("Paciente creado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<PatientPayload> & { id: string }) => {
      const { data, error } = await supabase
        .from("patients")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["admin", "patients"] });
      qc.invalidateQueries({ queryKey: ["patient", data.id] });
      toast.success("Paciente actualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["admin", "patients"] });
      toast.success("Paciente eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
