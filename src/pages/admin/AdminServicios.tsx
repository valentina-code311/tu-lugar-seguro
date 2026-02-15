import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Service = {
  id: string; name: string; slug: string | null; short_description: string | null;
  description: string | null; duration_minutes: number; price: number;
  mode: string; image_url: string | null; is_active: boolean; sort_order: number;
};

const empty: Omit<Service, "id"> = {
  name: "", slug: null, short_description: null, description: null,
  duration_minutes: 60, price: 0, mode: "online", image_url: null,
  is_active: true, sort_order: 0,
};

const AdminServicios = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);

  const { data: services = [] } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const slug = form.name.toLowerCase().replace(/[^a-záéíóúñü\d\s]/g, "").replace(/\s+/g, "-");
      const payload = { ...form, slug };
      if (editing) {
        const { error } = await supabase.from("services").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: editing ? "Servicio actualizado" : "Servicio creado" });
      close();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "Servicio eliminado" });
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from("services").update({ is_active: active }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const close = () => { setEditing(null); setCreating(false); setForm(empty); };

  const openEdit = (s: Service) => {
    setEditing(s);
    setCreating(true);
    setForm({ name: s.name, slug: s.slug, short_description: s.short_description, description: s.description, duration_minutes: s.duration_minutes, price: s.price, mode: s.mode, image_url: s.image_url, is_active: s.is_active, sort_order: s.sort_order });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(empty); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {creating && (
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-bold mb-4">{editing ? "Editar servicio" : "Nuevo servicio"}</h2>
          <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción corta</label>
              <input value={form.short_description || ""} onChange={e => setForm({ ...form, short_description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duración (min)</label>
              <input type="number" min={15} value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio COP</label>
              <input type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modalidad</label>
              <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción completa</label>
              <textarea rows={3} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Imagen</label>
              <ImageUpload value={form.image_url || ""} onChange={url => setForm({ ...form, image_url: url || null })} folder="services" />
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

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Servicio</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Duración</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Precio</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.duration_minutes} min</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">${s.price.toLocaleString("es-CO")}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle.mutate({ id: s.id, active: !s.is_active })} className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.is_active ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {s.is_active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-secondary" aria-label="Editar"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(s.id); }} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" aria-label="Eliminar"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && <p className="p-6 text-center text-muted-foreground">No hay servicios aún.</p>}
      </div>
    </div>
  );
};

export default AdminServicios;
