import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/mockData";

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Testimonios</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Lo que dicen mis pacientes
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-muted-foreground">"{t.text}"</p>
              <p className="mt-4 text-sm font-semibold text-foreground">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
