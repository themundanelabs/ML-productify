"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(13,148,136,0.15), transparent)",
        }}
      />

      <div className="w-full max-w-sm mx-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-7 h-7 text-primary-foreground"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            ProductivityHub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your tools
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card shadow-xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Credentials are set via{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">
            ADMIN_EMAIL
          </code>{" "}
          &amp;{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">
            ADMIN_PASSWORD
          </code>{" "}
          in your <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">.env</code>
        </p>
      </div>
    </div>
  );
}
