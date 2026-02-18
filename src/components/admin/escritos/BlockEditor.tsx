import { useRef } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  AlignLeft,
  Heading2,
  Quote,
  ImageIcon,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EditorBlock, BlockType, uploadEscritoImage } from "@/hooks/useEscritos";
import { toast } from "sonner";
import { useState } from "react";

interface BlockEditorProps {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "paragraph", label: "Párrafo", icon: AlignLeft },
  { type: "heading", label: "Encabezado", icon: Heading2 },
  { type: "quote", label: "Cita", icon: Quote },
  { type: "image", label: "Imagen", icon: ImageIcon },
];

function newBlock(type: BlockType): EditorBlock {
  return {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    content: "",
    image_url: "",
  };
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [addingAt, setAddingAt] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  function updateBlock(localId: string, patch: Partial<EditorBlock>) {
    onChange(blocks.map((b) => (b.localId === localId ? { ...b, ...patch } : b)));
  }

  function removeBlock(localId: string) {
    onChange(blocks.filter((b) => b.localId !== localId));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addBlock(type: BlockType, afterIndex: number) {
    const next = [...blocks];
    next.splice(afterIndex + 1, 0, newBlock(type));
    onChange(next);
    setAddingAt(null);
  }

  async function handleImageFile(localId: string, file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }
    setUploadingId(localId);
    try {
      const url = await uploadEscritoImage(file);
      updateBlock(localId, { image_url: url });
    } catch (err) {
      toast.error("Error al subir la imagen");
    } finally {
      setUploadingId(null);
    }
  }

  function triggerFileInput(localId: string) {
    uploadTargetId.current = localId;
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && uploadTargetId.current) {
      handleImageFile(uploadTargetId.current, file);
    }
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      {/* Hidden file input shared across all image blocks */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
          <AlignLeft className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">El escrito está vacío.</p>
          <p className="text-xs text-muted-foreground">Agrega el primer bloque abajo.</p>
        </div>
      )}

      {blocks.map((block, index) => (
        <div key={block.localId} className="group relative">
          {/* Block card */}
          <div className="rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-soft">
            {/* Block header: type label + controls */}
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {BLOCK_OPTIONS.find((o) => o.type === block.type)?.icon &&
                  (() => {
                    const Icon = BLOCK_OPTIONS.find((o) => o.type === block.type)!.icon;
                    return <Icon className="h-3.5 w-3.5" />;
                  })()}
                {BLOCK_OPTIONS.find((o) => o.type === block.type)?.label}
              </span>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                  title="Mover arriba"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  title="Mover abajo"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeBlock(block.localId)}
                  title="Eliminar bloque"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Block content */}
            {block.type === "paragraph" && (
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.localId, { content: e.target.value })}
                placeholder="Escribe tu párrafo aquí..."
                className="min-h-[120px] resize-y border-0 bg-transparent p-0 text-base leading-relaxed shadow-none focus-visible:ring-0"
              />
            )}

            {block.type === "heading" && (
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.localId, { content: e.target.value })}
                placeholder="Encabezado..."
                className="border-0 bg-transparent p-0 font-display text-2xl font-bold shadow-none focus-visible:ring-0"
              />
            )}

            {block.type === "quote" && (
              <div className="border-l-4 border-primary pl-4">
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.localId, { content: e.target.value })}
                  placeholder="Escribe una cita o frase reflexiva..."
                  className="min-h-[80px] resize-y border-0 bg-transparent p-0 text-lg italic leading-relaxed text-foreground/80 shadow-none focus-visible:ring-0"
                />
              </div>
            )}

            {block.type === "image" && (
              <div className="space-y-3">
                {block.image_url ? (
                  <div className="group/img relative overflow-hidden rounded-lg">
                    <img
                      src={block.image_url}
                      alt="Imagen del bloque"
                      className="w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => triggerFileInput(block.localId)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100"
                    >
                      <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-foreground">
                        Cambiar imagen
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => triggerFileInput(block.localId)}
                    disabled={uploadingId === block.localId}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-12 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {uploadingId === block.localId ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Subiendo imagen...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground">
                          Haz clic para subir una imagen
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          PNG, JPG, WEBP — máx. 5 MB
                        </span>
                      </>
                    )}
                  </button>
                )}
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(block.localId, { content: e.target.value })}
                  placeholder="Pie de foto (opcional)"
                  className="text-sm text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Add block button between blocks */}
          <div className="relative flex items-center justify-center py-1">
            {addingAt === index ? (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1 shadow-soft">
                {BLOCK_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => addBlock(opt.type, index)}
                    className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    title={opt.label}
                  >
                    <opt.icon className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => setAddingAt(null)}
                  className="ml-1 rounded-full px-2 py-1 text-xs text-muted-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingAt(index)}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground opacity-0 shadow-soft transition-all group-hover:opacity-100 hover:border-primary hover:text-primary"
                title="Agregar bloque"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add block at the end */}
      <div className="flex items-center gap-2 pt-2">
        {BLOCK_OPTIONS.map((opt) => (
          <Button
            key={opt.type}
            variant="outline"
            size="sm"
            onClick={() => {
              onChange([...blocks, newBlock(opt.type)]);
            }}
            className="gap-1.5"
          >
            <opt.icon className="h-3.5 w-3.5" />
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
