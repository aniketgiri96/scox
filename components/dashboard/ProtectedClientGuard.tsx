"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function ProtectedClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error || !data.session) {
        router.replace("/login");
        return;
      }

      setReady(true);
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <section className="card" style={{ padding: "1rem" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>Checking session...</p>
      </section>
    );
  }

  return <>{children}</>;
}
