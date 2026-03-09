"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { authedFetch } from "@/lib/api/auth-fetch";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      try {
        await authedFetch("/api/billing/customer", {
          method: "POST"
        });
      } catch {
        // Billing profile sync should not block login.
      }

      setMessage("Login successful. Redirecting...");
      router.replace("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <main>
      <section className="card stack" style={{ maxWidth: 460, margin: "2rem auto", padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Login</h1>
        <form className="stack" onSubmit={handleSubmit}>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Sign in</Button>
        </form>
        {message ? <p style={{ margin: 0, fontSize: 14 }}>{message}</p> : null}
        <p style={{ margin: 0, fontSize: 14 }}>
          Need an account? <Link href="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
