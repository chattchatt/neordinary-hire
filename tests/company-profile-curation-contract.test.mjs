import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

async function importCompanyProfileHelper() {
  const stamp = Date.now();
  const dependencySource = read("src/lib/drive-evidence-insights.ts");
  const dependencyCompiled = ts.transpileModule(dependencySource, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const dependencyPath = join(tmpdir(), `drive-evidence-insights-${stamp}.mjs`);
  writeFileSync(dependencyPath, dependencyCompiled);

  const source = read("src/lib/company-profile-curation.ts").replace(
    './drive-evidence-insights',
    `file://${dependencyPath}`,
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulePath = join(tmpdir(), `company-profile-curation-${stamp}.mjs`);
  writeFileSync(modulePath, compiled);
  return import(`file://${modulePath}`);
}

const sampleMember = {
  id: "member-1",
  name: "김범조",
  affiliation: "부산 인재풀",
  organization: "부경대학교",
  email: "private@example.com",
  phone: "010-0000-0000",
  roles: ["프론트엔드", "개발자"],
  techStack: "Next.js, TypeScript, Figma",
  certifications: null,
  experience: "팀 프로젝트 2회",
  projectExperience: "DemoDay 웹 서비스 개발",
  communityType: "NERDY",
  generation: 1,
  communityRole: "개발자",
  track: "Frontend",
  availability: "즉시",
  workType: "하이브리드",
  workRegion: "부산",
  employmentTypes: ["인턴", "계약직"],
  notes: "내부 운영 메모: 아직 기업에 공유하지 말 것",
  bio: "문제 해결을 좋아하는 웹 개발자입니다.",
  portfolioUrl: "https://portfolio.example.com",
  discordUserId: "1234567890",
  discordUsername: "private_discord",
  discordDisplayName: "버미",
  discordNickname: "버미",
  discordRoles: ["부산 1기", "Frontend"],
  discordActivitySummary: "최근 프로젝트 채널에서 구현 논의를 주도했습니다.",
  activityEvidence: [
    {
      id: "msg-1",
      contentExcerpt: "raw discord private message about implementation details",
      channelName: "project",
      occurredAt: "2026-06-14T00:00:00.000Z",
    },
  ],
  driveEvidence: [
    {
      id: "drive-1",
      title: "DemoDay 발표자료",
      mimeType: "application/vnd.google-apps.presentation",
      matchedBy: "name-from-team-members",
      matchConfidence: "high",
      projectName: "DemoDay 프로젝트",
      role: "프론트엔드 개발",
      contentExcerpt: "Next.js 구현, 시장 문제 탐색, GitHub 링크",
      summary: "팀 산출물에서 프론트엔드 구현 참여 근거가 확인됨",
      occurredAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-15T00:00:00.000Z",
    },
  ],
};

test("company profile preview curates job-relevant signals without exposing private or internal data", async () => {
  const { buildCompanyProfilePreview } = await importCompanyProfileHelper();
  const preview = buildCompanyProfilePreview(sampleMember);
  const serialized = JSON.stringify(preview);

  assert.equal(preview.headline, "프론트엔드 · Next.js, TypeScript, Figma");
  assert.deepEqual(preview.logistics, ["즉시", "하이브리드", "부산", "인턴/계약직"]);
  assert.match(preview.positioning, /부산/);
  assert.match(preview.evidenceSummary.join("\n"), /DemoDay 프로젝트/);
  assert.match(preview.collaborationSignals.join("\n"), /커뮤니티 활동/);
  assert.match(preview.shareGuidance.join("\n"), /동의/);

  assert.doesNotMatch(serialized, /private@example\.com/);
  assert.doesNotMatch(serialized, /010-0000-0000/);
  assert.doesNotMatch(serialized, /1234567890/);
  assert.doesNotMatch(serialized, /private_discord/);
  assert.doesNotMatch(serialized, /raw discord private message/);
  assert.doesNotMatch(serialized, /내부 운영 메모/);
});

test("admin detail renders company-facing curation labels separately from internal evidence", () => {
  const helper = read("src/lib/company-profile-curation.ts");
  const detail = read("src/app/admin/members/[id]/page.tsx");

  assert.match(helper, /buildCompanyProfilePreview/);
  assert.match(helper, /직무 적합성/);
  assert.match(helper, /검증된 프로젝트 근거/);
  assert.match(helper, /협업\/커뮤니티 신호/);
  assert.match(helper, /전달 전 확인 필요/);

  assert.match(detail, /기업 전달용 인재 카드/);
  assert.match(detail, /추천 포지션/);
  assert.match(detail, /직무 적합성/);
  assert.match(detail, /검증된 프로젝트 근거/);
  assert.match(detail, /협업\/커뮤니티 신호/);
  assert.match(detail, /전달 전 확인 필요/);
  assert.match(detail, /개인 연락처와 내부 원문 로그는 제외/);
});
