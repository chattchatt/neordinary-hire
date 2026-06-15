import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

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
  for (const route of [
    "src/app/api/discord/link/route.ts",
    "src/app/api/discord/sync/route.ts",
  ]) {
    assert.equal(
      existsSync(new URL(`../${route}`, import.meta.url)),
      true,
      `${route} missing`,
    );
    const source = read(route);
    assert.match(source, /DISCORD_SYNC_SECRET/);
    assert.match(source, /Authorization/);
  }
});

test("Discord sync can auto-link a pending profile by submitted handle", () => {
  const syncRoute = read("src/app/api/discord/sync/route.ts");
  assert.match(syncRoute, /findPendingMemberByDiscordHandle/);
  assert.match(syncRoute, /discordUserId: null/);
  assert.match(syncRoute, /mode: "insensitive"/);
  assert.match(syncRoute, /자동 매칭 후보가 여러 명/);
  assert.match(syncRoute, /discordLinkedAt: member.discordLinkedAt \|\| now/);
  assert.match(syncRoute, /activityType = "auto-link"/);
  assert.match(syncRoute, /sanitize\(body\.activitySummary, 8000\)/);
});

test("quick registration accepts Discord handle without forcing bot commands", () => {
  const quickRoute = read("src/app/api/members/quick/route.ts");
  const quickPage = read("src/app/register/quick/page.tsx");
  const successPage = read("src/app/register/quick/success/page.tsx");
  assert.match(quickRoute, /hireLinkCode/);
  assert.match(quickRoute, /discordUsername: discordHandle \|\| null/);
  assert.match(quickRoute, /activityConsentAt/);
  assert.match(quickRoute, /Duplicate-click guard/);
  assert.match(quickRoute, /const rateLimitKey = `\$\{ip\}:\$\{email\}`/);
  assert.match(quickPage, /hireLinkCode/);
  assert.match(quickPage, /Discord ID·사용자명·서버 닉네임/);
  assert.match(quickPage, /직접 명령어를 입력하지 않아도 매칭 검토가 시작/);
  assert.match(quickPage, /discord", "submitted"/);
  assert.match(quickPage, /활동 맥락을 인재풀 매칭 검토에 활용/);
  assert.match(successPage, /연동 코드/);
  assert.match(successPage, /접수 완료 · 커뮤니티 매칭 대기/);
  assert.match(successPage, /이제 사용자가 직접 할 일은 없습니다/);
  assert.match(successPage, /선택 사항 · 커뮤니티 매칭/);
  assert.match(successPage, /매칭이 안 될 때만 직접 인증 방법 보기/);
  assert.match(successPage, /직접 인증은 선택/);
  assert.match(successPage, /서버 멤버와 매칭을 시도/);
  assert.match(successPage, /\/hire-link/);
  assert.match(successPage, /선택 인증/);
  assert.match(successPage, /공개 채널에 코드를 올리지 마세요/);
  assert.match(successPage, /\/hire-sync-me/);
});

test("full profile registration captures Discord handle for operator matching", () => {
  const membersRoute = read("src/app/api/members/route.ts");
  const registerPage = read("src/app/register/page.tsx");
  assert.equal(
    membersRoute.includes("hireLinkCode: member.hireLinkCode"),
    true,
  );
  assert.match(membersRoute, /discordUsername: discordHandle \|\| null/);
  assert.match(membersRoute, /activityConsentAt/);
  assert.match(registerPage, /hireLinkCode/);
  assert.match(registerPage, /Discord ID·사용자명·서버 닉네임/);
  assert.match(registerPage, /직접 봇 명령어를 입력하지 않아도/);
  assert.match(registerPage, /discord", "submitted"/);
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
  assert.match(admin, /자동 매칭 대기/);
  assert.match(admin, /활동 활용 동의/);
  assert.match(admin, /활동 요약/);
  assert.match(admin, /활동 딥다이브/);
  assert.match(admin, /채널별 활동/);
  assert.match(admin, /최근 활동 타임라인/);
  assert.match(admin, /수집 범위/);
  assert.match(admin, /메시지 원문은 저장하지 않고 요약\/메타데이터만 확인/);
});

test("admin can filter Discord trust status and activity sync state", () => {
  const membersRoute = read("src/app/api/members/route.ts");
  const exportRoute = read("src/app/api/members/export/route.ts");
  const admin = read("src/app/admin/page.tsx");

  assert.match(membersRoute, /discordStatus/);
  assert.match(membersRoute, /verified/);
  assert.match(membersRoute, /pending/);
  assert.match(membersRoute, /active/);
  assert.match(membersRoute, /discordActive/);
  assert.match(exportRoute, /discordStatus/);
  assert.match(admin, /Discord 전체/);
  assert.match(admin, /인증 완료/);
  assert.match(admin, /자동 매칭 대기/);
  assert.match(admin, /최근 활동 있음/);
  assert.match(admin, /미연동/);
  assert.match(admin, /stats\.discordActive/);
});

test("admin auth survives refresh with httpOnly cookie", () => {
  const admin = read("src/app/admin/page.tsx");
  const authRoute = read("src/app/api/auth/route.ts");
  assert.match(authRoute, /httpOnly:\s*true/);
  assert.doesNotMatch(admin, /document\.cookie/);
  assert.match(admin, /useState\(true\)/);
  assert.match(admin, /res\.status === 401/);
  assert.match(admin, /setAuthed\(false\)/);
});
