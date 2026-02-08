import { useState } from "react";
import { MessageCircle, Clock, Info } from "lucide-react";
import { WHATSAPP_URL, EMAIL } from "@/lib/constants";

const Agenda = () => {
  const [form, setForm] = useState({ nombre: "", pronombres: "", correo: "", motivo: "", modalidad: "online", consentimiento: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola Maryen, me gustaría agendar una sesión.\n\nNombre: ${form.nombre}\nPronombres: ${form.pronombres}\nCorreo: ${form.correo}\nMotivo: ${form.motivo}\nModalidad: ${form.modalidad}`;
    window.open(`https://wa.me/573208621614?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-card" aria-labelledby="agenda-title">
        <div className="container max-w-3xl">
          <h1 id="agenda-title" className="text-4xl md:text-5xl font-bold mb-8">Agenda tu sesión</h1>

          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent mt-1 shrink-0" />
              <div>
                <h2 className="font-semibold mb-1">Horarios de atención</h2>
                <p className="text-muted-foreground">Lunes a viernes: 8:00 – 12:00 / 13:30 – 19:00</p>
                <p className="text-muted-foreground">Sábados: 8:00 – 11:00</p>
                <p className="text-muted-foreground text-sm">No se atiende domingos ni festivos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-1 shrink-0" />
              <div>
                <h2 className="font-semibold mb-1">Reserva y cancelación</h2>
                <p className="text-muted-foreground">Reserva con el 50% anticipado (efectivo, Nequi o transferencia).</p>
                <p className="text-muted-foreground text-sm mt-1">
                  <strong>Cancelación online:</strong> mínimo 1 hora de anticipación. <strong>Presencial:</strong> mínimo 3 horas.
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Dentro de la ventana: devolución parcial del 40% o reprogramación. Fuera de ventana: se pierde la reserva.
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Si la profesional cancela: reprogramación prioritaria o devolución total.
                </p>
              </div>
            </div>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-cta text-cta-foreground font-bold text-lg hover:opacity-90 transition-opacity mb-12"
          >
            <MessageCircle className="w-5 h-5" />
            Agendar por WhatsApp
          </a>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary" aria-labelledby="form-title">
        <div className="container max-w-xl">
          <h2 id="form-title" className="text-2xl font-bold mb-6">Formulario de contacto (opcional)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre</label>
              <input id="nombre" type="text" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pronombres" className="block text-sm font-medium mb-1">Pronombres</label>
              <input id="pronombres" type="text" maxLength={50} placeholder="Ej.: elle, ella, él" className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground" value={form.pronombres} onChange={(e) => setForm({ ...form, pronombres: e.target.value })} />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input id="correo" type="email" required maxLength={255} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
            </div>
            <div>
              <label htmlFor="motivo" className="block text-sm font-medium mb-1">Breve motivo de consulta</label>
              <textarea id="motivo" rows={3} maxLength={500} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground resize-none" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
            </div>
            <div>
              <label htmlFor="modalidad" className="block text-sm font-medium mb-1">Modalidad preferida</label>
              <select id="modalidad" className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground" value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}>
                <option value="online">Online</option>
                <option value="presencial">Presencial (Zona Norte, Cali)</option>
              </select>
            </div>
            <div className="flex items-start gap-2">
              <input id="consentimiento" type="checkbox" required checked={form.consentimiento} onChange={(e) => setForm({ ...form, consentimiento: e.target.checked })} className="mt-1 accent-cta" />
              <label htmlFor="consentimiento" className="text-sm text-muted-foreground">
                Acepto que mis datos sean utilizados para contactarme. Puedo ejercer mis derechos escribiendo a {EMAIL}.
              </label>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity">
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Agenda;
