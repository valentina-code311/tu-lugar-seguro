import { motion } from "framer-motion";

const tokens = {
  "Marca": [
    { name: "Primary", variable: "--primary", hex: "#670F28", desc: "CTAs, botones principales, badges activos" },
    { name: "Primary Hover", variable: "--primary-hover", hex: "#600C23", desc: "Hover de botones principales" },
    { name: "Secondary", variable: "--secondary", hex: "#8A3D4B", desc: "Links, textos de acento, subtítulos" },
  ],
  "Fondos": [
    { name: "Background", variable: "--background", hex: "#F6E4E6", desc: "Fondo general de la app" },
    { name: "Surface", variable: "--surface", hex: "#FFFFFF", desc: "Cards, modales, navbar, footer" },
    { name: "Highlight Cream", variable: "--highlight-cream", hex: "#F1E0D2", desc: "Secciones destacadas, badges default" },
  ],
  "Texto": [
    { name: "Text Primary", variable: "--foreground", hex: "#1F1B1C", desc: "Texto principal, títulos" },
    { name: "Text Muted", variable: "--muted-foreground", hex: "#6B5E62", desc: "Texto secundario, descripciones" },
    { name: "Primary Foreground", variable: "--primary-foreground", hex: "#FFFFFF", desc: "Texto sobre fondo primary" },
  ],
  "Bordes": [
    { name: "Border", variable: "--border", hex: "#EAD9DD", desc: "Bordes de cards, inputs, divisores" },
  ],
  "Estados UI": [
    { name: "Success", variable: "--success", hex: "#1E8E5A", desc: "Confirmaciones, checks" },
    { name: "Warning", variable: "--warning", hex: "#D97706", desc: "Alertas, estrellas" },
    { name: "Error", variable: "--error", hex: "#DC2626", desc: "Errores, destructivo" },
    { name: "Info", variable: "--info", hex: "#2563EB", desc: "Información, links informativos" },
  ],
};

const ThemePreview = () => {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Theme Preview</h1>
        <p className="mt-2 text-muted-foreground">Tokens de diseño del sistema. Source of truth para toda la UI.</p>
      </motion.div>

      {/* Color Tokens */}
      <div className="mt-8 space-y-8">
        {Object.entries(tokens).map(([group, items]) => (
          <div key={group}>
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((token) => (
                <div
                  key={token.variable}
                  className="rounded-xl border border-border bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-12 w-12 shrink-0 rounded-lg border border-border"
                      style={{ backgroundColor: token.hex }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{token.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{token.hex}</p>
                      <p className="font-mono text-xs text-muted-foreground">{token.variable}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{token.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Typography Preview */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Tipografía</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Display</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">Playfair Display</p>
            <p className="mt-1 font-display text-lg italic text-muted-foreground">Elegante y con personalidad</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Body</p>
            <p className="mt-2 font-body text-3xl font-bold text-foreground">DM Sans</p>
            <p className="mt-1 font-body text-lg text-muted-foreground">Limpia y legible</p>
          </div>
        </div>
      </div>

      {/* Component Preview */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Componentes</h2>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Botones</p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
                  Primary CTA
                </button>
                <button className="rounded-md border border-secondary px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary">
                  Secondary
                </button>
                <button className="rounded-md px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary">
                  Ghost
                </button>
                <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-destructive/90">
                  Destructive
                </button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Badges / Chips</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-accent-foreground">Default</span>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Activo</span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">Éxito</span>
                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">Alerta</span>
                <span className="rounded-full bg-error/10 px-3 py-1 text-xs font-medium text-error">Error</span>
              </div>
            </div>

            {/* Input */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Inputs</p>
              <div className="max-w-sm space-y-3">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  placeholder="Input normal"
                />
                <input
                  className="flex h-10 w-full rounded-md border-2 border-error bg-surface px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
                  placeholder="Input con error"
                />
              </div>
            </div>

            {/* Card */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Card</p>
              <div className="max-w-sm rounded-xl border border-border bg-surface p-5 shadow-card">
                <h3 className="font-display text-lg font-semibold text-foreground">Título de la card</h3>
                <p className="mt-1 text-sm text-muted-foreground">Descripción con texto muted sobre fondo surface.</p>
                <div className="mt-4">
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
                    Acción
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Alertas / Toasts</p>
              <div className="space-y-2 max-w-md">
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success">
                  ✓ Operación exitosa
                </div>
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
                  ⚠ Advertencia: revisa los datos
                </div>
                <div className="rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error">
                  ✕ Error al procesar la solicitud
                </div>
                <div className="rounded-lg border border-info/30 bg-info/5 p-3 text-sm text-info">
                  ℹ Información importante
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
