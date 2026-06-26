import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SERVICES } from "@/lib/services";
import type { ServiceHealth, HealthResponse } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function checkService(service: (typeof SERVICES)[0]): Promise<ServiceHealth> {
  const start = Date.now();
  const url = `${service.url}${service.healthPath}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);
    const latency = Date.now() - start;

    return {
      slug: service.slug,
      status: res.ok ? "online" : "degraded",
      latency,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      slug: service.slug,
      status: "offline",
      latency: null,
      checkedAt: new Date().toISOString(),
    };
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await Promise.allSettled(SERVICES.map(checkService));

  const services: ServiceHealth[] = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          slug: SERVICES[i].slug,
          status: "unknown" as const,
          latency: null,
          checkedAt: new Date().toISOString(),
        }
  );

  const summary = {
    online: services.filter((s) => s.status === "online").length,
    offline: services.filter((s) => s.status === "offline").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    unknown: services.filter((s) => s.status === "unknown").length,
    total: services.length,
  };

  const response: HealthResponse = { services, summary };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
