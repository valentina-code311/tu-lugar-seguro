import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowRight } from "lucide-react";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  tags: string[] | null; published_at: string | null;
  reading_time_minutes: number | null; cover_image_url: string | null;
};

const Blog = () => {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("Todas");

  const { data: posts = [] } = useQuery({
    queryKey: ["public-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, tags, published_at, reading_time_minutes, cover_image_url")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const allTags = ["Todas", ...new Set(posts.flatMap(p => p.tags || []))];

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchTag = tag === "Todas" || (p.tags || []).includes(tag);
    return matchSearch && matchTag;
  });

  return (
    <section className="py-16 md:py-24 bg-card" aria-labelledby="blog-title">
      <div className="container max-w-4xl">
        <h1 id="blog-title" className="text-4xl md:text-5xl font-bold mb-4">Escritos</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Reflexiones sobre autoestima, límites, relaciones y cuidado desde un enfoque humanista y feminista.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="search" placeholder="Buscar escritos..." maxLength={100} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground" value={search} onChange={e => setSearch(e.target.value)} aria-label="Buscar escritos" />
        </div>

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Tags">
          {allTags.map((t) => (
            <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tag === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.length === 0 && <p className="text-muted-foreground text-center py-12">No se encontraron escritos.</p>}
          {filtered.map((post) => (
            <article key={post.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 text-sm text-muted-foreground">
                {post.tags?.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{t}</span>)}
                {post.published_at && <span>{new Date(post.published_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</span>}
                {post.reading_time_minutes && <span>· {post.reading_time_minutes} min de lectura</span>}
              </div>
              <h2 className="text-xl font-bold mb-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">{post.title}</Link>
              </h2>
              {post.excerpt && <p className="text-muted-foreground mb-4">{post.excerpt}</p>}
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-cta font-semibold text-sm hover:underline">
                Leer más <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
