import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, MessageCircle, UserPlus, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { WHATSAPP_URL, CALENDLY_URL } from "@/lib/constants";

const tabs = [
  { id: "directo", label: "Agendar directo", icon: Calendar },
  { id: "primera-vez", label: "Primera vez", icon: UserPlus },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Agendar = () => {
  const location = useLocation();
  const embedRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>(
    location.hash === "#directo" ? "directo" : "directo"
  );

  useEffect(() => {
    if (location.hash === "#directo" && embedRef.current) {
      embedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <>
      <section className="py-16 md:py-24 bg-card" aria-labelledby="agendar-title">
        <div className="container max-w-3xl">
          <h1 id="agendar-title" className="text-4xl md:text-5xl font-bold mb-4">
            Agenda tu sesión
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl">
            Si ya hemos trabajado antes o vienes con una referencia clara, puedes agendar directamente aquí.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8" role="tablist" aria-label="Tipo de agendamiento">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel: Agendar directo */}
          <div
            id="panel-directo"
            role="tabpanel"
            aria-labelledby="tab-directo"
            hidden={activeTab !== "directo"}
          >
            {/* Tips */}
            <div className="rounded-xl border border-border bg-secondary/50 p-5 mb-8">
              <h2 className="font-semibold mb-3 text-sm">Antes de agendar</h2>
              <ul className="space-y-2">
                {[
                  "Elige el tipo de sesión y horario",
                  "Revisa tu correo de confirmación",
                  "Si necesitas reprogramar, usa el enlace del correo",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendly embed */}
            <div ref={embedRef} className="mb-6">
              <div className="rounded-xl border border-border overflow-hidden bg-white">
                <iframe
                  src={CALENDLY_URL}
                  title="Agendar sesión con Maryen Chamorro"
                  className="w-full border-0"
                  style={{ minHeight: "700px" }}
                  loading="lazy"
                  allow="payment"
                />
              </div>
            </div>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en Calendly (si el calendario no carga)
            </a>
          </div>

          {/* Panel: Primera vez */}
          <div
            id="panel-primera-vez"
            role="tabpanel"
            aria-labelledby="tab-primera-vez"
            hidden={activeTab !== "primera-vez"}
          >
            <div className="rounded-xl border border-border bg-secondary/50 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-3">¿Es tu primera vez aquí?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Si es tu primera sesión, puedes contarme brevemente tu motivo de consulta para orientarte mejor. No es obligatorio, pero me ayuda a preparar un espacio más adecuado para ti.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                >
                  Ir a formulario de contacto
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cta text-cta-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribirme por WhatsApp
                </a>
              </div>
              <p className="text-xs text-muted-foreground">Respondo en 24–48h hábiles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-secondary border-t border-border">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este agendamiento no es para emergencias. Si estás en riesgo o necesitas ayuda inmediata, contacta servicios de emergencia locales:{" "}
              <strong>106</strong> (orientación en salud mental) o <strong>123</strong> (emergencias).{" "}
              <Link to="/privacidad" className="underline hover:text-primary">Política de privacidad</Link> ·{" "}
              <Link to="/etica" className="underline hover:text-primary">Marco ético</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Agendar;
