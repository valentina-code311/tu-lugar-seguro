import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Error de acceso", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-16">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Acceso administrador</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Correo</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
            <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Auth;
