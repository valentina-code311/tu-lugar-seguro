import { useRef, useEffect } from "react";
import { Bold, Italic, Underline, Link2 } from "lucide-react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Convert plain text to HTML (backward compatibility with old plain-text content)
export function toHtml(text: string): string {
  if (!text) return "";
  if (/<[^>]+>/.test(text)) return text;
  return text.replace(/\n/g, "<br>");
}

// ── Toolbar button ─────────────────────────────────────────────────────────────

export function ToolbarBtn({
  onMouseDown,
  title,
  children,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Preserve selection in contentEditable
        onMouseDown(e);
      }}
      title={title}
      className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

// ── Rich text editor ──────────────────────────────────────────────────────────

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Extra classes applied to the contentEditable div */
  editorClassName?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe aquí...",
  editorClassName,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const htmlContent = toHtml(content);
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
  }, [content]);

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function handleLink() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      toast.error("Selecciona texto primero para agregar un enlace");
      return;
    }
    const url = window.prompt("URL del enlace (ej: https://ejemplo.com):");
    if (url) exec("createLink", url);
  }

  return (
    <div>
      {/* Formatting toolbar */}
      <div className="mb-2 flex items-center gap-0.5 border-b border-border/50 pb-2">
        <ToolbarBtn onMouseDown={() => exec("bold")} title="Negrita (Ctrl+B)">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={() => exec("italic")} title="Cursiva (Ctrl+I)">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={() => exec("underline")} title="Subrayado (Ctrl+U)">
          <Underline className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarBtn onMouseDown={handleLink} title="Agregar enlace">
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      {/* ContentEditable editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        className={
          editorClassName ??
          "min-h-[120px] text-base leading-relaxed outline-none [&:empty]:before:text-muted-foreground/50 [&:empty]:before:content-[attr(data-placeholder)] [&_a]:text-primary [&_a]:underline"
        }
        data-placeholder={placeholder}
      />
    </div>
  );
}
