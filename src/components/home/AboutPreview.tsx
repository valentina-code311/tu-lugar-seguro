import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Sprout } from 'lucide-react'

const AboutPreview = () => {
  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Sobre mí
            </span>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              Soy{" "}
              <span className="italic text-primary/70 underline">Maryen Chamorro</span>,
              hago psicología con criterio, contexto y cambio real.
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Psicóloga con más de 5 años de experiencia acompañando procesos desde un enfoque humanista, feminista y psicosocial.
                Trabajo bienestar emocional, autoestima, límites y relaciones, integrando tu historia personal con el contexto social
                que también moldea lo que sentimos, pensamos y sostenemos.
              </p>
              <p>
                Aquí no vengo a juzgarte ni a decirte qué hacer. Construimos un espacio seguro para comprender tus patrones,
                nombrarlos con claridad y tomar decisiones más conscientes, con herramientas prácticas para la vida diaria.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Psicología Humanista", "Perspectiva Feminista", "Talleres Psicoeducativos"].map((tag) => (
                <span key={tag} className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/sobre-mi">
                Conoce más sobre mí <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-primary shadow-card">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center p-4 lg:p-6 h-full w-full">
                  <img
                    src="https://raw.githubusercontent.com/valentina-code311/tu-lugar-seguro/refs/heads/main/docs/photo.jpg"
                    alt="Maryen"
                    className="mx-auto h-full w-full rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-elevated">
              <p className="font-display text-2xl font-bold">+5</p>
              <p className="text-xs">Años de experiencia</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
