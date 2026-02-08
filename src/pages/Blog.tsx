import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { blogPosts, BLOG_CATEGORIES } from "@/data/blog-posts";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const filtered = blogPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <section className="py-16 md:py-24 bg-card" aria-labelledby="blog-title">
      <div className="container max-w-4xl">
        <h1 id="blog-title" className="text-4xl md:text-5xl font-bold mb-4">Escritos</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Reflexiones sobre autoestima, límites, relaciones y cuidado desde un enfoque humanista y feminista.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar escritos..."
            maxLength={100}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar escritos"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Categorías">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No se encontraron escritos.</p>
          )}
          {filtered.map((post) => (
            <article key={post.slug} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>· {post.readTime} de lectura</span>
              </div>
              <h2 className="text-xl font-bold mb-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
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
