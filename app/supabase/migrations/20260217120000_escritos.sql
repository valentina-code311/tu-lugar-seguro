
-- Storage bucket for escrito images
INSERT INTO storage.buckets (id, name, public)
VALUES ('escritos', 'escritos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view escrito images" ON storage.objects
  FOR SELECT USING (bucket_id = 'escritos');

CREATE POLICY "Authenticated users can upload escrito images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'escritos');

CREATE POLICY "Authenticated users can update escrito images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'escritos');

CREATE POLICY "Authenticated users can delete escrito images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'escritos');

-- ----------------------------------------
-- Escritos (long-form reflective articles)
-- ----------------------------------------
CREATE TABLE public.escritos (
  id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL DEFAULT '',
  slug        TEXT        UNIQUE NOT NULL DEFAULT '',
  cover_image TEXT,
  excerpt     TEXT,
  status      TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.escritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published escritos" ON public.escritos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can view all escritos" ON public.escritos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage escritos" ON public.escritos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger to update updated_at automatically
CREATE TRIGGER update_escritos_updated_at
  BEFORE UPDATE ON public.escritos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------
-- Escrito blocks (paragraph-by-paragraph content)
-- ----------------------------------------
CREATE TABLE public.escrito_blocks (
  id          UUID    NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escrito_id  UUID    NOT NULL REFERENCES public.escritos(id) ON DELETE CASCADE,
  type        TEXT    NOT NULL CHECK (type IN ('paragraph', 'heading', 'quote', 'image')),
  content     TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.escrito_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blocks of published escritos" ON public.escrito_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.escritos e
      WHERE e.id = escrito_id AND e.status = 'published'
    )
  );

CREATE POLICY "Admin can view all escrito blocks" ON public.escrito_blocks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage escrito blocks" ON public.escrito_blocks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Index for fast block retrieval ordered by position
CREATE INDEX escrito_blocks_escrito_id_sort ON public.escrito_blocks (escrito_id, sort_order);
