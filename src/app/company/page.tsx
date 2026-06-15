"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Gauge, Lock, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";

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
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-zinc-950 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-emerald-600">Ne(o)rdinary Hire</p>
            <h1 className="mt-2 text-2xl font-black">기업용 인재 대시보드</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">개인정보와 내부 로그를 제외한 익명 후보자 점수표를 확인합니다.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="기업용 비밀번호"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950"
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={!password || loading} className="w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:opacity-40">
              {loading ? "확인 중..." : "대시보드 열기"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function scoreTone(level: CompanyTalentCard["fitScore"]["level"]) {
  if (level === "우선 검토") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (level === "검토 가능") return "bg-sky-50 text-sky-700 border-sky-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
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
    if (!keyword) return dashboard?.talents || [];
    return (dashboard?.talents || []).filter((talent) =>
      [talent.anonymousLabel, talent.headline, talent.recommendedPosition, talent.positioning, ...talent.logistics]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [dashboard, search]);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Ne(o)rdinary Hire Partner View</p>
              <h1 className="mt-2 text-3xl font-black text-zinc-950">기업용 인재 대시보드</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                익명 후보자 기준으로 직무 적합성, 프로젝트 근거, 커뮤니티 협업 신호를 점수표와 함께 확인합니다. 개인 연락처와 내부 원문 로그는 공개하지 않습니다.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4" /> 개인정보 비공개 뷰</div>
              <p className="mt-1 text-xs">면접/소개 단계 전까지 이름·연락처·Discord ID는 운영진이 관리합니다.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-6">
        {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid gap-4 md:grid-cols-5">
          {[
            { label: "익명 후보자", value: dashboard?.stats.total || 0, icon: BriefcaseBusiness },
            { label: "우선 검토", value: dashboard?.stats.shareReady || 0, icon: CheckCircle2 },
            { label: "평균 점수", value: dashboard?.stats.averageScore || 0, icon: Gauge },
            { label: "즉시 가능", value: dashboard?.stats.immediateAvailable || 0, icon: Sparkles },
            { label: "프로젝트 근거", value: dashboard?.stats.withProjectEvidence || 0, icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <Icon className="mb-3 h-5 w-5 text-zinc-400" />
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="mt-1 text-3xl font-black text-zinc-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="역할, 기술, 지역 검색" className="w-full rounded-xl border border-zinc-200 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-950" />
            </div>
            <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
              <option value="">전체 역할</option>
              {['PM', '기획자', '디자이너', '프론트엔드', '백엔드', 'iOS', 'Android', '풀스택', '개발자'].map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select value={filters.availability} onChange={(event) => setFilters({ ...filters, availability: event.target.value })} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
              <option value="">전체 가용</option>
              {['즉시', '1개월 이내', '3개월 이내', '미정'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input value={filters.region} onChange={(event) => setFilters({ ...filters, region: event.target.value })} placeholder="지역" className="w-32 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-950" />
          </div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          {loading ? (
            <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">기업용 점수표를 불러오는 중...</div>
          ) : talents.length ? talents.map((talent) => (
            <article key={talent.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-bold text-white">{talent.anonymousLabel}</span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${scoreTone(talent.fitScore.level)}`}>{talent.fitScore.level}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-zinc-950">{talent.headline}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{talent.positioning}</p>
                </div>
                <div className="min-w-28 rounded-2xl bg-zinc-950 p-4 text-center text-white">
                  <p className="text-xs font-semibold text-zinc-400">점수표</p>
                  <p className="text-4xl font-black">{talent.fitScore.total}</p>
                  <p className="text-xs text-zinc-400">/ 100</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">추천 {talent.recommendedPosition}</span>
                {talent.logistics.map((item) => <span key={item} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">{item}</span>)}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {talent.fitScore.breakdown.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                    <div className="flex items-end justify-between gap-2">
                      <p className="text-xs font-bold text-zinc-500">{item.label}</p>
                      <p className="font-black text-zinc-950">{item.score}<span className="text-xs text-zinc-400">/{item.max}</span></p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                      <div className="h-full rounded-full bg-zinc-950" style={{ width: `${Math.round((item.score / item.max) * 100)}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-zinc-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-bold text-zinc-900">직무 적합성</h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-600">{talent.jobFitSignals.slice(0, 3).map((item) => <li key={item}>· {item}</li>)}</ul>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">프로젝트 근거</h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-600">{talent.evidenceSummary.slice(0, 3).map((item) => <li key={item}>· {item}</li>)}</ul>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">협업 신호</h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-600">{talent.collaborationSignals.slice(0, 3).map((item) => <li key={item}>· {item}</li>)}</ul>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                <h3 className="text-sm font-bold text-zinc-900">기업 검토 포인트</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-600">{talent.fitScore.rationale.map((item) => <li key={item}>· {item}</li>)}</ul>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">조건에 맞는 익명 후보자가 없습니다.</div>
          )}
        </section>
      </div>
    </main>
  );
}
