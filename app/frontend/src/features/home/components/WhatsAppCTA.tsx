import { MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";

const WhatsAppCTA = () => {
  return (
    <section className="bg-primary/90 py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-primary-foreground lg:text-3xl">
            ¿Tienes dudas? Escríbeme
          </h2>
          <p className="text-sm text-primary-foreground">
            Puedes contactarme directamente por WhatsApp. Respondo en menos de 24 horas.
          </p>
          <Button
            asChild
            size="lg"
            variant="hero"
            className="mt-4 bg-background text-secondary-foreground hover:bg-background/80"
          >
            <a href="https://wa.me/573208621614" target="_blank" rel="noopener noreferrer">
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
