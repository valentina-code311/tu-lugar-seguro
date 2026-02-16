export const socialLinks = [
  { id: "1", name: "Instagram", icon: "Instagram", url: "https://www.instagram.com/psico.maryen/", active: true },
  { id: "2", name: "Facebook", icon: "Facebook", url: "https://www.facebook.com/profile.php?id=100083516142386", active: true },
  { id: "3", name: "YouTube", icon: "Youtube", url: "https://www.youtube.com/@psico.maryenchamorro/", active: true },
  { id: "4", name: "WhatsApp", icon: "MessageCircle", url: "https://wa.me/573208621614", active: true },
  // { id: "5", name: "TikTok", icon: "Music2", url: "https://tiktok.com/@psicosexvalendm", active: true },
  // { id: "6", name: "Twitter", icon: "Twitter", url: "https://twitter.com/psicosexvalendm", active: true },
];

export const services = [
  {
    id: "1",
    title: "Terapia Individual",
    description: "Sesiones personalizadas para trabajar autoestima, ansiedad, gestión emocional y crecimiento personal.",
    icon: "Heart",
    price: "120.000 COP",
  },
  {
    id: "2",
    title: "Terapia de Pareja",
    description: "Fortalece la comunicación, la intimidad y resuelve conflictos con herramientas terapéuticas efectivas.",
    icon: "Users",
    price: "180.000 COP",
  },
  {
    id: "3",
    title: "Sexología Clínica",
    description: "Abordaje profesional de disfunciones sexuales, educación sexual y bienestar íntimo sin tabúes.",
    icon: "Sparkles",
    price: "150.000 COP",
  },
  {
    id: "4",
    title: "Asesoría Online",
    description: "Consultas virtuales desde la comodidad de tu hogar. Misma calidad, mayor accesibilidad.",
    icon: "Video",
    price: "100.000 COP",
  },
];

export const productCategories = [
  { id: "1", name: "Juguetes", slug: "juguetes" },
  { id: "2", name: "Lubricantes", slug: "lubricantes" },
  { id: "3", name: "Higiene íntima", slug: "higiene" },
  { id: "4", name: "Bienestar", slug: "bienestar" },
  { id: "5", name: "Accesorios", slug: "accesorios" },
];

export const products = [
  {
    id: "1", name: "Vibrador Clásico Silicona", category: "juguetes", price: 89000,
    description: "Vibrador ergonómico de silicona médica hipoalergénica, 10 modos de vibración. Recargable USB.", stock: 15,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
  },
  {
    id: "2", name: "Lubricante Base Agua Premium", category: "lubricantes", price: 45000,
    description: "Lubricante íntimo a base de agua, pH balanceado, sin parabenos. Compatible con preservativos y juguetes.", stock: 30,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80",
  },
  {
    id: "3", name: "Gel Limpiador de Juguetes", category: "higiene", price: 28000,
    description: "Spray antibacterial especial para limpieza e higiene de juguetes íntimos. Fórmula suave y efectiva.", stock: 25,
    image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=400&q=80",
  },
  {
    id: "4", name: "Aceite de Masaje Sensual", category: "bienestar", price: 52000,
    description: "Aceite con esencia de ylang-ylang y jazmín. Textura sedosa, ideal para masajes en pareja.", stock: 20,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
  },
  {
    id: "5", name: "Succionador de Clítoris", category: "juguetes", price: 135000,
    description: "Tecnología de succión por ondas de aire. Silicona suave, resistente al agua. 8 niveles de intensidad.", stock: 10,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80",
  },
  {
    id: "6", name: "Velas de Masaje Comestibles", category: "accesorios", price: 38000,
    description: "Vela con cera de baja temperatura que se convierte en aceite de masaje. Aroma a vainilla y canela.", stock: 18,
    image: "https://images.unsplash.com/photo-1602607753498-5005d0e4068f?w=400&q=80",
  },
  {
    id: "7", name: "Kit Lubricantes Sabores", category: "lubricantes", price: 65000,
    description: "Set de 3 lubricantes con sabor: fresa, menta y chocolate. Base agua, seguros para sexo oral.", stock: 12,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
  },
  {
    id: "8", name: "Bolas Chinas Ejercitadoras", category: "bienestar", price: 72000,
    description: "Set progresivo de bolas de Kegel en 3 pesos. Fortalece el suelo pélvico. Silicona premium.", stock: 14,
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=400&q=80",
  },
];

export const infoproducts = [
  {
    id: "1",
    title: "Guía: Reconecta con tu Placer",
    description: "Ebook de 85 páginas con ejercicios prácticos para reconectar con tu sexualidad, superar bloqueos emocionales y descubrir qué te da placer.",
    price: 35000,
    includes: ["85 páginas en PDF", "12 ejercicios prácticos", "Meditaciones guiadas (audio)", "Workbook descargable"],
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
  },
  {
    id: "2",
    title: "Curso: Comunicación en Pareja",
    description: "Minicurso en video con herramientas para mejorar la comunicación emocional y sexual con tu pareja.",
    price: 89000,
    includes: ["6 módulos en video", "Guía de ejercicios", "Plantillas de conversación", "Acceso de por vida"],
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
  },
  {
    id: "3",
    title: "Kit: Autoexploración Sexual",
    description: "Material digital completo para un viaje de autoconocimiento íntimo. Incluye diario, guías y audios.",
    price: 55000,
    includes: ["Diario de autoexploración (PDF)", "Guía anatómica ilustrada", "5 audios de relajación", "Checklist de bienestar"],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
  },
];

export const testimonials = [
  {
    id: "1", name: "Carolina M.", text: "Valeria me ayudó a reconectar conmigo misma. Su enfoque es cálido, profesional y libre de juicios. ¡Totalmente recomendada!",
    rating: 5,
  },
  {
    id: "2", name: "Andrés y Laura", text: "Las sesiones de pareja transformaron nuestra relación. Aprendimos a comunicarnos de verdad sobre lo que sentimos y necesitamos.",
    rating: 5,
  },
  {
    id: "3", name: "Sofía R.", text: "El ebook 'Reconecta con tu Placer' cambió mi perspectiva. Los ejercicios son prácticos y el enfoque es respetuoso y empoderador.",
    rating: 5,
  },
];

export const faqs = [
  {
    question: "¿Las sesiones son confidenciales?",
    answer: "Absolutamente. Todo lo compartido en consulta es estrictamente confidencial, respetando el código ético profesional y la ley de protección de datos.",
  },
  {
    question: "¿Qué diferencia hay entre psicología y sexología?",
    answer: "La psicología aborda la salud mental en general (ansiedad, autoestima, relaciones). La sexología se especializa en la salud sexual: disfunciones, educación, placer y bienestar íntimo. En mi práctica integro ambas.",
  },
  {
    question: "¿Los productos son discretos en el envío?",
    answer: "Sí. Todos los pedidos se envían en empaque neutro, sin logos ni descripciones del contenido. Tu privacidad es nuestra prioridad.",
  },
  {
    question: "¿Cómo accedo a los infoproductos después de comprarlos?",
    answer: "Inmediatamente después del pago recibirás acceso en tu portal 'Mis Infoproductos', donde podrás ver y descargar todo el contenido adquirido.",
  },
  {
    question: "¿Puedo agendar una cita si estoy fuera de Colombia?",
    answer: "¡Claro! Ofrezco asesorías online para cualquier parte del mundo. Solo necesitas conexión a internet y un espacio privado.",
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);
};
