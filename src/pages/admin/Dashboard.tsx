import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Briefcase, GraduationCap, FileText } from "lucide-react";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [svc, ws, posts, appts] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("workshops").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).neq("status", "cancelled"),
      ]);
      return {
        services: svc.count ?? 0,
        workshops: ws.count ?? 0,
        posts: posts.count ?? 0,
        appointments: appts.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Servicios", value: stats?.services ?? "–", icon: Briefcase },
    { label: "Talleres", value: stats?.workshops ?? "–", icon: GraduationCap },
    { label: "Citas activas", value: stats?.appointments ?? "–", icon: CalendarDays },
    { label: "Posts", value: stats?.posts ?? "–", icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <c.icon className="w-6 h-6 text-accent mb-2" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
