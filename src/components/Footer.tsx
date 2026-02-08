import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube, Mail, Phone } from "lucide-react";
import { SOCIAL, EMAIL, WHATSAPP_NUMBER, TARJETA_PROFESIONAL } from "@/lib/constants";
import logo from "@/assets/logo-maryen.png";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground" role="contentinfo">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="" className="h-10 w-10 brightness-0 invert" aria-hidden="true" />
            <span className="font-serif text-xl font-semibold">Maryen Chamorro</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Psicóloga con enfoque humanista e interseccional feminista. Acompaño a jóvenes y personas LGBTIQ+ en Cali y online.
          </p>
          <p className="text-xs opacity-60 mt-3">Tarjeta profesional: {TARJETA_PROFESIONAL}</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4 text-primary-foreground">Navegación</h3>
          <ul className="space-y-2">
            {[
              { label: "Sobre mí", href: "/sobre-mi" },
              { label: "Servicios", href: "/servicios" },
              { label: "Talleres", href: "/talleres" },
              { label: "Escritos", href: "/blog" },
              { label: "Ética", href: "/etica" },
              { label: "Privacidad", href: "/privacidad" },
            ].map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4 text-primary-foreground">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm opacity-80">
              <Mail className="w-4 h-4 shrink-0" />
              <a href={`mailto:${EMAIL}`} className="hover:opacity-100 transition-opacity">{EMAIL}</a>
            </li>
            <li className="flex items-center gap-2 text-sm opacity-80">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{WHATSAPP_NUMBER}</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-xs opacity-60">
        <p>© {new Date().getFullYear()} Maryen Chamorro — Psicóloga. Todos los derechos reservados.</p>
        <p className="mt-1">
          Líneas de ayuda en Cali: <strong>106</strong> (orientación en salud mental) · <strong>123</strong> (emergencias)
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
