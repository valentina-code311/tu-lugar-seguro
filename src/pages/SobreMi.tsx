import { Shield, Lock, Heart } from "lucide-react";

const SobreMi = () => (
  <>
    <section className="py-16 md:py-24 bg-card" aria-labelledby="about-title">
      <div className="container max-w-3xl">
        <h1 id="about-title" className="text-4xl md:text-5xl font-bold mb-8">Sobre mí</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Soy <strong className="text-primary">Maryen Chamorro</strong>, psicóloga con enfoque humanista e interseccional feminista. Creo que cada persona merece un espacio donde pueda ser vista, escuchada y acompañada sin juicio.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Mi trabajo se centra en acompañar a jóvenes y personas LGBTIQ+ en procesos de autoestima, límites, regulación emocional y relaciones sanas. Trabajo desde la convicción de que <strong className="text-primary">el feminismo no es contra los hombres, es a favor de relaciones más justas y cuidadosas</strong>.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Atiendo de manera online y presencial en Zona Norte, Cali. Cada proceso es único: juntes construimos un camino a tu ritmo, con herramientas concretas y un acompañamiento genuino.
          </p>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-secondary" aria-labelledby="valores">
      <div className="container max-w-3xl">
        <h2 id="valores" className="text-3xl font-bold text-center mb-12">Mis valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Seguridad", desc: "Un espacio libre de juicio donde puedas explorar tu historia." },
            { icon: Lock, title: "Confidencialidad", desc: "Tu proceso es privado. Respeto absoluto por tu información." },
            { icon: Heart, title: "Inclusión", desc: "Todas las identidades, orientaciones y expresiones son bienvenidas." },
          ].map((v) => (
            <div key={v.title} className="bg-card rounded-xl p-6 border border-border text-center">
              <v.icon className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default SobreMi;
