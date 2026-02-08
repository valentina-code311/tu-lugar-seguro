export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
}

export const BLOG_CATEGORIES = [
  "Todas",
  "Patrones & comparación",
  "Límites sin culpa",
  "Relaciones",
  "LGBTIQ+ cuidados",
  "Reflexiones largas",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "compararte-no-es-motivacion",
    title: "Compararte no es motivación: cómo dejar de medirte con les demás",
    excerpt: "Exploramos por qué la comparación constante nos aleja de nuestro propio proceso y cómo empezar a ver tu camino como único.",
    category: "Patrones & comparación",
    date: "2026-01-15",
    readTime: "8 min",
    content: `## ¿Por qué nos comparamos?

La comparación es un mecanismo aprendido. Desde la infancia nos enseñan a medirnos: las notas, los logros, las apariencias. Pero lo que nadie nos dice es que **compararte constantemente te desconecta de tu propia experiencia**.

> "No necesitas ser como alguien más para merecer cuidado."

### El costo emocional

Cuando vives comparándote, tu autoestima depende de factores externos. Eso genera:

- Ansiedad ante logros ajenos
- Sensación de nunca ser suficiente
- Dificultad para celebrar tus propios avances

### ¿Qué puedes hacer?

1. **Ver**: Identifica cuándo estás comparándote. Sin juicio, solo observa.
2. **Nombrar**: Ponle palabras a lo que sientes. "Siento envidia" es válido.
3. **Elegir**: Decide conscientemente qué hacer con esa información.
4. **Practicar**: Cada día, intenta reconocer un avance propio, por pequeño que sea.

---

*Si sientes que la comparación te está afectando y quieres explorar esto en un espacio seguro, estoy aquí para acompañarte.*`,
  },
  {
    slug: "poner-limites-sin-culpa",
    title: "Poner límites no te hace mala persona",
    excerpt: "Una reflexión sobre por qué nos cuesta tanto decir 'no' y cómo empezar a hacerlo desde el cuidado propio.",
    category: "Límites sin culpa",
    date: "2026-01-28",
    readTime: "6 min",
    content: `## El mito de la disponibilidad permanente

Nos han enseñado que ser buena persona significa estar siempre disponible. Pero **la disponibilidad sin límites es agotamiento disfrazado de amor**.

> "Poner un límite no es un acto de egoísmo, es un acto de honestidad."

### ¿Por qué cuesta tanto?

- Miedo al rechazo
- Culpa aprendida
- Confundir amor con sacrificio

### Primeros pasos

1. Identifica qué te drena energía
2. Practica frases cortas: "No puedo en este momento"
3. Recuerda: un límite protege la relación, no la destruye

---

*¿Te cuesta poner límites en tus relaciones? Podemos trabajarlo juntes.*`,
  },
  {
    slug: "salud-mental-lgbtiq",
    title: "Salud mental LGBTIQ+: lo que no nos dicen",
    excerpt: "Hablar de salud mental en comunidades diversas requiere entender el contexto, las violencias y las fortalezas que nos atraviesan.",
    category: "LGBTIQ+ cuidados",
    date: "2026-02-05",
    readTime: "10 min",
    content: `## Más allá del diagnóstico

La salud mental de personas LGBTIQ+ no puede entenderse sin considerar el contexto: **la discriminación, el rechazo familiar y la violencia sistémica son factores que impactan directamente nuestro bienestar**.

> "Tu malestar no es un defecto personal. Es una respuesta a un mundo que muchas veces no está diseñado para ti."

### Lo que necesitamos

- Espacios terapéuticos donde no tengamos que explicar nuestra identidad desde cero
- Profesionales que entiendan las violencias específicas que vivimos
- Herramientas que partan de nuestras fortalezas, no solo de nuestras heridas

### Cuidado comunitario

El cuidado también es colectivo. Las redes de apoyo, los espacios seguros y la visibilidad son formas de resistencia y sanación.

---

*Si buscas un espacio donde tu identidad sea respetada desde el primer momento, escríbeme.*`,
  },
];
