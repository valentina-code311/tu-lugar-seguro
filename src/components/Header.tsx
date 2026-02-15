import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, CalendarIcon, Shield } from "lucide-react";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo-maryen.png";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border" role="banner">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2" aria-label="Inicio - Maryen Chamorro Psicóloga">
          <img src={logo} alt="Logo Maryen Chamorro" className="h-10 w-10 md:h-12 md:w-12" />
          <div className="hidden sm:block">
            <span className="font-serif text-lg font-semibold text-primary leading-tight block">Maryen Chamorro</span>
            <span className="text-xs text-muted-foreground">Psicóloga Humanista</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary hover:text-primary ${
                location.pathname === link.href ? "bg-secondary text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/agenda" className="ml-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cta text-cta-foreground hover:opacity-90 transition-opacity">
            <CalendarIcon className="w-4 h-4" /> Agendar
          </Link>
          {isAdmin && (
            <Link to="/admin" className="ml-1 p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-primary transition-colors" aria-label="Panel admin">
              <Shield className="w-4 h-4" />
            </Link>
          )}
        </nav>

        <button className="lg:hidden p-2 text-primary" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-card pb-4" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${location.pathname === link.href ? "bg-secondary text-primary" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-2 flex gap-2">
            <Link to="/agenda" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cta text-cta-foreground">
              <CalendarIcon className="w-4 h-4" /> Agendar
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-muted-foreground">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
