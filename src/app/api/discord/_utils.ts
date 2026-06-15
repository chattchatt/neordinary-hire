import { NextRequest, NextResponse } from "next/server";

export function sanitize(value: unknown, maxLength = 1000): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
}

export function sanitizeStringArray(value: unknown, maxItems = 30): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitize(String(item), 80))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function parseOptionalDate(value: unknown): Date | null {
  const raw = sanitize(value, 80);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function assertDiscordSyncAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.DISCORD_SYNC_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "DISCORD_SYNC_SECRET is not configured." }, { status: 503 });
  }
  const auth = req.headers.get("Authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
