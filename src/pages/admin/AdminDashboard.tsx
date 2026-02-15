import { motion } from "framer-motion";

const AdminDashboard = () => {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Bienvenida al panel de administración.</p>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Productos", value: "8", color: "bg-primary" },
          { label: "Infoproductos", value: "3", color: "bg-secondary" },
          { label: "Pedidos", value: "0", color: "bg-success" },
          { label: "Citas", value: "0", color: "bg-info" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
