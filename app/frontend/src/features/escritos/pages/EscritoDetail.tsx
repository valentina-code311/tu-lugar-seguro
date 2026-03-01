import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowLeft, Link2, MessageCircle, Twitter, Facebook, BookOpen, Dot } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import Layout from "@/shared/components/layout/Layout";
import { Button } from "@/shared/components/ui/button";
import { useEscritoBySlug, EscritoBlock } from "@/features/escritos/hooks/useEscritos";

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
    <div className="flex flex-wrap items-center gap-2">
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

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

function parseTable(content: string): TableData | null {
  try {
    const d = JSON.parse(content);
    if (Array.isArray(d.headers) && Array.isArray(d.rows)) return d;
  } catch {}
  return null;
}

// Convert plain text to HTML for backward compat
function contentToHtml(text: string | null): string {
  if (!text) return "";
  if (/<[^>]+>/.test(text)) return text;
  return text.replace(/\n/g, "<br>");
}

function RenderBlock({ block }: { block: EscritoBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className="text-lg leading-[1.85] text-foreground/85 text-justify [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
          dangerouslySetInnerHTML={{ __html: contentToHtml(block.content) }}
        />
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

    case "separator":
      return (
        <div className="flex items-center justify-center py-2">
          <span className="flex items-center gap-2 select-none tracking-[0.6em] text-primary/80">
            <Dot />
            <Dot />
            <Dot />
          </span>
        </div>
      );

    case "video": {
      const embedUrl = getYoutubeEmbedUrl(block.content ?? "");
      if (!embedUrl) return null;
      return (
        <div className="aspect-video overflow-hidden rounded-xl shadow-soft">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title="Video"
          />
        </div>
      );
    }

    case "table": {
      const tableData = parseTable(block.content ?? "");
      if (!tableData) return null;
      return (
        <div className="overflow-auto rounded-xl border border-border shadow-soft">
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-muted/60">
                {tableData.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-4 py-2.5 text-left text-sm font-semibold text-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-border/60 last:border-0 odd:bg-background even:bg-muted/20"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2.5 text-sm text-foreground/85"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

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
        <div className="h-[40vh] min-h-[280px] w-full overflow-hidden bg-primary/50 md:h-[55vh] animate-pulse" />
      </Layout>
    );
  }

  if (isError || !escrito) {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
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

  const pageUrl = `${window.location.origin}/escritos/${escrito.slug}`;
  const ogImage = escrito.cover_image ?? `${window.location.origin}/favicon.png`;
  const ogDescription = escrito.excerpt
    ? escrito.excerpt.replace(/<[^>]+>/g, "").slice(0, 160)
    : "Psicología con contexto, claridad, criterio y cambios reales.";

  return (
    <Layout>
      <Helmet>
        <title>{escrito.title} | Maryen Chamorro</title>
        <meta name="description" content={ogDescription} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={escrito.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Maryen Chamorro" />
        {escrito.published_at && (
          <meta property="article:published_time" content={escrito.published_at} />
        )}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={escrito.title} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Cover image */}
      {escrito.cover_image && (
        <div className="h-[40vh] min-h-[200px] w-full overflow-hidden md:h-[55vh]">
          <img
            src={escrito.cover_image}
            alt={escrito.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <article className="bg-background py-4 md:py-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            {/* Back link */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mb-5 gap-1.5 text-muted-foreground"
            >
              <Link to="/escritos">
                <ArrowLeft className="h-4 w-4" />
                Todos los escritos
              </Link>
            </Button>

            {/* Share bar */}
            <div className="pb-6">
              <ShareBar title={escrito.title} />
            </div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              {escrito.published_at && (
                <time className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                  {format(new Date(escrito.published_at), "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </time>
              )}

              <h1 className="font-display font-bold leading-tight text-foreground text-3xl md:text-4xl mt-4 mb-8">
                {escrito.title}
              </h1>
              {escrito.excerpt && (
                <p
                  className="text-lg leading-[1.85] text-primary text-justify [&_a]:underline [&_a]:underline-offset-2"
                  dangerouslySetInnerHTML={{ __html: contentToHtml(escrito.excerpt) }}
                />
              )}
            </motion.header>

            {/* Content blocks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-4"
            >
              {escrito.escrito_blocks.map((block) => (
                <RenderBlock key={block.id} block={block} />
              ))}
            </motion.div>

            {/* Footer sharing */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="mb-5 text-sm font-medium text-muted-foreground">
                ¿Te resonó este escrito? Compártelo con alguien que también pueda conectar.
              </p>
              <ShareBar title={escrito.title} />
            </div>

            {/* Back CTA */}
            <div className="mt-5 text-center">
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
