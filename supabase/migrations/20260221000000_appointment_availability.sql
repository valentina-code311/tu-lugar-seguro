-- ============================================================
-- Función pública para consultar slots ocupados en una fecha.
-- Usa SECURITY DEFINER para leer la tabla sin exponer datos
-- de clientes al usuario anónimo.
-- Devuelve solo start_time y end_time de citas no canceladas.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_booked_slots(p_date DATE)
RETURNS TABLE(start_time TIME, end_time TIME)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT a.start_time::TIME, a.end_time::TIME
  FROM public.appointments a
  WHERE a.appointment_date = p_date
    AND a.status <> 'cancelled';
$$;

-- Permitir que usuarios anónimos y autenticados ejecuten la función
GRANT EXECUTE ON FUNCTION public.get_booked_slots(DATE) TO anon, authenticated;
