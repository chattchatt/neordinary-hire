import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";

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
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { techStack: { contains: search, mode: "insensitive" } },
      { organization: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) where.roles = { has: role };
  if (experience) where.experience = experience;
  if (availability) where.availability = availability;
  if (community) where.communityType = community;
  if (region) where.workRegion = { contains: region, mode: "insensitive" };

  const members = await prisma.member.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.member.count();
  const thisMonth = await prisma.member.count({
    where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
  });
  const availableNow = await prisma.member.count({ where: { availability: "즉시" } });

  return NextResponse.json({
    members,
    stats: { total, thisMonth, availableNow },
  });
}

// POST /api/members — 멤버 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  const member = await prisma.member.create({
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
      portfolioUrl: body.portfolioUrl || null,
      bio: body.bio || null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json({ success: true, member }, { status: 201 });
}