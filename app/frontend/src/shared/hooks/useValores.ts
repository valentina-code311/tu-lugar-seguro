import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Valor {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export function useValores() {
  return useQuery({
    queryKey: ["valores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("valores")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Valor[];
    },
  });
}

export function useAdminValores() {
  return useQuery({
    queryKey: ["admin", "valores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("valores")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Valor[];
    },
  });
}

type ValorPayload = Omit<Valor, "id">;

export function useCreateValor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ValorPayload) => {
      const { data, error } = await supabase.from("valores").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["valores"] });
      qc.invalidateQueries({ queryKey: ["admin", "valores"] });
      toast.success("Valor creado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateValor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<ValorPayload> & { id: string }) => {
      const { data, error } = await supabase
        .from("valores").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["valores"] });
      qc.invalidateQueries({ queryKey: ["admin", "valores"] });
      toast.success("Valor actualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteValor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("valores").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["valores"] });
      qc.invalidateQueries({ queryKey: ["admin", "valores"] });
      toast.success("Valor eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
