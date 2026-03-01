import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UserCheck, UserX, Phone, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useAllPatients,
  useCreatePatient,
  useUpdatePatient,
  type Patient,
} from "@/hooks/usePatients";

const EMPTY_FORM = {
  full_name: "",
  preferred_name: "",
  document_id: "",
  age: "",
  phone: "",
  email: "",
  pronouns: "",
  occupation: "",
  education: "",
  city: "",
  referral_source: "",
  notes: "",
  is_active: true,
};

export default function AdminPacientes() {
  const navigate = useNavigate();
  const { data: patients, isLoading } = useAllPatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function openNew() {
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  async function handleSave() {
    if (!form.full_name.trim()) return;
    await createMutation.mutateAsync({
      ...form,
      age: form.age ? Number(form.age) : null,
      document_id: form.document_id || null,
      preferred_name: form.preferred_name || null,
      pronouns: form.pronouns || null,
      occupation: form.occupation || null,
      education: form.education || null,
      city: form.city || null,
      referral_source: form.referral_source || null,
      phone: form.phone || null,
      email: form.email || null,
      notes: form.notes || null,
    });
    setOpen(false);
  }

  function toggleActive(patient: Patient) {
    updateMutation.mutate({ id: patient.id, is_active: !patient.is_active });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona el registro de pacientes y su historial clínico
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {patients?.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => navigate(`/admin/pacientes/${patient.id}`)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {(patient.preferred_name || patient.full_name).charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">
                    {patient.full_name}
                    {patient.preferred_name && patient.preferred_name !== patient.full_name && (
                      <span className="text-muted-foreground font-normal ml-1">
                        ({patient.preferred_name})
                      </span>
                    )}
                  </p>
                  {!patient.is_active && (
                    <Badge variant="secondary" className="shrink-0 text-xs">Archivado</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                  {patient.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {patient.phone}
                    </span>
                  )}
                  {patient.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </span>
                  )}
                  {patient.city && <span>{patient.city}</span>}
                  {patient.age && <span>{patient.age} años</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  title={patient.is_active ? "Archivar" : "Reactivar"}
                  onClick={() => toggleActive(patient)}
                >
                  {patient.is_active
                    ? <UserX className="h-4 w-4" />
                    : <UserCheck className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Ver detalle"
                  onClick={() => navigate(`/admin/pacientes/${patient.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {patients?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">No hay pacientes registrados.</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                Registrar el primero
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo paciente</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Nombre completo *</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Ej: Ana García López"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nombre preferido</Label>
                <Input
                  value={form.preferred_name}
                  onChange={(e) => setForm({ ...form, preferred_name: e.target.value })}
                  placeholder="Ej: Ana"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Pronombres</Label>
                <Input
                  value={form.pronouns}
                  onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
                  placeholder="Ej: ella/su"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Documento ID</Label>
                <Input
                  value={form.document_id}
                  onChange={(e) => setForm({ ...form, document_id: e.target.value })}
                  placeholder="CC / Pasaporte"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Edad</Label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Teléfono</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+57 300..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="paciente@email.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Ciudad</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Ocupación</Label>
                <Input
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Educación</Label>
                <Input
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Fuente de referencia</Label>
                <Input
                  value={form.referral_source}
                  onChange={(e) => setForm({ ...form, referral_source: e.target.value })}
                  placeholder="Ej: Autorreferido, redes sociales..."
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Notas internas</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || !form.full_name.trim()}
            >
              {createMutation.isPending ? "Guardando..." : "Crear paciente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
