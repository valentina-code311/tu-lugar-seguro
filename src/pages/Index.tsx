import { Link } from "react-router-dom";
import { Heart, Users, Calendar, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import metodo from "@/assets/metodo-4-pasos.png";

const services = [
  {
    icon: Heart,
    title: "Individual",
    desc: "Acompaño tu proceso personal desde un espacio seguro, sin juicios ni comparaciones.",
    detail: "1ª sesión 90 min · Siguientes 60 min",
  },
  {
    icon: Users,
    title: "Familiar y pareja diversa",
    desc: "Trabajo con familias y parejas diversas para construir relaciones más justas y cuidadosas.",
    detail: "1ª sesión 90 min · Siguientes 60 min",
  },
  {
    icon: Calendar,
    title: "Talleres bimensuales",
    desc: "Espacios presenciales de psicoeducación, ejercicios y herramientas prácticas.",
    detail: "90 min · 20 cupos · Presencial en Cali",
  },
];

const testimonials = [
  {
    text: "Por primera vez sentí que mi terapeuta realmente entendía lo que es ser yo, sin intentar cambiarme.",
    author: "Persona anónima, 24 años",
  },
  {
    text: "Maryen me ayudó a poner límites sin sentir culpa. Eso cambió mis relaciones por completo.",
    author: "Persona anónima, 28 años",
  },
  {
    text: "Un espacio donde puedo hablar de mi identidad sin tener que explicar todo desde cero.",
    author: "Persona anónima, 22 años",
  },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40" />
        </div>
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent mb-4 animate-fade-in">Psicología humanista y feminista</p>
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Psicología que sí te cuida.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-in text-balance" style={{ animationDelay: "0.2s" }}>
              Acompaño a jóvenes y personas LGBTIQ+ desde un enfoque humanista y feminista para ver, nombrar y cambiar patrones sin compararte.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity text-base"
              >
                <Calendar className="w-5 h-5" />
                Agendar sesión
              </Link>
              <Link
                to="/servicios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
              >
                Ver servicios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Método */}
      <section className="py-16 md:py-24 bg-card" aria-labelledby="metodo-title">
        <div className="container text-center">
          <h2 id="metodo-title" className="text-3xl md:text-4xl font-bold mb-4">
            Método Cabeza <span className="text-accent">♥</span> Corazón
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Ver, Nombrar, Elegir, Practicar — cuatro pasos para reconectar contigo.
          </p>
          <img
            src={metodo}
            alt="Método de 4 pasos: Ver, Nombrar, Elegir, Practicar"
            className="max-w-2xl w-full mx-auto rounded-xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* Para quién */}
      <section className="py-16 md:py-24 bg-secondary" aria-labelledby="para-quien">
        <div className="container text-center max-w-3xl">
          <h2 id="para-quien" className="text-3xl md:text-4xl font-bold mb-6">
            Para quién trabajo
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Atiendo a <strong className="text-primary">jóvenes y personas LGBTIQ+</strong> que buscan un espacio seguro para explorar su identidad, sus relaciones y su bienestar emocional. Ofrezco sesiones <strong className="text-primary">online y presenciales</strong> en Zona Norte, Cali.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 md:py-24 bg-card" aria-labelledby="servicios-home">
        <div className="container">
          <h2 id="servicios-home" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <article key={s.title} className="rounded-xl border border-border bg-card p-6 md:p-8 hover:shadow-lg transition-shadow">
                <s.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                <p className="text-sm font-medium text-accent">{s.detail}</p>
              </article>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/servicios" className="inline-flex items-center gap-2 text-cta font-semibold hover:underline">
              Ver todos los servicios y precios <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 md:py-24 bg-secondary" aria-labelledby="testimonios">
        <div className="container">
          <h2 id="testimonios" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Testimonios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="rounded-xl bg-card p-6 md:p-8 border border-border">
                <p className="text-foreground leading-relaxed italic mb-4">"{t.text}"</p>
                <cite className="text-sm text-muted-foreground not-italic">— {t.author}</cite>
              </blockquote>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Testimonios compartidos con consentimiento. Nombres omitidos por privacidad.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 md:py-24 gradient-primary text-center" aria-labelledby="cta-final">
        <div className="container max-w-2xl">
          <h2 id="cta-final" className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Tu historia merece un lugar seguro.
          </h2>
          <p className="text-lg opacity-90 mb-8 text-primary-foreground">
            Cuidarte también es político. Da el primer paso hoy.
          </p>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-card text-primary font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-5 h-5" />
            Agendar sesión
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
