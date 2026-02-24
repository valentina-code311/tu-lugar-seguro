import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  email: string;
  phone: string;
  location: string;
  whatsapp_url: string;
  location_map_url: string | null;
}

const SETTINGS_DEFAULTS: SiteSettings = {
  email: "hola@psicosexvalendm.com",
  phone: "+57 300 123 4567",
  location: "Consulta presencial y online",
  whatsapp_url: "https://wa.me/573208621614",
  location_map_url: null,
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) return SETTINGS_DEFAULTS;
      return data as SiteSettings;
    },
    placeholderData: SETTINGS_DEFAULTS,
  });
}

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SiteSettings>) => {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ id: true, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Datos de contacto actualizados");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as SocialLink[];
    },
  });
}

type SocialLinkPayload = Omit<SocialLink, "id">;

export function useCreateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SocialLinkPayload) => {
      const { data, error } = await supabase
        .from("social_links")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social_links"] });
      toast.success("Red social creada");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<SocialLinkPayload> & { id: string }) => {
      const { data, error } = await supabase
        .from("social_links")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social_links"] });
      toast.success("Red social actualizada");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social_links"] });
      toast.success("Red social eliminada");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
