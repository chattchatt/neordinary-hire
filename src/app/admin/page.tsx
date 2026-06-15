"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Upload, X, ChevronUp, ChevronDown, Lock } from "lucide-react";
import Image from "next/image";

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
  availability: string;
  workType: string;
  workRegion: string;
  notes: string | null;
  bio: string | null;
  portfolioUrl: string | null;
  createdAt: string;
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

type SortKey = "name" | "availability" | "workRegion" | "createdAt";

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onAuth();
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("네트워크 오류. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex bg-zinc-900 rounded-lg px-3 py-1.5 mb-4">
            <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={120} height={28} className="h-5 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Admin</h1>
          <p className="text-sm text-zinc-400 mt-1">관리자 비밀번호를 입력하세요</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-zinc-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-40"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(true);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, availableNow: 0, discordLinked: 0, discordActive: 0 });
  const [schemaStatus, setSchemaStatus] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", experience: "", availability: "", community: "", discordStatus: "" });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.role) params.set("role", filters.role);
    if (filters.experience) params.set("experience", filters.experience);
    if (filters.availability) params.set("availability", filters.availability);
    if (filters.community) params.set("community", filters.community);
    if (filters.discordStatus) params.set("discordStatus", filters.discordStatus);
    params.set("sortBy", sortKey);
    params.set("sortOrder", sortAsc ? "asc" : "desc");

    try {
      const res = await fetch(`/api/members?${params}`);
      if (res.status === 401) {
        setAuthed(false);
        setMembers([]);
        setLoadError("");
        return;
      }
      if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
      const data = await res.json();
      setMembers(data.members || []);
      setStats(data.stats || { total: 0, thisMonth: 0, availableNow: 0, discordLinked: 0, discordActive: 0 });
      setSchemaStatus(data.schemaStatus || null);
      setLoadError("");
    } catch (error) {
      console.error("Failed to fetch members");
      setLoadError(error instanceof Error ? error.message : "인재 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [authed, search, filters, sortKey, sortAsc]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.role) params.set("role", filters.role);
    if (filters.experience) params.set("experience", filters.experience);
    if (filters.availability) params.set("availability", filters.availability);
    if (filters.community) params.set("community", filters.community);
    if (filters.discordStatus) params.set("discordStatus", filters.discordStatus);
    window.open(`/api/members/export?${params}`, "_blank");
  };

  const resetFilters = () => { setFilters({ role: "", experience: "", availability: "", community: "", discordStatus: "" }); setSearch(""); };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  const selectClass = "border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900";
  const visibleDiscordLinked = members.filter((member) => member.discordUserId).length;
  const visibleDiscordSubmitted = members.filter((member) => !member.discordUserId && member.discordUsername).length;
  const visibleDiscordActive = members.filter((member) => member.lastDiscordActiveAt).length;

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Ne(o)rdinary Hire Admin</h1>
            <p className="text-sm text-zinc-400">인재 Pool 관리 대시보드</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 border border-zinc-200 bg-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-50 transition-colors">
              <Upload className="w-4 h-4" /> CSV 업로드
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
              <Download className="w-4 h-4" /> 엑셀 다운로드
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {schemaStatus === "discord_migration_required" && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Discord 연동 DB 마이그레이션이 아직 적용되지 않았습니다.</p>
            <p className="mt-1">
              기존 인재풀 조회는 계속 가능하지만, 연동 코드 생성·Discord 닉네임/활동 동기화는 DB 마이그레이션 적용 후 활성화됩니다.
            </p>
          </div>
        )}
        {loadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "등록 인재", value: stats.total, suffix: "명" },
            { label: "이번 달 신규", value: stats.thisMonth, suffix: "명" },
            { label: "즉시 가용", value: stats.availableNow, suffix: "명" },
            { label: "Discord 연결", value: stats.discordLinked, suffix: "명" },
            { label: "최근 활동 동기화", value: stats.discordActive, suffix: "명" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-400">{s.label}</p>
              <p className="text-3xl font-bold text-zinc-900 mt-1">{s.value}<span className="text-lg text-zinc-400 ml-1">{s.suffix}</span></p>
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-900">Discord 인증 정보 확인 위치</p>
              <p className="text-sm text-indigo-800/80">
                표의 Discord 컬럼에서 닉네임·연동 상태를 빠르게 보고, 행을 클릭하면 별도 상세 페이지에서 서버 역할·채널별 활동·날짜별 메시지 증거까지 깊게 확인합니다.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-white border border-indigo-100 rounded-full px-3 py-1">
              현재 목록 {visibleDiscordLinked}명 인증 · {visibleDiscordSubmitted}명 입력/자동 매칭 대기 · {visibleDiscordActive}명 최근 활동 있음
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="이름, 스킬, 학교, Discord 닉네임 검색..." className="w-full border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={selectClass} value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">전체 역할</option>
              {["PM", "PL", "기획자", "디자이너", "프론트엔드", "백엔드", "iOS", "Android", "풀스택"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className={selectClass} value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })}>
              <option value="">전체 경력</option>
              {["없음", "1년 미만", "1-3년", "3-5년", "5-10년"].map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <select className={selectClass} value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
              <option value="">전체 가용</option>
              {["즉시", "1개월 이내", "3개월 이내", "미정"].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select className={selectClass} value={filters.community} onChange={(e) => setFilters({ ...filters, community: e.target.value })}>
              <option value="">전체 커뮤니티</option>
              <option value="UMC">UMC</option>
              <option value="CMC">CMC</option>
            </select>
            <select className={selectClass} value={filters.discordStatus} onChange={(e) => setFilters({ ...filters, discordStatus: e.target.value })}>
              <option value="">Discord 전체</option>
              <option value="verified">인증 완료</option>
              <option value="pending">자동 매칭 대기</option>
              <option value="active">최근 활동 있음</option>
              <option value="unlinked">미연동</option>
            </select>
            <button onClick={resetFilters} className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">초기화</button>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            {loading ? "로딩 중..." : `${members.length}명의 인재 · Discord 인증 ${visibleDiscordLinked}명 · 입력/자동 매칭 대기 ${visibleDiscordSubmitted}명 · 최근 활동 ${visibleDiscordActive}명 · 행 클릭 시 별도 상세 페이지에서 활동 딥다이브 확인`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  {([
                    ["name", "성명"], ["role", "역할"], ["techStack", "기술 스택"], ["discord", "Discord"], ["experience", "경력"],
                    ["availability", "가용 시기"], ["workRegion", "지역"], ["createdAt", "등록일"]
                  ] as [SortKey | "role" | "techStack" | "discord" | "experience", string][]).map(([key, label]) => (
                    <th key={key} className="text-left px-4 py-3 font-medium text-zinc-500 cursor-pointer hover:text-zinc-900 select-none" onClick={() => (key === "name" || key === "availability" || key === "workRegion" || key === "createdAt") && handleSort(key as SortKey)}>
                      <span className="flex items-center gap-1">{label} {(key === "name" || key === "availability" || key === "workRegion" || key === "createdAt") && <SortIcon k={key as SortKey} />}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 && !loading ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400">등록된 인재가 없습니다. 멤버가 등록하면 여기에 표시됩니다.</td></tr>
                ) : members.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => router.push(`/admin/members/${d.id}`)} title="상세 페이지 열기">
                    <td className="px-4 py-3 font-medium text-zinc-900">{d.name}</td>
                    <td className="px-4 py-3"><span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md text-xs">{d.roles.join(", ")}</span></td>
                    <td className="px-4 py-3 text-zinc-600 max-w-[200px] truncate">{d.techStack}</td>
                    <td className="px-4 py-3 text-zinc-500 min-w-[180px]">
                      {d.discordUserId ? (
                        <div className="space-y-1">
                          <span className="inline-flex bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-medium">
                            인증 완료 · {d.discordNickname || d.discordDisplayName || d.discordUsername}
                          </span>
                          <p className="text-xs text-zinc-400">
                            {d.discordRoles?.length ? d.discordRoles.slice(0, 3).join(", ") : "역할 미동기화"}
                            {d.activityEvidence?.length ? ` · 메시지 증거 ${d.activityEvidence.length}건` : d.lastDiscordActiveAt ? " · 요약 동기화·원문 대기" : d.activities?.length ? ` · 활동 ${d.activities.length}건` : ""}
                          </p>
                        </div>
                      ) : d.discordUsername ? (
                        <div className="space-y-1">
                          <span className="inline-flex bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-medium">
                            입력됨 · {d.discordUsername}
                          </span>
                          <p className="text-xs text-zinc-400">봇 자동 매칭 대기</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-zinc-300">미입력</span>
                          {d.hireLinkCode && <p className="text-xs text-zinc-300">직접 인증은 선택 사항</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{d.experience || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs ${d.availability === "즉시" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}>{d.availability}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{d.workRegion}</td>
                    <td className="px-4 py-3 text-zinc-400">{new Date(d.createdAt).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowUpload(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-6 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900">CSV 업로드</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-zinc-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <label className="block border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center hover:border-zinc-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">CSV 파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-zinc-400 mt-1">UMC 챌린저 CSV 형식 지원</p>
              <input type="file" accept=".csv" className="hidden" onChange={(e) => { console.log("CSV:", e.target.files?.[0]); setShowUpload(false); alert("CSV 업로드 기능은 DB 연결 후 활성화됩니다."); }} />
            </label>
          </div>
        </div>
      )}
    </main>
  );
}
