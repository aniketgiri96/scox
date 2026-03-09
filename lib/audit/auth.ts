import { NextRequest } from "next/server";
import { createSupabaseAnonClient, createSupabaseServiceClient } from "@/lib/supabase/server";

type AuthedUser = {
  id: string;
  email?: string;
};

export async function getUserFromRequest(req: NextRequest): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return null;
  }

  const anonClient = createSupabaseAnonClient();
  const { data, error } = await anonClient.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email
  };
}

export async function requireUserFromRequest(req: NextRequest): Promise<AuthedUser> {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getProfile(userId: string): Promise<{
  id: string;
  plan: string;
  audits_used: number;
  audits_limit: number;
}> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, plan, audits_used, audits_limit")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load user profile: ${error?.message ?? "not found"}`);
  }

  return data as {
    id: string;
    plan: string;
    audits_used: number;
    audits_limit: number;
  };
}
