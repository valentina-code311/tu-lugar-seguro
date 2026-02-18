import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";
import { useServices, formatPrice } from "@/hooks/useServices";
import { resolveIcon } from "@/components/admin/IconPicker";

const ServicesPreview = () => {
  const { data: services, isLoading } = useServices();

  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="flex items-center gap-2 justify-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
            <Sprout className="h-5 w-5" />
            Servicios
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Formas de acompañamiento
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Diferentes espacios para avanzar con claridad, contexto y herramientas.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 animate-pulse rounded-2xl bg-surface" />
            ))}

          {!isLoading &&
            services?.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-card/80 p-6 shadow-lg transition-all hover:shadow-card"
              >
                {(() => {
                  const Icon = resolveIcon(service.icon);
                  return (
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-secondary">
                      <Icon className="h-6 w-6" />
                    </div>
                  );
                })()}
                <h3 className="font-display text-lg font-semibold text-foreground">{service.name}</h3>
                {service.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                )}
                <p className="mt-4 font-display text-lg font-bold text-primary">{formatPrice(service.price)}</p>
              </motion.div>
            ))}
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
