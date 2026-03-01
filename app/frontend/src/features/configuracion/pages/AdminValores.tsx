import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { IconPicker, resolveIcon } from "@/shared/components/IconPicker";
import {
  useAdminValores, useCreateValor,
  useUpdateValor, useDeleteValor,
  type Valor,
} from "@/shared/hooks/useValores";

const EMPTY: Omit<Valor, "id"> = {
  title: "",
  description: "",
  icon: "Heart",
  sort_order: 0,
  is_active: true,
};

export default function AdminValores() {
  const { data: valores, isLoading } = useAdminValores();
  const createMutation = useCreateValor();
  const updateMutation = useUpdateValor();
  const deleteMutation = useDeleteValor();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Valor | null>(null);
  const [form, setForm] = useState(EMPTY);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: (valores?.length ?? 0) + 1 });
    setOpen(true);
  }

  function openEdit(v: Valor) {
    setEditing(v);
    setForm({
      title: v.title,
      description: v.description ?? "",
      icon: v.icon,
      sort_order: v.sort_order,
      is_active: v.is_active,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setOpen(false);
  }

  function toggleActive(v: Valor) {
    updateMutation.mutate({ id: v.id, is_active: !v.is_active });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Valores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aparecen en la sección "Mis Valores" de la página Sobre mí
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo valor
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 animate-pulse rounded-xl bg-background" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {valores?.map((v) => {
            const Icon = resolveIcon(v.icon);
            return (
              <div
                key={v.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-soft"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{v.title}</p>
                    {!v.is_active && (
                      <Badge variant="secondary" className="shrink-0 text-xs">Inactivo</Badge>
                    )}
                  </div>
                  {v.description && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{v.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    title={v.is_active ? "Desactivar" : "Activar"}
                    onClick={() => toggleActive(v)}
                  >
                    {v.is_active
                      ? <Eye className="h-4 w-4" />
                      : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(v)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost" size="icon"
                        className="text-destructive hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar "{v.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => deleteMutation.mutate(v.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}

          {valores?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">No hay valores todavía.</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                Crear el primero
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar valor" : "Nuevo valor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Enfoque Humanista"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción de este valor..."
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Orden de aparición</Label>
              <Input
                type="number"
                min={1}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-28"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ícono</Label>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = resolveIcon(form.icon);
                  return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  );
                })()}
                <span className="text-sm text-muted-foreground">Vista previa</span>
              </div>
              <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isPending || !form.title.trim()}>
              {isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear valor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
