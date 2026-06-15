import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const COMPANY_TOKEN_SECRET = process.env.COMPANY_TOKEN_SECRET || process.env.TOKEN_SECRET || "neordinary-company-view-2026";

function getCompanyPassword(): string | null {
  return process.env.COMPANY_VIEW_PASSWORD || process.env.ADMIN_PASSWORD || null;
}

export function generateCompanyToken(): string {
  const password = getCompanyPassword() || "company-view-disabled";
  const payload = `${password}:${COMPANY_TOKEN_SECRET}:${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`;
  return createHash("sha256").update(payload).digest("hex");
}

export function verifyCompanyPassword(password: string): boolean {
  const expectedPassword = getCompanyPassword();
  return Boolean(expectedPassword) && password === expectedPassword;
}

export function verifyCompanyAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("company_token");
  return cookie?.value === generateCompanyToken();
}

export function companyUnauthorizedResponse() {
  return NextResponse.json({ error: "기업용 로그인이 필요합니다." }, { status: 401 });
}
