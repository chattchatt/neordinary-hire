import { NextRequest, NextResponse } from "next/server";
import { generateCompanyToken, verifyCompanyPassword } from "@/lib/company-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyCompanyPassword(password || "")) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("company_token", generateCompanyToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
