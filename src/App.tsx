import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SobreMi from "./pages/SobreMi";
import Servicios from "./pages/Servicios";
import Agenda from "./pages/Agenda";
import Talleres from "./pages/Talleres";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Etica from "./pages/Etica";
import Privacidad from "./pages/Privacidad";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminServicios from "./pages/admin/AdminServicios";
import AdminTalleres from "./pages/admin/AdminTalleres";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminAgenda from "./pages/admin/AdminAgenda";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/sobre-mi" element={<SobreMi />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/talleres" element={<Talleres />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/etica" element={<Etica />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="servicios" element={<AdminServicios />} />
            <Route path="talleres" element={<AdminTalleres />} />
            <Route path="agenda" element={<AdminAgenda />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
