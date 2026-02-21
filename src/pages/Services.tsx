import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Sprout, ChevronRight } from "lucide-react";
import { useServices, formatPrice } from "@/hooks/useServices";
import { resolveIcon } from "@/components/admin/IconPicker";

const Services = () => {
  const { data: services, isLoading } = useServices();

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Servicios
            </span>
            <div className="mt-6 mx-2 grid gap-4 text-muted-foreground text-justify">
              <p>
                Acompañamiento terapéutico adaptado a tus necesidades, con enfoque integral y sin juicios.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-36 animate-pulse rounded-2xl bg-card/80" />
              ))}
            </div>
          )}

          {!isLoading && (
            services?.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col rounded-2xl bg-card/80 p-6 shadow-lg transition-all hover:shadow-card"
              >
                {(() => {
                  const Icon = resolveIcon(service.icon);
                  return (
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration_minutes} min
                      </p>
                    </div>
                  );
                })()}

                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{service.name}</h3>
                  {service.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="font-display text-xl font-bold text-primary">
                    {formatPrice(service.price)}
                  </p>
                  <Button asChild className="group">
                    <Link to={`/agenda?servicio=${service.id}`}>
                      <Calendar className="h-4 w-4" />
                      <ChevronRight className="hidden group-hover:block group-hover:animate-slide-left" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
