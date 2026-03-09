import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/Nav";
import { ProtectedClientGuard } from "@/components/dashboard/ProtectedClientGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="dashboard-shell">
      <DashboardNav />
      <ProtectedClientGuard>
        <section className="stack" style={{ gap: "1rem" }}>
          {children}
        </section>
      </ProtectedClientGuard>
    </main>
  );
}
