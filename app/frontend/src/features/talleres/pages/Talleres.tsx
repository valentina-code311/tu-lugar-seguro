import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarDays, Clock, MapPin, Users, BookOpen,
  Sparkles, AlertCircle, CheckCircle2, Ticket, Sprout,
} from "lucide-react";
import Layout from "@/shared/components/layout/Layout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  usePublishedTalleres, useInscribirse,
  isFutureTaller, isRegistrationOpen, tallerDateTime,
  type Taller,
} from "@/features/talleres/hooks/useTalleres";

// ── Registration dialog ───────────────────────────────────────────────────────

function InscripcionDialog({ taller, open, onClose }: { taller: Taller; open: boolean; onClose: () => void; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [done, setDone] = useState(false);
  const mutation = useInscribirse();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync({ taller_id: taller.id, name, email, whatsapp });
    setDone(true);
  }

  function handleClose() {
    setDone(false);
    setName(""); setEmail(""); setWhatsapp("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Inscripción al taller</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {taller.title}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-display text-lg font-semibold text-foreground">
              ¡Inscripción confirmada!
            </p>
            <p className="text-sm text-muted-foreground">
              Recibirás más información por correo. ¡Nos vemos el{" "}
              {format(tallerDateTime(taller), "d 'de' MMMM", { locale: es })}!
            </p>
            <Button onClick={handleClose} className="mt-2">Cerrar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+57 300 000 0000"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Confirmar inscripción"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Taller card ───────────────────────────────────────────────────────────────

function TallerCard({ taller, index, past = false }: { taller: Taller; index: number; past?: boolean; }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = isRegistrationOpen(taller);
  const dt = tallerDateTime(taller);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="overflow-hidden rounded-2xl bg-card/80 shadow-lg"
      >
        {/* Cover image */}
        {taller.image_url ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={taller.image_url}
              alt={taller.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-primary/10">
            <Users className="h-12 w-12 text-primary/30" />
          </div>
        )}

        <div className="p-6">
          {/* Topic badge */}
          {taller.topic && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {taller.topic}
            </span>
          )}

          <h3 className="font-display text-xl font-bold text-foreground">{taller.title}</h3>

          {/* Meta info */}
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              {format(dt, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              {format(dt, "HH:mm")} h
            </p>
            {taller.location && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                {taller.location}
              </p>
            )}
            <p className="flex items-center gap-2 font-medium">
              <Ticket className="h-4 w-4 shrink-0" />
              {taller.price === 0
                ? <span className="text-green-600">Gratuito</span>
                : <span className="text-foreground">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(taller.price)}
                </span>}
            </p>
          </div>

          {/* Purpose */}
          {taller.purpose && (
            <div className="mt-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                <BookOpen className="h-3.5 w-3.5" />
                Propósito
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">{taller.purpose}</p>
            </div>
          )}

          {/* Experience (past talleres) */}
          {past && taller.experience && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary/70">
                <Sparkles className="h-3.5 w-3.5" />
                Experiencia vivida
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">{taller.experience}</p>
            </div>
          )}

          {/* CTA (future only) */}
          {!past && (
            <div className="mt-5">
              {open ? (
                <Button className="w-full" onClick={() => setDialogOpen(true)}>
                  Inscribirme
                </Button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Inscripción cerrada (menos de 5 h para el evento)
                </div>
              )}
            </div>
          )}
        </div>
      </motion.article>

      {!past && (
        <InscripcionDialog
          taller={taller}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Talleres() {
  const { data: all, isLoading } = usePublishedTalleres();

  const future = all?.filter((t) => isFutureTaller(t)) ?? [];
  const past = all?.filter((t) => !isFutureTaller(t)).reverse() ?? [];

  return (
    <Layout>
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <Sprout className="h-5 w-5" />
              Encuentros
            </span>
            <div className="mt-6 mx-2 text-muted-foreground">
              <p>
                Espacios grupales para explorar, sentir y aprender en juntanza.
              </p>
              <p>
                Cada encuentro es un espacio único e irrepetible.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {isLoading && (
        <div className="container mx-auto pb-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 animate-pulse rounded-2xl bg-card/80" />
            ))}
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="bg-background pb-12">
          <div className="container mx-auto space-y-14">

            {/* Próximos talleres */}
            <section>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  Proximamente
                </h2>
                <div className="mt-1 h-1 w-12 rounded-full bg-primary" />
              </div>

              {future.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                  <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">Sin encuentros próximos por ahora</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estamos preparando nuevas experiencias. ¡Vuelve pronto!
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {future.map((t, i) => (
                    <TallerCard key={t.id} taller={t} index={i} />
                  ))}
                </div>
              )}
            </section>

            {/* Talleres anteriores */}
            {past.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    Experiencias pasadas
                  </h2>
                  <div className="mt-1 h-1 w-12 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {past.map((t, i) => (
                    <TallerCard key={t.id} taller={t} index={i} past />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
