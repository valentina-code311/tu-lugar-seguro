import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { usePublishedEscritos } from "@/hooks/useEscritos";

export default function Escritos() {
  const { data: escritos, isLoading } = usePublishedEscritos();

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              Reflexiones
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">
              Escritos
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Reflexiones sobre sexualidad, vínculos y bienestar emocional. Textos para pensar,
              sentir y reconocerte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background pb-24">
        <div className="container mx-auto">
          {isLoading && (
            <div className="flex justify-center py-20 text-muted-foreground">
              Cargando escritos...
            </div>
          )}

          {!isLoading && (!escritos || escritos.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-foreground">Próximamente</p>
              <p className="mt-1 text-muted-foreground">
                Los primeros escritos están en camino.
              </p>
            </div>
          )}

          {!isLoading && escritos && escritos.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {escritos.map((escrito, i) => (
                <motion.article
                  key={escrito.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={`/escritos/${escrito.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-shadow hover:shadow-card"
                  >
                    {/* Cover image */}
                    {escrito.cover_image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={escrito.cover_image}
                          alt={escrito.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-primary/10">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                      </div>
                    )}

                    {/* Text */}
                    <div className="flex flex-1 flex-col p-5">
                      {escrito.published_at && (
                        <time className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                          {format(new Date(escrito.published_at), "d MMMM yyyy", { locale: es })}
                        </time>
                      )}
                      <h2 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {escrito.title}
                      </h2>
                      {escrito.excerpt && (
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {escrito.excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Leer escrito
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
