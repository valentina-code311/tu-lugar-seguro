import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ClinicalSession {
  id: string;
  patient_id: string;
  session_date: string | null;
  session_time: string | null;
  modality: "online" | "presencial" | null;
  session_number: number | null;
  status: string;
  motivo_consulta: Record<string, unknown> | null;
  historia_problema: Record<string, unknown> | null;
  tamizajes: Record<string, unknown> | null;
  riesgo_seguridad: Record<string, unknown> | null;
  antecedentes: Record<string, unknown> | null;
  contexto_psicosocial: Record<string, unknown> | null;
  observaciones_clinicas: Record<string, unknown> | null;
  formulacion_clinica: Record<string, unknown> | null;
  objetivos: string[] | null;
  intervenciones: Record<string, unknown> | null;
  plan: Record<string, unknown> | null;
  cierre_administrativo: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SessionUpload {
  id: string;
  session_id: string;
  file_url: string;
  file_name: string | null;
  ocr_text: string | null;
  is_processed: boolean;
  created_at: string;
}

export type SessionPayload = Omit<ClinicalSession, "id" | "created_at" | "updated_at">;

// ── Session Queries ────────────────────────────────────────────────────────────

export function usePatientSessions(patientId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinical_sessions")
        .select("*")
        .eq("patient_id", patientId!)
        .order("session_date", { ascending: false });
      if (error) throw error;
      return data as ClinicalSession[];
    },
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: ["session", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinical_sessions")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as ClinicalSession;
    },
  });
}

// ── Session Mutations ──────────────────────────────────────────────────────────

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SessionPayload> & { patient_id: string }) => {
      const { data, error } = await supabase
        .from("clinical_sessions")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as ClinicalSession;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sessions", data.patient_id] });
      toast.success("Sesión creada");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<SessionPayload> & { id: string }) => {
      const { data, error } = await supabase
        .from("clinical_sessions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ClinicalSession;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["sessions", data.patient_id] });
      qc.invalidateQueries({ queryKey: ["session", data.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Upload Queries ─────────────────────────────────────────────────────────────

export function useSessionUploads(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["uploads", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_uploads")
        .select("*")
        .eq("session_id", sessionId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as SessionUpload[];
    },
  });
}

// ── Upload Mutation ────────────────────────────────────────────────────────────

export function useUploadSessionFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, file }: { sessionId: string; file: File }) => {
      const ext = file.name.split(".").pop();
      const path = `${sessionId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("session-notes")
        .upload(path, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("session-notes")
        .getPublicUrl(path);

      const fileUrl = urlData.publicUrl;

      const { data, error } = await supabase
        .from("session_uploads")
        .insert({
          session_id: sessionId,
          file_url: fileUrl,
          file_name: file.name,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SessionUpload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["uploads", data.session_id] });
      toast.success("Archivo subido");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sessionId }: { id: string; sessionId: string }) => {
      const { error } = await supabase
        .from("session_uploads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return sessionId;
    },
    onSuccess: (sessionId) => {
      qc.invalidateQueries({ queryKey: ["uploads", sessionId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
