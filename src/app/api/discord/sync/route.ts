import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isMissingColumnError } from "@/lib/prisma-compat";
import { assertDiscordSyncAuth, parseOptionalDate, sanitize, sanitizeStringArray } from "../_utils";

export const dynamic = "force-dynamic";
// Auth is enforced by assertDiscordSyncAuth via DISCORD_SYNC_SECRET and Authorization: Bearer <secret>.

// POST /api/discord/sync — NERDY bot refreshes Discord profile/activity for an already linked member.
export async function POST(req: NextRequest) {
  const authError = assertDiscordSyncAuth(req);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 JSON 요청입니다." }, { status: 400 });
  }

  const discordUserId = sanitize(body.discordUserId, 64);
  if (!discordUserId) {
    return NextResponse.json({ error: "discordUserId가 필요합니다." }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({ where: { discordUserId } });
    if (!member) {
      return NextResponse.json({ error: "먼저 /hire-link 연동이 필요합니다." }, { status: 404 });
    }

    const now = new Date();
    const activitySummary = sanitize(body.activitySummary, 2000);
    const occurredAt = parseOptionalDate(body.lastActiveAt) || now;
    const discordRoles = Array.isArray(body.discordRoles) ? sanitizeStringArray(body.discordRoles) : member.discordRoles;
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        discordUsername: sanitize(body.discordUsername, 80) || member.discordUsername,
        discordDisplayName: sanitize(body.discordDisplayName, 120) || member.discordDisplayName,
        discordNickname: sanitize(body.discordNickname, 120) || member.discordNickname,
        discordRoles,
        discordJoinedAt: parseOptionalDate(body.discordJoinedAt) || member.discordJoinedAt,
        lastDiscordActiveAt: occurredAt,
        discordActivitySummary: activitySummary || member.discordActivitySummary,
        activities: activitySummary
          ? { create: { source: "discord", type: "sync", summary: activitySummary, occurredAt } }
          : undefined,
      },
      include: { activities: { orderBy: { occurredAt: "desc" }, take: 5 } },
    });

    return NextResponse.json({ success: true, memberId: updated.id, syncedAt: now.toISOString() });
  } catch (error) {
    if (isMissingColumnError(error)) {
      return NextResponse.json(
        {
          error: "Discord 연동 DB 마이그레이션이 필요합니다.",
          schemaStatus: "discord_migration_required",
        },
        { status: 503 }
      );
    }
    throw error;
  }
}
