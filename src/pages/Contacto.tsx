import { MessageCircle, Mail, MapPin, Instagram, Linkedin, Youtube } from "lucide-react";
import { WHATSAPP_URL, EMAIL, SOCIAL } from "@/lib/constants";

const Contacto = () => (
  <section className="py-16 md:py-24 bg-card" aria-labelledby="contacto-title">
    <div className="container max-w-3xl">
      <h1 id="contacto-title" className="text-4xl md:text-5xl font-bold mb-8">Contacto</h1>

      <div className="space-y-6 mb-12">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
          <div>
            <h2 className="font-semibold mb-1">Ubicación</h2>
            <p className="text-muted-foreground">Zona Norte, Cali, Colombia</p>
            <p className="text-sm text-muted-foreground">Atención presencial y online</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-accent mt-1 shrink-0" />
          <div>
            <h2 className="font-semibold mb-1">Correo</h2>
            <a href={`mailto:${EMAIL}`} className="text-cta hover:underline">{EMAIL}</a>
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-cta text-cta-foreground font-bold text-lg hover:opacity-90 transition-opacity mb-12"
      >
        <MessageCircle className="w-6 h-6" />
        Escríbeme por WhatsApp
      </a>

      <div>
        <h2 className="text-xl font-bold mb-4">Redes sociales</h2>
        <div className="flex gap-4">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm font-medium">
            <Instagram className="w-5 h-5 text-accent" /> @maryenchamorro.psico
          </a>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm font-medium">
            <Linkedin className="w-5 h-5 text-accent" /> LinkedIn
          </a>
          <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm font-medium">
            <Youtube className="w-5 h-5 text-accent" /> YouTube
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Contacto;
