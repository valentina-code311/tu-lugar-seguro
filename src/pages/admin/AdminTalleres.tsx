import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Workshop = {
  id: string; title: string; slug: string; short_description: string | null;
  content: string | null; start_at: string | null; end_at: string | null;
  price_cop: number | null; capacity: number | null; image_url: string | null;
  is_active: boolean; sort_order: number;
};

const emptyForm = {
  title: "", slug: "", short_description: "", content: "",
  start_at: "", end_at: "", price_cop: 0, capacity: 20,
  image_url: "", is_active: true, sort_order: 0,
};

const AdminTalleres = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: workshops = [] } = useQuery({
    queryKey: ["admin-workshops"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workshops").select("*").order("sort_order");
      if (error) throw error;
      return data as Workshop[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const slug = form.title.toLowerCase().replace(/[^a-záéíóúñü\d\s]/g, "").replace(/\s+/g, "-");
      const payload = {
        title: form.title, slug, short_description: form.short_description || null,
        content: form.content || null,
        start_at: form.start_at || null, end_at: form.end_at || null,
        price_cop: form.price_cop || null, capacity: form.capacity || null,
        image_url: form.image_url || null, is_active: form.is_active, sort_order: form.sort_order,
      };
      if (editing) {
        const { error } = await supabase.from("workshops").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("workshops").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-workshops"] }); toast({ title: editing ? "Taller actualizado" : "Taller creado" }); close(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("workshops").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-workshops"] }); toast({ title: "Taller eliminado" }); },
  });

  const close = () => { setEditing(null); setCreating(false); setForm(emptyForm); };

  const openEdit = (w: Workshop) => {
    setEditing(w); setCreating(true);
    setForm({
      title: w.title, slug: w.slug, short_description: w.short_description || "",
      content: w.content || "", start_at: w.start_at?.slice(0, 16) || "",
      end_at: w.end_at?.slice(0, 16) || "", price_cop: w.price_cop || 0,
      capacity: w.capacity || 20, image_url: w.image_url || "",
      is_active: w.is_active, sort_order: w.sort_order,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Talleres</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(emptyForm); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {creating && (
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-bold mb-4">{editing ? "Editar taller" : "Nuevo taller"}</h2>
          <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción corta</label>
              <input value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inicio</label>
              <input type="datetime-local" value={form.start_at} onChange={e => setForm({ ...form, start_at: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <input type="datetime-local" value={form.end_at} onChange={e => setForm({ ...form, end_at: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio COP</label>
              <input type="number" min={0} value={form.price_cop} onChange={e => setForm({ ...form, price_cop: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cupos</label>
              <input type="number" min={1} value={form.capacity} onChange={e => setForm({ ...form, capacity: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Contenido (Markdown)</label>
              <textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Imagen</label>
              <ImageUpload value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} folder="workshops" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                {save.isPending ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={close} className="px-4 py-2 rounded-lg border border-border text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workshops.map(w => (
          <div key={w.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{w.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs ${w.is_active ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                {w.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>
            {w.short_description && <p className="text-sm text-muted-foreground mb-3">{w.short_description}</p>}
            <div className="flex gap-2">
              <button onClick={() => openEdit(w)} className="px-3 py-1 rounded-lg bg-secondary text-sm"><Pencil className="w-3 h-3 inline mr-1" />Editar</button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(w.id); }} className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive text-sm"><Trash2 className="w-3 h-3 inline mr-1" />Eliminar</button>
            </div>
          </div>
        ))}
        {workshops.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">No hay talleres aún.</p>}
      </div>
    </div>
  );
};

export default AdminTalleres;
