import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isMissingColumnError, isMissingRelationError } from "@/lib/prisma-compat";
import { assertDiscordSyncAuth, parseOptionalDate, sanitize, sanitizeStringArray } from "../_utils";

export const dynamic = "force-dynamic";
// Auth is enforced by assertDiscordSyncAuth via DISCORD_SYNC_SECRET and Authorization: Bearer <secret>.

type PendingMember = NonNullable<Awaited<ReturnType<typeof findPendingMemberByDiscordHandle>>>;

function discordHandleCandidates(...values: string[]) {
  const candidates = new Set<string>();
  for (const value of values) {
    const raw = value.trim();
    if (!raw) continue;
    candidates.add(raw);
    candidates.add(raw.replace(/^@/, ""));
    const withoutDiscriminator = raw.replace(/^@/, "").replace(/#\d{4}$/, "");
    if (withoutDiscriminator) candidates.add(withoutDiscriminator);
  }
  return [...candidates].filter(Boolean).slice(0, 12);
}


type DiscordActivityEventInput = {
  messageId?: unknown;
  channelId?: unknown;
  channelName?: unknown;
  messageType?: unknown;
  contentExcerpt?: unknown;
  messageUrl?: unknown;
  occurredAt?: unknown;
};

function sanitizeActivityEvents(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const event = item as DiscordActivityEventInput;
      const messageId = sanitize(event.messageId, 80);
      const channelId = sanitize(event.channelId, 80);
      const channelName = sanitize(event.channelName, 120);
      const contentExcerpt = sanitize(event.contentExcerpt, 1200);
      const occurredAt = parseOptionalDate(event.occurredAt);
      if (!messageId || !channelId || !channelName || !contentExcerpt || !occurredAt) return null;
      return {
        messageId,
        channelId,
        channelName,
        messageType: sanitize(event.messageType, 40) || "message",
        contentExcerpt,
        messageUrl: sanitize(event.messageUrl, 300) || null,
        occurredAt,
      };
    })
    .filter((event): event is NonNullable<typeof event> => Boolean(event))
    .slice(0, 100);
}

async function findPendingMemberByDiscordHandle(body: Record<string, unknown>) {
  const candidates = discordHandleCandidates(
    sanitize(body.discordUsername, 80),
    sanitize(body.discordDisplayName, 120),
    sanitize(body.discordNickname, 120)
  );
  if (!candidates.length) return null;

  const pendingMembers = await prisma.member.findMany({
    where: {
      discordUserId: null,
      OR: candidates.map((candidate) => ({ discordUsername: { equals: candidate, mode: "insensitive" as const } })),
    },
    take: 2,
  });

  if (pendingMembers.length > 1) {
    throw new Error("자동 매칭 후보가 여러 명입니다. 사용자가 /hire-link 코드로 직접 인증해야 합니다.");
  }
  return pendingMembers[0] || null;
}

// POST /api/discord/sync — NERDY bot refreshes Discord profile/activity or auto-links a pending profile by submitted handle.
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
    const existingMember = await prisma.member.findUnique({ where: { discordUserId } });
    let member = existingMember;
    let activityType = "sync";
    let defaultActivitySummary = "Discord 프로필 동기화 완료. 활동 상세가 필요한 경우 Discord에서 /hire-sync-activity @사용자를 실행하세요.";

    if (!member) {
      try {
        member = await findPendingMemberByDiscordHandle(body) as PendingMember | null;
      } catch (error) {
        if (error instanceof Error && error.message.includes("자동 매칭 후보가 여러 명")) {
          return NextResponse.json({ error: error.message }, { status: 409 });
        }
        throw error;
      }
      if (!member) {
        return NextResponse.json({ error: "먼저 /hire-link 연동이 필요합니다." }, { status: 404 });
      }
      activityType = "auto-link";
      defaultActivitySummary = "Discord 계정 자동 매칭 완료: 등록폼 Discord 입력값과 서버 멤버가 일치했습니다. 활동 상세는 아직 수집되지 않았습니다.";
    }

    const now = new Date();
    const activitySummary = sanitize(body.activitySummary, 8000) || defaultActivitySummary;
    const occurredAt = parseOptionalDate(body.lastActiveAt) || now;
    const discordRoles = Array.isArray(body.discordRoles) ? sanitizeStringArray(body.discordRoles) : member.discordRoles;
    const activityEvents = sanitizeActivityEvents(body.activityEvents);

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        discordUserId: member.discordUserId || discordUserId,
        discordUsername: sanitize(body.discordUsername, 80) || member.discordUsername,
        discordDisplayName: sanitize(body.discordDisplayName, 120) || member.discordDisplayName,
        discordNickname: sanitize(body.discordNickname, 120) || member.discordNickname,
        discordRoles,
        discordJoinedAt: parseOptionalDate(body.discordJoinedAt) || member.discordJoinedAt,
        lastDiscordActiveAt: occurredAt,
        discordActivitySummary: activitySummary || member.discordActivitySummary,
        discordLinkedAt: member.discordLinkedAt || now,
        activities: { create: { source: "discord", type: activityType, summary: activitySummary, occurredAt } },
      },
      include: { activities: { orderBy: { occurredAt: "desc" }, take: 5 } },
    });

    if (activityEvents.length) {
      await prisma.discordActivityEvidence.createMany({
        data: activityEvents.map((event) => ({ ...event, memberId: updated.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, memberId: updated.id, syncedAt: now.toISOString(), evidenceCount: activityEvents.length });
  } catch (error) {
    if (isMissingColumnError(error) || isMissingRelationError(error)) {
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
