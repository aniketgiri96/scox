import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${appConfig.appName} | SEO + GEO Intelligence`,
  description: "SEOX audits websites across SEO + GEO dimensions and delivers prioritized growth roadmaps."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
