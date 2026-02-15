import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, productCategories, formatPrice } from "@/data/mockData";
import { Search, ShoppingBag } from "lucide-react";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <section className="bg-surface py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">El Clóset de la Sexóloga</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">Tienda</h1>
            <p className="mt-4 text-muted-foreground">Productos seleccionados para tu bienestar íntimo. Envío discreto.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-cream text-accent-foreground hover:bg-muted"
                }`}
              >
                Todos
              </button>
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-cream text-accent-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Products grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                    <Button size="sm" className="gap-1">
                      <ShoppingBag className="h-3 w-3" /> Agregar
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron productos con esos criterios.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
