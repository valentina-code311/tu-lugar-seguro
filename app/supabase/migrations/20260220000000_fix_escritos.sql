-- ============================================================
-- Fix 1: Ampliar el CHECK de type en escrito_blocks
--   para incluir los nuevos tipos de bloque agregados.
-- ============================================================

ALTER TABLE public.escrito_blocks
  DROP CONSTRAINT IF EXISTS escrito_blocks_type_check;

ALTER TABLE public.escrito_blocks
  ADD CONSTRAINT escrito_blocks_type_check
    CHECK (type IN ('paragraph', 'heading', 'quote', 'image', 'separator', 'video', 'table'));


-- ============================================================
-- Fix 2: Trigger que gestiona published_at automáticamente.
--   - Al publicar por primera vez: pone NOW()
--   - Al re-guardar un escrito ya publicado: conserva la fecha
--   - Al pasar a borrador: limpia la fecha
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_escrito_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Nueva publicación directa
    IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
      NEW.published_at = NOW();
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'published' THEN
      -- Solo asignar fecha si recién se está publicando (antes era borrador o sin fecha)
      IF OLD.published_at IS NULL OR OLD.status <> 'published' THEN
        NEW.published_at = NOW();
      END IF;
      -- Si ya estaba publicado, published_at se conserva tal cual
    ELSIF NEW.status = 'draft' THEN
      NEW.published_at = NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_escritos_published_at
  BEFORE INSERT OR UPDATE ON public.escritos
  FOR EACH ROW EXECUTE FUNCTION public.set_escrito_published_at();
