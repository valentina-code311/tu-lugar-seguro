import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, MapPin, Clock, Users } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Workshop = {
  id: string; title: string; short_description: string | null;
  content: string | null; start_at: string | null; end_at: string | null;
  price_cop: number | null; capacity: number | null; image_url: string | null;
};

const Talleres = () => {
  const { data: workshops = [] } = useQuery({
    queryKey: ["public-workshops"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workshops").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data as Workshop[];
    },
  });

  return (
    <>
      <section className="py-16 md:py-24 bg-card" aria-labelledby="talleres-title">
        <div className="container max-w-3xl">
          <h1 id="talleres-title" className="text-4xl md:text-5xl font-bold mb-4">Talleres</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Espacios presenciales de psicoeducación para aprender herramientas concretas que puedas usar en tu día a día.
          </p>

          {workshops.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No hay talleres programados en este momento. ¡Vuelve pronto!</p>
          )}

          <div className="space-y-8">
            {workshops.map((w) => (
              <article key={w.id} className="rounded-xl border-2 border-accent bg-secondary overflow-hidden">
                <ImageWithPlaceholder src={w.image_url} alt={w.title} className="w-full h-48 object-cover" />
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-3">{w.title}</h2>
                  {w.short_description && <p className="text-muted-foreground mb-4">{w.short_description}</p>}
                  <div className="space-y-2 mb-6">
                    {w.start_at && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-accent" />
                        {format(new Date(w.start_at), "d 'de' MMMM, yyyy · HH:mm", { locale: es })}
                      </p>
                    )}
                    {w.capacity && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-accent" /> {w.capacity} cupos
                      </p>
                    )}
                    {w.price_cop != null && (
                      <p className="font-semibold text-primary text-lg">
                        ${w.price_cop.toLocaleString("es-CO")}
                      </p>
                    )}
                  </div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity">
                    <MessageCircle className="w-5 h-5" /> Reservar cupo por WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Info section */}
          <div className="mt-12">
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
};

export default Talleres;
