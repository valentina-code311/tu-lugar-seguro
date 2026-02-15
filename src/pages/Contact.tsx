import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <section className="bg-surface py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Contacto</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground lg:text-5xl">Hablemos</h1>
            <p className="mt-4 text-muted-foreground">Estoy aquí para ayudarte. Escríbeme y te responderé lo antes posible.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              {[
                { icon: Mail, label: "Email", value: "hola@psicosexvalendm.com" },
                { icon: Phone, label: "Teléfono", value: "+57 300 123 4567" },
                { icon: MapPin, label: "Ubicación", value: "Consulta presencial y online" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-accent-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full gap-2">
                <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp directo
                </a>
              </Button>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:col-span-3"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
                  <Input placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Asunto</label>
                <Input placeholder="¿En qué puedo ayudarte?" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Mensaje</label>
                <Textarea placeholder="Cuéntame..." rows={5} />
              </div>
              <Button type="button" className="w-full gap-2" size="lg">
                <Send className="h-4 w-4" /> Enviar mensaje
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
