
-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages FOR INSERT 
  WITH CHECK (true);

-- Allow only authenticated admins to view/manage using has_role()
CREATE POLICY "Admins can view contact messages" 
  ON public.contact_messages FOR SELECT 
  TO authenticated 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages" 
  ON public.contact_messages FOR UPDATE 
  TO authenticated 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages" 
  ON public.contact_messages FOR DELETE 
  TO authenticated 
  USING (has_role(auth.uid(), 'admin'));
