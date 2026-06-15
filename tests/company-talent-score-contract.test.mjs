import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import ts from "typescript";

async function compileModule(sourceFile) {
  const tempDir = await mkdtemp(path.join(tmpdir(), "company-talent-score-"));
  const compilerOptions = {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    esModuleInterop: true,
    strict: true,
  };

  const driveSource = await readFile("src/lib/drive-evidence-insights.ts", "utf8");
  const driveOutput = ts.transpileModule(driveSource, { compilerOptions }).outputText;
  const drivePath = path.join(tempDir, "drive-evidence-insights.mjs");
  await writeFile(drivePath, driveOutput);

  const profileSource = (await readFile("src/lib/company-profile-curation.ts", "utf8")).replace(
    './drive-evidence-insights',
    `file://${drivePath}`,
  );
  const profileOutput = ts.transpileModule(profileSource, { compilerOptions }).outputText;
  const profilePath = path.join(tempDir, "company-profile-curation.mjs");
  await writeFile(profilePath, profileOutput);

  const source = (await readFile(sourceFile, "utf8"))
    .replace('./company-profile-curation', `file://${profilePath}`)
    .replace('./drive-evidence-insights', `file://${drivePath}`);
  const output = ts.transpileModule(source, { compilerOptions }).outputText;
  const outputPath = path.join(tempDir, "module.mjs");
  await writeFile(outputPath, output);
  return {
    module: await import(outputPath),
    cleanup: () => rm(tempDir, { recursive: true, force: true }),
  };
}

test("company talent score creates an anonymous, evidence-weighted profile", async () => {
  const { module, cleanup } = await compileModule("src/lib/company-talent-score.ts");
  try {
    const dashboard = module.buildCompanyTalentDashboard([
      {
        id: "member_1",
        name: "홍길동",
        email: "private@example.com",
        phone: "010-0000-0000",
        roles: ["프론트엔드"],
        techStack: "Next.js, TypeScript, Figma",
        experience: "1년 미만",
        projectExperience: "부산 프로젝트에서 웹 대시보드 구현",
        communityType: "UMC",
        generation: 1,
        communityRole: "챌린저",
        track: "프론트엔드",
        availability: "즉시",
        workType: "재택/하이브리드",
        workRegion: "부산",
        employmentTypes: ["인턴", "계약직"],
        portfolioUrl: "https://portfolio.example.com",
        discordUserId: "1234567890",
        discordUsername: "private_discord",
        discordRoles: ["챌린저", "Frontend"],
        discordActivitySummary: "원문 메시지 숨김",
        activityEvidence: [{ id: "e1" }, { id: "e2" }, { id: "e3" }],
        driveEvidence: [
          {
            id: "g1",
            title: "부산 데모데이 발표자료",
            projectName: "부산 데모데이",
            role: "프론트엔드",
            matchConfidence: "high",
            summary: "웹 대시보드 산출물",
            contentExcerpt: "private raw drive excerpt",
            fileId: "file1",
            url: "https://drive.example.com/file1",
            mimeType: "application/pdf",
            sourceType: "drive",
            matchedBy: "name",
            occurredAt: null,
            createdAt: "2026-06-15T00:00:00.000Z",
          },
        ],
      },
    ]);

    assert.equal(dashboard.stats.total, 1);
    assert.equal(dashboard.stats.shareReady, 1);
    assert.equal(dashboard.talents[0].anonymousLabel, "후보자 001");
    assert.equal(dashboard.talents[0].recommendedPosition, "프론트엔드 / 프론트엔드");
    assert.ok(dashboard.talents[0].fitScore.total >= 70);
    assert.ok(dashboard.talents[0].fitScore.breakdown.some((item) => item.label === "프로젝트 근거"));
    assert.ok(dashboard.talents[0].fitScore.rationale.some((item) => item.includes("Drive")));

    const serialized = JSON.stringify(dashboard);
    assert.ok(!serialized.includes("홍길동"));
    assert.ok(!serialized.includes("private@example.com"));
    assert.ok(!serialized.includes("010-0000-0000"));
    assert.ok(!serialized.includes("1234567890"));
    assert.ok(!serialized.includes("private_discord"));
    assert.ok(!serialized.includes("private raw drive excerpt"));
  } finally {
    await cleanup();
  }
});

test("company page and api expose expected product labels", async () => {
  const page = await readFile("src/app/company/page.tsx", "utf8");
  const api = await readFile("src/app/api/company/members/route.ts", "utf8");
  assert.match(page, /기업용 인재 대시보드/);
  assert.match(page, /익명 후보자/);
  assert.match(page, /점수표/);
  assert.match(api, /buildCompanyTalentDashboard/);
});
