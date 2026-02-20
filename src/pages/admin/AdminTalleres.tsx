import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus, Pencil, Trash2, CalendarDays, Clock,
  MapPin, Users, Sparkles, Eye, EyeOff, Loader2,
  Mail, Phone, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAdminTalleres, useDeleteTaller, useSaveTaller,
  useInscripcionesByTaller,
  isFutureTaller, tallerDateTime,
  type Taller,
} from "@/hooks/useTalleres";

// ── Inscritos dialog ──────────────────────────────────────────────────────────

function InscritosDialog({
  taller,
  open,
  onClose,
}: {
  taller: Taller & { taller_inscripciones: [{ count: number }] };
  open: boolean;
  onClose: () => void;
}) {
  const { data: inscritos, isLoading } = useInscripcionesByTaller(open ? taller.id : null);

  function downloadCSV() {
    if (!inscritos?.length) return;
    const header = "Nombre,Email,WhatsApp,Fecha de inscripción";
    const rows = inscritos.map((i) =>
      `"${i.name}","${i.email}","${i.whatsapp}","${format(new Date(i.created_at), "dd/MM/yyyy HH:mm")}"`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscritos-${taller.title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Inscritos — {taller.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
          </div>
        )}

        {!isLoading && inscritos?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Users className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Aún no hay inscripciones para este taller.</p>
          </div>
        )}

        {!isLoading && inscritos && inscritos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{inscritos.length}</span>{" "}
                {inscritos.length === 1 ? "persona inscrita" : "personas inscritas"}
              </p>
              <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Exportar CSV
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {inscritos.map((ins, i) => (
                <div
                  key={ins.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium text-foreground">{ins.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 shrink-0" />
                      <a href={`mailto:${ins.email}`} className="hover:underline truncate">
                        {ins.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <a href={`https://wa.me/${ins.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {ins.whatsapp}
                      </a>
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground/60">
                    {format(new Date(ins.created_at), "d MMM", { locale: es })}
                  </time>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminTalleres() {
  const { data: talleres, isLoading } = useAdminTalleres();
  const deleteMutation = useDeleteTaller();
  const saveMutation = useSaveTaller();

  const [inscritosOf, setInscritosOf] = useState<typeof talleres[0] | null>(null);

  const future = talleres?.filter((t) => isFutureTaller(t)) ?? [];
  const past = talleres?.filter((t) => !isFutureTaller(t)) ?? [];

  function togglePublished(t: { id: string; is_published: boolean }) {
    saveMutation.mutate({ id: t.id, is_published: !t.is_published });
  }

  function TallerRow({ t }: { t: typeof talleres[0] }) {
    const dt = tallerDateTime(t);
    const inscCount = t.taller_inscripciones?.[0]?.count ?? 0;

    return (
      <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 shadow-soft">
        {/* Thumbnail */}
        {t.image_url ? (
          <img src={t.image_url} alt={t.title} className="h-20 w-32 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-8 w-8 text-primary/30" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground truncate">{t.title}</p>
            {!t.is_published && <Badge variant="secondary" className="text-xs">Oculto</Badge>}
            {t.experience && (
              <Badge className="bg-primary/10 text-primary text-xs hover:bg-primary/10">
                <Sparkles className="mr-1 h-3 w-3" />
                Con experiencia
              </Badge>
            )}
          </div>
          {t.topic && <p className="mt-0.5 text-sm text-muted-foreground">{t.topic}</p>}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dt, "d MMM yyyy", { locale: es })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(dt, "HH:mm")} h
            </span>
            {t.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {t.location}
              </span>
            )}
            <span className={t.price === 0 ? "text-green-600 font-medium" : ""}>
              {t.price === 0
                ? "Gratuito"
                : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(t.price)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Inscritos button — shows count, opens dialog */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            title="Ver inscritos"
            onClick={() => setInscritosOf(t)}
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold">{inscCount}</span>
          </Button>

          <Button
            variant="ghost" size="icon"
            title={t.is_published ? "Ocultar" : "Publicar"}
            onClick={() => togglePublished(t)}
          >
            {t.is_published
              ? <Eye className="h-4 w-4" />
              : <EyeOff className="h-4 w-4 text-muted-foreground" />}
          </Button>

          <Button asChild variant="ghost" size="icon" title="Editar">
            <Link to={`/admin/talleres/${t.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
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
                <AlertDialogTitle>¿Eliminar "{t.title}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminarán también todas las inscripciones. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate(t.id)}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Talleres</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configura y gestiona los encuentros grupales
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/talleres/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo taller
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-xl bg-background" />
          ))}
        </div>
      )}

      {!isLoading && talleres?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No hay talleres todavía.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/admin/talleres/nuevo">Crear el primero</Link>
          </Button>
        </div>
      )}

      {!isLoading && future.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Próximos</h2>
          {future.map((t) => <TallerRow key={t.id} t={t} />)}
        </section>
      )}

      {!isLoading && past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Anteriores</h2>
          {past.map((t) => <TallerRow key={t.id} t={t} />)}
        </section>
      )}

      {/* Inscritos dialog */}
      {inscritosOf && (
        <InscritosDialog
          taller={inscritosOf}
          open={!!inscritosOf}
          onClose={() => setInscritosOf(null)}
        />
      )}
    </div>
  );
}
