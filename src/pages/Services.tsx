import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Sprout } from "lucide-react";
import { useServices, formatPrice } from "@/hooks/useServices";
import { resolveIcon } from "@/components/admin/IconPicker";

const Services = () => {
  const { data: services, isLoading } = useServices();

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="flex items-center gap-2 justify-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Servicios
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">
              Servicios profesionales
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Acompañamiento terapéutico adaptado a tus necesidades, con enfoque integral y sin juicios.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-5 pb-12">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="space-y-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-36 animate-pulse rounded-2xl bg-background" />
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="grid gap-6 sm:grid-cols-2">
              {services?.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl bg-card/80 p-6 space-y-6 shadow-lg transition-all hover:shadow-card"
                >
                  <div className="flex gap-4">
                    {(() => {
                      const Icon = resolveIcon(service.icon);
                      return (
                        <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background text-primary group-hover:bg-primary group-hover:text-secondary">
                          <Icon className="h-6 w-6" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{service.name}</h2>
                      {service.description && (
                        <p className="mt-2 max-w-lg text-sm text-muted-foreground">{service.description}</p>
                      )}
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display text-2xl font-bold text-primary">{formatPrice(service.price)}</p>
                    <Button asChild className="gap-2">
                      <Link to={`/agenda?servicio=${service.id}`}>
                        <Calendar className="h-4 w-4" />
                        Agendar
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
