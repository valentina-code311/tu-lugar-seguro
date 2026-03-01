-- Agregar campos de contenido editable a site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_badge TEXT NOT NULL DEFAULT 'Psicología humanista y feminista',
  ADD COLUMN IF NOT EXISTS hero_title TEXT NOT NULL DEFAULT 'Psicología que sí te cuida.',
  ADD COLUMN IF NOT EXISTS hero_subtitle TEXT NOT NULL DEFAULT 'Acompaño a jóvenes y personas LGBTIQ+ desde un enfoque humanista y feminista para ver, nombrar y cambiar patrones sin compararte.',

  ADD COLUMN IF NOT EXISTS about_title TEXT NOT NULL DEFAULT 'Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real.',
  ADD COLUMN IF NOT EXISTS about_paragraph1 TEXT NOT NULL DEFAULT 'Psicóloga con más de 5 años de experiencia acompañando procesos desde un enfoque humanista, feminista y psicosocial. Trabajo bienestar emocional, autoestima, límites y relaciones, integrando tu historia personal con el contexto social que también moldea lo que sentimos, pensamos y sostenemos.',
  ADD COLUMN IF NOT EXISTS about_paragraph2 TEXT NOT NULL DEFAULT 'Aquí no vengo a juzgarte ni a decirte qué hacer. Construimos un espacio seguro para comprender tus patrones, nombrarlos con claridad y tomar decisiones más conscientes, con herramientas prácticas para la vida diaria.',
  ADD COLUMN IF NOT EXISTS about_tags TEXT[] NOT NULL DEFAULT ARRAY['Psicología Humanista', 'Perspectiva Feminista', 'Talleres Psicoeducativos']::TEXT[],

  ADD COLUMN IF NOT EXISTS about_full_title TEXT NOT NULL DEFAULT 'Soy Maryen Chamorro, hago psicología con criterio, contexto y cambio real',
  ADD COLUMN IF NOT EXISTS about_full_paragraphs TEXT[] NOT NULL DEFAULT ARRAY[
    'Mi misión es sostener un espacio seguro y sin juicio donde puedas comprender lo que te pasa con claridad, y transformar lo que se repite en tu vida sin compararte con el proceso de nadie.',
    'Trabajo desde un enfoque humanista porque creo que tu historia merece ser escuchada completa: lo que sientes, lo que piensas, tu cuerpo, tus vínculos y tus recursos, no me interesa "arreglarte", sino ayudarte a entenderte y recuperar agencia.',
    'Mi mirada es feminista y psicosocial porque el malestar no ocurre en el vacío: mandatos de género, roles, heteronorma, violencia, desigualdad y contextos familiares y culturales influyen en cómo aprendemos a amar, a poner límites, a callar o a sostener cargas, aquí el contexto importa, y se trabaja.',
    'Mi forma de acompañar es práctica y directa, sin perder la calidez, uso un método sencillo para aterrizar el proceso: Ver → Nombrar → Elegir → Practicar.',
    'Primero observamos patrones bien sean emocionales, relacionales o de pensamiento, después los nombramos con honestidad, elegimos que es lo que hay que cambiar y lo practicamos con herramientas concretas para tu día a día, en vez de prometer soluciones rápidas, construimos cambios sostenibles con una comunicación más clara, límites que cuidan, decisiones conscientes y una relación amable contigo mismo.',
    'Si estás buscando terapia donde puedas hablar con libertad, sentirte respetad@ y encontrar dirección —sin moralidad, sin etiquetas innecesarias y sin presión por "estar bien" rápido— este es tu lugar.'
  ]::TEXT[];
