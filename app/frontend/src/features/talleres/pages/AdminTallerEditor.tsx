import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft, Save, Loader2, ImageIcon,
  X, Users, Sparkles, Eye, EyeOff, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  useAdminTaller, useSaveTaller, useDeleteTaller,
  uploadTallerImage, isFutureTaller, type TallerPayload,
  type Inscripcion,
} from "@/features/talleres/hooks/useTalleres";

const EMPTY: Omit<TallerPayload, "event_date" | "event_time"> & {
  event_date: string;
  event_time: string;
} = {
  title: "",
  topic: "",
  event_date: "",
  event_time: "10:00",
  location: "",
  image_url: "",
  purpose: "",
  experience: "",
  price: 0,
  is_published: true,
};

export default function AdminTallerEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nuevo";
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminTaller(isNew ? undefined : id);
  const saveMutation = useSaveTaller();
  const deleteMutation = useDeleteTaller();

  const [form, setForm] = useState(EMPTY);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        topic: existing.topic ?? "",
        event_date: existing.event_date,
        event_time: existing.event_time.slice(0, 5), // "HH:MM"
        location: existing.location ?? "",
        image_url: existing.image_url ?? "",
        purpose: existing.purpose ?? "",
        experience: existing.experience ?? "",
        price: existing.price ?? 0,
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadTallerImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("El título es obligatorio"); return; }
    if (!form.event_date) { toast.error("La fecha es obligatoria"); return; }
    if (!form.event_time) { toast.error("La hora es obligatoria"); return; }

    const payload: Partial<TallerPayload> & { id?: string } = {
      ...form,
      title: form.title.trim(),
      topic: form.topic?.trim() || null,
      location: form.location?.trim() || null,
      image_url: form.image_url || null,
      purpose: form.purpose?.trim() || null,
      experience: form.experience?.trim() || null,
      ...(isNew ? {} : { id }),
    };

    const saved = await saveMutation.mutateAsync(payload);
    if (isNew && saved) navigate(`/admin/encuentros/${saved.id}`, { replace: true });
  }

  async function handleDelete() {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    navigate("/admin/encuentros");
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando taller...
      </div>
    );
  }

  const isPast = existing && !isFutureTaller(existing);
  const inscripciones: Inscripcion[] = existing?.taller_inscripciones ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost" size="sm"
          onClick={() => navigate("/admin/encuentros")}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center gap-2">
          {isPast && (
            <Badge variant="secondary">Evento pasado</Badge>
          )}
          <Button
            variant="outline" size="sm"
            onClick={() => setForm((f) => ({ ...f, is_published: !f.is_published }))}
            className="gap-1.5"
          >
            {form.is_published
              ? <><Eye className="h-4 w-4" /> Publicado</>
              : <><EyeOff className="h-4 w-4" /> Oculto</>}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="gap-1.5"
          >
            {saveMutation.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Save className="h-4 w-4" />}
            {isNew ? "Crear taller" : "Guardar cambios"}
          </Button>
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este taller?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán también todas las inscripciones. No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main form */}
        <div className="space-y-5">
          {/* Básico */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Información general</h2>

            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Taller de autoconocimiento sensorial"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Temática</Label>
              <Input
                value={form.topic ?? ""}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="Ej: Sexualidad consciente, Vínculos, Cuerpo..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fecha *</Label>
                <Input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Hora *</Label>
                <Input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Lugar</Label>
              <Input
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ej: Online / Cali, Valle del Cauca"
              />
            </div>

            <div className="space-y-3">
              <Label>Precio</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="gratuito"
                  checked={form.price === 0}
                  onCheckedChange={(free) => setForm({ ...form, price: free ? 0 : 50000 })}
                />
                <label htmlFor="gratuito" className="text-sm text-muted-foreground cursor-pointer">
                  {form.price === 0 ? "Gratuito" : "Con costo"}
                </label>
              </div>
              {form.price > 0 && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-40"
                  />
                  <span className="text-sm text-muted-foreground">COP</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Propósito de la sesión</Label>
              <Textarea
                value={form.purpose ?? ""}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="¿Qué van a explorar? ¿Qué se llevarán las participantes?"
                rows={4}
              />
            </div>
          </div>

          {/* Post-evento */}
          <div className={`rounded-xl border p-5 space-y-4 ${isPast ? "border-primary/30 bg-primary/5" : "border-border bg-background opacity-60"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${isPast ? "text-primary" : "text-muted-foreground"}`} />
              <h2 className="font-semibold text-foreground">Experiencia vivida</h2>
              {!isPast && (
                <span className="text-xs text-muted-foreground">(disponible después del evento)</span>
              )}
            </div>
            <Textarea
              value={form.experience ?? ""}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="Describe cómo fue el encuentro, qué surgió, qué se vivió..."
              rows={5}
              disabled={!isPast && isNew}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Image */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <Label>Imagen de referencia</Label>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {form.image_url ? (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={form.image_url}
                  alt="Imagen del taller"
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 p-2">
                  <Button
                    size="sm" variant="secondary" className="h-7 text-xs"
                    onClick={() => imgInputRef.current?.click()}
                    disabled={uploadingImg}
                  >
                    Cambiar
                  </Button>
                  <Button
                    size="sm" variant="secondary" className="h-7 text-xs"
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => imgInputRef.current?.click()}
                disabled={uploadingImg}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 transition-colors hover:border-primary hover:bg-primary/5"
              >
                {uploadingImg
                  ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  : <ImageIcon className="h-6 w-6 text-muted-foreground/50" />}
                <span className="text-xs text-muted-foreground">
                  {uploadingImg ? "Subiendo..." : "Subir imagen"}
                </span>
              </button>
            )}
          </div>

          {/* Inscripciones */}
          {!isNew && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Inscripciones</Label>
                <Badge variant="secondary">{inscripciones.length}</Badge>
              </div>

              {inscripciones.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin inscripciones todavía.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {inscripciones.map((ins) => (
                    <div key={ins.id} className="rounded-lg border border-border p-3 text-xs space-y-0.5">
                      <p className="font-medium text-foreground">{ins.name}</p>
                      <p className="text-muted-foreground">{ins.email}</p>
                      <p className="text-muted-foreground">{ins.whatsapp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
