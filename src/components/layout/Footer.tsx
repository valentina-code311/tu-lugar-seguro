import { Instagram, Youtube, Twitter, MessageCircle, Music2, Heart, Facebook } from "lucide-react";
import { socialLinks } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Instagram, Youtube, Twitter, MessageCircle, Music2, Facebook
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Maryen Chamorro</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Psicóloga Humanista</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tu lugar seguro para el autoconocimiento y el bienestar emocional.
            </p>
          </div>

          <div className="flex gap-3">
            {socialLinks.filter(s => s.active).map((social) => {
              const Icon = iconMap[social.icon] || Heart;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PsicoMaryen. Todos los derechos reservados.
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
