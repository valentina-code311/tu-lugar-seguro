import { useState } from "react";
import Layout from "@/shared/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Send, HeartHandshake, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/shared/hooks/useSiteSettings";
import { useContactMessages } from "@/features/contacto/hooks/useContactMessages";
import { toast } from "sonner";

function extractIframeSrc(raw: string): string | null {
  const srcMatch = raw.match(/src="([^"]+)"/);
  return srcMatch ? srcMatch[1] : (raw.startsWith("http") ? raw : null);
}

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const { sendMessage, isSending } = useContactMessages();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactItems = [
    { icon: Mail,   label: "Email",     value: settings?.email    ?? "" },
    { icon: Phone,  label: "Teléfono",  value: settings?.phone    ?? "" },
    { icon: MapPin, label: "Ubicación", value: settings?.location ?? "" },
  ];

  const mapSrc = settings?.location_map_url
    ? extractIframeSrc(settings.location_map_url)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    try {
      await sendMessage(formData);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-background py-10 md:pt-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              <HeartHandshake className="h-5 w-5" />
              Contacto
            </span>
            <div className="mt-6 mx-2 text-muted-foreground">
              <p>Estoy aquí para ayudarte. Escríbeme y te responderé lo antes posible.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid gap-3 lg:grid-cols-5">

            {/* Info lateral */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card/80 p-4 shadow-lg space-y-6 lg:col-span-2"
            >
              <h3 className="font-display text-lg font-semibold text-primary">Encuéntrame</h3>

              {contactItems.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}

              <a
                href={settings?.whatsapp_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/20"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp directo
              </a>
            </motion.div>

            {/* Formulario */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card/80 p-6 shadow-lg space-y-4 lg:col-span-3"
            >
              <h3 className="font-display text-lg font-semibold text-primary">Escríbeme</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
                  <Input 
                    placeholder="Tu nombre" 
                    className="bg-background/60" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="bg-background/60" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Asunto</label>
                <Input 
                  placeholder="¿En qué puedo ayudarte?" 
                  className="bg-background/60" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Mensaje</label>
                <Textarea 
                  placeholder="Cuéntame..." 
                  rows={5} 
                  className="bg-background/60" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> 
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> 
                    Enviar mensaje
                  </>
                )}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Mapa */}
      {mapSrc && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-lg">
              <iframe
                src={mapSrc}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación en el mapa"
              />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Contact;
