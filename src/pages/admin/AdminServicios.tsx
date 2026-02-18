import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconPicker, resolveIcon } from "@/components/admin/IconPicker";
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  formatPrice,
  type Service,
} from "@/hooks/useServices";

const EMPTY: Omit<Service, "id"> = {
  name: "",
  description: "",
  duration_minutes: 60,
  price: 0,
  icon: "Heart",
  is_active: true,
  sort_order: 0,
};

export default function AdminServicios() {
  const { data: services, isLoading } = useAdminServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);

  function openNew() {
    const nextOrder = (services?.length ?? 0) + 1;
    setEditing(null);
    setForm({ ...EMPTY, sort_order: nextOrder });
    setOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description ?? "",
      duration_minutes: service.duration_minutes,
      price: service.price,
      icon: service.icon,
      is_active: service.is_active,
      sort_order: service.sort_order,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setOpen(false);
  }

  function toggleActive(service: Service) {
    updateMutation.mutate({ id: service.id, is_active: !service.is_active });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Servicios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los servicios que ofreces y su información
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo servicio
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {services?.map((service) => {
            const Icon = resolveIcon(service.icon);
            return (
              <div
                key={service.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{service.name}</p>
                    {!service.is_active && (
                      <Badge variant="secondary" className="shrink-0 text-xs">Inactivo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {service.duration_minutes} min · {formatPrice(service.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={service.is_active ? "Desactivar" : "Activar"}
                    onClick={() => toggleActive(service)}
                  >
                    {service.is_active
                      ? <Eye className="h-4 w-4" />
                      : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar "{service.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => deleteMutation.mutate(service.id)}
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

          {services?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">No hay servicios todavía.</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                Crear el primero
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Sesión individual"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción del servicio..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duración (minutos)</Label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Precio (COP)</Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Orden de aparición</Label>
              <Input
                type="number"
                min={1}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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
                <span className="text-sm text-muted-foreground">Vista previa del ícono seleccionado</span>
              </div>
              <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isPending || !form.name.trim()}>
              {isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
