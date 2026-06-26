import type { Metadata } from "next";
import { DashboardOverview } from "./overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardOverview />;
}
