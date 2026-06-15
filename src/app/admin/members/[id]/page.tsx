"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Code2,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

interface MemberActivityData {
  id: string;
  source: string;
  type: string;
  summary: string;
  occurredAt: string;
}

interface DiscordActivityEvidenceData {
  id: string;
  messageId: string;
  channelId: string;
  channelName: string;
  messageType: string;
  contentExcerpt: string;
  messageUrl: string | null;
  occurredAt: string;
}

interface MemberData {
  id: string;
  name: string;
  affiliation: string;
  organization: string | null;
  email: string;
  phone: string;
  roles: string[];
  techStack: string;
  certifications: string | null;
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
  notes: string | null;
  bio: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  updatedAt: string;
  hireLinkCode: string | null;
  discordUserId: string | null;
  discordUsername: string | null;
  discordDisplayName: string | null;
  discordNickname: string | null;
  discordRoles: string[];
  discordJoinedAt: string | null;
  lastDiscordActiveAt: string | null;
  discordActivitySummary: string | null;
  discordLinkedAt: string | null;
  activityConsentAt: string | null;
  activities: MemberActivityData[];
  activityEvidence: DiscordActivityEvidenceData[];
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("ko-KR");
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("ko-KR");
}

function splitDiscordActivitySummary(summary: string | null): { overview: string; depth: string; hasDepth: boolean } {
  if (!summary) return { overview: "아직 활동 요약이 없습니다.", depth: "", hasDepth: false };
  const marker = "[활동 딥다이브]";
  const markerIndex = summary.indexOf(marker);
  if (markerIndex === -1) return { overview: summary, depth: "", hasDepth: false };
  return {
    overview: summary.slice(0, markerIndex).trim() || "—",
    depth: summary.slice(markerIndex + marker.length).trim(),
    hasDepth: true,
  };
}

function formatActivityType(type: string): string {
  const labels: Record<string, string> = {
    "auto-link": "계정 자동 매칭",
    link: "직접 인증",
    sync: "프로필/활동 동기화",
  };
  return labels[type] || type;
}

function formatMessageType(type: string): string {
  if (type === "reply") return "댓글/답글";
  if (type === "thread") return "스레드";
  return "글/메시지";
}

function groupEvidenceByDate(evidence: DiscordActivityEvidenceData[]) {
  return evidence.reduce<Record<string, DiscordActivityEvidenceData[]>>((groups, item) => {
    const date = formatDate(item.occurredAt);
    groups[date] = [...(groups[date] || []), item];
    return groups;
  }, {});
}

function getChannelStats(evidence: DiscordActivityEvidenceData[]) {
  const stats = evidence.reduce<Record<string, { count: number; latest: string }>>((acc, item) => {
    const key = item.channelName || item.channelId || "unknown";
    const previous = acc[key];
    acc[key] = {
      count: (previous?.count || 0) + 1,
      latest: previous && new Date(previous.latest) > new Date(item.occurredAt) ? previous.latest : item.occurredAt,
    };
    return acc;
  }, {});

  return Object.entries(stats)
    .map(([channel, value]) => ({ channel, ...value }))
    .sort((a, b) => b.count - a.count || new Date(b.latest).getTime() - new Date(a.latest).getTime());
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
      <p className="font-semibold text-zinc-900">{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof UserRound }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid gap-1 border-b border-zinc-100 py-4 last:border-b-0 md:grid-cols-[180px_1fr] md:gap-6">
      <p className="text-sm font-medium text-zinc-400">{label}</p>
      <p className="whitespace-pre-wrap break-words text-sm text-zinc-900">{value || "—"}</p>
    </div>
  );
}

