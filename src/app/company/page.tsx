"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Eye,
  Filter,
  Gauge,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

interface CompanyTalentScoreItem {
  label: string;
  score: number;
  max: number;
  description: string;
}

interface CompanyTalentCard {
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

interface CompanyTalentDashboard {
  stats: {
    total: number;
    shareReady: number;
    averageScore: number;
    immediateAvailable: number;
    withProjectEvidence: number;
  };
  talents: CompanyTalentCard[];
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/company/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("기업용 비밀번호가 올바르지 않습니다.");
        return;
      }
      onAuth();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.28),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_28%),linear-gradient(135deg,#09090b,#18181b_45%,#052e2b)]" />
      <div className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur lg:grid-cols-[1.08fr_0.92fr]">
          <section className="p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" /> Partner View
            </div>
            <h1 className="mt-8 max-w-xl text-4xl font-black tracking-tight md:text-5xl">기업용 인재 대시보드</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300">
              이름·연락처·원문 로그는 숨기고, 직무 적합성·프로젝트 근거·커뮤니티 협업 신호만 정리한 익명 후보자 점수표를 제공합니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["개인정보", "비공개"],
                ["평가 기준", "100점"],
                ["용도", "Shortlist"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs text-zinc-400">{label}</p>
                  <p className="mt-1 text-lg font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 bg-white p-8 text-zinc-950 lg:border-l lg:border-t-0 md:p-10">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">
                <Lock className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-emerald-600">Ne(o)rdinary Hire</p>
              <h2 className="mt-2 text-2xl font-black">기업 전용 로그인</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">공유받은 기업용 비밀번호로만 접근할 수 있습니다.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="기업용 비밀번호"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-950/10"
                autoFocus
              />
              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
              <button disabled={!password || loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:opacity-40">
                {loading ? "확인 중..." : "대시보드 열기"}
                {!loading && <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function levelTheme(level: CompanyTalentCard["fitScore"]["level"]) {
  if (level === "우선 검토") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      rail: "from-emerald-400 via-teal-400 to-cyan-400",
      card: "border-emerald-200/80 shadow-emerald-950/5",
      dot: "bg-emerald-500",
    };
  }
  if (level === "검토 가능") {
    return {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      rail: "from-sky-400 via-blue-400 to-indigo-400",
      card: "border-sky-200/80 shadow-sky-950/5",
      dot: "bg-sky-500",
    };
  }
  return {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    rail: "from-amber-300 via-orange-300 to-rose-300",
    card: "border-amber-200/80 shadow-amber-950/5",
    dot: "bg-amber-500",
  };
}

function scorePercent(item: CompanyTalentScoreItem) {
  return Math.max(0, Math.min(100, Math.round((item.score / item.max) * 100)));
}

function StatCard({ label, value, helper, icon: Icon }: { label: string; value: number | string; helper: string; icon: typeof BriefcaseBusiness }) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-zinc-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-500 transition group-hover:bg-zinc-950 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-zinc-400">{helper}</p>
    </div>
  );
}

