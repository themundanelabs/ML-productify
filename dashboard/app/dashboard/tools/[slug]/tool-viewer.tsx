"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { useServiceHealth } from "@/hooks/use-service-health";
import { ExternalLink, RefreshCw, Maximize2, Minimize2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/services";

export function ToolViewer({ service }: { service: Service }) {
  const { getStatus, getLatency } = useServiceHealth();
  const [iframeKey, setIframeKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const status = getStatus(service.slug);
  const latency = getLatency(service.slug);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader>
        {/* Tool identity in header */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <ServiceIcon name={service.icon} color={service.color} size="sm" />
          <span className="font-semibold text-sm text-foreground truncate">
            {service.name}
          </span>
          <StatusBadge status={status} latency={latency} />
        </div>

        {/* Tool actions in header right */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            aria-label="Reload tool"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {fullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in new tab"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </AppHeader>

      {/* Iframe or offline state */}
      <div className="flex-1 relative overflow-hidden">
        {status === "offline" ? (
          <OfflineState service={service} />
        ) : (
          <iframe
            key={iframeKey}
            src={service.url}
            title={service.name}
            className="w-full h-full border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        )}
      </div>
    </div>
  );
}

function OfflineState({ service }: { service: Service }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
      <ServiceIcon name={service.icon} color={service.color} size="lg" />
      <div>
        <h3 className="font-semibold text-foreground">{service.name} is unreachable</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          The service at{" "}
          <code className="font-mono text-xs bg-muted px-1 rounded">{service.url}</code>{" "}
          did not respond. Make sure it&apos;s running.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={service.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Setup docs <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-muted-foreground">·</span>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