export default function AdminMemberDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const [error, setError] = useState("");

  const loadMember = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/members/${params.id}`, { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("상세 정보를 불러오지 못했습니다.");
      const data = await res.json();
      setMember(data.member);
    } catch (err) {
      setError(err instanceof Error ? err.message : "상세 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  const activitySummary = useMemo(() => splitDiscordActivitySummary(member?.discordActivitySummary || null), [member]);
  const evidenceByDate = useMemo(() => groupEvidenceByDate(member?.activityEvidence || []), [member]);
  const channelStats = useMemo(() => getChannelStats(member?.activityEvidence || []), [member]);

  if (!authed) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
          <h1 className="text-2xl font-bold text-zinc-900">관리자 로그인이 필요합니다</h1>
          <p className="mt-2 text-sm text-zinc-500">상세 페이지는 관리자 세션에서만 볼 수 있습니다.</p>
          <button onClick={() => router.push("/admin")} className="mt-6 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700">
            Admin 로그인으로 이동
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return <main className="min-h-screen bg-zinc-50 px-6 py-16 text-center text-sm text-zinc-500">상세 정보를 불러오는 중...</main>;
  }

  if (error || !member) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">상세 정보를 볼 수 없습니다</h1>
          <p className="mt-2 text-sm text-zinc-500">{error || "멤버를 찾을 수 없습니다."}</p>
          <button onClick={() => router.push("/admin")} className="mt-6 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
            대시보드로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  const discordStatus = member.discordUserId ? "인증 완료" : member.discordUsername ? "입력됨/자동 매칭 대기" : "미입력";
  const evidenceCount = member.activityEvidence?.length || 0;

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1480px] px-6 py-8">
        <button onClick={() => router.push("/admin")} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" /> 대시보드로 돌아가기
        </button>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">Talent Detail</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.discordUserId ? "bg-indigo-50 text-indigo-700" : member.discordUsername ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>
                  Discord {discordStatus}
                </span>
                {evidenceCount > 0 && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">메시지 증거 {evidenceCount}건</span>}
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950">{member.name}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                {member.bio || "등록폼 프로필과 NERDY Discord 봇이 수집한 커뮤니티 활동 근거를 한 화면에서 검토합니다."}
              </p>
            </div>
            <div className="grid min-w-[280px] gap-3 text-sm text-zinc-600">
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-zinc-900"><Mail className="h-4 w-4" /> {member.email}</a>
              <a href={`tel:${member.phone}`} className="flex items-center gap-2 hover:text-zinc-900"><Phone className="h-4 w-4" /> {member.phone}</a>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {member.workRegion}</span>
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> 등록 {formatDate(member.createdAt)}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <InfoCard icon={ShieldCheck} label="Discord 상태" value={discordStatus} />
          <InfoCard icon={MessageSquare} label="메시지 증거" value={`${evidenceCount}건`} />
          <InfoCard icon={Activity} label="처리 로그" value={`${member.activities?.length || 0}건`} />
          <InfoCard icon={Briefcase} label="가용 시기" value={member.availability || "—"} />
          <InfoCard icon={Code2} label="역할" value={member.roles?.join(", ") || "—"} />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">정식 프로필</h2>
              <div className="mt-4">
                <DetailRow label="소속 구분" value={member.affiliation} />
                <DetailRow label="소속/조직" value={member.organization} />
                <DetailRow label="주요 역할" value={member.roles?.join(", ")} />
                <DetailRow label="기술 스택" value={member.techStack} />
                <DetailRow label="보유 자격증" value={member.certifications} />
                <DetailRow label="총 경력" value={member.experience} />
                <DetailRow label="프로젝트 경력" value={member.projectExperience} />
                <DetailRow label="커뮤니티" value={member.communityType ? `${member.communityType} ${member.generation || ""}기 ${member.communityRole || ""}`.trim() : null} />
                <DetailRow label="트랙" value={member.track} />
                <DetailRow label="희망 근무 형태" value={member.workType} />
                <DetailRow label="희망 고용 형태" value={member.employmentTypes?.join(", ")} />
                <DetailRow label="포트폴리오" value={member.portfolioUrl} />
                <DetailRow label="기타/운영 메모" value={member.notes} />
              </div>
              {member.portfolioUrl && (
                <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700">
                  포트폴리오 열기 <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-zinc-900">Discord 신뢰 정보</h2>
                <CheckCircle2 className={`h-5 w-5 ${member.discordUserId ? "text-indigo-600" : "text-zinc-300"}`} />
              </div>
              <div className="mt-4">
                <DetailRow label="닉네임" value={member.discordNickname || member.discordUsername} />
                <DetailRow label="표시명" value={member.discordDisplayName} />
                <DetailRow label="사용자명" value={member.discordUsername} />
                <DetailRow label="Discord ID" value={member.discordUserId || (member.discordUsername ? "매칭 전" : null)} />
                <DetailRow label="서버 합류" value={formatDateTime(member.discordJoinedAt)} />
                <DetailRow label="최근 동기화/활동" value={formatDateTime(member.lastDiscordActiveAt)} />
                <DetailRow label="활동 활용 동의" value={formatDateTime(member.activityConsentAt)} />
                <DetailRow label="서버 역할" value={member.discordRoles?.join(", ")} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Discord 활동 딥다이브</h2>
                  <p className="mt-1 text-sm text-zinc-500">채널별 활동, 날짜별 타임라인, 메시지 원문 발췌를 상세 페이지에서 검토합니다.</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">수집 범위: 봇 접근 가능 채널</span>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">활동 요약</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{activitySummary.overview}</p>
                {activitySummary.hasDepth && (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs font-semibold text-zinc-400">요약 딥다이브</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{activitySummary.depth}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 p-5">
                  <h3 className="font-bold text-zinc-900">채널별 활동</h3>
                  {channelStats.length ? (
                    <div className="mt-4 space-y-3">
                      {channelStats.map((channel) => (
                        <div key={channel.channel} className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 px-4 py-3">
                          <div>
                            <p className="font-medium text-zinc-900">#{channel.channel}</p>
                            <p className="text-xs text-zinc-400">최근 {formatDateTime(channel.latest)}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-700">{channel.count}건</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-zinc-500">아직 채널별 메시지 증거가 없습니다.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <h3 className="font-bold text-zinc-900">운영 판단 포인트</h3>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                    <li>· 최근 활동 타임라인으로 커뮤니티 참여의 최신성을 봅니다.</li>
                    <li>· 채널별 분포로 관심사/기여 영역을 봅니다.</li>
                    <li>· 메시지 원문 발췌로 말투, 문제의식, 협업 태도를 봅니다.</li>
                    <li>· 수집 범위는 봇이 접근 가능한 채널과 백필 실행 범위에 한정됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">날짜별 활동 타임라인</h2>
              <p className="mt-1 text-sm text-zinc-500">Discord에서 어떤 날짜에 어떤 글/답글을 남겼는지 메시지 단위로 확인합니다.</p>
              {evidenceCount ? (
                <div className="mt-6 space-y-6">
                  {Object.entries(evidenceByDate).map(([date, items]) => (
                    <div key={date} className="border-l-2 border-zinc-200 pl-5">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="font-bold text-zinc-900">{date}</h3>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">{items.length}건</span>
                      </div>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <article key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                              <span className="font-semibold text-zinc-800">#{item.channelName || item.channelId}</span>
                              <span>{formatMessageType(item.messageType)}</span>
                              <span>{formatDateTime(item.occurredAt)}</span>
                              {item.messageUrl && (
                                <a href={item.messageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                                  원문 열기 <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-900">{item.contentExcerpt}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    title="아직 메시지 단위 활동 기록이 없습니다"
                    description="이 사용자가 봇 접근 가능 채널에 새 글을 쓰거나 백필 동기화가 실행되면 날짜별 활동과 원문 발췌가 여기에 쌓입니다."
                  />
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">동기화/처리 로그</h2>
              {member.activities?.length ? (
                <div className="mt-4 space-y-3">
                  {member.activities.map((activity) => (
                    <div key={activity.id} className="rounded-2xl border border-zinc-200 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span>{activity.source}</span>
                        <span>·</span>
                        <span>{formatActivityType(activity.type)}</span>
                        <span>·</span>
                        <span>{formatDateTime(activity.occurredAt)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-zinc-800">{activity.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">아직 처리 로그가 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
