const Etica = () => (
  <section className="py-16 md:py-24 bg-card" aria-labelledby="etica-title">
    <div className="container max-w-3xl">
      <h1 id="etica-title" className="text-4xl md:text-5xl font-bold mb-8">Ética y emergencias</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Marco ético</h2>
          <p className="mb-3">Mi práctica se rige por los principios de la psicología humanista y los estándares éticos de la profesión:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-primary">Consentimiento informado:</strong> Antes de iniciar cualquier proceso, recibirás información clara sobre el enfoque, la duración estimada, las tarifas y tus derechos.</li>
            <li><strong className="text-primary">Confidencialidad:</strong> Todo lo compartido en sesión es estrictamente confidencial.</li>
            <li><strong className="text-primary">Límites legales:</strong> Existen excepciones legales a la confidencialidad: riesgo vital (autolesión o suicidio), violencia o abuso hacia menores o personas vulnerables, y requerimientos judiciales.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Líneas de ayuda en Cali</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-3xl font-bold text-primary mb-1">106</p>
              <p className="text-sm">Línea de orientación en salud mental</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-3xl font-bold text-primary mb-1">123</p>
              <p className="text-sm">Línea de emergencias</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">Testimonios</h2>
          <p>Los testimonios publicados en este sitio cuentan con el consentimiento expreso de cada persona. Se ofrece la opción de compartirlos de forma anónima o con nombre, según la preferencia de cada consultante.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Etica;
