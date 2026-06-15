import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { isMissingColumnError, isMissingRelationError } from "@/lib/prisma-compat";

const legacyMemberSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  affiliation: true,
  organization: true,
  roles: true,
  techStack: true,
  certifications: true,
  experience: true,
  projectExperience: true,
  communityType: true,
  generation: true,
  communityRole: true,
  track: true,
  availability: true,
  workType: true,
  workRegion: true,
  employmentTypes: true,
  portfolioUrl: true,
  bio: true,
  notes: true,
  isQuickRegister: true,
  availabilityUpdatedAt: true,
  createdAt: true,
  updatedAt: true,
};

function withDiscordFallback(member: Record<string, unknown>) {
  return {
    ...member,
    hireLinkCode: null,
    discordUserId: null,
    discordUsername: null,
    discordDisplayName: null,
    discordNickname: null,
    discordRoles: [],
    discordJoinedAt: null,
    lastDiscordActiveAt: null,
    discordActivitySummary: null,
    discordLinkedAt: null,
    activityConsentAt: null,
    activities: [],
    activityEvidence: [],
  };
}

export async function GET(req: NextRequest, context: RouteContext<"/api/members/[id]">) {
  if (!verifyAuth(req)) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { occurredAt: "desc" }, take: 200 },
        activityEvidence: { orderBy: { occurredAt: "desc" }, take: 500 },
      },
    });

    if (!member) return NextResponse.json({ error: "멤버를 찾을 수 없습니다." }, { status: 404 });

    return NextResponse.json({ member });
  } catch (error) {
    if (!isMissingColumnError(error) && !isMissingRelationError(error)) throw error;

    const member = await prisma.member.findUnique({
      where: { id },
      select: legacyMemberSelect,
    });

    if (!member) return NextResponse.json({ error: "멤버를 찾을 수 없습니다." }, { status: 404 });

    return NextResponse.json({
      member: withDiscordFallback(member),
      schemaStatus: "discord_migration_required",
    });
  }
}
