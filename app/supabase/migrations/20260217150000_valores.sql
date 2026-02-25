-- ----------------------------------------
-- Valores (shown in /sobre-mi)
-- ----------------------------------------
CREATE TABLE public.valores (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT,
  icon        TEXT        NOT NULL DEFAULT 'Heart',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.valores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active valores" ON public.valores
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage valores" ON public.valores
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed with current hardcoded values
INSERT INTO public.valores (title, description, icon, sort_order) VALUES
  ('Seguridad', 'Un espacio libre de juicio donde puedas explorar tu historia.', 'Award', 1),
  ('Confidencialidad', 'Tu proceso es privado. Respeto absoluto por tu información.', 'BookOpen', 2),
  ('Inclusión', 'Todas las identidades, orientaciones y expresiones son bienvenidas.', 'Heart', 3)
;
