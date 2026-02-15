import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter, MessageCircle, Music2, Heart } from "lucide-react";
import { socialLinks } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Instagram, Youtube, Twitter, MessageCircle, Music2,
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Psicosexvalendm</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Psicóloga · Sexóloga</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Salud mental y sexualidad sin tabúes. Acompañamiento profesional, cálido y basado en evidencia.
            </p>
            <div className="flex gap-3">
              {socialLinks.filter(s => s.active).map((social) => {
                const Icon = iconMap[social.icon] || Heart;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-foreground">Navegación</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Inicio", path: "/" },
                { label: "Sobre mí", path: "/sobre-mi" },
                { label: "Servicios", path: "/servicios" },
                { label: "Tienda", path: "/tienda" },
                { label: "Infoproductos", path: "/infoproductos" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-secondary transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-foreground">Soporte</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Contacto", path: "/contacto" },
                { label: "Agenda tu cita", path: "/agenda" },
                { label: "Preguntas frecuentes", path: "/#faq" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-secondary transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Términos y condiciones", path: "/legal#terminos" },
                { label: "Política de privacidad", path: "/legal#privacidad" },
                { label: "Política de envíos", path: "/legal#envios" },
                { label: "Devoluciones", path: "/legal#devoluciones" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-secondary transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Psicosexvalendm. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Este contenido es educativo y no reemplaza la atención médica profesional.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
