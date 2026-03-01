import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sprout } from "lucide-react";
import Layout from "@/shared/components/layout/Layout";
import { usePublishedEscritos } from "@/features/escritos/hooks/useEscritos";

export default function Escritos() {
  const { data: escritos, isLoading } = usePublishedEscritos();

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Escritos
            </span>
            <div className="mt-6 mx-2 text-muted-foreground">
              <p>
                Textos para pensar, sentir y reconocerte.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background pb-12">
        <div className="container mx-auto">
          {isLoading && (
            <div className="container mx-auto pb-12">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-96 animate-pulse rounded-2xl bg-card/80" />
                ))}
              </div>
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
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card/80 shadow-lg transition-shadow hover:shadow-card"
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
                      <h2 className="font-display line-clamp-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {escrito.title}
                      </h2>
                      {escrito.excerpt && (
                        <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                          {escrito.excerpt}
                        </p>
                      )}
                      <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:border-b-2 group-hover:border-primary w-fit">
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
