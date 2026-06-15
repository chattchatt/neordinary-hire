import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isMissingColumnError } from "@/lib/prisma-compat";
import { assertDiscordSyncAuth, parseOptionalDate, sanitize, sanitizeStringArray } from "../_utils";

export const dynamic = "force-dynamic";
// Auth is enforced by assertDiscordSyncAuth via DISCORD_SYNC_SECRET and Authorization: Bearer <secret>.

// POST /api/discord/link — NERDY bot links a Discord user to a HIRE profile by link code.
export async function POST(req: NextRequest) {
  const authError = assertDiscordSyncAuth(req);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 JSON 요청입니다." }, { status: 400 });
  }

  const linkCode = sanitize(body.linkCode, 32).toUpperCase();
  const discordUserId = sanitize(body.discordUserId, 64);
  if (!linkCode || !discordUserId) {
    return NextResponse.json({ error: "linkCode와 discordUserId가 필요합니다." }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({ where: { hireLinkCode: linkCode } });
    if (!member) {
      return NextResponse.json({ error: "해당 연동 코드를 찾을 수 없습니다." }, { status: 404 });
    }

    const now = new Date();
    const activitySummary = sanitize(body.activitySummary, 8000);
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        discordUserId,
        discordUsername: sanitize(body.discordUsername, 80) || null,
        discordDisplayName: sanitize(body.discordDisplayName, 120) || null,
        discordNickname: sanitize(body.discordNickname, 120) || null,
        discordRoles: sanitizeStringArray(body.discordRoles),
        discordJoinedAt: parseOptionalDate(body.discordJoinedAt),
        lastDiscordActiveAt: parseOptionalDate(body.lastActiveAt) || now,
        discordActivitySummary: activitySummary || null,
        discordLinkedAt: member.discordLinkedAt || now,
        activityConsentAt: member.activityConsentAt || now,
        activities: {
          create: {
            source: "discord",
            type: "link",
            summary: activitySummary || "Discord 계정이 HIRE 프로필에 연결되었습니다.",
            occurredAt: now,
          },
        },
      },
      include: { activities: { orderBy: { occurredAt: "desc" }, take: 5 } },
    });

    return NextResponse.json({ success: true, memberId: updated.id, discordUserId: updated.discordUserId });
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
