-- Storage bucket for taller images
INSERT INTO storage.buckets (id, name, public)
VALUES ('talleres', 'talleres', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view taller images" ON storage.objects
  FOR SELECT USING (bucket_id = 'talleres');

CREATE POLICY "Authenticated users can upload taller images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'talleres');

CREATE POLICY "Authenticated users can update taller images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'talleres');

CREATE POLICY "Authenticated users can delete taller images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'talleres');

-- ----------------------------------------
-- Talleres
-- ----------------------------------------
CREATE TABLE public.talleres (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL DEFAULT '',
  topic        TEXT,
  event_date   DATE        NOT NULL,
  event_time   TIME        NOT NULL,
  location     TEXT,
  image_url    TEXT,
  purpose      TEXT,
  experience   TEXT,
  price        INTEGER      NOT NULL DEFAULT 0,  -- 0 = gratuito
  is_published BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.talleres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published talleres" ON public.talleres
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage talleres" ON public.talleres
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_talleres_updated_at
  BEFORE UPDATE ON public.talleres
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------
-- Inscripciones a talleres
-- ----------------------------------------
CREATE TABLE public.taller_inscripciones (
  id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  taller_id  UUID        NOT NULL REFERENCES public.talleres(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  whatsapp   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.taller_inscripciones ENABLE ROW LEVEL SECURITY;

-- Anyone can register
CREATE POLICY "Anyone can register to a taller" ON public.taller_inscripciones
  FOR INSERT WITH CHECK (true);

-- Only admin can view registrations
CREATE POLICY "Admin can view inscripciones" ON public.taller_inscripciones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can delete inscripciones" ON public.taller_inscripciones
  FOR DELETE TO authenticated USING (true);

CREATE INDEX taller_inscripciones_taller_id ON public.taller_inscripciones (taller_id);
