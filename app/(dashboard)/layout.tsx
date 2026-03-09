import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/Nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="dashboard-shell">
      <DashboardNav />
      <section className="stack" style={{ gap: "1rem" }}>
        {children}
      </section>
    </main>
  );
}
