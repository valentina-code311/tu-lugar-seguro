import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { products, formatPrice } from "@/data/mockData";

const ProductsPreview = () => {
  const featured = products.slice(0, 4);

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">El Clóset de la Sexóloga</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Productos para tu bienestar íntimo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Selección curada de productos seguros, de calidad y recomendados por profesionales. 
            Envío discreto garantizado.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:shadow-card"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-accent-foreground">{product.category}</span>
                <h3 className="mt-2 font-display text-sm font-semibold text-foreground">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-display text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                  <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-primary hover:text-primary-foreground">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="gap-2">
            <Link to="/tienda">
              Ver toda la tienda <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
