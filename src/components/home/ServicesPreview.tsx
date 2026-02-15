import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Sparkles, Video, ArrowRight } from "lucide-react";
import { services } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = { Heart, Users, Sparkles, Video };

const ServicesPreview = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Servicios</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
            ¿Cómo puedo ayudarte?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Cada persona y cada relación es única. Ofrezco diferentes modalidades para 
            acompañarte en tu proceso.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Heart;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all hover:shadow-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <p className="mt-4 font-display text-lg font-bold text-primary">{service.price}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/servicios">
              Ver todos los servicios <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
