import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconPicker, resolveIcon } from "@/components/admin/IconPicker";
import {
  useSiteSettings, useUpdateSiteSettings,
  useSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink,
  type SocialLink,
} from "@/hooks/useSiteSettings";

// ─── Contact Info Section ─────────────────────────────────────────────────────

function ContactInfoSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    location: "",
    whatsapp_url: "",
    location_map_url: "" as string | null,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  function handleSave() {
    updateMutation.mutate(form);
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Datos de contacto</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Aparecen en la página /contacto
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="hola@ejemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+57 300 000 0000"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Ubicación</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Consulta presencial y online"
            />
          </div>

          <div className="space-y-1.5">
            <Label>URL de WhatsApp</Label>
            <Input
              value={form.whatsapp_url}
              onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
              placeholder="https://wa.me/57300..."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Mapa de ubicación (iframe de Google Maps)</Label>
            <Textarea
              value={form.location_map_url ?? ""}
              onChange={(e) => setForm({ ...form, location_map_url: e.target.value || null })}
              placeholder='Pega aquí el código iframe completo de Google Maps&#10;Ej: <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
              rows={3}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              En Google Maps: <strong>Compartir → Insertar un mapa</strong> → copia el código completo. Si está vacío no se muestra el mapa.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}

// ─── Social Links Section ─────────────────────────────────────────────────────

const EMPTY_SOCIAL: Omit<SocialLink, "id"> = {
  name: "",
  icon: "Instagram",
  url: "",
  is_active: true,
  sort_order: 0,
};

function SocialLinksSection() {
  const { data: links, isLoading } = useSocialLinks();
  const createMutation = useCreateSocialLink();
  const updateMutation = useUpdateSocialLink();
  const deleteMutation = useDeleteSocialLink();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState(EMPTY_SOCIAL);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY_SOCIAL, sort_order: (links?.length ?? 0) + 1 });
    setOpen(true);
  }

  function openEdit(link: SocialLink) {
    setEditing(link);
    setForm({
      name: link.name,
      icon: link.icon,
      url: link.url,
      is_active: link.is_active,
      sort_order: link.sort_order,
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.url.trim()) return;
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setOpen(false);
  }

  function toggleActive(link: SocialLink) {
    updateMutation.mutate({ id: link.id, is_active: !link.is_active });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-soft space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Redes sociales</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aparecen en el footer del sitio
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva red
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {links?.map((link) => {
            const Icon = resolveIcon(link.icon);
            return (
              <div
                key={link.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{link.name}</p>
                    {!link.is_active && (
                      <Badge variant="secondary" className="shrink-0 text-xs">Inactivo</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{link.url}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    title={link.is_active ? "Desactivar" : "Activar"}
                    onClick={() => toggleActive(link)}
                  >
                    {link.is_active
                      ? <Eye className="h-4 w-4" />
                      : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(link)}>
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
                        <AlertDialogTitle>¿Eliminar "{link.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => deleteMutation.mutate(link.id)}
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

          {links?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No hay redes sociales todavía.</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                Agregar la primera
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar red social" : "Nueva red social"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Instagram"
              />
            </div>

            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-4 w-4" />
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
            <Button
              onClick={handleSave}
              disabled={isPending || !form.name.trim() || !form.url.trim()}
            >
              {isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminConfiguracion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Datos de contacto y redes sociales del sitio
        </p>
      </div>

      <ContactInfoSection />
      <SocialLinksSection />
    </div>
  );
}
