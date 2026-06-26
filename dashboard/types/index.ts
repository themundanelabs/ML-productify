import type { ServiceStatus } from "@/lib/services";

export interface ServiceHealth {
  slug: string;
  status: ServiceStatus;
  latency: number | null;
  checkedAt: string;
}

export interface HealthResponse {
  services: ServiceHealth[];
  summary: {
    online: number;
    offline: number;
    degraded: number;
    unknown: number;
    total: number;
  };
}
