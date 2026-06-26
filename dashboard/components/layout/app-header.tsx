"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export function AppHeader({ title, children }: AppHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const THEMES = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-sm flex-shrink-0 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {title && (
          <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        )}
        {children}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme switcher */}
        <div className="flex items-center gap-0.5 rounded-lg border bg-muted p-0.5">
          {THEMES.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-label={`${label} mode`}
              className={cn(
                "p-1.5 rounded-md transition-colors cursor-pointer",
                theme === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
              {(session?.user?.email?.[0] ?? "A").toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block max-w-[120px] truncate">
              {session?.user?.email ?? "Admin"}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border bg-popover shadow-lg z-50 py-1 animate-fade-in">
              <div className="px-3 py-2 border-b">
                <p className="text-xs font-medium text-foreground truncate">
                  {session?.user?.email ?? "Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground">Administrator</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
