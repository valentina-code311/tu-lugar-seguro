import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";
import { useSiteSettings } from "@/shared/hooks/useSiteSettings";
import { toHtml } from "@/shared/components/RichTextEditor";

const AboutPreview = () => {
  const { data: settings, isLoading } = useSiteSettings();

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Sobre mí
            </span>
            {isLoading ? (
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
            ) : (
              <h2
                className="font-display text-3xl font-semibold text-primary md:text-4xl [&_u]:underline-offset-4 [&_u]:decoration-2"
                dangerouslySetInnerHTML={{ __html: toHtml(settings?.about_title ?? "") }}
              />
            )}
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground">
                <p
                  dangerouslySetInnerHTML={{ __html: toHtml(settings?.about_paragraph1 ?? "") }}
                  className="[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                />
                <p
                  dangerouslySetInnerHTML={{ __html: toHtml(settings?.about_paragraph2 ?? "") }}
                  className="[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                />
              </div>
            )}
            {isLoading ? (
              <div className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {settings?.about_tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Button asChild variant="outline" className="gap-2">
              <Link to="/sobre-mi">
                Conoce más sobre mí <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-primary shadow-card">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center p-4 lg:p-6 h-full w-full">
                  <img
                    src="https://raw.githubusercontent.com/valentina-code311/tu-lugar-seguro/refs/heads/main/docs/photo.jpg"
                    alt="Maryen"
                    className="mx-auto h-full w-full rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-elevated">
              <p className="font-display text-2xl font-bold">+5</p>
              <p className="text-xs">Años de experiencia</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
