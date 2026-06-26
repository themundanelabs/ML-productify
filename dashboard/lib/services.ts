export type ServiceStatus = "online" | "offline" | "degraded" | "unknown";

export interface Service {
  slug: string;
  name: string;
  description: string;
  category: "scheduling" | "analytics" | "publishing" | "automation" | "infrastructure" | "ecommerce" | "workspace" | "deployment" | "email" | "design";
  color: string;
  bgGradient: string;
  url: string;
  healthPath: string;
  icon: string;
  docs: string;
  tags: string[];
  openInNewTab?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "localhost";
const PROTO = process.env.NEXT_PUBLIC_PROTOCOL ?? "http";

function serviceUrl(subdomain: string, port?: number): string {
  if (BASE === "localhost" && port) return `${PROTO}://${BASE}:${port}`;
  return `${PROTO}://${subdomain}.${BASE}`;
}

export const SERVICES: Service[] = [
  {
    slug: "cal",
    name: "cal.diy",
    description: "Scheduling & calendar booking. Let clients book time with you.",
    category: "scheduling",
    color: "#3B82F6",
    bgGradient: "from-blue-500/20 to-blue-600/5",
    url: serviceUrl("cal", 3000),
    healthPath: "/api/health",
    icon: "Calendar",
    docs: "https://github.com/calcom/cal.diy",
    tags: ["meetings", "booking", "calendar"],
  },
  {
    slug: "analytics",
    name: "Plausible",
    description: "Privacy-first web analytics. No cookies, GDPR compliant.",
    category: "analytics",
    color: "#7C3AED",
    bgGradient: "from-violet-500/20 to-violet-600/5",
    url: serviceUrl("analytics", 8000),
    healthPath: "/api/health",
    icon: "BarChart3",
    docs: "https://github.com/plausible/analytics",
    tags: ["analytics", "privacy", "metrics"],
  },
  {
    slug: "ghost",
    name: "Ghost",
    description: "Modern publishing platform. Blog, newsletter, memberships.",
    category: "publishing",
    color: "#F59E0B",
    bgGradient: "from-amber-500/20 to-amber-600/5",
    url: serviceUrl("ghost", 2368),
    healthPath: "/ghost/api/v4/admin/site/",
    icon: "PenLine",
    docs: "https://github.com/tryghost/ghost",
    tags: ["blog", "newsletter", "cms"],
  },
  {
    slug: "n8n",
    name: "n8n",
    description: "Workflow automation. Connect apps and automate repetitive tasks.",
    category: "automation",
    color: "#EF4444",
    bgGradient: "from-red-500/20 to-red-600/5",
    url: serviceUrl("n8n", 5678),
    healthPath: "/healthz",
    icon: "Workflow",
    docs: "https://github.com/n8n-io/n8n",
    tags: ["automation", "workflows", "integrations"],
  },
  {
    slug: "supabase",
    name: "Supabase",
    description: "Open-source Firebase alternative. Postgres DB, Auth, Storage.",
    category: "infrastructure",
    color: "#10B981",
    bgGradient: "from-emerald-500/20 to-emerald-600/5",
    url: serviceUrl("supabase", 3001),
    healthPath: "/api/profile",
    icon: "Database",
    docs: "https://github.com/supabase/supabase",
    tags: ["database", "auth", "storage"],
  },
  {
    slug: "medusa",
    name: "Medusa",
    description: "Open-source e-commerce engine. Build your store your way.",
    category: "ecommerce",
    color: "#8B5CF6",
    bgGradient: "from-purple-500/20 to-purple-600/5",
    url: serviceUrl("medusa", 7001),
    healthPath: "/health",
    icon: "ShoppingBag",
    docs: "https://github.com/medusajs/medusa",
    tags: ["ecommerce", "store", "checkout"],
  },
  {
    slug: "appflowy",
    name: "AppFlowy",
    description: "Notion alternative. Docs, notes, wikis, kanban boards.",
    category: "workspace",
    color: "#06B6D4",
    bgGradient: "from-cyan-500/20 to-cyan-600/5",
    url: serviceUrl("appflowy", 80),
    healthPath: "/api/user/sign_in",
    icon: "LayoutDashboard",
    docs: "https://github.com/AppFlowy-IO/AppFlowy-Cloud",
    tags: ["docs", "notes", "kanban"],
  },
  {
    slug: "coolify",
    name: "Coolify",
    description: "Self-hosted PaaS. Deploy apps, databases, and services.",
    category: "deployment",
    color: "#6366F1",
    bgGradient: "from-indigo-500/20 to-indigo-600/5",
    url: serviceUrl("coolify", 8080),
    healthPath: "/api/v1/healthcheck",
    icon: "Rocket",
    docs: "https://github.com/coollabsio/coolify",
    tags: ["deployment", "hosting", "devops"],
    openInNewTab: true,
  },
  {
    slug: "listmonk",
    name: "Listmonk",
    description: "Self-hosted email campaigns & mailing lists at scale.",
    category: "email",
    color: "#EC4899",
    bgGradient: "from-pink-500/20 to-pink-600/5",
    url: serviceUrl("listmonk", 9000),
    healthPath: "/api/health",
    icon: "Mail",
    docs: "https://github.com/knadh/listmonk",
    tags: ["email", "newsletters", "campaigns"],
  },
  {
    slug: "penpot",
    name: "Penpot",
    description: "Open-source design tool. Figma alternative, built for teams.",
    category: "design",
    color: "#F97316",
    bgGradient: "from-orange-500/20 to-orange-600/5",
    url: serviceUrl("penpot", 9001),
    healthPath: "/api/rpc/command/get-profile",
    icon: "Paintbrush",
    docs: "https://github.com/penpot/penpot",
    tags: ["design", "prototyping", "ui"],
    openInNewTab: true,
  },
];

export const CATEGORY_LABELS: Record<Service["category"], string> = {
  scheduling: "Scheduling",
  analytics: "Analytics",
  publishing: "Publishing",
  automation: "Automation",
  infrastructure: "Infrastructure",
  ecommerce: "E-Commerce",
  workspace: "Workspace",
  deployment: "Deployment",
  email: "Email",
  design: "Design",
};

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
