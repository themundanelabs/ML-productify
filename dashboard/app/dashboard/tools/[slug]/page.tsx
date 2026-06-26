import { notFound } from "next/navigation";
import { getService } from "@/lib/services";
import type { Metadata } from "next";
import { ToolViewer } from "./tool-viewer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return { title: service?.name ?? "Tool" };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ToolViewer service={service} />;
}
