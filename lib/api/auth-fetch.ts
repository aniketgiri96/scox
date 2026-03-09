"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthedFetchOptions = RequestInit & {
  allowAnonymous?: boolean;
};

export async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(`Failed to read auth session: ${error.message}`);
  }
  return data.session?.access_token ?? null;
}

export async function authedFetch(url: string, options: AuthedFetchOptions = {}): Promise<Response> {
  const token = await getAccessToken();

  if (!token && !options.allowAnonymous) {
    throw new Error("You are not authenticated. Please log in again.");
  }

  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  if (!headers.has("content-type") && options.body) {
    headers.set("content-type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers
  });
}
