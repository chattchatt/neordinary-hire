import { buildCompanyProfilePreview } from "./company-profile-curation";
import { buildDriveEvidenceReport, type DriveEvidenceInput } from "./drive-evidence-insights";

export interface CompanyTalentMemberInput {
  id: string;
  name: string;
  email?: string;
  phone?: string;
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
  discordUserId?: string | null;
  discordUsername?: string | null;
  discordRoles: string[];
  discordActivitySummary: string | null;
  activityEvidence: Array<{ id: string }>;
  driveEvidence: DriveEvidenceInput[];
}

export interface CompanyTalentScoreItem {
  label: string;
  score: number;
  max: number;
  description: string;
}

export interface CompanyTalentCard {
  id: string;
  anonymousLabel: string;
  headline: string;
  recommendedPosition: string;
  positioning: string;
  logistics: string[];
  jobFitSignals: string[];
  evidenceSummary: string[];
  collaborationSignals: string[];
  publicLinks: string[];
  fitScore: {
    total: number;
    level: "우선 검토" | "검토 가능" | "근거 보강 필요";
    breakdown: CompanyTalentScoreItem[];
    rationale: string[];
  };
}

export interface CompanyTalentDashboard {
  stats: {
    total: number;
    shareReady: number;
    averageScore: number;
    immediateAvailable: number;
    withProjectEvidence: number;
  };
  talents: CompanyTalentCard[];
}

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(max, value));
}

function getRoleScore(member: CompanyTalentMemberInput): number {
  const hasRole = member.roles.length > 0 || Boolean(member.track || member.communityRole);
  const hasTech = member.techStack.trim().length > 0;
  const hasProjectText = Boolean(member.projectExperience?.trim());
  return clamp((hasRole ? 15 : 0) + (hasTech ? 15 : 0) + (hasProjectText ? 10 : 0), 40);
}

function getEvidenceScore(member: CompanyTalentMemberInput): number {
  const report = buildDriveEvidenceReport(member.driveEvidence || []);
  const projectScore = Math.min(report.projectCount, 3) * 6;
  const confidenceScore = Math.min(report.highConfidenceCount, 3) * 4;
  const penalty = Math.min(report.needsReviewCount, 2) * 3;
  return clamp(projectScore + confidenceScore - penalty, 25);
}

function getCommunityScore(member: CompanyTalentMemberInput): number {
  const roleScore = member.discordRoles.length ? 4 : 0;
  const messageScore = Math.min(member.activityEvidence.length, 10);
  const communityScore = member.communityType ? 4 : 0;
  const summaryScore = member.discordActivitySummary ? 2 : 0;
  return clamp(roleScore + messageScore + communityScore + summaryScore, 20);
}

function getAvailabilityScore(member: CompanyTalentMemberInput): number {
  const available = member.availability === "즉시" ? 7 : member.availability.includes("1개월") ? 5 : member.availability ? 3 : 0;
  const logistics = [member.workType, member.workRegion, member.employmentTypes.join("/")].filter((item) => item?.trim()).length;
  return clamp(available + logistics * 2, 15);
}

function getScoreLevel(total: number): CompanyTalentCard["fitScore"]["level"] {
  if (total >= 70) return "우선 검토";
  if (total >= 45) return "검토 가능";
  return "근거 보강 필요";
}

function buildRationale(member: CompanyTalentMemberInput): string[] {
  const report = buildDriveEvidenceReport(member.driveEvidence || []);
  const items = [
    report.projectCount > 0 ? `Drive 프로젝트 근거 ${report.projectCount}개로 직무 관련 산출물 확인 가능` : "Drive 프로젝트 근거 보강 필요",
    member.activityEvidence.length > 0 ? `Discord 커뮤니티 활동 증거 ${member.activityEvidence.length}건을 운영진이 검토 완료` : "Discord 메시지 단위 활동 근거 보강 필요",
    member.availability === "즉시" ? "즉시 투입 가능 후보" : `${member.availability || "가용 시기 미입력"} 기준으로 일정 확인 필요`,
  ];
  return items;
}

export function buildCompanyTalentCard(member: CompanyTalentMemberInput, index: number): CompanyTalentCard {
  const profile = buildCompanyProfilePreview({
    ...member,
    name: `후보자 ${String(index + 1).padStart(3, "0")}`,
  });

  const breakdown = [
    { label: "직무 적합성", score: getRoleScore(member), max: 40, description: "역할, 기술 스택, 프로젝트 서술 기반" },
    { label: "프로젝트 근거", score: getEvidenceScore(member), max: 25, description: "Google Drive 산출물, 프로젝트 수, 매칭 확신도 기반" },
    { label: "협업/커뮤니티", score: getCommunityScore(member), max: 20, description: "Discord 역할, 메시지 증거, 커뮤니티 이력 기반" },
    { label: "투입 조건", score: getAvailabilityScore(member), max: 15, description: "가용 시기, 근무 형태, 지역, 고용 형태 기반" },
  ];
  const total = breakdown.reduce((sum, item) => sum + item.score, 0);

  return {
    id: member.id,
    anonymousLabel: `후보자 ${String(index + 1).padStart(3, "0")}`,
    headline: profile.headline,
    recommendedPosition: profile.recommendedPosition,
    positioning: profile.positioning,
    logistics: profile.logistics,
    jobFitSignals: profile.jobFitSignals,
    evidenceSummary: profile.evidenceSummary,
    collaborationSignals: profile.collaborationSignals,
    publicLinks: profile.publicLinks,
    fitScore: {
      total,
      level: getScoreLevel(total),
      breakdown,
      rationale: buildRationale(member),
    },
  };
}

export function buildCompanyTalentDashboard(members: CompanyTalentMemberInput[]): CompanyTalentDashboard {
  const talents = members
    .map((member, index) => buildCompanyTalentCard(member, index))
    .sort((a, b) => b.fitScore.total - a.fitScore.total);

  const averageScore = talents.length
    ? Math.round(talents.reduce((sum, talent) => sum + talent.fitScore.total, 0) / talents.length)
    : 0;

  return {
    stats: {
      total: talents.length,
      shareReady: talents.filter((talent) => talent.fitScore.total >= 70).length,
      averageScore,
      immediateAvailable: members.filter((member) => member.availability === "즉시").length,
      withProjectEvidence: members.filter((member) => member.driveEvidence.length > 0).length,
    },
    talents,
  };
}
