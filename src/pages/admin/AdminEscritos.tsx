import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { useAdminEscritos, useDeleteEscrito } from "@/hooks/useEscritos";

export default function AdminEscritos() {
  const { data: escritos, isLoading } = useAdminEscritos();
  const deleteMutation = useDeleteEscrito();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Escritos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reflexiones y textos largos publicados en el sitio
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/escritos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo escrito
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Cargando escritos...
        </div>
      )}

      {!isLoading && escritos?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">Aún no hay escritos.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/admin/escritos/nuevo">Crear el primero</Link>
          </Button>
        </div>
      )}

      {!isLoading && escritos && escritos.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Última edición</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {escritos.map((escrito) => (
                <tr key={escrito.id} className="transition-colors hover:bg-background/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{escrito.title || "(Sin título)"}</p>
                    {escrito.excerpt && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {escrito.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {escrito.status === "published" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Borrador</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(escrito.updated_at), "d MMM yyyy, HH:mm", { locale: es })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {escrito.status === "published" && (
                        <Button asChild variant="ghost" size="icon" title="Ver en el sitio">
                          <Link to={`/escritos/${escrito.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon" title="Editar">
                        <Link to={`/admin/escritos/${escrito.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este escrito?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se eliminará "{escrito.title || "sin título"}" y todos sus bloques de
                              contenido. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => deleteMutation.mutate(escrito.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
