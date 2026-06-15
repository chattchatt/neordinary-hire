import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { isMissingColumnError } from "@/lib/prisma-compat";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

type ExportMember = {
  name: string;
  affiliation: string;
  organization: string | null;
  phone: string;
  email: string;
  roles: string[];
  techStack: string;
  certifications: string | null;
  experience: string | null;
  projectExperience: string | null;
  availability: string;
  workType: string;
  workRegion: string;
  discordNickname?: string | null;
  discordDisplayName?: string | null;
  discordUsername?: string | null;
  discordRoles?: string[];
  discordActivitySummary?: string | null;
  notes: string | null;
};

// GET /api/members/export — 부산은행 포맷 엑셀 다운로드 (인증 필요)
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) return unauthorizedResponse();
  try {
    const { searchParams } = req.nextUrl;
    const role = searchParams.get("role") || "";
    const experience = searchParams.get("experience") || "";
    const availability = searchParams.get("availability") || "";
    const community = searchParams.get("community") || "";
    const region = searchParams.get("region") || "";
    const discordStatus = searchParams.get("discordStatus") || "";

    const where: Record<string, unknown> = {};
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

    let members: ExportMember[];
    let hasDiscordSchema = true;
    try {
      members = await prisma.member.findMany({ where, orderBy: { createdAt: "desc" } });
    } catch (error) {
      if (!isMissingColumnError(error)) throw error;
      hasDiscordSchema = false;
      const legacyWhere: Record<string, unknown> = { ...where };
      delete legacyWhere.discordUserId;
      delete legacyWhere.discordUsername;
      delete legacyWhere.lastDiscordActiveAt;
      members = await prisma.member.findMany({
        where: legacyWhere,
        orderBy: { createdAt: "desc" },
        select: {
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
          availability: true,
          workType: true,
          workRegion: true,
          notes: true,
          createdAt: true,
        },
      });
    }

    const header = [
      "성명", "소속 구분", "소속 회사명", "연락처 / 이메일",
      "주요 역할", "기술 스택", "보유 자격증", "총 경력 (년)",
      "차세대 프로젝트 관련 경력", "가용 시기",
      "희망 근무 형태", "근무 가능 지역", "Discord 닉네임", "Discord 표시명", "Discord 역할", "Discord 활동 요약", "기타 사항",
    ];

    const rows = members.map((m) => [
      m.name,
      m.affiliation,
      m.organization || "",
      `${m.phone} / ${m.email}`,
      m.roles.join(", "),
      m.techStack,
      m.certifications || "",
      m.experience || "",
      m.projectExperience || "",
      m.availability,
      m.workType,
      m.workRegion,
      hasDiscordSchema ? m.discordNickname || "" : "",
      hasDiscordSchema ? m.discordDisplayName || m.discordUsername || "" : "",
      hasDiscordSchema ? (m.discordRoles || []).join(", ") : "",
      hasDiscordSchema ? m.discordActivitySummary || "" : "",
      m.notes || "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    ws["!cols"] = [
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 15 },
      { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 30 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 40 }, { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "인력Pool");

    const out = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const buf = Buffer.from(out, "base64");
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Neordinary_Pool_${date}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
