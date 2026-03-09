import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { publishAudit, unpublishAudit } from "@/lib/audit/persistence";
import { appConfig } from "@/lib/config";

const schema = z.object({
  auditId: z.string().uuid()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    const published = await publishAudit(user.id, body.auditId);

    return ok({
      slug: published.slug,
      publicUrl: `${appConfig.appUrl}/public/${published.slug}`,
      badgeEmbed: `<a href=\"${appConfig.appUrl}/public/${published.slug}\" target=\"_blank\" rel=\"noopener\">SEOX Score Badge</a>`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Publish failed", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    await unpublishAudit(user.id, body.auditId);
    return ok({ unpublished: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Unpublish failed", 500);
  }
}
