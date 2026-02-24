
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useContactMessages = () => {
  const queryClient = useQueryClient();

  // Fetch messages (for admin)
  const messagesQuery = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  // Submit new message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: Omit<ContactMessage, "id" | "is_read" | "created_at">) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([message])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Mensaje enviado con éxito. Te responderé pronto.");
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
    },
  });

  // Toggle read status
  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    },
  });

  // Delete message
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mensaje eliminado");
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    },
  });

  return {
    messages: messagesQuery.data,
    isLoading: messagesQuery.isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    toggleRead: toggleReadMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
  };
};
