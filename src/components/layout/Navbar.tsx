import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Sobre mí", path: "/sobre-mi" },
  { label: "Servicios", path: "/servicios" },
  { label: "Tienda", path: "/tienda" },
  { label: "Infoproductos", path: "/infoproductos" },
  { label: "Agenda", path: "/agenda" },
  { label: "Contacto", path: "/contacto" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold tracking-tight text-foreground lg:text-xl">
            Psicosexvalendm
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Psicóloga · Sexóloga
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-cream text-accent-foreground"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary-hover" onClick={() => navigate("/admin")}>
              <Shield className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => navigate("/auth")}>
              <User className="h-5 w-5" />
            </Button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-cream lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
            className="overflow-hidden border-t border-border bg-surface lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-cream text-accent-foreground"
                      : "text-muted-foreground hover:text-secondary"
                  }`}
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
