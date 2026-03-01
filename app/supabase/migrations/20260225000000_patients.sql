-- patients: registro de pacientes psicológicos
CREATE TABLE IF NOT EXISTS public.patients (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT NOT NULL,
  document_id      TEXT,
  age              INTEGER,
  phone            TEXT,
  email            TEXT,
  preferred_name   TEXT,
  pronouns         TEXT,
  occupation       TEXT,
  education        TEXT,
  city             TEXT,
  referral_source  TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at (reuses update_updated_at_column from auth_roles migration)
CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: solo admins
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patients_admin_all"
  ON public.patients FOR ALL
  USING (has_role(auth.uid(), 'admin'));
