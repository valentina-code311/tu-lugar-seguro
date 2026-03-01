-- site_settings: fila única con datos de contacto y contenido editable
CREATE TABLE IF NOT EXISTS public.site_settings (
  id      BOOLEAN PRIMARY KEY DEFAULT TRUE,
  email   TEXT NOT NULL,
  phone   TEXT NOT NULL,
  location TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  location_map_url TEXT DEFAULT NULL,

  -- Hero section
  hero_badge    TEXT NOT NULL DEFAULT 'Psicología humanista y feminista',
  hero_title    TEXT NOT NULL DEFAULT 'Psicología que sí te cuida.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Acompaño a jóvenes y personas LGBTIQ+ desde un enfoque humanista y feminista para ver, nombrar y cambiar patrones sin compararte.',

  -- About preview (home page)
  about_title      TEXT NOT NULL DEFAULT 'Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real.',
  about_paragraph1 TEXT NOT NULL DEFAULT 'Psicóloga con más de 5 años de experiencia acompañando procesos desde un enfoque humanista, feminista y psicosocial. Trabajo bienestar emocional, autoestima, límites y relaciones, integrando tu historia personal con el contexto social que también moldea lo que sentimos, pensamos y sostenemos.',
  about_paragraph2 TEXT NOT NULL DEFAULT 'Aquí no vengo a juzgarte ni a decirte qué hacer. Construimos un espacio seguro para comprender tus patrones, nombrarlos con claridad y tomar decisiones más conscientes, con herramientas prácticas para la vida diaria.',
  about_tags       TEXT[] NOT NULL DEFAULT ARRAY['Psicología Humanista', 'Perspectiva Feminista', 'Talleres Psicoeducativos']::TEXT[],

  -- About full page
  about_full_title      TEXT NOT NULL DEFAULT 'Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real',
  about_full_paragraphs TEXT[] NOT NULL DEFAULT ARRAY[
    'Mi misión es sostener un espacio seguro y sin juicio donde puedas comprender lo que te pasa con claridad, y transformar lo que se repite en tu vida sin compararte con el proceso de nadie.',
    'Trabajo desde un enfoque humanista porque creo que tu historia merece ser escuchada completa: lo que sientes, lo que piensas, tu cuerpo, tus vínculos y tus recursos, no me interesa "arreglarte", sino ayudarte a entenderte y recuperar agencia.',
    'Mi mirada es feminista y psicosocial porque el malestar no ocurre en el vacío: mandatos de género, roles, heteronorma, violencia, desigualdad y contextos familiares y culturales influyen en cómo aprendemos a amar, a poner límites, a callar o a sostener cargas, aquí el contexto importa, y se trabaja.',
    'Mi forma de acompañar es práctica y directa, sin perder la calidez, uso un método sencillo para aterrizar el proceso: Ver → Nombrar → Elegir → Practicar.',
    'Primero observamos patrones bien sean emocionales, relacionales o de pensamiento, después los nombramos con honestidad, elegimos que es lo que hay que cambiar y lo practicamos con herramientas concretas para tu día a día, en vez de prometer soluciones rápidas, construimos cambios sostenibles con una comunicación más clara, límites que cuidan, decisiones conscientes y una relación amable contigo mismo.',
    'Si estás buscando terapia donde puedas hablar con libertad, sentirte respetad@ y encontrar dirección —sin moralidad, sin etiquetas innecesarias y sin presión por "estar bien" rápido— este es tu lugar.'
  ]::TEXT[],

  CONSTRAINT single_row CHECK (id = TRUE)
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT USING (TRUE);

CREATE POLICY "site_settings_admin_update"
  ON public.site_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "site_settings_admin_insert"
  ON public.site_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));


-- social_links: múltiples filas
CREATE TABLE IF NOT EXISTS public.social_links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  icon       TEXT NOT NULL,
  url        TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0
);

-- RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_links_public_read"
  ON public.social_links FOR SELECT USING (TRUE);

CREATE POLICY "social_links_admin_all"
  ON public.social_links FOR ALL
  USING (has_role(auth.uid(), 'admin'));
