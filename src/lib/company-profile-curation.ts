import { buildDriveEvidenceReport, type DriveEvidenceInput } from "./drive-evidence-insights";

export const COMPANY_PROFILE_CURATION_LABELS = [
  "기업 전달용 인재 카드",
  "추천 포지션",
  "직무 적합성",
  "검증된 프로젝트 근거",
  "협업/커뮤니티 신호",
  "전달 전 확인 필요",
] as const;

interface CompanyProfileMemberInput {
  name: string;
  organization: string | null;
  roles: string[];
  techStack: string;
  experience: string | null;
  projectExperience: string | null;
  communityType: string | null;
  generation: number | null;
  communityRole: string | null;
  track: string | null;
  availability: string;
  workType: string;
  workRegion: string;
  employmentTypes: string[];
  bio: string | null;
  portfolioUrl: string | null;
  discordRoles: string[];
  discordActivitySummary: string | null;
  activityEvidence: Array<{ id: string }>;
  driveEvidence: DriveEvidenceInput[];
}

export interface CompanyProfilePreview {
  headline: string;
  recommendedPosition: string;
  positioning: string;
  logistics: string[];
  jobFitSignals: string[];
  evidenceSummary: string[];
  collaborationSignals: string[];
  shareGuidance: string[];
  publicLinks: string[];
}

function uniqueLimited(values: Array<string | null | undefined>, limit: number): string[] {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])).slice(0, limit);
}

function splitTechStack(techStack: string): string[] {
  return uniqueLimited(
    techStack
      .split(/[,·/|\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
    4,
  );
}

function compactText(value: string | null | undefined, fallback: string): string {
  const text = value?.replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > 110 ? `${text.slice(0, 110)}…` : text;
}

export function buildCompanyProfilePreview(member: CompanyProfileMemberInput): CompanyProfilePreview {
  const primaryRole = member.roles?.[0] || member.communityRole || member.track || "후보자";
  const techHighlights = splitTechStack(member.techStack);
  const headline = [primaryRole, techHighlights.join(", ")].filter(Boolean).join(" · ") || "후보자";
  const recommendedPosition = [primaryRole, member.track].filter(Boolean).join(" / ") || primaryRole;
  const driveReport = buildDriveEvidenceReport(member.driveEvidence || []);

  const logistics = uniqueLimited(
    [
      member.availability,
      member.workType,
      member.workRegion,
      member.employmentTypes?.join("/"),
    ],
    4,
  );

  const communityLabel = member.communityType
    ? `${member.communityType}${member.generation ? ` ${member.generation}기` : ""}${member.communityRole ? ` ${member.communityRole}` : ""}`
    : null;

  const jobFitSignals = [
    `${primaryRole} 포지션 기준으로 ${techHighlights.length ? techHighlights.join(", ") : "등록 기술 스택"} 경험을 우선 검토할 수 있습니다.`,
    compactText(member.projectExperience, "프로젝트 경험은 운영진이 Drive/Discord 근거와 함께 보강해야 합니다."),
    member.experience ? `경험 메모: ${compactText(member.experience, member.experience)}` : "경력 연차보다 프로젝트 산출물과 커뮤니티 기여 근거 중심으로 판단합니다.",
  ];

  const evidenceSummary = driveReport.projectEvidence.length
    ? driveReport.projectEvidence.slice(0, 3).map((project) => {
        const role = project.roles.length ? ` / 역할: ${project.roles.join(", ")}` : "";
        const confidence = project.needsReview ? "운영 확인 필요" : "확인된 근거";
        return `${project.project}: ${project.count}건 ${confidence}${role}`;
      })
    : ["아직 기업 전달용으로 검증된 프로젝트 근거가 부족합니다. Drive 산출물 백필 후 보강하세요."];

  const collaborationSignals = [
    communityLabel ? `커뮤니티 활동: ${communityLabel}` : "커뮤니티 활동: 등록 정보 기준 보강 필요",
    member.discordRoles?.length ? `Discord 역할: ${member.discordRoles.slice(0, 4).join(", ")}` : "Discord 역할: 매칭/동기화 후 확인 필요",
    member.activityEvidence?.length
      ? `커뮤니케이션 근거: Discord 메시지 ${member.activityEvidence.length}건을 운영진이 내부에서 검토 가능`
      : "커뮤니케이션 근거: 아직 메시지 단위 증거가 부족합니다.",
    member.discordActivitySummary ? `운영진 요약: ${compactText(member.discordActivitySummary, member.discordActivitySummary)}` : "운영진 요약: 활동 요약 생성 필요",
  ];

  const shareGuidance = [
    "개인 연락처와 내부 원문 로그는 제외하고, 후보자 동의 후 기업/기관에 전달하세요.",
    driveReport.needsReviewCount > 0
      ? `전달 전 확인 필요: Drive 매칭 ${driveReport.needsReviewCount}건은 본인 기여도/동명이인 여부를 확인하세요.`
      : "전달 전 확인 필요: 포트폴리오 링크와 프로젝트별 본인 기여도를 마지막으로 확인하세요.",
    "기업에는 직무 적합성, 검증된 프로젝트 근거, 협업/커뮤니티 신호 순서로 보여주는 것이 적합합니다.",
  ];

  return {
    headline,
    recommendedPosition,
    positioning: `${member.name}님은 ${member.workRegion || "희망 지역 미입력"} 기준 ${headline} 후보자로, 등록 프로필과 NERDY 커뮤니티/Drive 산출물 근거를 함께 검토할 수 있습니다.`,
    logistics,
    jobFitSignals,
    evidenceSummary,
    collaborationSignals,
    shareGuidance,
    publicLinks: uniqueLimited([member.portfolioUrl], 3),
  };
}
