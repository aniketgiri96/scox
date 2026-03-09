import { ok } from "@/lib/http";

export async function GET() {
  return ok({
    status: "ok",
    service: "seox-platform",
    timestamp: new Date().toISOString()
  });
}
