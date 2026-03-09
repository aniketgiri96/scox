import type { Metadata } from "next";
import "@/app/globals.css";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `${appConfig.appName} | SEO + GEO Intelligence`,
  description: "SEOX audits websites across SEO + GEO dimensions and delivers prioritized growth roadmaps."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
