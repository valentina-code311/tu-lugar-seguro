import { useRef, useState } from "react";
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
  Minus,
  Video,
  Table,
  Rows3,
  Columns3,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { EditorBlock, BlockType, uploadEscritoImage } from "@/features/escritos/hooks/useEscritos";
import { toast } from "sonner";
import { RichTextEditor } from "@/shared/components/RichTextEditor";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

function parseTable(content: string): TableData {
  try {
    const d = JSON.parse(content);
    if (Array.isArray(d.headers) && Array.isArray(d.rows)) return d;
  } catch {}
  return { headers: ["Columna 1", "Columna 2"], rows: [["", ""]] };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function VideoEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  const embedUrl = getYoutubeEmbedUrl(content);

  return (
    <div className="space-y-3">
      <Input
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
        className="font-mono text-sm"
      />
      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-lg bg-black/5">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Vista previa del video"
          />
        </div>
      ) : content ? (
        <p className="text-xs text-destructive">URL de YouTube no válida</p>
      ) : null}
    </div>
  );
}

function TableEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  const data = parseTable(content);

  function update(newData: TableData) {
    onChange(JSON.stringify(newData));
  }

  function updateHeader(ci: number, value: string) {
    const headers = [...data.headers];
    headers[ci] = value;
    update({ ...data, headers });
  }

  function updateCell(ri: number, ci: number, value: string) {
    const rows = data.rows.map((r) => [...r]);
    rows[ri][ci] = value;
    update({ ...data, rows });
  }

  function addRow() {
    update({ ...data, rows: [...data.rows, data.headers.map(() => "")] });
  }

  function removeRow(ri: number) {
    update({ ...data, rows: data.rows.filter((_, j) => j !== ri) });
  }

  function addCol() {
    update({
      headers: [...data.headers, `Columna ${data.headers.length + 1}`],
      rows: data.rows.map((r) => [...r, ""]),
    });
  }

  function removeCol(ci: number) {
    update({
      headers: data.headers.filter((_, j) => j !== ci),
      rows: data.rows.map((r) => r.filter((_, j) => j !== ci)),
    });
  }

  return (
    <div className="space-y-2 overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {data.headers.map((h, ci) => (
              <th key={ci} className="border border-border bg-muted/50 p-0">
                <div className="flex items-center">
                  <input
                    value={h}
                    onChange={(e) => updateHeader(ci, e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-2 py-1.5 font-semibold outline-none"
                    placeholder={`Col ${ci + 1}`}
                  />
                  {data.headers.length > 1 && (
                    <button
                      onClick={() => removeCol(ci)}
                      className="mr-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-muted-foreground/50 hover:text-destructive"
                      title="Eliminar columna"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </th>
            ))}
            {/* Add column */}
            <th className="w-8 border border-dashed border-border/60 bg-muted/20 p-0">
              <button
                onClick={addCol}
                className="flex w-full items-center justify-center py-2 text-muted-foreground/60 hover:text-primary"
                title="Agregar columna"
              >
                <Columns3 className="h-3.5 w-3.5" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-border p-0">
                  <input
                    value={cell}
                    onChange={(e) => updateCell(ri, ci, e.target.value)}
                    className="w-full bg-transparent px-2 py-1.5 outline-none"
                    placeholder="..."
                  />
                </td>
              ))}
              {/* Delete row */}
              <td className="border border-border p-0 text-center">
                {data.rows.length > 1 && (
                  <button
                    onClick={() => removeRow(ri)}
                    className="flex w-full items-center justify-center py-2 text-muted-foreground/50 hover:text-destructive"
                    title="Eliminar fila"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </td>
            </tr>
          ))}
          {/* Add row */}
          <tr>
            <td
              colSpan={data.headers.length + 1}
              className="border border-dashed border-border/60 p-0"
            >
              <button
                onClick={addRow}
                className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-muted-foreground/60 hover:text-primary"
                title="Agregar fila"
              >
                <Rows3 className="h-3.5 w-3.5" />
                Agregar fila
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Block options ─────────────────────────────────────────────────────────────

interface BlockEditorProps {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "paragraph", label: "Párrafo", icon: AlignLeft },
  { type: "heading", label: "Encabezado", icon: Heading2 },
  { type: "quote", label: "Cita", icon: Quote },
  { type: "image", label: "Imagen", icon: ImageIcon },
  { type: "separator", label: "Separador", icon: Minus },
  { type: "video", label: "Video", icon: Video },
  { type: "table", label: "Tabla", icon: Table },
];

function newBlock(type: BlockType): EditorBlock {
  let defaultContent = "";
  if (type === "table") {
    defaultContent = JSON.stringify({
      headers: ["Columna 1", "Columna 2"],
      rows: [["", ""]],
    });
  }
  return {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    content: defaultContent,
    image_url: "",
  };
}

// ── Main component ────────────────────────────────────────────────────────────

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
    } catch {
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
          <div className="rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-soft">
            {/* Block header: type label + controls */}
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {(() => {
                  const opt = BLOCK_OPTIONS.find((o) => o.type === block.type);
                  if (!opt) return null;
                  const Icon = opt.icon;
                  return (
                    <>
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </>
                  );
                })()}
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

            {/* ── Block content ── */}

            {block.type === "paragraph" && (
              <RichTextEditor
                content={block.content}
                onChange={(html) => updateBlock(block.localId, { content: html })}
                placeholder="Escribe tu párrafo aquí..."
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

            {block.type === "separator" && (
              <div className="flex items-center justify-center py-3">
                <span className="select-none text-2xl font-light tracking-[0.5em] text-muted-foreground/40">
                  · · ·
                </span>
              </div>
            )}

            {block.type === "video" && (
              <VideoEditor
                content={block.content}
                onChange={(v) => updateBlock(block.localId, { content: v })}
              />
            )}

            {block.type === "table" && (
              <TableEditor
                content={block.content}
                onChange={(v) => updateBlock(block.localId, { content: v })}
              />
            )}
          </div>

          {/* Add block button between blocks */}
          <div className="relative flex items-center justify-center py-1">
            {addingAt === index ? (
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-background p-1.5 shadow-soft">
                {BLOCK_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => addBlock(opt.type, index)}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
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
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 shadow-soft transition-all group-hover:opacity-100 hover:border-primary hover:text-primary"
                title="Agregar bloque"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add block at the end */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {BLOCK_OPTIONS.map((opt) => (
          <Button
            key={opt.type}
            variant="outline"
            size="sm"
            onClick={() => onChange([...blocks, newBlock(opt.type)])}
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
