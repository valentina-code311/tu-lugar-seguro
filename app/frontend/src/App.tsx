import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Agenda from "./pages/Agenda";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEscritos from "./pages/admin/AdminEscritos";
import AdminEscritoEditor from "./pages/admin/AdminEscritoEditor";
import AdminTalleres from "./pages/admin/AdminTalleres";
import AdminTallerEditor from "./pages/admin/AdminTallerEditor";
import AdminAgenda from "./pages/admin/AdminAgenda";
import AdminConfiguracion from "./pages/admin/AdminConfiguracion";
import AdminMensajes from "./pages/admin/AdminMensajes";
import AdminPacientes from "./pages/admin/AdminPacientes";
import AdminPacienteDetalle from "./pages/admin/AdminPacienteDetalle";
import AdminSesionEditor from "./pages/admin/AdminSesionEditor";
import Talleres from "./pages/Talleres";
import Escritos from "./pages/Escritos";
import EscritoDetail from "./pages/EscritoDetail";
import NotFound from "./pages/NotFound";

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
