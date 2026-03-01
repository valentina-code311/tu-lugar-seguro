import Layout from "@/shared/components/layout/Layout";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { useValores } from "@/shared/hooks/useValores";
import { resolveIcon } from "@/shared/components/IconPicker";
import { useSiteSettings } from "@/shared/hooks/useSiteSettings";
import { toHtml } from "@/shared/components/RichTextEditor";

const About = () => {
  const { data: valores, isLoading: loadingValores } = useValores();
  const { data: settings, isLoading: loadingSettings } = useSiteSettings();

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Sobre mí
            </span>
            {loadingSettings ? (
              <div className="mt-6 flex justify-center">
                <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
              </div>
            ) : (
              <h2
                className="mt-6 font-display text-center text-3xl font-semibold text-primary md:text-4xl [&_u]:underline-offset-4 [&_u]:decoration-2"
                dangerouslySetInnerHTML={{ __html: toHtml(settings?.about_full_title ?? "") }}
              />
            )}

            {loadingSettings ? (
              <div className="mt-6 mx-2 space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${85 + (n % 3) * 5}%` }} />
                ))}
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${80 + (n % 4) * 5}%` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 mx-2 grid gap-4 text-muted-foreground text-justify">
                {settings?.about_full_paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    dangerouslySetInnerHTML={{ __html: toHtml(p) }}
                    className="[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-5 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold text-foreground">
            <Sprout className="h-7 w-7" />
            Mis Valores
          </h2>

          {loadingValores && (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-24 animate-pulse rounded-2xl bg-background" />
              ))}
            </div>
          )}

          {!loadingValores && (
            <div className="grid gap-6 sm:grid-cols-3">
              {valores?.map((v, i) => {
                const Icon = resolveIcon(v.icon);
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl bg-card/80 p-6 shadow-lg transition-all hover:shadow-card"
                  >
                    <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background text-primary group-hover:bg-primary group-hover:text-secondary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-display font-semibold text-foreground text-xl">{v.title}</h3>
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
        <div className="container mx-auto px-4 max-w-lg text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground">
            "Cuando entiendes que el contexto importa, cambia la forma de cuidarte."
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/70">— Maryen Chamorro</p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
