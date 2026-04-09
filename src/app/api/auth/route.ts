import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (verifyPassword(password)) {
    const token = generateToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
}