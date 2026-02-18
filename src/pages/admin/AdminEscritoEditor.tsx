import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Globe, Loader2, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/escritos/BlockEditor";
import {
  EditorBlock,
  useAdminEscrito,
  useSaveEscrito,
  uploadEscritoImage,
  toSlug,
} from "@/hooks/useEscritos";
import { toast } from "sonner";

export default function AdminEscritoEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nuevo";
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminEscrito(isNew ? undefined : id);
  const saveMutation = useSaveEscrito();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load existing data
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setExcerpt(existing.excerpt ?? "");
      setCoverImage(existing.cover_image ?? "");
      setBlocks(
        existing.escrito_blocks.map((b) => ({
          localId: b.id,
          type: b.type,
          content: b.content ?? "",
          image_url: b.image_url ?? "",
        }))
      );
      setSlugManuallyEdited(true);
    }
  }, [existing]);

  // Auto-generate slug from title (only when not manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugManuallyEdited]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }
    setUploadingCover(true);
    try {
      const url = await uploadEscritoImage(file);
      setCoverImage(url);
    } catch {
      toast.error("Error al subir la portada");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleSave(status: "draft" | "published") {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (!slug.trim()) {
      toast.error("El slug es obligatorio");
      return;
    }

    const saved = await saveMutation.mutateAsync({
      id: isNew ? undefined : id,
      title: title.trim(),
      slug: slug.trim(),
      cover_image: coverImage,
      excerpt: excerpt.trim(),
      status,
      blocks,
    });

    if (isNew && saved) {
      navigate(`/admin/escritos/${saved.id}`, { replace: true });
    }
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando escrito...
      </div>
    );
  }

  const isDraft = !existing || existing.status === "draft";

  return (
    <div className="mx-auto max-w-5xl space-y-0">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/escritos")}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a escritos
        </Button>

        <div className="flex items-center gap-2">
          {!isDraft && <Badge className="bg-green-100 text-green-700">Publicado</Badge>}
          {isDraft && <Badge variant="secondary">Borrador</Badge>}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={saveMutation.isPending}
            className="gap-1.5"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar borrador
          </Button>

          <Button
            size="sm"
            onClick={() => handleSave("published")}
            disabled={saveMutation.isPending}
            className="gap-1.5"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {isDraft ? "Publicar" : "Actualizar publicación"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main editor area */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del escrito..."
              className="w-full border-0 bg-transparent font-display text-4xl font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Resumen o extracto corto (aparece en el listado)..."
              className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-lg leading-relaxed text-muted-foreground placeholder:text-muted-foreground/40 shadow-none focus-visible:ring-0"
            />
          </div>

          <Separator />

          {/* Block editor */}
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          {/* Cover image */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <Label className="mb-3 block text-sm font-medium">Imagen de portada</Label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
            {coverImage ? (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={coverImage}
                  alt="Portada"
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 p-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                  >
                    Cambiar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={() => setCoverImage("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 transition-colors hover:border-primary hover:bg-primary/5"
              >
                {uploadingCover ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                )}
                <span className="text-xs text-muted-foreground">
                  {uploadingCover ? "Subiendo..." : "Subir portada"}
                </span>
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Metadatos</h3>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-xs text-muted-foreground">
                Slug (URL)
              </Label>
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm">
                <span className="text-muted-foreground/60 whitespace-nowrap">/escritos/</span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(toSlug(e.target.value));
                    setSlugManuallyEdited(true);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-foreground focus:outline-none"
                  placeholder="mi-escrito"
                />
              </div>
            </div>
          </div>

          {/* Word count */}
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {blocks.reduce((acc, b) => acc + (b.content?.split(/\s+/).filter(Boolean).length ?? 0), 0)}
              </span>{" "}
              palabras ·{" "}
              <span className="font-medium text-foreground">{blocks.length}</span>{" "}
              {blocks.length === 1 ? "bloque" : "bloques"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
