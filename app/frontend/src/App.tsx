import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import Index from "@/features/home/pages/Index";
import About from "@/features/sobre-mi/pages/About";
import Services from "@/features/servicios/pages/Services";
import Agenda from "@/features/agenda/pages/Agenda";
import Contact from "@/features/contacto/pages/Contact";
import Auth from "@/features/auth/pages/Auth";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminEscritos from "@/features/escritos/pages/AdminEscritos";
import AdminEscritoEditor from "@/features/escritos/pages/AdminEscritoEditor";
import AdminTalleres from "@/features/talleres/pages/AdminTalleres";
import AdminTallerEditor from "@/features/talleres/pages/AdminTallerEditor";
import AdminAgenda from "@/features/agenda/pages/AdminAgenda";
import AdminConfiguracion from "@/features/configuracion/pages/AdminConfiguracion";
import AdminMensajes from "@/features/contacto/pages/AdminMensajes";
import AdminPacientes from "@/features/pacientes/pages/AdminPacientes";
import AdminPacienteDetalle from "@/features/pacientes/pages/AdminPacienteDetalle";
import AdminSesionEditor from "@/features/pacientes/pages/AdminSesionEditor";
import Talleres from "@/features/talleres/pages/Talleres";
import Escritos from "@/features/escritos/pages/Escritos";
import EscritoDetail from "@/features/escritos/pages/EscritoDetail";
import NotFound from "@/features/admin/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre-mi" element={<About />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/encuentros" element={<Talleres />} />
            <Route path="/escritos" element={<Escritos />} />
            <Route path="/escritos/:slug" element={<EscritoDetail />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="theme" element={<Navigate to="/admin" replace />} />
              <Route path="escritos" element={<AdminEscritos />} />
              <Route path="escritos/nuevo" element={<AdminEscritoEditor />} />
              <Route path="escritos/:id" element={<AdminEscritoEditor />} />
              <Route path="servicios" element={<Navigate to="/admin/configuracion?tab=servicios" replace />} />
              <Route path="valores" element={<Navigate to="/admin/configuracion?tab=valores" replace />} />
              <Route path="encuentros" element={<AdminTalleres />} />
              <Route path="encuentros/nuevo" element={<AdminTallerEditor />} />
              <Route path="encuentros/:id" element={<AdminTallerEditor />} />
              <Route path="agenda" element={<AdminAgenda />} />
              <Route path="mensajes" element={<AdminMensajes />} />
              <Route path="pacientes" element={<AdminPacientes />} />
              <Route path="pacientes/:id" element={<AdminPacienteDetalle />} />
              <Route path="sesiones/:id" element={<AdminSesionEditor />} />
              <Route path="configuracion" element={<AdminConfiguracion />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
