"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { cn } from "@/lib/utils";
import type { Service, ServiceStatus } from "@/lib/services";

interface ToolCardProps {
  service: Service;
  status: ServiceStatus;
  latency: number | null;
  featured?: boolean;
}

export function ToolCard({ service, status, latency, featured }: ToolCardProps) {
  const router = useRouter();

  function handleLaunch() {
    if (service.openInNewTab) {
      window.open(service.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/dashboard/tools/${service.slug}`);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleLaunch}
      onKeyDown={(e) => e.key === "Enter" && handleLaunch()}
      className={cn(
        "bento-card group relative overflow-hidden",
        featured && "md:col-span-2"
      )}
    >
      {/* Color wash background */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          service.bgGradient
        )}
      />

      <div className="relative flex flex-col gap-3 h-full">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <ServiceIcon name={service.icon} color={service.color} size="md" />
          <StatusBadge status={status} latency={latency} />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {service.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-wrap gap-1">
            {service.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-0.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: service.color }}
          >
            {service.openInNewTab ? (
              <>Open <ExternalLink className="w-3 h-3" /></>
            ) : (
              <>Launch <ArrowUpRight className="w-3 h-3" /></>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
