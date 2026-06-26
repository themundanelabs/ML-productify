"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ToolCard } from "@/components/dashboard/tool-card";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { SERVICES, CATEGORY_LABELS } from "@/lib/services";
import { useServiceHealth } from "@/hooks/use-service-health";
import { useState, useMemo } from "react";

type FilterCategory = "all" | keyof typeof CATEGORY_LABELS;

export function DashboardOverview() {
  const { getStatus, getLatency, isLoading, refresh, services } = useServiceHealth();
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filteredServices = useMemo(
    () =>
      filter === "all"
        ? SERVICES
        : SERVICES.filter((s) => s.category === filter),
    [filter]
  );

  const categories: FilterCategory[] = [
    "all",
    ...Array.from(new Set(SERVICES.map((s) => s.category as FilterCategory))),
  ];

  const lastUpdated = services[0]?.checkedAt;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Dashboard">
        <span className="text-xs text-muted-foreground hidden md:block">
          {SERVICES.length} tools · auto-refreshes every 30s
        </span>
      </AppHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6 animate-fade-in">
          {/* Welcome banner */}
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Welcome to ProductivityHub
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  All your open-source tools in one place. Click any card to launch.
                </p>
              </div>
              <StatsOverview
                summary={
                  isLoading
                    ? undefined
                    : {
                        online: services.filter((s) => s.status === "online").length,
                        offline: services.filter((s) => s.status === "offline").length,
                        degraded: services.filter((s) => s.status === "degraded").length,
                        unknown: services.filter((s) => s.status === "unknown").length,
                        total: services.length,
                      }
                }
                isLoading={isLoading}
                onRefresh={refresh}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {cat === "all"
                  ? `All (${SERVICES.length})`
                  : CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
              </button>
            ))}
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service, i) => (
              <ToolCard
                key={service.slug}
                service={service}
                status={getStatus(service.slug)}
                latency={getLatency(service.slug)}
                featured={i === 0 && filter === "all"}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No tools in this category yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
