"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar, BarChart3, PenLine, Workflow, Database,
  ShoppingBag, LayoutDashboard, Rocket, Mail, Paintbrush,
  Home, ChevronLeft, ChevronRight, Settings, ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/services";
import { useServiceHealth } from "@/hooks/use-service-health";

const ICON_MAP: Record<string, React.ElementType> = {
  Calendar, BarChart3, PenLine, Workflow, Database,
  ShoppingBag, LayoutDashboard, Rocket, Mail, Paintbrush,
};

const STATUS_DOT: Record<string, string> = {
  online:   "bg-emerald-500",
  offline:  "bg-red-500",
  degraded: "bg-amber-500",
  unknown:  "bg-gray-400",
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { getStatus } = useServiceHealth();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b h-14 px-3 gap-3 flex-shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary-foreground" stroke="currentColor" strokeWidth={2.5}>
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-sidebar-foreground truncate">
              ProductivityHub
            </span>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Dashboard home */}
        <NavItem
          href="/dashboard"
          icon={Home}
          label="Dashboard"
          collapsed={collapsed}
          active={pathname === "/dashboard"}
        />

        {/* Divider */}
        <div className="my-2 mx-2 border-t border-sidebar-border" />

        {/* Tools */}
        {SERVICES.map((service) => {
          const Icon = ICON_MAP[service.icon] ?? LayoutDashboard;
          const status = getStatus(service.slug);
          const href = service.openInNewTab
            ? null
            : `/dashboard/tools/${service.slug}`;
          const active = pathname === `/dashboard/tools/${service.slug}`;

          return (
            <div key={service.slug} className="relative">
              {href ? (
                <NavItem
                  href={href}
                  icon={Icon}
                  label={service.name}
                  collapsed={collapsed}
                  active={active}
                  iconColor={service.color}
                />
              ) : (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed ? "justify-center" : ""
                  )}
                  title={collapsed ? service.name : undefined}
                >
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: service.color }}
                    strokeWidth={2}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{service.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-40" />
                    </>
                  )}
                </a>
              )}

              {/* Status dot */}
              <span
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full",
                  STATUS_DOT[status] ?? "bg-gray-400",
                  collapsed ? "right-1.5" : ""
                )}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t p-2 flex flex-col gap-0.5",
        collapsed ? "items-center" : ""
      )}>
        <NavItem
          href="/dashboard/settings"
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
          active={pathname === "/dashboard/settings"}
        />
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="mt-1 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors cursor-pointer p-2 rounded-lg hover:bg-sidebar-accent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
  iconColor,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
  iconColor?: string;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer",
        collapsed ? "justify-center" : "",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0"
        style={iconColor ? { color: iconColor } : undefined}
        strokeWidth={2}
      />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );
}
