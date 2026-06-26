import {
  Calendar,
  BarChart3,
  PenLine,
  Workflow,
  Database,
  ShoppingBag,
  LayoutDashboard,
  Rocket,
  Mail,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Calendar,
  BarChart3,
  PenLine,
  Workflow,
  Database,
  ShoppingBag,
  LayoutDashboard,
  Rocket,
  Mail,
  Paintbrush,
};

interface ServiceIconProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { wrapper: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { wrapper: "w-11 h-11 rounded-xl", icon: "w-5 h-5" },
  lg: { wrapper: "w-14 h-14 rounded-2xl", icon: "w-7 h-7" },
};

export function ServiceIcon({ name, color, size = "md", className }: ServiceIconProps) {
  const Icon = ICON_MAP[name] ?? LayoutDashboard;
  const sizes = SIZE_MAP[size];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0",
        sizes.wrapper,
        className
      )}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <Icon className={sizes.icon} strokeWidth={2} />
    </div>
  );
}
