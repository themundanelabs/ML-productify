"use client";

import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HealthResponse } from "@/types";

interface StatsOverviewProps {
  summary: HealthResponse["summary"] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
}

export function StatsOverview({ summary, isLoading, onRefresh, lastUpdated }: StatsOverviewProps) {
  const stats = [
    {
      label: "Online",
      value: summary?.online ?? "—",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Offline",
      value: summary?.offline ?? "—",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Degraded",
      value: summary?.degraded ?? "—",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Unknown",
      value: summary?.unknown ?? "—",
      icon: HelpCircle,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
            bg
          )}
        >
          <Icon className={cn("w-4 h-4", color)} />
          <span className="font-semibold text-foreground">{value}</span>
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}

      <button
        onClick={onRefresh}
        aria-label="Refresh health status"
        className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
        {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : "Refresh"}
      </button>
    </div>
  );
}
