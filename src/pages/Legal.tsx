import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const sections = [
  {
    id: "terminos",
    title: "Términos y Condiciones",
    content: `Al utilizar este sitio web y realizar compras a través de "El Clóset de la Sexóloga", aceptas los siguientes términos y condiciones. Los productos ofrecidos son para mayores de 18 años. Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio implica la aceptación de los cambios.\n\nLos precios están expresados en COP (pesos colombianos) e incluyen IVA cuando aplique. Nos reservamos el derecho de ajustar precios sin previo aviso. Las imágenes de los productos son referenciales.`,
  },
  {
    id: "privacidad",
    title: "Política de Privacidad",
    content: `Tu privacidad es fundamental para nosotros. Recopilamos únicamente la información necesaria para procesar tus pedidos y brindarte un mejor servicio: nombre, email, dirección de envío y datos de pago (procesados de forma segura por nuestra pasarela).\n\nNo compartimos tu información personal con terceros, excepto cuando sea necesario para el envío de productos. Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a hola@psicosexvalendm.com.\n\nLas sesiones de terapia y su contenido son estrictamente confidenciales conforme al código ético profesional.`,
  },
  {
    id: "envios",
    title: "Política de Envíos",
    content: `Realizamos envíos a todo Colombia. Los tiempos de entrega varían según la ciudad: principales ciudades (3-5 días hábiles), otras zonas (5-8 días hábiles).\n\nTodos los paquetes se envían en empaque discreto, sin logos ni descripciones del contenido. El costo de envío se calcula al momento del checkout según tu ubicación.\n\nRecibirás un número de seguimiento por email una vez despachado tu pedido.`,
  },
  {
    id: "devoluciones",
    title: "Política de Devoluciones",
    content: `Por razones de higiene y seguridad, los productos íntimos que hayan sido abiertos no son elegibles para devolución. Los productos sellados pueden devolverse dentro de los 30 días posteriores a la compra.\n\nLos infoproductos digitales no son reembolsables una vez entregado el acceso.\n\nPara solicitar una devolución, contacta a hola@psicosexvalendm.com con tu número de pedido y el motivo.`,
  },
  {
    id: "consentimiento",
    title: "Consentimiento Informado",
    content: `El contenido de este sitio web es de carácter educativo e informativo sobre salud mental y sexualidad. No reemplaza la atención médica o psicológica profesional.\n\nAl acceder a este sitio, confirmas que eres mayor de 18 años y que comprendes que la información proporcionada tiene fines educativos. Para diagnósticos o tratamientos específicos, agenda una consulta profesional.`,
  },
];

const Legal = () => {
  return (
    <Layout>
      <section className="bg-surface py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground lg:text-5xl">Información Legal</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-12">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scroll-mt-24 rounded-2xl border border-border bg-surface p-8 shadow-soft"
              >
                <h2 className="font-display text-2xl font-bold text-foreground">{section.title}</h2>
                <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
