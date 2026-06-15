import { NextRequest, NextResponse } from "next/server";
import { companyUnauthorizedResponse, verifyCompanyAuth } from "@/lib/company-auth";
import { buildCompanyTalentDashboard, type CompanyTalentMemberInput } from "@/lib/company-talent-score";
import { prisma } from "@/lib/prisma";
import { isMissingColumnError, isMissingRelationError } from "@/lib/prisma-compat";

export async function GET(req: NextRequest) {
  if (!verifyCompanyAuth(req)) return companyUnauthorizedResponse();

  const { searchParams } = req.nextUrl;
  const role = searchParams.get("role") || "";
  const region = searchParams.get("region") || "";
  const availability = searchParams.get("availability") || "";

  const where: Record<string, unknown> = {};
  if (role) where.roles = { has: role };
  if (region) where.workRegion = { contains: region, mode: "insensitive" };
  if (availability) where.availability = availability;

  try {
    const members = await prisma.member.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: {
        activityEvidence: { select: { id: true }, take: 100 },
        driveEvidence: { orderBy: { createdAt: "desc" }, take: 100 },
      },
    });

    const dashboardInput: CompanyTalentMemberInput[] = members.map((member) => ({
      ...member,
      driveEvidence: member.driveEvidence.map((evidence) => ({
        ...evidence,
        occurredAt: evidence.occurredAt?.toISOString() ?? null,
        createdAt: evidence.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json(buildCompanyTalentDashboard(dashboardInput));
  } catch (error) {
    if (isMissingColumnError(error) || isMissingRelationError(error)) {
      return NextResponse.json({ error: "기업용 뷰는 Discord/Drive 마이그레이션 적용 후 사용할 수 있습니다." }, { status: 503 });
    }
    throw error;
  }
}
