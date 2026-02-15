import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; cover_image_url: string | null;
  status: "draft" | "published"; published_at: string | null;
  tags: string[] | null; reading_time_minutes: number | null;
  created_at: string;
};

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "",
  cover_image_url: "", status: "draft" as "draft" | "published",
  tags: "", reading_time_minutes: 5,
};

const AdminBlog = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const filtered = posts.filter(p => filter === "all" || p.status === filter);

  const save = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-záéíóúñü\d\s]/g, "").replace(/\s+/g, "-");
      const words = form.content.split(/\s+/).length;
      const reading = Math.max(1, Math.round(words / 200));
      const tagsArr = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      const payload = {
        title: form.title, slug, excerpt: form.excerpt || null,
        content: form.content, cover_image_url: form.cover_image_url || null,
        status: form.status, tags: tagsArr, reading_time_minutes: reading,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };
      if (editing) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast({ title: editing ? "Post actualizado" : "Post creado" }); close(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast({ title: "Post eliminado" }); },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "draft" | "published" }) => {
      await supabase.from("posts").update({
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const close = () => { setEditing(null); setCreating(false); setForm(emptyForm); };

  const openEdit = (p: Post) => {
    setEditing(p); setCreating(true);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || "",
      content: p.content, cover_image_url: p.cover_image_url || "",
      status: p.status, tags: (p.tags || []).join(", "),
      reading_time_minutes: p.reading_time_minutes || 5,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(emptyForm); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Nuevo post
        </button>
      </div>

      {creating && (
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-bold mb-4">{editing ? "Editar post" : "Nuevo post"}</h2>
          <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Extracto</label>
              <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido (Markdown) *</label>
              <textarea required rows={12} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-mono resize-y" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="autoestima, límites" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "draft" | "published" })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Imagen de portada</label>
              <ImageUpload value={form.cover_image_url} onChange={url => setForm({ ...form, cover_image_url: url })} folder="blog" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                {save.isPending ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={close} className="px-4 py-2 rounded-lg border border-border text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(["all", "draft", "published"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {f === "all" ? "Todos" : f === "draft" ? "Borradores" : "Publicados"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "published" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {p.status === "published" ? "Publicado" : "Borrador"}
                </span>
                {p.tags?.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-secondary text-xs">{t}</span>)}
              </div>
              <h3 className="font-bold truncate">{p.title}</h3>
              {p.excerpt && <p className="text-sm text-muted-foreground truncate">{p.excerpt}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => toggleStatus.mutate({ id: p.id, status: p.status === "published" ? "draft" : "published" })} className="p-1.5 rounded hover:bg-secondary" aria-label={p.status === "published" ? "Despublicar" : "Publicar"}>
                {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-secondary" aria-label="Editar"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(p.id); }} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" aria-label="Eliminar"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No hay posts.</p>}
      </div>
    </div>
  );
};

export default AdminBlog;
