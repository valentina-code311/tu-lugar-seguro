-- site_settings: fila única con datos de contacto
CREATE TABLE IF NOT EXISTS public.site_settings (
  id      BOOLEAN PRIMARY KEY DEFAULT TRUE,
  email   TEXT NOT NULL,
  phone   TEXT NOT NULL,
  location TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  location_map_url TEXT DEFAULT NULL,
  CONSTRAINT single_row CHECK (id = TRUE)
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT USING (TRUE);

CREATE POLICY "site_settings_admin_update"
  ON public.site_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "site_settings_admin_insert"
  ON public.site_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));


-- social_links: múltiples filas
CREATE TABLE IF NOT EXISTS public.social_links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  icon       TEXT NOT NULL,
  url        TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0
);

-- RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_links_public_read"
  ON public.social_links FOR SELECT USING (TRUE);

CREATE POLICY "social_links_admin_all"
  ON public.social_links FOR ALL
  USING (has_role(auth.uid(), 'admin'));
