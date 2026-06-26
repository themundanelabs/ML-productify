"use client";

import useSWR from "swr";
import type { HealthResponse, ServiceHealth } from "@/types";
import type { ServiceStatus } from "@/lib/services";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 401) return null; // unauthenticated — silently skip
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
};

export function useServiceHealth() {
  const { data, error, isLoading, mutate } = useSWR<HealthResponse>(
    "/api/health",
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: true }
  );

  function getStatus(slug: string): ServiceStatus {
    if (!data) return "unknown";
    return data.services.find((s) => s.slug === slug)?.status ?? "unknown";
  }

  function getLatency(slug: string): number | null {
    if (!data) return null;
    return data.services.find((s) => s.slug === slug)?.latency ?? null;
  }

  return {
    health: data,
    services: data?.services ?? ([] as ServiceHealth[]),
    summary: data?.summary,
    isLoading,
    isError: !!error,
    getStatus,
    getLatency,
    refresh: mutate,
  };
}
