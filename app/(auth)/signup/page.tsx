"use client";

import { useState } from "react";
import Link from "next/link";
import { InputField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { authedFetch } from "@/lib/api/auth-fetch";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      if (error) {
        throw error;
      }

      if (data.session) {
        try {
          await authedFetch("/api/billing/customer", { method: "POST" });
        } catch {
          // Billing profile sync should not block signup.
        }
      }

      setMessage("Signup successful. Check your inbox to verify email, then log in.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed");
    }
  }

  return (
    <main>
      <section className="card stack" style={{ maxWidth: 460, margin: "2rem auto", padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Create account</h1>
        <form className="stack" onSubmit={handleSubmit}>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <InputField
            label="Password"
            type="password"
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Create account</Button>
        </form>
        {message ? <p style={{ margin: 0, fontSize: 14 }}>{message}</p> : null}
        <p style={{ margin: 0, fontSize: 14 }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
