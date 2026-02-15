import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, GraduationCap, CalendarDays, FileText, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { href: "/admin/talleres", label: "Talleres", icon: GraduationCap },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 shrink-0 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Volver al sitio
          </Link>
          <h2 className="font-bold text-lg mt-2">Admin</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                (l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href))
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary w-full">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-2 p-3 border-b border-border bg-card overflow-x-auto">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                (l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href))
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
