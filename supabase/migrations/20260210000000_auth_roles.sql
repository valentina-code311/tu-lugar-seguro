-- ----------------------------------------
-- App role enum
-- ----------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ----------------------------------------
-- Profiles (one per auth user)
-- ----------------------------------------
CREATE TABLE public.profiles (
  id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT        NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------
-- User roles
-- ----------------------------------------
CREATE TABLE public.user_roles (
  id      UUID     NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (true);

-- ----------------------------------------
-- has_role() helper used by the frontend
-- ----------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;
