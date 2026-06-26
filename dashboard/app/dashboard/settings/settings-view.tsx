"use client";

import { AppHeader } from "@/components/layout/app-header";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SERVICES } from "@/lib/services";
import { useServiceHealth } from "@/hooks/use-service-health";
import { ExternalLink, BookOpen } from "lucide-react";

export function SettingsView() {
  const { getStatus, getLatency, refresh, isLoading } = useServiceHealth();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader title="Settings" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">

          {/* Service URL Config */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">Service URLs</h2>
            <p className="text-sm text-muted-foreground mb-4">
              URLs are configured via environment variables. Edit your{" "}
              <code className="font-mono text-xs bg-muted px-1 rounded">.env</code> file
              and restart the dashboard to apply changes.
            </p>

            <div className="rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Tool</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">URL</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {SERVICES.map((service, i) => (
                    <tr
                      key={service.slug}
                      className={i < SERVICES.length - 1 ? "border-b" : ""}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <ServiceIcon name={service.icon} color={service.color} size="sm" />
                          <span className="font-medium text-foreground">{service.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate max-w-[180px] block">
                          {service.url}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={getStatus(service.slug)}
                          latency={getLatency(service.slug)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={service.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          Docs
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Env var reference */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">Environment Variables</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Copy these into your <code className="font-mono text-xs bg-muted px-1 rounded">.env</code> file.
            </p>
            <div className="rounded-2xl border bg-muted/30 p-4 font-mono text-xs space-y-1 text-muted-foreground leading-relaxed">
              <p className="text-foreground font-semibold"># Authentication</p>
              <p>ADMIN_EMAIL=admin@example.com</p>
              <p>ADMIN_PASSWORD=changeme</p>
              <p>NEXTAUTH_SECRET=your-secret-here</p>
              <p>NEXTAUTH_URL=http://localhost:3100</p>
              <p>&nbsp;</p>
              <p className="text-foreground font-semibold"># Service routing</p>
              <p>NEXT_PUBLIC_BASE_DOMAIN=yourdomain.com</p>
              <p>NEXT_PUBLIC_PROTOCOL=https</p>
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">About</h2>
            <div className="rounded-2xl border p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">ProductivityHub</p>
                <p className="text-sm text-muted-foreground">
                  Open-source dashboard for 10 self-hosted productivity tools
                </p>
              </div>
              <a
                href="https://github.com/productivity-hub/productivity-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
              >
                GitHub <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
