"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceStatus } from "@/lib/services";

interface StatusBadgeProps {
  status: ServiceStatus;
  latency?: number | null;
  className?: string;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: "online" | "offline" | "degraded" | "unknown"; dot: string }
> = {
  online:   { label: "Online",   variant: "online",   dot: "bg-emerald-500" },
  offline:  { label: "Offline",  variant: "offline",  dot: "bg-red-500" },
  degraded: { label: "Degraded", variant: "degraded", dot: "bg-amber-500" },
  unknown:  { label: "Unknown",  variant: "unknown",  dot: "bg-gray-400" },
};

export function StatusBadge({ status, latency, className }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <Badge variant={cfg.variant} className={cn("gap-1.5", className)}>
      <span
        className={cn(
          "inline-block w-1.5 h-1.5 rounded-full",
          cfg.dot,
          status === "online" && "animate-pulse-slow"
        )}
      />
      {cfg.label}
      {latency !== null && latency !== undefined && status === "online" && (
        <span className="opacity-60">{latency}ms</span>
      )}
    </Badge>
  );
}
