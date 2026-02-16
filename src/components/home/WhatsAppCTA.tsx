import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const WhatsAppCTA = () => {
  return (
    <section className="bg-gradient-primary py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-primary-foreground lg:text-3xl">
            ¿Tienes dudas? Escríbeme
          </h2>
          <p className="max-w-md text-sm text-primary-foreground/80">
            Puedes contactarme directamente por WhatsApp. Respondo en menos de 24 horas.
          </p>
          <Button
            asChild
            size="lg"
            variant="hero"
            className="bg-surface text-primary hover:bg-primary"
          >
            <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
