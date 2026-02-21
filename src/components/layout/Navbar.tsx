import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-maryen.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Sobre mí", path: "/sobre-mi" },
  { label: "Servicios", path: "/servicios" },
  { label: "Encuentros", path: "/talleres" },
  { label: "Escritos", path: "/escritos" },
  { label: "Agenda", path: "/agenda" },
  { label: "Contacto", path: "/contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-primary-foreground/70 backdrop-blur-lg relative">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        <Link to="/" className="flex items-center gap-4" aria-label="Inicio - Maryen Chamorro Psicóloga">
          <img src={logo} alt="Logo Maryen Chamorro" className="h-10 w-10 md:h-12 md:w-12" />
          <div>
            <span className="font-serif text-lg font-semibold text-primary leading-tight block">Maryen Chamorro</span>
            <span className="text-xs text-muted-foreground">Psicóloga Humanista</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent",
                location.pathname === item.path
                  ? "border-primary"
                  : "text-muted-foreground hover:border-muted-foreground/50 hover:text-muted-foreground/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="ghost" size="icon"
              onClick={() => navigate("/admin")}
            >
              <Shield className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full overflow-hidden border-b border-border bg-primary-foreground/70 backdrop-blur-lg shadow-md lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    `rounded-lg px-4 py-3 text-sm font-medium transition-colors`,
                    location.pathname === item.path
                      ? "border-b border-primary"
                      : "text-muted-foreground hover:text-muted-foreground/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-primary"
                >
                  Panel Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
