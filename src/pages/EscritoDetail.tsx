import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Link2,
  MessageCircle,
  Twitter,
  Facebook,
  Loader2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useEscritoBySlug, EscritoBlock } from "@/hooks/useEscritos";

// ── Sharing helpers ────────────────────────────────────────────────────────────

function buildShareLinks(title: string, url: string) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(`${title} — ${url}`);
  return {
    whatsapp: `https://wa.me/?text=${text}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
  };
}

function ShareBar({ title }: { title: string }) {
  const url = window.location.href;
  const links = buildShareLinks(title, url);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => toast.success("Enlace copiado"));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Share2 className="h-4 w-4" />
        Compartir
      </span>

      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-black/20"
      >
        <Twitter className="h-4 w-4" />
        X / Twitter
      </a>

      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3 py-1.5 text-sm font-medium text-[#1877F2] transition-colors hover:bg-[#1877F2]/20"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </a>

      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
      >
        <Link2 className="h-4 w-4" />
        Copiar enlace
      </button>
    </div>
  );
}

// ── Block renderer ─────────────────────────────────────────────────────────────

function RenderBlock({ block }: { block: EscritoBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg leading-[1.85] text-foreground/85 whitespace-pre-wrap">
          {block.content}
        </p>
      );

    case "heading":
      return (
        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {block.content}
        </h2>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-5">
          <p className="text-xl font-medium italic leading-relaxed text-foreground/80">
            {block.content}
          </p>
        </blockquote>
      );

    case "image":
      return (
        <figure className="space-y-2">
          {block.image_url && (
            <img
              src={block.image_url}
              alt={block.content ?? ""}
              className="w-full rounded-xl object-cover shadow-soft"
              loading="lazy"
            />
          )}
          {block.content && (
            <figcaption className="text-center text-sm text-muted-foreground">
              {block.content}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EscritoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: escrito, isLoading, isError } = useEscritoBySlug(slug ?? "");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Cargando escrito...
        </div>
      </Layout>
    );
  }

  if (isError || !escrito) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Escrito no encontrado
          </h1>
          <p className="text-muted-foreground">
            Es posible que este escrito haya sido retirado o el enlace sea incorrecto.
          </p>
          <Button asChild variant="outline">
            <Link to="/escritos">Ver todos los escritos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Cover image */}
      {escrito.cover_image && (
        <div className="h-[40vh] min-h-[280px] w-full overflow-hidden md:h-[55vh]">
          <img
            src={escrito.cover_image}
            alt={escrito.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <article className="bg-background py-12 md:py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl">
            {/* Back link */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mb-8 gap-1.5 text-muted-foreground"
            >
              <Link to="/escritos">
                <ArrowLeft className="h-4 w-4" />
                Todos los escritos
              </Link>
            </Button>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 space-y-4"
            >
              {escrito.published_at && (
                <time className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                  {format(new Date(escrito.published_at), "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </time>
              )}
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                {escrito.title}
              </h1>
              {escrito.excerpt && (
                <p className="text-xl leading-relaxed text-muted-foreground">{escrito.excerpt}</p>
              )}

              <div className="pt-2">
                <ShareBar title={escrito.title} />
              </div>
            </motion.header>

            {/* Content blocks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-8"
            >
              {escrito.escrito_blocks.map((block) => (
                <RenderBlock key={block.id} block={block} />
              ))}
            </motion.div>

            {/* Footer sharing */}
            <div className="mt-16 border-t border-border pt-8">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                ¿Te resonó este escrito? Compártelo con alguien que pueda necesitarlo.
              </p>
              <ShareBar title={escrito.title} />
            </div>

            {/* Back CTA */}
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/escritos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver más escritos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
