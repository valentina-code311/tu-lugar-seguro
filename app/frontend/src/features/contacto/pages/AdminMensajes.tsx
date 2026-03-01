
import { useContactMessages } from "@/features/contacto/hooks/useContactMessages";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  User, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export default function AdminMensajes() {
  const { messages, isLoading, toggleRead, deleteMessage } = useContactMessages();

  if (isLoading) {
    return <div className="p-8 text-center">Cargando mensajes...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Mensajes de Contacto</h1>
        <Badge variant="outline" className="px-3 py-1">
          {messages?.filter(m => !m.is_read).length} nuevos
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {messages?.map((msg) => (
          <Card key={msg.id} className={`${!msg.is_read ? "border-primary/50 bg-primary/5" : ""} transition-colors`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{msg.subject || "Sin asunto"}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{msg.name}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRead({ id: msg.id, is_read: !msg.is_read })}
                  title={msg.is_read ? "Marcar como no leído" : "Marcar como leído"}
                >
                  {msg.is_read ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-primary" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{msg.email}</span>
                <span className="mx-1">•</span>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(msg.created_at), "d MMM, HH:mm", { locale: es })}</span>
              </div>
              
              <ScrollArea className="h-24 rounded-md border bg-background/50 p-3 text-sm">
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </ScrollArea>

              <div className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará el mensaje de forma permanente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMessage(msg.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
            <MessageSquare className="mb-4 h-12 w-12 opacity-20" />
            <p>No hay mensajes todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
