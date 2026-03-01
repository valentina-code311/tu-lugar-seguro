import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, LogOut, ChevronLeft, PenLine, GraduationCap, Settings2, Mail, Users, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Escritos", path: "/admin/escritos", icon: PenLine },
  { label: "Encuentros", path: "/admin/encuentros", icon: GraduationCap },
  { label: "Agenda", path: "/admin/agenda", icon: Calendar },
  { label: "Pacientes", path: "/admin/pacientes", icon: Users },
  { label: "Mensajes", path: "/admin/mensajes", icon: Mail },
  { label: "Configuración", path: "/admin/configuracion", icon: Settings2 },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <>
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {adminNav.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-border p-3 space-y-0.5">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al sitio
        </Link>
        <SignOutButton />
      </div>
    </>
  );
}

function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <button
      onClick={signOut}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </button>
  );
}

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col border-r border-border bg-card shadow-soft">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold text-foreground">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Maryen Chamorro</p>
        </div>
        <NavItems />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 shadow-soft">
        <Button
          variant="ghost"
          size="icon"
          className="min-h-[44px] min-w-[44px]"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="font-display text-base font-bold text-foreground">Admin Panel</h2>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col bg-card">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle className="font-display text-lg font-bold">Admin Panel</SheetTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Maryen Chamorro</p>
          </SheetHeader>
          <NavItems onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 pt-[68px] md:pt-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
