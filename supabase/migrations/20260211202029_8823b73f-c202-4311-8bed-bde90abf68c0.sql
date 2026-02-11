
-- Services offered
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Weekly recurring availability (e.g. Monday 8:00-12:00)
CREATE TABLE public.weekly_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  CHECK (end_time > start_time)
);

ALTER TABLE public.weekly_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability" ON public.weekly_availability FOR SELECT USING (true);
CREATE POLICY "Admin can manage availability" ON public.weekly_availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blocked dates (vacations, holidays)
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admin can manage blocked dates" ON public.blocked_dates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Appointment status enum
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  client_name TEXT NOT NULL,
  client_pronouns TEXT,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_message TEXT,
  modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial')),
  status public.appointment_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  consent_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
-- Public can insert (book) appointments
CREATE POLICY "Anyone can book appointments" ON public.appointments FOR INSERT WITH CHECK (true);
-- Only admin can view/update/delete
CREATE POLICY "Admin can view appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default services
INSERT INTO public.services (name, description, duration_minutes, price, sort_order) VALUES
  ('Sesión individual (primera)', 'Primera sesión de evaluación y orientación', 90, 75000, 1),
  ('Sesión individual (seguimiento)', 'Sesión de seguimiento', 60, 70000, 2),
  ('Sesión familiar/pareja diversa (primera)', 'Primera sesión familiar o de pareja', 90, 85000, 3),
  ('Sesión familiar/pareja diversa (seguimiento)', 'Sesión familiar o de pareja de seguimiento', 60, 75000, 4);

-- Seed default weekly availability (Mon-Fri 8-12, 13:30-19, Sat 8-11)
INSERT INTO public.weekly_availability (day_of_week, start_time, end_time) VALUES
  (1, '08:00', '12:00'), (1, '13:30', '19:00'),
  (2, '08:00', '12:00'), (2, '13:30', '19:00'),
  (3, '08:00', '12:00'), (3, '13:30', '19:00'),
  (4, '08:00', '12:00'), (4, '13:30', '19:00'),
  (5, '08:00', '12:00'), (5, '13:30', '19:00'),
  (6, '08:00', '11:00');
