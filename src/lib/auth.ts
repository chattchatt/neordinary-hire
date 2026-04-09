import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "epqpf123698745~!";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "neordinary-hire-secret-2026";

export function generateToken(): string {
  const payload = `${ADMIN_PASSWORD}:${TOKEN_SECRET}:${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`;
  return createHash("sha256").update(payload).digest("hex");
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function verifyAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_token");
  if (!cookie) return false;
  return cookie.value === generateToken();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
}