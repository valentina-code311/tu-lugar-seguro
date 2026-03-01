import { useState } from "react";
import {
  Heart, HeartHandshake, HeartPulse,
  Users, User, UserRound, Baby,
  Brain, Eye, Ear, Hand,
  Sparkles, Star, Sun, Moon, Rainbow,
  Flower, Flower2, Leaf, Sprout, TreePine,
  Shield, ShieldCheck, Lock, Unlock,
  Video, Phone, MessageCircle, Mail,
  Calendar, Clock, Globe,
  Activity, Stethoscope, Pill, Syringe,
  BookOpen, GraduationCap, Lightbulb,
  Music, Headphones, Waves,
  Coffee, Home, Smile, Laugh,
  Zap, Wind, Flame, Search,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Curated map: name → component
const ICON_MAP: Record<string, LucideIcon> = {
  Heart, HeartHandshake, HeartPulse,
  Users, User, UserRound, Baby,
  Brain, Eye, Ear, Hand,
  Sparkles, Star, Sun, Moon, Rainbow,
  Flower, Flower2, Leaf, Sprout, TreePine,
  Shield, ShieldCheck, Lock, Unlock,
  Video, Phone, MessageCircle, Mail,
  Calendar, Clock, Globe,
  Activity, Stethoscope, Pill, Syringe,
  BookOpen, GraduationCap, Lightbulb,
  Music, Headphones, Waves,
  Coffee, Home, Smile, Laugh,
  Zap, Wind, Flame,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = AVAILABLE_ICONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar icono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 text-sm"
        />
      </div>

      <div className="grid max-h-52 grid-cols-8 gap-1 overflow-y-auto rounded-lg border border-border p-2">
        {filtered.map((name) => {
          const Icon = ICON_MAP[name];
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
              className={cn(
                "flex items-center justify-center rounded-md p-2 transition-colors hover:bg-primary/10",
                value === name && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-8 py-4 text-center text-xs text-muted-foreground">
            Sin resultados
          </p>
        )}
      </div>

      {value && (
        <p className="text-xs text-muted-foreground">
          Seleccionado: <span className="font-medium text-foreground">{value}</span>
        </p>
      )}
    </div>
  );
}

// ── Helper to resolve an icon name to a Lucide component ─────────────────────

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Heart;
}
