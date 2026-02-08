import { EMAIL, TARJETA_PROFESIONAL } from "@/lib/constants";

const Privacidad = () => (
  <section className="py-16 md:py-24 bg-card" aria-labelledby="privacidad-title">
    <div className="container max-w-3xl">
      <h1 id="privacidad-title" className="text-4xl md:text-5xl font-bold mb-8">Datos y privacidad</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Habeas Data y derechos ARCO</h2>
          <p>Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales en cualquier momento. Para ejercer estos derechos, escríbeme a: <a href={`mailto:${EMAIL}`} className="text-cta hover:underline font-medium">{EMAIL}</a>.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Historias clínicas</h2>
          <p>Las historias clínicas se almacenan de forma segura por un período de 10 años, según lo establecido por la normatividad colombiana. Se guardan en carpetas físicas y en unidades digitales con acceso restringido (Drive nominal).</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Datos profesionales</h2>
          <p>Tarjeta profesional: <strong className="text-primary">{TARJETA_PROFESIONAL}</strong></p>
          <p>Contacto: <a href={`mailto:${EMAIL}`} className="text-cta hover:underline font-medium">{EMAIL}</a></p>
        </div>
      </div>
    </div>
  </section>
);

export default Privacidad;
