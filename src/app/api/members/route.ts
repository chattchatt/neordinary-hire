import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { generateHireLinkCode } from "@/lib/hire-link-code";
import { isMissingColumnError } from "@/lib/prisma-compat";

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
  };
}

// GET /api/members — 인재 목록 조회 (인증 필요)
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) return unauthorizedResponse();
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const experience = searchParams.get("experience") || "";
  const availability = searchParams.get("availability") || "";
  const community = searchParams.get("community") || "";
  const region = searchParams.get("region") || "";
  const discordStatus = searchParams.get("discordStatus") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { techStack: { contains: search, mode: "insensitive" } },
      { organization: { contains: search, mode: "insensitive" } },
      { discordUsername: { contains: search, mode: "insensitive" } },
      { discordDisplayName: { contains: search, mode: "insensitive" } },
      { discordNickname: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) where.roles = { has: role };
  if (experience) where.experience = experience;
  if (availability) where.availability = availability;
  if (community) where.communityType = community;
  if (region) where.workRegion = { contains: region, mode: "insensitive" };
  if (discordStatus === "verified") where.discordUserId = { not: null };
  if (discordStatus === "pending") {
    where.discordUserId = null;
    where.discordUsername = { not: null };
  }
  if (discordStatus === "active") where.lastDiscordActiveAt = { not: null };
  if (discordStatus === "unlinked") {
    where.discordUserId = null;
    where.discordUsername = null;
  }

  try {
    const members = await prisma.member.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: { activities: { orderBy: { occurredAt: "desc" }, take: 10 } },
    });

    const total = await prisma.member.count();
    const thisMonth = await prisma.member.count({
      where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    });
    const availableNow = await prisma.member.count({ where: { availability: "즉시" } });
    const discordLinked = await prisma.member.count({ where: { discordUserId: { not: null } } });
    const discordActive = await prisma.member.count({ where: { lastDiscordActiveAt: { not: null } } });

    return NextResponse.json({
      members,
      stats: { total, thisMonth, availableNow, discordLinked, discordActive },
    });
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;

    const legacyWhere: Record<string, unknown> = { ...where };
    delete legacyWhere.discordUserId;
    delete legacyWhere.discordUsername;
    delete legacyWhere.lastDiscordActiveAt;
    if (search) {
      legacyWhere.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { techStack: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    const members = await prisma.member.findMany({
      where: legacyWhere,
      orderBy: { [sortBy]: sortOrder },
      select: legacyMemberSelect,
    });

    const total = await prisma.member.count();
    const thisMonth = await prisma.member.count({
      where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    });
    const availableNow = await prisma.member.count({ where: { availability: "즉시" } });

    return NextResponse.json({
      members: members.map(withDiscordFallback),
      stats: { total, thisMonth, availableNow, discordLinked: 0, discordActive: 0 },
      schemaStatus: "discord_migration_required",
    });
  }
}

// POST /api/members — 멤버 등록
export async function POST(req: NextRequest) {
  const body = await req.json();
  const discordHandle = typeof body.discordHandle === "string"
    ? body.discordHandle.replace(/<[^>]*>/g, "").trim().slice(0, 80)
    : typeof body.discordUsername === "string"
      ? body.discordUsername.replace(/<[^>]*>/g, "").trim().slice(0, 80)
      : "";
  const activityConsent = body.activityConsent === true;

  let member;
  try {
    member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        affiliation: body.affiliation,
        organization: body.organization || null,
        roles: body.roles || [],
        techStack: body.techStack,
        certifications: body.certifications || null,
        experience: body.experience || null,
        projectExperience: body.projectExperience || null,
        communityType: body.communityType || null,
        generation: body.generation ? parseInt(body.generation) : null,
        communityRole: body.communityRole || null,
        track: body.track || null,
        availability: body.availability,
        workType: body.workType,
        workRegion: body.workRegion,
        employmentTypes: body.employmentTypes || [],
        hireLinkCode: generateHireLinkCode(),
        discordUsername: discordHandle || null,
        activityConsentAt: discordHandle && activityConsent ? new Date() : null,
        portfolioUrl: body.portfolioUrl || null,
        bio: body.bio || null,
        notes: body.notes || null,
      },
    });
  } catch (error) {
    if (isMissingColumnError(error)) {
      return NextResponse.json(
        {
          error: "Discord 연동 DB 마이그레이션 적용 후 인재 등록이 가능합니다.",
          schemaStatus: "discord_migration_required",
        },
        { status: 503 }
      );
    }
    throw error;
  }

  return NextResponse.json({ success: true, member, hireLinkCode: member.hireLinkCode }, { status: 201 });
}
