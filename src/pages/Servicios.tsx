import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const pricingData = [
  {
    title: "Individual",
    items: [
      { label: "1ª sesión (90 min)", price: "$75.000" },
      { label: "Sesiones siguientes (60 min)", price: "$70.000" },
    ],
  },
  {
    title: "Familiar y pareja diversa",
    subtitle: "(servicio temporal)",
    items: [
      { label: "1ª sesión (90 min)", price: "$85.000" },
      { label: "Sesiones siguientes (60 min)", price: "$75.000" },
    ],
  },
  {
    title: "Adolescentes",
    subtitle: "(excepcional, con consentimiento)",
    items: [
      { label: "1ª sesión", price: "$85.000" },
      { label: "Sesiones siguientes", price: "$75.000" },
    ],
  },
  {
    title: "Talleres bimensuales",
    subtitle: "(presenciales, 90 min, 20 cupos)",
    items: [{ label: "Por taller", price: "$25.000" }],
  },
];

const temas = [
  "Regulación emocional y estado del ánimo",
  "Autoestima, límites y relaciones sanas",
  "Salud mental para personas LGBTIQ+",
];

const Servicios = () => (
  <>
    <section className="py-16 md:py-24 bg-card" aria-labelledby="servicios-title">
      <div className="container max-w-4xl">
        <h1 id="servicios-title" className="text-4xl md:text-5xl font-bold mb-4">Servicios</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Métodos de pago: efectivo, Nequi y transferencia. La reserva se confirma con el 50% anticipado.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingData.map((s) => (
            <article key={s.title} className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1">{s.title}</h2>
              {s.subtitle && <p className="text-sm text-muted-foreground mb-4">{s.subtitle}</p>}
              <ul className="space-y-3">
                {s.items.map((item) => (
                  <li key={item.label} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-primary">{item.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-secondary" aria-labelledby="temas">
      <div className="container max-w-3xl">
        <h2 id="temas" className="text-3xl font-bold text-center mb-8">Temas que trabajo</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {temas.map((t) => (
            <span key={t} className="px-4 py-2 rounded-full border border-accent text-primary text-sm font-medium bg-card">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20 gradient-primary text-center">
      <div className="container">
        <h2 className="text-3xl font-bold mb-4 text-primary-foreground">¿Listx para empezar?</h2>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-card text-primary font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          Agendar por WhatsApp
        </a>
      </div>
    </section>
  </>
);

export default Servicios;
