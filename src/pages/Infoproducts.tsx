import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowRight } from "lucide-react";
import { infoproducts, formatPrice } from "@/data/mockData";

const Infoproducts = () => {
  return (
    <Layout>
      <section className="bg-background py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Recursos Digitales</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">Infoproductos</h1>
            <p className="mt-4 text-muted-foreground">
              Material digital profesional para tu crecimiento personal, sexual y emocional.
              Acceso inmediato tras la compra.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {infoproducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all hover:shadow-card"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground">
                    <Download className="h-3 w-3" /> Descarga digital
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold text-foreground">{product.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">Incluye:</p>
                    <ul className="space-y-1.5">
                      {product.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 shrink-0 text-success" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <p className="font-display text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                    <Button className="gap-1">Comprar <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Infoproducts;
