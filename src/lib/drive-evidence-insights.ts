
export const DRIVE_EVIDENCE_REPORT_LABELS = [
  "Drive 기반 인재 평가 리포트",
  "검토 우선순위",
  "역량 신호",
  "프로젝트 참여 근거",
  "매칭 확인 필요",
] as const;

export interface DriveEvidenceInput {
  id: string;
  title: string;
  mimeType: string | null;
  matchedBy: string;
  matchConfidence: string | null;
  projectName: string | null;
  role: string | null;
  contentExcerpt: string | null;
  summary: string | null;
  occurredAt: string | null;
  createdAt: string;
}

export interface DriveEvidenceSignal {
  label: "시장/문제 탐색" | "기술 구현" | "포트폴리오/경험" | "팀 산출물";
  description: string;
  count: number;
  evidenceTitles: string[];
}

export interface DriveProjectEvidence {
  project: string;
  count: number;
  roles: string[];
  summaries: string[];
  titles: string[];
  hasDirectEvidence: boolean;
  hasTeamEvidence: boolean;
  needsReview: boolean;
}

export interface DriveEvidenceReport {
  totalCount: number;
  projectCount: number;
  highConfidenceCount: number;
  mediumOrLowConfidenceCount: number;
  needsReviewCount: number;
  reviewPriority: "우선 검토" | "일반 검토" | "매칭 확인 필요" | "자료 없음";
  signals: DriveEvidenceSignal[];
  projectEvidence: DriveProjectEvidence[];
  reviewNotes: string[];
}

const SIGNAL_RULES: Array<{
  label: DriveEvidenceSignal["label"];
  description: string;
  patterns: RegExp[];
  matchedBy?: RegExp;
}> = [
  {
    label: "시장/문제 탐색",
    description: "문제 정의, 시장 조사, 인사이트, 기획 가설을 다룬 흔적입니다.",
    patterns: [/market insight/i, /시장/, /문제/, /인사이트/, /가설/, /hypothesis/i, /proposal/i, /기획/, /제안/],
  },
  {
    label: "기술 구현",
    description: "개발·GitHub·기술 스택·구현 산출물과 연결된 흔적입니다.",
    patterns: [/개발/, /github/i, /기술/, /\bBE\b/i, /\bFE\b/i, /web/i, /developer/i, /\bdev\b/i, /구현/],
  },
  {
    label: "포트폴리오/경험",
    description: "개인 포트폴리오, 지원서, 프로젝트 경험을 직접 설명한 흔적입니다.",
    patterns: [/포트폴리오/, /portfolio/i, /project/i, /프로젝트 경험/, /지원서/, /경험/],
  },
  {
    label: "팀 산출물",
    description: "팀 발표자료, 최종 산출물, Notion/GitHub 등 협업 결과물에 포함된 흔적입니다.",
    patterns: [/demoday/i, /데모데이/, /최종 산출물/, /팀 인원/, /PR PPT/i, /notion/i, /github/i, /발표/, /팀/],
    matchedBy: /team|members/i,
  },
];

function evidenceText(item: DriveEvidenceInput): string {
  return [item.title, item.role, item.projectName, item.summary, item.contentExcerpt].filter(Boolean).join("\n");
}

function hasAmbiguousKoreanNamePair(title: string): boolean {
  const match = title.match(/([가-힣]{2,4}).*-\s*([가-힣]{2,4})/);
  return Boolean(match && match[1] !== match[2]);
}

function evidenceNeedsReview(item: DriveEvidenceInput): boolean {
  if (item.matchConfidence === "medium" || item.matchConfidence === "low" || !item.matchConfidence) return true;
  if (hasAmbiguousKoreanNamePair(item.title)) return true;
  return false;
}

function uniqueLimited(values: Array<string | null | undefined>, limit: number): string[] {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])).slice(0, limit);
}

