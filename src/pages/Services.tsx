import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useServices, formatPrice } from "@/hooks/useServices";
import { resolveIcon } from "@/components/admin/IconPicker";

const Services = () => {
  const { data: services, isLoading } = useServices();

  return (
    <Layout>
      <section className="bg-surface py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Servicios</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">
              Servicios profesionales
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Acompañamiento terapéutico adaptado a tus necesidades, con enfoque integral y sin juicios.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="space-y-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-36 animate-pulse rounded-2xl bg-surface" />
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="space-y-8">
              {services?.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-soft md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex gap-4">
                    {(() => {
                      const Icon = resolveIcon(service.icon);
                      return (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <Icon className="h-7 w-7" />
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
                      <Link to="/agenda">
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
