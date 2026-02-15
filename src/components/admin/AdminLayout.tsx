import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Palette,
  Share2,
  Package,
  BookOpen,
  ShoppingCart,
  Calendar,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Theme Preview", path: "/admin/theme", icon: Palette },
  { label: "Redes Sociales", path: "/admin/redes", icon: Share2 },
  { label: "Productos", path: "/admin/productos", icon: Package },
  { label: "Infoproductos", path: "/admin/infoproductos", icon: BookOpen },
  { label: "Pedidos", path: "/admin/pedidos", icon: ShoppingCart },
  { label: "Agenda", path: "/admin/agenda", icon: Calendar },
  { label: "Clientes", path: "/admin/clientes", icon: Users },
];

const AdminLayout = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-surface">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-lg font-bold text-foreground">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Psicosexvalendm</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-cream hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-cream hover:text-accent-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
