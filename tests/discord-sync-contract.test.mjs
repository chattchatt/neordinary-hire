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

test("quick registration accepts Discord handle without forcing bot commands", () => {
  const quickRoute = read("src/app/api/members/quick/route.ts");
  const quickPage = read("src/app/register/quick/page.tsx");
  const successPage = read("src/app/register/quick/success/page.tsx");
  assert.match(quickRoute, /hireLinkCode/);
  assert.match(quickRoute, /discordUsername: discordHandle \|\| null/);
  assert.match(quickRoute, /activityConsentAt/);
  assert.match(quickPage, /hireLinkCode/);
  assert.match(quickPage, /Discord 닉네임 또는 사용자명/);
  assert.match(quickPage, /직접 Discord 명령어를 입력하지 않아도/);
  assert.match(quickPage, /활동 맥락을 인재풀 매칭 검토에 활용/);
  assert.match(successPage, /연동 코드/);
  assert.match(successPage, /선택 사항 · 커뮤니티 매칭 상태/);
  assert.match(successPage, /직접 인증은 선택/);
  assert.match(successPage, /서버 멤버 매칭을 시도/);
  assert.match(successPage, /\/hire-link/);
  assert.match(successPage, /선택 인증/);
  assert.match(successPage, /공개 채널에 코드를 올리지 마세요/);
  assert.match(successPage, /\/hire-sync-me/);
});

test("full profile registration captures Discord handle for operator matching", () => {
  const membersRoute = read("src/app/api/members/route.ts");
  const registerPage = read("src/app/register/page.tsx");
  assert.equal(membersRoute.includes("hireLinkCode: member.hireLinkCode"), true);
  assert.match(membersRoute, /discordUsername: discordHandle \|\| null/);
  assert.match(membersRoute, /activityConsentAt/);
  assert.match(registerPage, /hireLinkCode/);
  assert.match(registerPage, /Discord 닉네임 또는 사용자명/);
  assert.match(registerPage, /직접 봇 명령어를 입력하지 않아도/);
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
  assert.match(admin, /입력됨/);
  assert.match(admin, /매칭 필요/);
  assert.match(admin, /활동 활용 동의/);
  assert.match(admin, /활동 요약/);
});
