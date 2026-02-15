import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Link as LinkIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

const ImageUpload = ({ value, onChange, bucket = "images", folder = "uploads" }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode("upload")} className={`text-xs px-3 py-1 rounded-full ${mode === "upload" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          <Upload className="w-3 h-3 inline mr-1" />Subir
        </button>
        <button type="button" onClick={() => setMode("url")} className={`text-xs px-3 py-1 rounded-full ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          <LinkIcon className="w-3 h-3 inline mr-1" />URL
        </button>
      </div>

      {mode === "upload" ? (
        <label className="block cursor-pointer border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <p className="text-sm text-muted-foreground">{uploading ? "Subiendo…" : "Clic para subir imagen"}</p>
        </label>
      ) : (
        <div className="flex gap-2">
          <input type="url" placeholder="https://..." value={urlInput} onChange={e => setUrlInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          <button type="button" onClick={() => onChange(urlInput)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">OK</button>
        </div>
      )}

      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-20 rounded-lg object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-1 -right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
