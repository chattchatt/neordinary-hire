import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Prisma Member stores Discord identity, link code, and activities", () => {
  const schema = read("prisma/schema.prisma");
  for (const field of [
    "discordUserId",
    "discordUsername",
    "discordDisplayName",
    "discordNickname",
    "discordRoles",
    "discordJoinedAt",
    "lastDiscordActiveAt",
    "discordActivitySummary",
    "activityConsentAt",
    "hireLinkCode",
    "discordLinkedAt",
    "activities",
  ]) {
    assert.match(schema, new RegExp(`\\b${field}\\b`));
  }
  assert.match(schema, /model\s+MemberActivity\s+{/);
});

test("Discord sync API routes exist and require bearer secret", () => {
  for (const route of ["src/app/api/discord/link/route.ts", "src/app/api/discord/sync/route.ts"]) {
    assert.equal(existsSync(new URL(`../${route}`, import.meta.url)), true, `${route} missing`);
    const source = read(route);
    assert.match(source, /DISCORD_SYNC_SECRET/);
    assert.match(source, /Authorization/);
  }
});

test("quick registration returns and displays a hire link code", () => {
  const quickRoute = read("src/app/api/members/quick/route.ts");
  const quickPage = read("src/app/register/quick/page.tsx");
  const successPage = read("src/app/register/quick/success/page.tsx");
  assert.match(quickRoute, /hireLinkCode/);
  assert.match(quickPage, /hireLinkCode/);
  assert.match(successPage, /연동 코드/);
  assert.match(successPage, /선택 사항 · 커뮤니티 인증/);
  assert.match(successPage, /나중에 해도 됩니다/);
  assert.match(successPage, /매칭 신뢰도/);
  assert.match(successPage, /\/hire-link/);
  assert.match(successPage, /Discord에서 커뮤니티 인증하기/);
  assert.match(successPage, /공개 채널에 코드를 올리지 마세요/);
  assert.match(successPage, /\/hire-sync-me/);
});

test("full profile registration continues into Discord linking flow", () => {
  const membersRoute = read("src/app/api/members/route.ts");
  const registerPage = read("src/app/register/page.tsx");
  assert.equal(membersRoute.includes("hireLinkCode: member.hireLinkCode"), true);
  assert.match(registerPage, /hireLinkCode/);
  assert.match(registerPage, /Discord 커뮤니티 인증을 선택/);
  assert.equal(registerPage.includes("/register/quick/success"), true);
  assert.equal(registerPage.includes('window.location.href = "/"'), false);
});

test("admin dashboard exposes Discord community trust information", () => {
  const admin = read("src/app/admin/page.tsx");
  assert.match(admin, /커뮤니티 신뢰 정보/);
  assert.match(admin, /discordNickname/);
  assert.match(admin, /discordActivitySummary/);
  assert.match(admin, /activities/);
  assert.match(admin, /Discord 인증 정보 확인 위치/);
  assert.match(admin, /표의 Discord 컬럼/);
  assert.match(admin, /인증 완료/);
  assert.match(admin, /활동 요약/);
});
