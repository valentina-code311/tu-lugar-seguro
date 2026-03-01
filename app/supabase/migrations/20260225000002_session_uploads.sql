-- session_uploads: imágenes de notas de sesión
CREATE TABLE IF NOT EXISTS public.session_uploads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES public.clinical_sessions(id) ON DELETE CASCADE,
  file_url     TEXT NOT NULL,
  file_name    TEXT,
  ocr_text     TEXT,
  is_processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: solo admins
ALTER TABLE public.session_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "session_uploads_admin_all"
  ON public.session_uploads FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Storage bucket: session-notes (privado, solo admins)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'session-notes',
  'session-notes',
  FALSE,
  52428800,  -- 50 MB
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/heic','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "session_notes_admin_all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'session-notes' AND has_role(auth.uid(), 'admin'));
