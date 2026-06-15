import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isMissingColumnError, isMissingRelationError } from "@/lib/prisma-compat";
import { assertDiscordSyncAuth, parseOptionalDate, sanitize } from "../../discord/_utils";

export const dynamic = "force-dynamic";

type EvidenceInput = {
  fileId?: unknown;
  title?: unknown;
  url?: unknown;
  mimeType?: unknown;
  sourceType?: unknown;
  matchedBy?: unknown;
  matchConfidence?: unknown;
  projectName?: unknown;
  role?: unknown;
  contentExcerpt?: unknown;
  summary?: unknown;
  occurredAt?: unknown;
};

function toEvidenceEvents(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((raw) => {
      const item = (raw || {}) as EvidenceInput;
      const fileId = sanitize(item.fileId, 220);
      const title = sanitize(item.title, 500);
      if (!fileId || !title) return null;

      return {
        fileId,
        title,
        url: sanitize(item.url, 1000) || null,
        mimeType: sanitize(item.mimeType, 180) || null,
        sourceType: sanitize(item.sourceType, 80) || "drive",
        matchedBy: sanitize(item.matchedBy, 120) || "manual",
        matchConfidence: sanitize(item.matchConfidence, 80) || null,
        projectName: sanitize(item.projectName, 220) || null,
        role: sanitize(item.role, 120) || null,
        contentExcerpt: sanitize(item.contentExcerpt, 4000) || null,
        summary: sanitize(item.summary, 4000) || null,
        occurredAt: parseOptionalDate(item.occurredAt),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 200);
}

export async function POST(req: NextRequest) {
  const authError = assertDiscordSyncAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const memberId = sanitize(body.memberId, 120);
    const email = sanitize(body.email, 220).toLowerCase();
    const events = toEvidenceEvents(body.evidence);

    if (!memberId && !email) {
      return NextResponse.json({ error: "memberId 또는 email이 필요합니다." }, { status: 400 });
    }
    if (!events.length) {
      return NextResponse.json({ error: "저장할 Google Drive evidence가 없습니다." }, { status: 400 });
    }

    const member = memberId
      ? await prisma.member.findUnique({ where: { id: memberId }, select: { id: true, email: true } })
      : await prisma.member.findUnique({ where: { email }, select: { id: true, email: true } });

    if (!member) return NextResponse.json({ error: "멤버를 찾을 수 없습니다." }, { status: 404 });

    const results = [];
    for (const event of events) {
      const saved = await prisma.googleDriveEvidence.upsert({
        where: { memberId_fileId: { memberId: member.id, fileId: event.fileId } },
        update: {
          title: event.title,
          url: event.url,
          mimeType: event.mimeType,
          sourceType: event.sourceType,
          matchedBy: event.matchedBy,
          matchConfidence: event.matchConfidence,
          projectName: event.projectName,
          role: event.role,
          contentExcerpt: event.contentExcerpt,
          summary: event.summary,
          occurredAt: event.occurredAt,
        },
        create: {
          memberId: member.id,
          ...event,
        },
      });
      results.push(saved.id);
    }

    await prisma.memberActivity.create({
      data: {
        memberId: member.id,
        source: "google-drive",
        type: "evidence-sync",
        summary: `Google Drive 프로젝트/산출물 근거 ${results.length}건 동기화`,
        occurredAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, memberId: member.id, evidenceCount: results.length });
  } catch (error) {
    if (isMissingColumnError(error) || isMissingRelationError(error)) {
      return NextResponse.json(
        { error: "Google Drive evidence 마이그레이션이 필요합니다.", schemaStatus: "drive_migration_required" },
        { status: 503 },
      );
    }

    console.error("Google Drive evidence sync failed", error);
    return NextResponse.json({ error: "Google Drive evidence sync failed" }, { status: 500 });
  }
}
