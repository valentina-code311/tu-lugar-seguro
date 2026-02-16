import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Download } from "lucide-react";
import { infoproducts, formatPrice } from "@/data/mockData";

const InfoproductsPreview = () => {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Recursos Digitales</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Aprende a tu ritmo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ebooks, cursos y materiales diseñados para que trabajes en tu bienestar
            desde cualquier lugar.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {infoproducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:shadow-card"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground">
                  <Download className="h-3 w-3" />
                  Descarga digital
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{product.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {product.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <p className="font-display text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                  <Button size="sm" className="gap-1">
                    Comprar <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/infoproductos">
              Ver todos los infoproductos <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InfoproductsPreview;
