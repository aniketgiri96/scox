import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(): SupabaseClient {
  return createClientComponentClient();
}

let cachedBrowserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!cachedBrowserClient) {
    cachedBrowserClient = createSupabaseBrowserClient();
  }

  return cachedBrowserClient;
}
