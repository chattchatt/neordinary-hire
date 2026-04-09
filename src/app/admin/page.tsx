"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Download, Upload, X, ChevronUp, ChevronDown, Bookmark, Lock } from "lucide-react";
import Image from "next/image";

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
  const [authed, setAuthed] = useState(false);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, availableNow: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", experience: "", availability: "", community: "" });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // 쿠키로 이미 인증됐는지 확인
  useEffect(() => {
    if (document.cookie.includes("admin_token=")) {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.role) params.set("role", filters.role);
    if (filters.experience) params.set("experience", filters.experience);
    if (filters.availability) params.set("availability", filters.availability);
    if (filters.community) params.set("community", filters.community);
    params.set("sortBy", sortKey);
    params.set("sortOrder", sortAsc ? "asc" : "desc");

    try {
      const res = await fetch(`/api/members?${params}`);
      const data = await res.json();
      setMembers(data.members || []);
      setStats(data.stats || { total: 0, thisMonth: 0, availableNow: 0 });
    } catch {
      console.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, [search, filters, sortKey, sortAsc]);

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
    window.open(`/api/members/export?${params}`, "_blank");
  };

  const resetFilters = () => { setFilters({ role: "", experience: "", availability: "", community: "" }); setSearch(""); };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  const selectClass = "border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900";
  const selectedData = members.find((d) => d.id === selected);

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
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
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "등록 인재", value: stats.total, suffix: "명" },
            { label: "이번 달 신규", value: stats.thisMonth, suffix: "명" },
            { label: "즉시 가용", value: stats.availableNow, suffix: "명" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-400">{s.label}</p>
              <p className="text-3xl font-bold text-zinc-900 mt-1">{s.value}<span className="text-lg text-zinc-400 ml-1">{s.suffix}</span></p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="이름, 스킬, 학교 등 검색..." className="w-full border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <button onClick={resetFilters} className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">초기화</button>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            {loading ? "로딩 중..." : `${members.length}명의 인재`}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  {([
                    ["name", "성명"], ["role", "역할"], ["techStack", "기술 스택"], ["experience", "경력"],
                    ["availability", "가용 시기"], ["workRegion", "지역"], ["createdAt", "등록일"]
                  ] as [SortKey | "role" | "techStack" | "experience", string][]).map(([key, label]) => (
                    <th key={key} className="text-left px-4 py-3 font-medium text-zinc-500 cursor-pointer hover:text-zinc-900 select-none" onClick={() => (key === "name" || key === "availability" || key === "workRegion" || key === "createdAt") && handleSort(key as SortKey)}>
                      <span className="flex items-center gap-1">{label} {(key === "name" || key === "availability" || key === "workRegion" || key === "createdAt") && <SortIcon k={key as SortKey} />}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 && !loading ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400">등록된 인재가 없습니다. 멤버가 등록하면 여기에 표시됩니다.</td></tr>
                ) : members.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors" onClick={() => setSelected(d.id)}>
                    <td className="px-4 py-3 font-medium text-zinc-900">{d.name}</td>
                    <td className="px-4 py-3"><span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md text-xs">{d.roles.join(", ")}</span></td>
                    <td className="px-4 py-3 text-zinc-600 max-w-[200px] truncate">{d.techStack}</td>
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

      {/* Detail Panel */}
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
              <div>
                <p className="text-xs text-zinc-400 mb-1">메모</p>
                <textarea className="w-full border border-zinc-200 rounded-lg p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="내부 메모를 입력하세요..." />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
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