export default function CompanyPage() {
  const [authed, setAuthed] = useState(true);
  const [dashboard, setDashboard] = useState<CompanyTalentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", region: "", availability: "" });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filters.role) params.set("role", filters.role);
    if (filters.region) params.set("region", filters.region);
    if (filters.availability) params.set("availability", filters.availability);

    try {
      const res = await fetch(`/api/company/members?${params.toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        setDashboard(null);
        return;
      }
      if (!res.ok) throw new Error("기업용 인재 데이터를 불러오지 못했습니다.");
      setDashboard(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "기업용 인재 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (authed) fetchDashboard();
  }, [authed, fetchDashboard]);

  const talents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const items = dashboard?.talents || [];
    if (!keyword) return items;
    return items.filter((talent) =>
      [talent.anonymousLabel, talent.headline, talent.recommendedPosition, talent.positioning, ...talent.logistics]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [dashboard, search]);

  const topTalent = talents[0];
  const activeFilterCount = [filters.role, filters.region, filters.availability, search].filter(Boolean).length;

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-zinc-950">
      <header className="relative overflow-hidden bg-zinc-950 px-6 py-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.28),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_30%)]" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" /> 익명 공개 · 운영진 검증 자료 기반
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">기업용 인재 대시보드</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
                기업 담당자가 후보자를 빠르게 비교할 수 있도록 점수표, 프로젝트 근거, 커뮤니티 협업 신호를 한 화면에 정리했습니다. 개인 연락처와 내부 원문 로그는 공개하지 않습니다.
              </p>
            </div>
            <div className="grid min-w-[320px] grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="rounded-2xl bg-white p-4 text-zinc-950">
                <p className="text-xs font-semibold text-zinc-500">평균 점수</p>
                <p className="mt-2 text-3xl font-black">{dashboard?.stats.averageScore || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                <p className="text-xs font-semibold text-zinc-400">Shortlist</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{dashboard?.stats.shareReady || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-6">
        {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid gap-4 md:grid-cols-5">
          <StatCard label="익명 후보자" value={dashboard?.stats.total || 0} helper="기업 공개 전 개인정보 제거" icon={Users} />
          <StatCard label="우선 검토" value={dashboard?.stats.shareReady || 0} helper="70점 이상 shortlist 후보" icon={Trophy} />
          <StatCard label="평균 점수" value={dashboard?.stats.averageScore || 0} helper="현재 필터 기준 평균" icon={Gauge} />
          <StatCard label="즉시 가능" value={dashboard?.stats.immediateAvailable || 0} helper="가용 시기 즉시 입력 후보" icon={Sparkles} />
          <StatCard label="프로젝트 근거" value={dashboard?.stats.withProjectEvidence || 0} helper="Drive 산출물 연결 후보" icon={BriefcaseBusiness} />
        </section>

        {topTalent && !loading && (
          <section className="mt-5 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className={`rounded-3xl bg-gradient-to-br ${levelTheme(topTalent.fitScore.level).rail} p-5 text-white`}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">Recommended first look</p>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-white/80">{topTalent.anonymousLabel}</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">{topTalent.headline}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black">{topTalent.fitScore.total}</p>
                    <p className="text-xs font-bold text-white/70">점수표 / 100</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-black ${levelTheme(topTalent.fitScore.level).badge}`}>{topTalent.fitScore.level}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">추천 {topTalent.recommendedPosition}</span>
                  {topTalent.logistics.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">{item}</span>)}
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{topTalent.positioning}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {topTalent.fitScore.rationale.map((item) => (
                    <div key={item} className="rounded-2xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-600">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="sticky top-0 z-10 mt-5 rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-black text-zinc-900">
              <Filter className="h-4 w-4" /> 후보자 필터
              {activeFilterCount > 0 && <span className="rounded-full bg-zinc-950 px-2 py-0.5 text-[11px] text-white">{activeFilterCount}</span>}
            </div>
            <p className="text-xs text-zinc-400">검색 결과 {talents.length}명</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="역할, 기술, 지역 검색" className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-950/10" />
            </div>
            <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:ring-4 focus:ring-zinc-950/10">
              <option value="">전체 역할</option>
              {["PM", "기획자", "디자이너", "프론트엔드", "백엔드", "iOS", "Android", "풀스택", "개발자"].map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select value={filters.availability} onChange={(event) => setFilters({ ...filters, availability: event.target.value })} className="rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:ring-4 focus:ring-zinc-950/10">
              <option value="">전체 가용</option>
              {["즉시", "1개월 이내", "3개월 이내", "미정"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input value={filters.region} onChange={(event) => setFilters({ ...filters, region: event.target.value })} placeholder="지역" className="w-36 rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none focus:ring-4 focus:ring-zinc-950/10" />
          </div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          {loading ? (
            <div className="col-span-full rounded-[2rem] border border-zinc-200 bg-white p-14 text-center text-sm text-zinc-500 shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-950" />
              기업용 점수표를 불러오는 중...
            </div>
          ) : talents.length ? talents.map((talent, index) => {
            const theme = levelTheme(talent.fitScore.level);
            return (
              <article key={talent.id} className={`group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${theme.card}`}>
                <div className={`h-2 bg-gradient-to-r ${theme.rail}`} />
                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-white">#{String(index + 1).padStart(2, "0")} {talent.anonymousLabel}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${theme.badge}`}>{talent.fitScore.level}</span>
                      </div>
                      <h2 className="mt-4 text-2xl font-black tracking-tight text-zinc-950">{talent.headline}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">{talent.positioning}</p>
                    </div>
                    <div className="min-w-32 rounded-3xl bg-zinc-950 p-4 text-center text-white shadow-lg shadow-zinc-950/10">
                      <p className="text-xs font-semibold text-zinc-400">점수표</p>
                      <p className="mt-1 text-5xl font-black tracking-tight">{talent.fitScore.total}</p>
                      <p className="text-xs text-zinc-400">/ 100</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">추천 {talent.recommendedPosition}</span>
                    {talent.logistics.map((item) => <span key={item} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">{item}</span>)}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {talent.fitScore.breakdown.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                        <div className="flex items-end justify-between gap-2">
                          <p className="text-xs font-black text-zinc-600">{item.label}</p>
                          <p className="font-black text-zinc-950">{item.score}<span className="text-xs text-zinc-400">/{item.max}</span></p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                          <div className={`h-full rounded-full bg-gradient-to-r ${theme.rail}`} style={{ width: `${scorePercent(item)}%` }} />
                        </div>
                        <p className="mt-2 text-[11px] leading-4 text-zinc-400">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {[
                      { title: "직무 적합성", items: talent.jobFitSignals, icon: BriefcaseBusiness },
                      { title: "프로젝트 근거", items: talent.evidenceSummary, icon: Eye },
                      { title: "협업 신호", items: talent.collaborationSignals, icon: Users },
                    ].map(({ title, items, icon: Icon }) => (
                      <div key={title} className="rounded-2xl border border-zinc-100 p-4">
                        <h3 className="flex items-center gap-2 font-black text-zinc-900"><Icon className="h-4 w-4 text-zinc-400" /> {title}</h3>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
                          {items.slice(0, 3).map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-black text-zinc-900">기업 검토 포인트</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-500">면접 전 운영진 확인 권장</span>
                    </div>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-600 md:grid-cols-3">
                      {talent.fitScore.rationale.map((item) => <li key={item}>· {item}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-zinc-300 bg-white p-14 text-center text-sm text-zinc-500 shadow-sm">
              조건에 맞는 익명 후보자가 없습니다. 필터를 줄이거나 검색어를 다시 확인해주세요.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