function buildSignals(evidence: DriveEvidenceInput[]): DriveEvidenceSignal[] {
  return SIGNAL_RULES.map((rule) => {
    const matched = evidence.filter((item) => {
      const text = evidenceText(item);
      return rule.patterns.some((pattern) => pattern.test(text)) || Boolean(rule.matchedBy?.test(item.matchedBy));
    });

    return {
      label: rule.label,
      description: rule.description,
      count: matched.length,
      evidenceTitles: uniqueLimited(matched.map((item) => item.title), 3),
    };
  });
}

function buildProjectEvidence(evidence: DriveEvidenceInput[]): DriveProjectEvidence[] {
  const groups = evidence.reduce<Record<string, DriveEvidenceInput[]>>((acc, item) => {
    const key = item.projectName || "프로젝트 미지정";
    acc[key] = [...(acc[key] || []), item];
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([project, items]) => ({
      project,
      count: items.length,
      roles: uniqueLimited(items.map((item) => item.role), 5),
      summaries: uniqueLimited(items.map((item) => item.summary || item.contentExcerpt), 3),
      titles: uniqueLimited(items.map((item) => item.title), 4),
      hasDirectEvidence: items.some((item) => /drive-search-name|direct|email/i.test(item.matchedBy)),
      hasTeamEvidence: items.some((item) => /team|members/i.test(item.matchedBy)),
      needsReview: items.some(evidenceNeedsReview),
    }))
    .sort((a, b) => b.count - a.count || a.project.localeCompare(b.project));
}

function buildReviewNotes(evidence: DriveEvidenceInput[], projectEvidence: DriveProjectEvidence[]): string[] {
  if (evidence.length === 0) {
    return ["Drive 근거가 아직 없어 Discord 활동과 등록폼 정보만으로 판단해야 합니다."];
  }

  const notes: string[] = [];
  const needsReview = evidence.filter(evidenceNeedsReview);
  if (needsReview.length > 0) {
    notes.push(`매칭 확인 필요: ${needsReview.length}건은 중간/낮은 확신 또는 파일명상 다른 이름이 함께 있어 운영진 확인이 필요합니다.`);
  }

  const teamOnlyProjects = projectEvidence.filter((project) => project.hasTeamEvidence && !project.hasDirectEvidence);
  if (teamOnlyProjects.length > 0) {
    notes.push(`팀 산출물 근거: ${teamOnlyProjects.length}개 프로젝트는 팀 명단 기반 근거라 실제 개인 기여도는 문서 본문과 Discord 활동을 함께 봐야 합니다.`);
  }

  if (projectEvidence.length >= 2) {
    notes.push(`프로젝트 참여 근거: ${projectEvidence.length}개 프로젝트에서 반복 등장해 단일 파일보다 신뢰도가 높습니다.`);
  }

  return notes;
}

export function buildDriveEvidenceReport(evidence: DriveEvidenceInput[]): DriveEvidenceReport {
  const projectEvidence = buildProjectEvidence(evidence);
  const needsReviewCount = evidence.filter(evidenceNeedsReview).length;
  const highConfidenceCount = evidence.filter((item) => item.matchConfidence === "high").length;
  const mediumOrLowConfidenceCount = evidence.filter((item) => item.matchConfidence === "medium" || item.matchConfidence === "low").length;
  const projectCount = projectEvidence.length;

  let reviewPriority: DriveEvidenceReport["reviewPriority"] = "일반 검토";
  if (evidence.length === 0) reviewPriority = "자료 없음";
  else if (needsReviewCount > 0) reviewPriority = "매칭 확인 필요";
  else if (highConfidenceCount >= 3 && projectCount >= 2) reviewPriority = "우선 검토";

  return {
    totalCount: evidence.length,
    projectCount,
    highConfidenceCount,
    mediumOrLowConfidenceCount,
    needsReviewCount,
    reviewPriority,
    signals: buildSignals(evidence),
    projectEvidence,
    reviewNotes: buildReviewNotes(evidence, projectEvidence),
  };
}
