import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ProductivityHub",
    template: "%s · ProductivityHub",
  },
  description:
    "Your all-in-one open-source productivity dashboard. Manage every tool from a single place.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
