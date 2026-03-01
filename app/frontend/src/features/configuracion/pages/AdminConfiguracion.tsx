import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminValores from "@/pages/admin/AdminValores";
import AdminServicios from "@/pages/admin/AdminServicios";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, X } from "lucide-react";
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
import { RichTextEditor } from "@/components/admin/escritos/RichTextEditor";
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

// ─── Hero Content Section ──────────────────────────────────────────────────────

function HeroContentSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  const [form, setForm] = useState({
    hero_badge: "",
    hero_title: "",
    hero_subtitle: "",
  });

  useEffect(() => {
    if (settings) setForm({
      hero_badge: settings.hero_badge,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
    });
  }, [settings]);

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Hero (portada)</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Badge, título y subtítulo de la sección principal del inicio
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <div key={n} className="h-10 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Badge</Label>
            <Input
              value={form.hero_badge}
              onChange={(e) => setForm({ ...form, hero_badge: e.target.value })}
              placeholder="Ej: Psicología humanista y feminista"
            />
            <p className="text-xs text-muted-foreground">Texto pequeño que aparece sobre el título</p>
          </div>

          <div className="space-y-1.5">
            <Label>Título principal</Label>
            <Input
              value={form.hero_title}
              onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
              placeholder="Ej: Psicología que sí te cuida."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Texto corto (subtítulo)</Label>
            <Textarea
              value={form.hero_subtitle}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
              rows={3}
              placeholder="Descripción breve que aparece bajo el título"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}

// ─── About Home Section ────────────────────────────────────────────────────────

function AboutHomeSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  const [form, setForm] = useState({
    about_title: "",
    about_paragraph1: "",
    about_paragraph2: "",
    about_tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (settings) setForm({
      about_title: settings.about_title,
      about_paragraph1: settings.about_paragraph1,
      about_paragraph2: settings.about_paragraph2,
      about_tags: settings.about_tags ?? [],
    });
  }, [settings]);

  function addTag() {
    const tag = newTag.trim();
    if (!tag || form.about_tags.includes(tag)) return;
    setForm({ ...form, about_tags: [...form.about_tags, tag] });
    setNewTag("");
  }

  function removeTag(tag: string) {
    setForm({ ...form, about_tags: form.about_tags.filter((t) => t !== tag) });
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Sobre mí — inicio</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sección "Sobre mí" de la página principal
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-10 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <div className="rounded-md border border-input bg-background px-3 py-2">
              <RichTextEditor
                singleLine
                content={form.about_title}
                onChange={(html) => setForm({ ...form, about_title: html })}
                placeholder="Ej: Soy Maryen Chamorro, hago psicología con criterio..."
              />
            </div>
            <p className="text-xs text-muted-foreground">Selecciona texto para aplicar subrayado, cursiva o negrita</p>
          </div>

          <div className="space-y-1.5">
            <Label>Primer párrafo</Label>
            <div className="rounded-md border border-input bg-background px-3 py-2">
              <RichTextEditor
                content={form.about_paragraph1}
                onChange={(html) => setForm({ ...form, about_paragraph1: html })}
                placeholder="Primer párrafo..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Segundo párrafo</Label>
            <div className="rounded-md border border-input bg-background px-3 py-2">
              <RichTextEditor
                content={form.about_paragraph2}
                onChange={(html) => setForm({ ...form, about_paragraph2: html })}
                placeholder="Segundo párrafo..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2">
              {form.about_tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 rounded-full hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Nueva etiqueta..."
                className="max-w-xs"
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}

// ─── About Full Page Section ───────────────────────────────────────────────────

function AboutPageSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  const [form, setForm] = useState({
    about_full_title: "",
    about_full_paragraphs: [] as string[],
  });

  useEffect(() => {
    if (settings) setForm({
      about_full_title: settings.about_full_title,
      about_full_paragraphs: settings.about_full_paragraphs ?? [],
    });
  }, [settings]);

  function updateParagraph(index: number, value: string) {
    const updated = [...form.about_full_paragraphs];
    updated[index] = value;
    setForm({ ...form, about_full_paragraphs: updated });
  }

  function addParagraph() {
    setForm({ ...form, about_full_paragraphs: [...form.about_full_paragraphs, ""] });
  }

  function removeParagraph(index: number) {
    setForm({
      ...form,
      about_full_paragraphs: form.about_full_paragraphs.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Sobre mí — página completa</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Título y párrafos de la página <code className="font-mono">/sobre-mi</code>
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <div key={n} className="h-20 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <div className="rounded-md border border-input bg-background px-3 py-2">
              <RichTextEditor
                singleLine
                content={form.about_full_title}
                onChange={(html) => setForm({ ...form, about_full_title: html })}
                placeholder="Ej: Soy Maryen Chamorro..."
              />
            </div>
            <p className="text-xs text-muted-foreground">Selecciona texto para aplicar subrayado, cursiva o negrita</p>
          </div>

          <div className="space-y-3">
            <Label>Párrafos</Label>
            {form.about_full_paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-shrink-0 flex items-start pt-2">
                  <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}.</span>
                </div>
                <div className="flex-1 rounded-md border border-input bg-background px-3 py-2">
                  <RichTextEditor
                    content={p}
                    onChange={(html) => updateParagraph(i, html)}
                    placeholder={`Párrafo ${i + 1}...`}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-destructive hover:text-destructive mt-0.5"
                  onClick={() => removeParagraph(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addParagraph} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar párrafo
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending || isLoading}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = ["hero", "sobre-mi-inicio", "sobre-mi-pagina", "servicios", "valores", "contacto", "redes"] as const;
type Tab = typeof TABS[number];

export default function AdminConfiguracion() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "hero";

  function setTab(tab: Tab) {
    setSearchParams({ tab }, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contenido editable, contacto y redes sociales del sitio
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/50 p-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="sobre-mi-inicio">Sobre mí — inicio</TabsTrigger>
          <TabsTrigger value="sobre-mi-pagina">Sobre mí — página</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="valores">Valores</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="redes">Redes sociales</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-4">
          <HeroContentSection />
        </TabsContent>

        <TabsContent value="sobre-mi-inicio" className="mt-4">
          <AboutHomeSection />
        </TabsContent>

        <TabsContent value="sobre-mi-pagina" className="mt-4">
          <AboutPageSection />
        </TabsContent>

        <TabsContent value="servicios" className="mt-4">
          <AdminServicios />
        </TabsContent>

        <TabsContent value="valores" className="mt-4">
          <AdminValores />
        </TabsContent>

        <TabsContent value="contacto" className="mt-4">
          <ContactInfoSection />
        </TabsContent>

        <TabsContent value="redes" className="mt-4">
          <SocialLinksSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
