"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, Upload, X, ChevronUp, ChevronDown, Bookmark, Lock, Activity } from "lucide-react";
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

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("ko-KR");
}

function splitDiscordActivitySummary(summary: string | null): { overview: string; depth: string; hasDepth: boolean } {
  if (!summary) return { overview: "—", depth: "", hasDepth: false };
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

function isDeepDiscordActivity(summary: string): boolean {
  return summary.includes("[활동 딥다이브]");
}

function groupDiscordEvidenceByDate(evidence: DiscordActivityEvidenceData[]) {
  return evidence.reduce<Record<string, DiscordActivityEvidenceData[]>>((groups, item) => {
    const date = new Date(item.occurredAt).toLocaleDateString("ko-KR");
    groups[date] = [...(groups[date] || []), item];
    return groups;
  }, {});
}

function formatMessageType(type: string): string {
  if (type === "reply") return "댓글/답글";
  if (type === "thread") return "스레드";
  return "글/메시지";
}

export default function AdminPage() {
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
  const [selected, setSelected] = useState<string | null>(null);
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
  const selectedData = members.find((d) => d.id === selected);
  const selectedDiscordActivity = splitDiscordActivitySummary(selectedData?.discordActivitySummary || null);
  const selectedDiscordEvidenceByDate = groupDiscordEvidenceByDate(selectedData?.activityEvidence || []);
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
                표의 Discord 컬럼에서 닉네임·연동 상태를 바로 보고, 행을 클릭하면 커뮤니티 신뢰 정보에서 서버 역할·활동 요약·최근 활동 로그까지 확인합니다.
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
            {loading ? "로딩 중..." : `${members.length}명의 인재 · Discord 인증 ${visibleDiscordLinked}명 · 입력/자동 매칭 대기 ${visibleDiscordSubmitted}명 · 최근 활동 ${visibleDiscordActive}명 · 행 클릭 시 상세 커뮤니티 신뢰 정보 확인`}
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
                  <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => setSelected(d.id)}>
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
                            {d.lastDiscordActiveAt ? " · 최근 활동 있음" : d.activities?.length ? ` · 활동 ${d.activities.length}건` : ""}
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

      {selectedData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">{selectedData.name}</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"><Bookmark className="w-4 h-4" /></button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {[
                { label: "소속 구분", value: selectedData.affiliation },
                { label: "소속", value: selectedData.organization },
                { label: "연락처", value: `${selectedData.phone} / ${selectedData.email}` },
                { label: "주요 역할", value: selectedData.roles.join(", ") },
                { label: "기술 스택", value: selectedData.techStack },
                { label: "보유 자격증", value: selectedData.certifications },
                { label: "총 경력", value: selectedData.experience },
                { label: "프로젝트 경력", value: selectedData.projectExperience },
                { label: "커뮤니티", value: selectedData.communityType ? `${selectedData.communityType} ${selectedData.generation || ""}기` : null },
                { label: "가용 시기", value: selectedData.availability },
                { label: "희망 근무 형태", value: selectedData.workType },
                { label: "근무 가능 지역", value: selectedData.workRegion },
                { label: "포트폴리오", value: selectedData.portfolioUrl },
                { label: "자기소개", value: selectedData.bio },
                { label: "기타", value: selectedData.notes },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-zinc-400 mb-1">{item.label}</p>
                  <p className="text-sm text-zinc-900">{item.value || "—"}</p>
                </div>
              ))}

              <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">커뮤니티 신뢰 정보</p>
                    <p className="text-sm text-zinc-600 mt-1">등록폼 입력값과 NERDY Discord 봇으로 자동 매칭된 닉네임·역할·활동 히스토리입니다.</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${selectedData.discordUserId ? "bg-indigo-600 text-white" : selectedData.discordUsername ? "bg-amber-100 text-amber-700" : "bg-white text-zinc-400"}`}>
                    {selectedData.discordUserId ? "인증 완료" : selectedData.discordUsername ? "입력됨/자동 매칭 대기" : "미입력"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-zinc-400">Discord 닉네임</p><p className="text-zinc-900">{selectedData.discordNickname || selectedData.discordUsername || "—"}</p></div>
                  <div><p className="text-xs text-zinc-400">표시명</p><p className="text-zinc-900">{selectedData.discordDisplayName || "—"}</p></div>
                  <div><p className="text-xs text-zinc-400">사용자명</p><p className="text-zinc-900">{selectedData.discordUsername || "—"}</p></div>
                  <div><p className="text-xs text-zinc-400">Discord ID</p><p className="text-zinc-900 break-all">{selectedData.discordUserId || (selectedData.discordUsername ? "매칭 전" : "—")}</p></div>
                  <div><p className="text-xs text-zinc-400">서버 합류</p><p className="text-zinc-900">{formatDate(selectedData.discordJoinedAt)}</p></div>
                  <div><p className="text-xs text-zinc-400">최근 동기화</p><p className="text-zinc-900">{formatDate(selectedData.lastDiscordActiveAt)}</p></div>
                  <div><p className="text-xs text-zinc-400">활동 활용 동의</p><p className="text-zinc-900">{formatDate(selectedData.activityConsentAt)}</p></div>
                </div>
                <div className="mt-4 rounded-xl border border-indigo-100 bg-white px-3 py-3">
                  <p className="text-xs font-semibold text-indigo-700 mb-2">커뮤니티 신뢰 신호</p>
                  <ul className="space-y-1 text-xs text-zinc-600">
                    <li>{selectedData.discordUserId ? "✓ Discord 계정 인증 완료" : "• Discord 계정 매칭 전"}</li>
                    <li>{selectedData.discordRoles?.length ? `✓ 서버 역할 ${selectedData.discordRoles.length}개 동기화` : "• 서버 역할 미동기화"}</li>
                    <li>{selectedData.discordJoinedAt ? `✓ 서버 합류일 확인: ${formatDate(selectedData.discordJoinedAt)}` : "• 서버 합류일 미확인"}</li>
                    <li>{selectedData.lastDiscordActiveAt ? `✓ 최근 활동 동기화: ${formatDate(selectedData.lastDiscordActiveAt)}` : "• 최근 활동 동기화 전"}</li>
                    <li>{selectedData.activityConsentAt ? "✓ 활동 활용 동의 확인" : "• 활동 활용 동의 미확인"}</li>
                  </ul>
                  <p className="mt-2 text-xs text-zinc-400">메시지 원문은 저장하지 않고 요약/메타데이터만 확인합니다.</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 mb-1">역할</p>
                  <p className="text-sm text-zinc-900">{selectedData.discordRoles?.length ? selectedData.discordRoles.join(", ") : "—"}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 mb-1">활동 요약</p>
                  <p className="text-sm text-zinc-900 whitespace-pre-wrap">{selectedDiscordActivity.overview}</p>
                </div>
                <details className="mt-4 rounded-xl border border-indigo-100 bg-white" open={selectedDiscordActivity.hasDepth}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-indigo-800">
                    <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> 활동 딥다이브</span>
                    <span className="text-xs font-normal text-zinc-400">{selectedDiscordActivity.hasDepth ? "채널별 활동 · 최근 활동 타임라인 · 수집 범위" : "아직 활동 상세 수집 전"}</span>
                  </summary>
                  <div className="border-t border-indigo-50 px-3 py-3 space-y-3">
                    {selectedDiscordActivity.hasDepth ? (
                      <>
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 mb-1">채널별 활동 · 최근 활동 타임라인 · 수집 범위</p>
                          <p className="text-sm text-zinc-800 whitespace-pre-wrap">{selectedDiscordActivity.depth}</p>
                        </div>
                        <div className="grid gap-2 rounded-lg bg-indigo-50/60 p-3 text-xs text-zinc-600">
                          <p className="font-semibold text-indigo-800">운영 판단 포인트</p>
                          <p>· 최근 활동 타임라인에서 실제 커뮤니티 참여의 최신성을 봅니다.</p>
                          <p>· 채널별 활동에서 관심사/기여 영역을 봅니다.</p>
                          <p>· 수집 범위에서 봇 권한 때문에 빠진 채널이 있는지 확인합니다.</p>
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                        <p className="font-semibold">아직 활동 상세 수집 전입니다.</p>
                        <p>이 사람은 Discord 계정 매칭만 완료된 상태입니다.</p>
                        <p>채널별 활동/최근 활동 타임라인은 아직 수집되지 않았습니다.</p>
                        <p>Discord에서 운영진이 <code className="rounded bg-white px-1 py-0.5 text-xs">/hire-sync-activity @사용자</code>를 실행하면 이 영역이 실제 활동 근거로 채워집니다.</p>
                      </div>
                    )}
                  </div>
                </details>
                <details className="mt-4 rounded-xl border border-zinc-200 bg-white" open={Boolean(selectedData.activityEvidence?.length)}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-zinc-900">
                    <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Discord 활동 기록 보러가기</span>
                    <span className="text-xs font-normal text-zinc-400">날짜별 활동 · 메시지 원문 발췌</span>
                  </summary>
                  <div className="border-t border-zinc-100 px-3 py-3 space-y-4">
                    {selectedData.activityEvidence?.length ? (
                      <>
                        <p className="text-xs text-zinc-500">봇이 접근 가능한 채널에서 수집한 최근 메시지 발췌입니다. 전체 원문이 아니라 운영 검토에 필요한 최대 1,200자 발췌만 저장합니다.</p>
                        {Object.entries(selectedDiscordEvidenceByDate).map(([date, items]) => (
                          <div key={date} className="space-y-2">
                            <p className="text-xs font-bold text-zinc-500">{date}</p>
                            {items.map((item) => (
                              <article key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                  <span>#{item.channelName}</span>
                                  <span>·</span>
                                  <span>{formatMessageType(item.messageType)}</span>
                                  <span>·</span>
                                  <span>{formatDate(item.occurredAt)}</span>
                                  {item.messageUrl ? <a className="ml-auto text-indigo-600 hover:underline" href={item.messageUrl} target="_blank" rel="noreferrer">Discord에서 열기</a> : null}
                                </div>
                                <p className="mt-2 text-xs font-semibold text-zinc-500">메시지 원문 발췌</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-900">{item.contentExcerpt}</p>
                              </article>
                            ))}
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">아직 메시지 단위 활동 기록이 없습니다. Discord에서 운영진이 <code className="rounded bg-white px-1 py-0.5 text-xs">/hire-sync-activity @사용자</code>를 실행하면 날짜별 활동과 메시지 원문 발췌가 채워집니다.</p>
                    )}
                  </div>
                </details>
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 mb-2">최근 활동 로그</p>
                  {selectedData.activities?.length ? (
                    <ul className="space-y-2">
                      {selectedData.activities.map((activity) => (
                        <li key={activity.id} className="rounded-lg bg-white border border-indigo-100 px-3 py-2">
                          <p className="text-xs text-zinc-400">{activity.source} · {formatActivityType(activity.type)} · {formatDate(activity.occurredAt)}</p>
                          <p className="text-xs font-semibold text-zinc-500 mt-1">{isDeepDiscordActivity(activity.summary) ? "활동 상세 근거" : "처리 내용"}</p>
                          <p className="text-sm text-zinc-800 mt-1 whitespace-pre-wrap">{activity.summary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-zinc-400">아직 동기화된 활동이 없습니다.</p>}
                </div>
              </section>

              <div>
                <p className="text-xs text-zinc-400 mb-1">메모</p>
                <textarea className="w-full border border-zinc-200 rounded-lg p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="내부 메모를 입력하세요..." />
              </div>
            </div>
          </div>
        </div>
      )}

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
