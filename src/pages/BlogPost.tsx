import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { WHATSAPP_URL } from "@/lib/constants";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="py-20 text-center container">
        <h1 className="text-3xl font-bold mb-4">Escrito no encontrado</h1>
        <Link to="/blog" className="text-cta font-semibold hover:underline">← Volver a escritos</Link>
      </section>
    );
  }

  // Simple markdown-to-html: headings, blockquotes, bold, lists, hr
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        const ordered = listItems[0].match(/^\d+\./);
        const Tag = ordered ? "ol" : "ul";
        elements.push(
          <Tag key={`list-${elements.length}`} className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-1 mb-4 text-muted-foreground`}>
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^[\d]+\.\s|^-\s/, "")) }} />
            ))}
          </Tag>
        );
        listItems = [];
        inList = false;
      }
    };

    const formatInline = (text: string) =>
      text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-3" id={trimmed.slice(3).toLowerCase().replace(/[^a-záéíóúñü\s]/g, "").replace(/\s+/g, "-")}>{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={i} className="text-xl font-bold mt-6 mb-2">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote key={i} className="border-l-4 border-accent pl-4 py-2 my-4 italic text-muted-foreground bg-secondary rounded-r-lg">
            <p dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2).replace(/^"|"$/g, "")) }} />
          </blockquote>
        );
      } else if (trimmed.startsWith("---")) {
        flushList();
        elements.push(<hr key={i} className="my-8 border-border" />);
      } else if (trimmed.startsWith("- ") || trimmed.match(/^\d+\.\s/)) {
        inList = true;
        listItems.push(trimmed);
      } else if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
        flushList();
        elements.push(<p key={i} className="text-muted-foreground italic mb-4" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(1, -1)) }} />);
      } else if (trimmed) {
        flushList();
        elements.push(<p key={i} className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />);
      } else {
        flushList();
      }
    });
    flushList();

    return elements;
  };

  // Generate TOC
  const headings = post.content.split("\n").filter((l) => l.trim().startsWith("## ") || l.trim().startsWith("### "));
  const toc = headings.map((h) => {
    const level = h.trim().startsWith("### ") ? 3 : 2;
    const text = h.trim().replace(/^#{2,3}\s/, "");
    const id = text.toLowerCase().replace(/[^a-záéíóúñü\s]/g, "").replace(/\s+/g, "-");
    return { level, text, id };
  });

  return (
    <section className="py-16 md:py-24 bg-card" aria-labelledby="post-title">
      <div className="container max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a escritos
        </Link>

        <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{post.category}</span>
          <span>{new Date(post.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>· {post.readTime} de lectura</span>
        </div>

        <h1 id="post-title" className="text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>

        {/* TOC */}
        {toc.length > 2 && (
          <nav className="mb-10 p-4 rounded-lg bg-secondary border border-border" aria-label="Índice del artículo">
            <h2 className="font-semibold text-sm mb-2">En este artículo</h2>
            <ul className="space-y-1">
              {toc.map((h) => (
                <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                  <a href={`#${h.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <article className="prose-custom">{renderContent(post.content)}</article>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-xl gradient-primary text-center">
          <p className="text-lg font-semibold mb-3 text-primary-foreground">¿Te acompaño?</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card text-primary font-bold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Agendar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
