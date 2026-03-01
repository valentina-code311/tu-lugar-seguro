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
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_paragraph1: string;
  about_paragraph2: string;
  about_tags: string[];
  about_full_title: string;
  about_full_paragraphs: string[];
}

const SETTINGS_DEFAULTS: SiteSettings = {
  email: "hola@psicosexvalendm.com",
  phone: "+57 300 123 4567",
  location: "Consulta presencial y online",
  whatsapp_url: "https://wa.me/573208621614",
  location_map_url: null,
  hero_badge: "Psicología humanista y feminista",
  hero_title: "Psicología que sí te cuida.",
  hero_subtitle: "Acompaño a jóvenes y personas LGBTIQ+ desde un enfoque humanista y feminista para ver, nombrar y cambiar patrones sin compararte.",
  about_title: "Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real.",
  about_paragraph1: "Psicóloga con más de 5 años de experiencia acompañando procesos desde un enfoque humanista, feminista y psicosocial. Trabajo bienestar emocional, autoestima, límites y relaciones, integrando tu historia personal con el contexto social que también moldea lo que sentimos, pensamos y sostenemos.",
  about_paragraph2: "Aquí no vengo a juzgarte ni a decirte qué hacer. Construimos un espacio seguro para comprender tus patrones, nombrarlos con claridad y tomar decisiones más conscientes, con herramientas prácticas para la vida diaria.",
  about_tags: ["Psicología Humanista", "Perspectiva Feminista", "Talleres Psicoeducativos"],
  about_full_title: "Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real",
  about_full_paragraphs: [
    "Mi misión es sostener un espacio seguro y sin juicio donde puedas comprender lo que te pasa con claridad, y transformar lo que se repite en tu vida sin compararte con el proceso de nadie.",
    "Trabajo desde un enfoque humanista porque creo que tu historia merece ser escuchada completa: lo que sientes, lo que piensas, tu cuerpo, tus vínculos y tus recursos, no me interesa \"arreglarte\", sino ayudarte a entenderte y recuperar agencia.",
    "Mi mirada es feminista y psicosocial porque el malestar no ocurre en el vacío: mandatos de género, roles, heteronorma, violencia, desigualdad y contextos familiares y culturales influyen en cómo aprendemos a amar, a poner límites, a callar o a sostener cargas, aquí el contexto importa, y se trabaja.",
    "Mi forma de acompañar es práctica y directa, sin perder la calidez, uso un método sencillo para aterrizar el proceso: Ver → Nombrar → Elegir → Practicar.",
    "Primero observamos patrones bien sean emocionales, relacionales o de pensamiento, después los nombramos con honestidad, elegimos que es lo que hay que cambiar y lo practicamos con herramientas concretas para tu día a día, en vez de prometer soluciones rápidas, construimos cambios sostenibles con una comunicación más clara, límites que cuidan, decisiones conscientes y una relación amable contigo mismo.",
    "Si estás buscando terapia donde puedas hablar con libertad, sentirte respetad@ y encontrar dirección —sin moralidad, sin etiquetas innecesarias y sin presión por \"estar bien\" rápido— este es tu lugar.",
  ],
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
        .upsert({ id: true, ...SETTINGS_DEFAULTS, ...payload })
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
