import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

// ── Public query (only active, ordered) ──────────────────────────────────────

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });
}

// ── Admin query (all services) ────────────────────────────────────────────────

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

type ServicePayload = Omit<Service, "id" | "created_at">;

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ServicePayload) => {
      const { data, error } = await supabase
        .from("services")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("Servicio creado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<ServicePayload> & { id: string }) => {
      const { data, error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("Servicio actualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("Servicio eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}
