import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Shield } from "lucide-react";

const About = () => {
  const credentials = [
    { icon: Award, title: "Psicóloga Clínica", desc: "Universidad certificada con especialización en psicología clínica y salud mental." },
    { icon: BookOpen, title: "Sexóloga Clínica", desc: "Formación avanzada en sexología clínica, terapia sexual y educación sexual integral." },
    { icon: Heart, title: "Terapia de Pareja", desc: "Especialista en terapia relacional, comunicación y resolución de conflictos de pareja." },
    { icon: Shield, title: "Enfoque Integral", desc: "Combinación de terapia cognitivo-conductual, mindfulness y sexología basada en evidencia." },
  ];

  return (
    <Layout>
      <section className="bg-surface py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Sobre mí</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">
              Hola, soy <span className="text-gradient-primary">Valeria</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Psicóloga clínica y sexóloga con más de 8 años de experiencia. Mi misión es crear 
              espacios seguros donde puedas hablar sin filtros sobre tu salud mental, tu sexualidad 
              y tus relaciones.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Mi formación y enfoque</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {credentials.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-accent-foreground">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground lg:text-3xl">
            "La sexualidad es parte fundamental de nuestra salud integral. Hablemos de ella con naturalidad."
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/70">— Valeria, Psicosexvalendm</p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
