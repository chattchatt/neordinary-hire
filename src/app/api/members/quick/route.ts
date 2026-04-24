import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory rate limit store: ip -> timestamp of last successful submission
// (Resets on server restart — acceptable for serverless edge; no external dependency needed)
const rateLimitStore = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  // Strip HTML tags and trim
  return value.replace(/<[^>]*>/g, "").trim().slice(0, 1000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // 010-XXXX-XXXX format
  return /^010-\d{4}-\d{4}$/.test(phone);
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// POST /api/members/quick — 간이 등록 (7필드, 인증 불필요)
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limit: 1 submission per IP per 5 minutes
  const lastSubmission = rateLimitStore.get(ip);
  if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_WINDOW_MS) {
    const remainingSecs = Math.ceil((RATE_LIMIT_WINDOW_MS - (Date.now() - lastSubmission)) / 1000);
    return NextResponse.json(
      { error: `잠시 후 다시 시도해주세요. (${remainingSecs}초 후 가능)` },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // Sanitize all inputs
  const name = sanitize(body.name);
  const email = sanitize(body.email).toLowerCase();
  const phone = sanitize(body.phone);
  const techStack = sanitize(body.techStack);
  const availability = sanitize(body.availability);

  const rolesRaw = Array.isArray(body.roles) ? body.roles : [];
  const roles = rolesRaw.map((r) => sanitize(String(r))).filter(Boolean);

  const employmentTypesRaw = Array.isArray(body.employmentTypes) ? body.employmentTypes : [];
  const employmentTypes = employmentTypesRaw.map((e) => sanitize(String(e))).filter(Boolean);

  // Validation
  if (!name) return NextResponse.json({ error: "성명을 입력해주세요." }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
  if (!phone || !isValidPhone(phone)) return NextResponse.json({ error: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)" }, { status: 400 });
  if (roles.length === 0) return NextResponse.json({ error: "주요 역할을 하나 이상 선택해주세요." }, { status: 400 });
  if (!techStack) return NextResponse.json({ error: "기술 스택을 입력해주세요." }, { status: 400 });
  if (!availability) return NextResponse.json({ error: "가용 시기를 선택해주세요." }, { status: 400 });
  if (employmentTypes.length === 0) return NextResponse.json({ error: "희망 근무형태를 하나 이상 선택해주세요." }, { status: 400 });

  // Whitelist check for select fields
  const validAvailability = ["즉시", "1개월 내", "3개월 내", "미정"];
  const validEmploymentTypes = ["정규직", "프리랜서", "부업", "단발 프로젝트"];
  const validRoles = ["PM", "기획", "디자이너", "프론트엔드", "백엔드", "풀스택", "앱(iOS/Android)", "DevOps", "기타"];

  if (!validAvailability.includes(availability)) {
    return NextResponse.json({ error: "올바른 가용 시기를 선택해주세요." }, { status: 400 });
  }
  for (const et of employmentTypes) {
    if (!validEmploymentTypes.includes(et)) {
      return NextResponse.json({ error: "올바른 근무형태를 선택해주세요." }, { status: 400 });
    }
  }
  for (const r of roles) {
    if (!validRoles.includes(r)) {
      return NextResponse.json({ error: "올바른 역할을 선택해주세요." }, { status: 400 });
    }
  }

  // Duplicate email check
  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "already_exists", message: "이미 등록된 이메일입니다." },
      { status: 409 }
    );
  }

  // Create member with required defaults for non-quick fields
  const member = await prisma.member.create({
    data: {
      name,
      email,
      phone,
      roles,
      techStack,
      availability,
      employmentTypes,
      // Quick register defaults for required schema fields
      affiliation: "미입력",
      workType: "미정",
      workRegion: "미입력",
      isQuickRegister: true,
    },
  });

  // Record rate limit timestamp after successful creation
  rateLimitStore.set(ip, Date.now());

  return NextResponse.json({ success: true, memberId: member.id }, { status: 201 });
}
