import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

type Service = {
  id: string; name: string; short_description: string | null;
  description: string | null; duration_minutes: number; price: number;
  mode: string; image_url: string | null;
};

const temas = [
  "Regulación emocional y estado del ánimo",
  "Autoestima, límites y relaciones sanas",
  "Salud mental para personas LGBTIQ+",
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

const Servicios = () => {
  const { data: services = [] } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  return (
    <>
      <section className="py-16 md:py-24 bg-card" aria-labelledby="servicios-title">
        <div className="container max-w-4xl">
          <h1 id="servicios-title" className="text-4xl md:text-5xl font-bold mb-4">Servicios</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Métodos de pago: efectivo, Nequi y transferencia. La reserva se confirma con el 50% anticipado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <article key={s.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <ImageWithPlaceholder src={s.image_url} alt={s.name} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-1">{s.name}</h2>
                  <span className="text-xs text-muted-foreground capitalize">{s.mode} · {s.duration_minutes} min</span>
                  {s.short_description && <p className="text-muted-foreground mt-2 text-sm">{s.short_description}</p>}
                  <p className="text-lg font-semibold text-primary mt-3">{formatPrice(s.price)}</p>
                </div>
              </article>
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No hay servicios disponibles en este momento.</p>
          )}
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
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-card text-primary font-bold text-lg hover:opacity-90 transition-opacity">
            <MessageCircle className="w-5 h-5" /> Agendar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
};

export default Servicios;
