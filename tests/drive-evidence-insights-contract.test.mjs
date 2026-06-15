import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

async function importDriveEvidenceHelper() {
  const source = read("src/lib/drive-evidence-insights.ts");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulePath = join(tmpdir(), `drive-evidence-insights-${Date.now()}.mjs`);
  writeFileSync(modulePath, compiled);
  return import(`file://${modulePath}`);
}

const sampleEvidence = [
  {
    id: "direct-portfolio",
    title: "김범조_포트폴리오 - 김동준.pdf",
    mimeType: "application/pdf",
    matchedBy: "drive-search-name",
    matchConfidence: "medium",
    projectName: "개인 포트폴리오",
    role: "개발자",
    contentExcerpt: "웹 서비스 개발, GitHub, 프로젝트 경험 정리",
    summary: "개발 구현과 포트폴리오 경험이 있는 직접 이름 매칭 파일",
    occurredAt: "2026-06-01T00:00:00.000Z",
    createdAt: "2026-06-15T00:00:00.000Z",
  },
  {
    id: "team-market",
    title: "부산 1기 DemoDay PR PPT",
    mimeType: "application/vnd.google-apps.presentation",
    matchedBy: "name-from-team-members",
    matchConfidence: "high",
    projectName: "DemoDay 프로젝트",
    role: "팀 인원",
    contentExcerpt: "시장 문제 탐색, 인사이트, 최종 산출물, Notion 링크",
    summary: "팀 산출물에서 시장/문제 탐색과 발표 참여 근거가 확인됨",
    occurredAt: "2026-05-01T00:00:00.000Z",
    createdAt: "2026-06-15T00:00:00.000Z",
  },
];

test("Drive evidence report summarizes review priority, competency signals, and project evidence", async () => {
  const { buildDriveEvidenceReport } = await importDriveEvidenceHelper();
  const report = buildDriveEvidenceReport(sampleEvidence);

  assert.equal(report.totalCount, 2);
  assert.equal(report.projectCount, 2);
  assert.equal(report.reviewPriority, "매칭 확인 필요");
  assert.equal(report.needsReviewCount, 1);
  assert.deepEqual(
    report.signals.filter((signal) => signal.count > 0).map((signal) => signal.label),
    ["시장/문제 탐색", "기술 구현", "포트폴리오/경험", "팀 산출물"],
  );
  assert.equal(report.projectEvidence.length, 2);
  assert.match(report.reviewNotes.join("\n"), /매칭 확인 필요/);
});

test("admin detail renders Drive assessment report labels", () => {
  const helper = read("src/lib/drive-evidence-insights.ts");
  const detail = read("src/app/admin/members/[id]/page.tsx");

  assert.match(helper, /buildDriveEvidenceReport/);
  assert.match(helper, /역량 신호/);
  assert.match(helper, /프로젝트 참여 근거/);
  assert.match(helper, /매칭 확인 필요/);
  assert.match(helper, /시장\/문제 탐색/);
  assert.match(helper, /기술 구현/);
  assert.match(helper, /포트폴리오\/경험/);
  assert.match(helper, /팀 산출물/);

  assert.match(detail, /Drive 기반 인재 평가 리포트/);
  assert.match(detail, /검토 우선순위/);
  assert.match(detail, /역량 신호/);
  assert.match(detail, /프로젝트 참여 근거/);
  assert.match(detail, /매칭 확인 필요/);
});
