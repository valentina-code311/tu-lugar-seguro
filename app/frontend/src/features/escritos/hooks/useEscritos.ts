import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/shared/integrations/supabase/client";
import { Tables } from "@/shared/integrations/supabase/types";

export type Escrito = Tables<"escritos">;
export type EscritoBlock = Tables<"escrito_blocks">;
export type BlockType = "paragraph" | "heading" | "quote" | "image" | "separator" | "video" | "table";

export interface EscritoWithBlocks extends Escrito {
  escrito_blocks: EscritoBlock[];
}

// Local editor state for a block (uses a local id before DB save)
export interface EditorBlock {
  localId: string;
  type: BlockType;
  content: string;
  image_url: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Public queries ────────────────────────────────────────────────────────────

export function usePublishedEscritos() {
  return useQuery({
    queryKey: ["escritos", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("escritos")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Escrito[];
    },
  });
}

export function useEscritoBySlug(slug: string) {
  return useQuery({
    queryKey: ["escritos", "slug", slug],
    queryFn: async () => {
      const { data: escrito, error: e1 } = await supabase
        .from("escritos")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (e1) throw e1;

      const { data: blocks, error: e2 } = await supabase
        .from("escrito_blocks")
        .select("*")
        .eq("escrito_id", escrito.id)
        .order("sort_order", { ascending: true });
      if (e2) throw e2;

      return { ...escrito, escrito_blocks: blocks } as EscritoWithBlocks;
    },
    enabled: !!slug,
  });
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export function useAdminEscritos() {
  return useQuery({
    queryKey: ["admin", "escritos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("escritos")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Escrito[];
    },
  });
}

export function useAdminEscrito(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "escritos", id],
    queryFn: async () => {
      const { data: escrito, error: e1 } = await supabase
        .from("escritos")
        .select("*")
        .eq("id", id!)
        .single();
      if (e1) throw e1;

      const { data: blocks, error: e2 } = await supabase
        .from("escrito_blocks")
        .select("*")
        .eq("escrito_id", id!)
        .order("sort_order", { ascending: true });
      if (e2) throw e2;

      return { ...escrito, escrito_blocks: blocks } as EscritoWithBlocks;
    },
    enabled: !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

interface SaveEscritoPayload {
  id?: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  status: "draft" | "published";
  blocks: EditorBlock[];
}

export function useSaveEscrito() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveEscritoPayload) => {
      const { id, title, slug, cover_image, excerpt, status, blocks } = payload;

      const fields = {
        title,
        slug,
        cover_image: cover_image || null,
        excerpt: excerpt || null,
        status,
        // published_at is managed automatically by the DB trigger
      };

      let escrito: Escrito;

      if (id) {
        // 1a. Update existing escrito (avoids slug unique-constraint conflicts)
        const { data, error: e1 } = await supabase
          .from("escritos")
          .update(fields)
          .eq("id", id)
          .select()
          .single();
        if (e1) throw e1;
        escrito = data;

        // 2. Delete old blocks before re-inserting
        const { error: e2 } = await supabase
          .from("escrito_blocks")
          .delete()
          .eq("escrito_id", id);
        if (e2) throw e2;
      } else {
        // 1b. Insert new escrito
        const { data, error: e1 } = await supabase
          .from("escritos")
          .insert(fields)
          .select()
          .single();
        if (e1) throw e1;
        escrito = data;
      }

      // 3. Insert blocks
      if (blocks.length > 0) {
        const { error: e3 } = await supabase.from("escrito_blocks").insert(
          blocks.map((b, i) => ({
            escrito_id: escrito.id,
            type: b.type,
            content: b.content || null,
            image_url: b.image_url || null,
            sort_order: i,
          }))
        );
        if (e3) throw e3;
      }

      return escrito;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "escritos"] });
      qc.invalidateQueries({ queryKey: ["escritos"] });
      toast.success("Escrito guardado correctamente");
    },
    onError: (err: Error) => {
      toast.error(`Error al guardar: ${err.message}`);
    },
  });
}

export function useDeleteEscrito() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("escritos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "escritos"] });
      qc.invalidateQueries({ queryKey: ["escritos"] });
      toast.success("Escrito eliminado");
    },
    onError: (err: Error) => {
      toast.error(`Error al eliminar: ${err.message}`);
    },
  });
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadEscritoImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("escritos")
    .upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from("escritos").getPublicUrl(path);
  return data.publicUrl;
}
