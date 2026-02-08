import { MessageCircle, MapPin, Clock, Users } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const Talleres = () => (
  <>
    <section className="py-16 md:py-24 bg-card" aria-labelledby="talleres-title">
      <div className="container max-w-3xl">
        <h1 id="talleres-title" className="text-4xl md:text-5xl font-bold mb-4">Talleres</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Espacios presenciales de psicoeducación para aprender herramientas concretas que puedas usar en tu día a día.
        </p>

        {/* Próximo taller */}
        <article className="rounded-xl border-2 border-accent bg-secondary p-6 md:p-8 mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Próximo taller</span>
          <h2 className="text-2xl font-bold mt-2 mb-4">Límites sin culpa</h2>
          <div className="space-y-2 mb-6">
            <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 text-accent" /> Zona Norte, Cali (presencial)</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 text-accent" /> 90 minutos</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-accent" /> 20 cupos</p>
            <p className="font-semibold text-primary text-lg">$25.000</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Reservar cupo por WhatsApp
          </a>
        </article>

        {/* Estructura */}
        <div>
          <h2 className="text-2xl font-bold mb-6">¿Cómo son los talleres?</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Psicoeducación breve", desc: "Comprendemos el tema desde la teoría humanista y feminista." },
              { step: "2", title: "Ejercicios prácticos", desc: "Actividades individuales y grupales para conectar con tu experiencia." },
              { step: "3", title: "Plan de 7 días", desc: "Te llevas un plan concreto para practicar en tu vida cotidiana." },
              { step: "4", title: "Recursos", desc: "Material complementario: lecturas, audios y herramientas." },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full gradient-primary text-primary-foreground font-bold text-sm shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  </>
);

export default Talleres;
