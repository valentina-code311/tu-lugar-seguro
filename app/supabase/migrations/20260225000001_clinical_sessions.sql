-- clinical_sessions: historias clínicas por sesión
CREATE TABLE IF NOT EXISTS public.clinical_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  session_date     DATE,
  session_time     TIME,
  modality         TEXT CHECK (modality IN ('online', 'presencial')),
  session_number   INTEGER,
  status           TEXT NOT NULL DEFAULT 'draft',

  -- Sección A: Motivo de consulta
  motivo_consulta        JSONB DEFAULT '{}',
  -- { texto_paciente, inicio_evolucion, desencadenantes }

  -- Sección B: Historia del problema
  historia_problema      JSONB DEFAULT '{}',
  -- { sintomas, impacto_score, areas[], estrategias, factores }

  -- Sección C: Tamizajes
  tamizajes              JSONB DEFAULT '{}',
  -- { phq_score, phq_items, otros }

  -- Sección D: Riesgo y seguridad
  riesgo_seguridad       JSONB DEFAULT '{}',
  -- { ideacion, frecuencia, plan, medios, intencion, protectores, acciones[] }

  -- Sección E: Antecedentes
  antecedentes           JSONB DEFAULT '{}',
  -- { salud_mental, salud_medica, sustancias, eventos }

  -- Sección F: Contexto psicosocial
  contexto_psicosocial   JSONB DEFAULT '{}',
  -- { familia, relaciones, factores_contexto, recursos }

  -- Sección G: Observaciones clínicas
  observaciones_clinicas JSONB DEFAULT '{}',
  -- { apariencia, actitud, afecto, lenguaje, pensamiento, orientacion, insight }

  -- Sección H: Formulación clínica
  formulacion_clinica    JSONB DEFAULT '{}',
  -- { patrones, creencias, ciclo, necesidades }

  -- Sección I: Objetivos terapéuticos
  objetivos              TEXT[] DEFAULT '{}',

  -- Sección J: Intervenciones
  intervenciones         JSONB DEFAULT '{}',
  -- { psicoeducacion, regulacion, patrones, limites, otros }

  -- Sección K: Plan
  plan                   JSONB DEFAULT '{}',
  -- { plan_semana, tarea, proxima_fecha, proxima_hora, proxima_foco }

  -- Sección L: Cierre administrativo
  cierre_administrativo  JSONB DEFAULT '{}',
  -- { pago_realizado, pago_metodo, reserva, consentimiento, observaciones }

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER clinical_sessions_updated_at
  BEFORE UPDATE ON public.clinical_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: solo admins
ALTER TABLE public.clinical_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinical_sessions_admin_all"
  ON public.clinical_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'));
