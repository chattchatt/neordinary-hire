import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

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

    const where: Record<string, unknown> = {};
    if (role) where.roles = { has: role };
    if (experience) where.experience = experience;
    if (availability) where.availability = availability;
    if (community) where.communityType = community;
    if (region) where.workRegion = { contains: region, mode: "insensitive" };

    const members = await prisma.member.findMany({ where, orderBy: { createdAt: "desc" } });

    const header = [
      "성명", "소속 구분", "소속 회사명", "연락처 / 이메일",
      "주요 역할", "기술 스택", "보유 자격증", "총 경력 (년)",
      "차세대 프로젝트 관련 경력", "가용 시기",
      "희망 근무 형태", "근무 가능 지역", "기타 사항",
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
      m.notes || "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    ws["!cols"] = [
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 15 },
      { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 30 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 20 },
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