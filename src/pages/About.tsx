import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { useValores } from "@/hooks/useValores";
import { resolveIcon } from "@/components/admin/IconPicker";

const About = () => {
  const { data: valores, isLoading: loadingValores } = useValores();

  return (
    <Layout>
      <section className="bg-surface py-10 lg:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Sobre mí
            </span>
            <h2 className="mt-6 font-display text-center text-3xl font-semibold text-primary md:text-4xl">
              Soy{" "}
              <span className="italic text-primary/70 underline">Maryen Chamorro</span>,
              hago psicología con criterio, contexto y cambio real
            </h2>

            <div className="mt-6 mx-2 grid gap-4 text-muted-foreground text-justify">
              <p>
                Mi misión es sostener un espacio seguro y sin juicio donde puedas comprender lo que te pasa con claridad,
                y transformar lo que se repite en tu vida sin compararte con el proceso de nadie.
              </p>
              <p>
                Trabajo desde un enfoque humanista porque creo que tu historia merece ser escuchada completa: lo que sientes,
                lo que piensas, tu cuerpo, tus vínculos y tus recursos, no me interesa “arreglarte”, sino ayudarte a entenderte y recuperar agencia.
              </p>
              <p>
                Mi mirada es feminista  y psicosocial porque el malestar no ocurre en el vacío: mandatos de género, roles,
                heteronorma, violencia, desigualdad y contextos familiares y culturales influyen en cómo aprendemos a amar,
                a poner límites, a callar o a sostener cargas, aquí el contexto importa, y se trabaja.
              </p>
              <p>
                Mi forma de acompañar es práctica y directa, sin perder la calidez, uso un método sencillo para aterrizar el proceso:
                Ver → Nombrar → Elegir → Practicar. 
              </p>
              <p>
                Primero observamos patrones bien sean emocionales, relacionales o de pensamiento, después los nombramos con honestidad,
                elegimos que es lo que hay que cambiar y lo practicamos con herramientas concretas para tu día a día,
                en vez de prometer soluciones rápidas, construimos cambios sostenibles con una comunicación más clara,
                límites que cuidan, decisiones conscientes y una relación amable contigo mismo.
              </p>
              <p>
                Si estás buscando terapia donde puedas hablar con libertad, sentirte respetad@ y encontrar dirección —sin moralidad,
                sin etiquetas innecesarias y sin presión por “estar bien” rápido— este es tu lugar.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-5">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Mis Valores</h2>

          {loadingValores && (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface" />
              ))}
            </div>
          )}

          {!loadingValores && (
            <div className="grid gap-6 md:grid-cols-2">
              {valores?.map((v, i) => {
                const Icon = resolveIcon(v.icon);
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
                      {v.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary/90 py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground lg:text-3xl">
            "La sexualidad es parte fundamental de nuestra salud integral. Hablemos de ella con naturalidad."
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/70">— Maryen Chamorro</p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
