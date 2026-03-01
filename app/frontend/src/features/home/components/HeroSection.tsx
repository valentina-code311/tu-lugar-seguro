import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/shared/assets/hero-bg.jpg";
import { useSiteSettings } from "@/shared/hooks/useSiteSettings";

const HeroSection = () => {
  const { data: settings, isLoading } = useSiteSettings();

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="container relative mx-auto flex min-h-[90vh] items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {isLoading
              ? <span className="h-4 w-32 animate-pulse rounded bg-primary-foreground/20 inline-block" />
              : settings?.hero_badge}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 w-3/4 animate-pulse rounded-lg bg-primary-foreground/20" />
              <div className="h-12 w-1/2 animate-pulse rounded-lg bg-primary-foreground/20" />
            </div>
          ) : (
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {settings?.hero_title}
            </h1>
          )}

          {isLoading ? (
            <div className="max-w-lg space-y-2">
              <div className="h-5 w-full animate-pulse rounded bg-primary-foreground/20" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-primary-foreground/20" />
              <div className="h-5 w-3/5 animate-pulse rounded bg-primary-foreground/20" />
            </div>
          ) : (
            <p className="max-w-lg text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              {settings?.hero_subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" variant="hero">
              <Link to="/agenda">
                <Calendar className="h-4 w-4" />
                Agendar cita
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20">
              <Link to="/escritos">
                <BookOpen className="h-4 w-4" />
                Escritos
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
