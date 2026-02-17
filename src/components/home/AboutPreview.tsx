import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutPreview = () => {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">Sobre mí</span>
            <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Soy Maryen, y creo en una sexualidad{" "}
              <span className="text-gradient-primary italic">libre y consciente</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Psicóloga clínica y sexóloga con más de 5 años de experiencia acompañando
                a personas y parejas en su camino hacia el bienestar emocional y sexual.
              </p>
              <p>
                Mi enfoque integra terapia cognitivo-conductual, sexología clínica y educación
                sexual basada en evidencia. Creo que hablar de sexualidad con naturalidad es
                el primer paso para vivir relaciones más plenas y auténticas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Psicología Clínica", "Sexología", "Terapia de Pareja", "Educación Sexual"].map((tag) => (
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
                <div className="text-center">
                  <img
                    src="https://raw.githubusercontent.com/valentina-code311/tu-lugar-seguro/refs/heads/main/docs/photo.jpg"
                    alt="Maryen"
                    className="mx-auto mb-4 h-full w-full"
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
