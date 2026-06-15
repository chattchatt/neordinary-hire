"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = ["기본 정보", "소속 및 역할", "기술 및 경력", "커뮤니티 이력", "희망 조건", "추가 정보"];

const ROLES = ["PM", "PL", "기획자", "디자이너", "프론트엔드", "백엔드", "iOS", "Android", "풀스택", "데이터", "AI·ML", "DevOps", "기타"];
const EMPLOYMENT_TYPES = ["정규직", "인턴", "계약직", "프리랜서", "프로젝트"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", birthDate: "",
    affiliation: "", organization: "", roles: [] as string[],
    techStack: "", certifications: "", experience: "", projectExperience: "",
    communityType: "", generation: "", communityRole: "", track: "",
    discordHandle: "", activityConsent: false,
    availability: "", workType: "", workRegion: "", employmentTypes: [] as string[],
    portfolioUrl: "", bio: "", notes: "",
  });

  const updateField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleArrayField = (field: "roles" | "employmentTypes", value: string) => {
    setForm((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        const hireLinkCode =
          typeof data.hireLinkCode === "string"
            ? data.hireLinkCode
            : typeof data.member?.hireLinkCode === "string"
              ? data.member.hireLinkCode
              : "";
        const codeParam = hireLinkCode ? `?code=${encodeURIComponent(hireLinkCode)}&profile=full` : "?profile=full";
        window.location.href = `/register/quick/success${codeParam}`;
      } else {
        alert("등록 실패: " + (data.error || "다시 시도해주세요."));
      }
    } catch {
      alert("네트워크 오류. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.phone;
    if (step === 1) return form.affiliation && form.roles.length > 0;
    if (step === 2) return form.techStack;
    if (step === 4) return form.availability && form.workType && form.workRegion;
    return true;
  };

  const inputClass = "w-full border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-300";
  const selectClass = "w-full border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-white";
  const labelClass = "block text-sm font-medium text-zinc-700 mb-1.5";

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={120} height={28} className="h-5 w-auto" />
            </div>
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
            돌아가기
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">인재 등록</h1>
          <p className="mt-2 text-zinc-500">프로필을 등록하면 적합한 채용·프로젝트 기회 검토 대상에 포함됩니다.</p>
          <p className="mt-2 text-xs text-zinc-400">
            Discord 닉네임을 함께 남기면 직접 봇 명령어를 입력하지 않아도 운영팀/봇이 커뮤니티 활동 맥락 매칭을 시도합니다.
          </p>

          {/* Progress */}
          <div className="mt-8 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-zinc-900" : "bg-zinc-100"}`}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            {step + 1} / {STEPS.length} · {STEPS[step]}
          </p>

          {/* Form */}
          <div className="mt-10 space-y-6">
            {step === 0 && (
              <>
                <div>
                  <label className={labelClass}>성명 *</label>
                  <input type="text" className={inputClass} placeholder="홍길동" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>이메일 *</label>
                  <input type="email" className={inputClass} placeholder="hello@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>연락처 *</label>
                  <input type="tel" className={inputClass} placeholder="010-0000-0000" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>생년월일</label>
                  <input type="date" className={inputClass} value={form.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className={labelClass}>소속 구분 *</label>
                  <select className={selectClass} value={form.affiliation} onChange={(e) => updateField("affiliation", e.target.value)}>
                    <option value="">선택하세요</option>
                    <option value="대학생">대학생</option>
                    <option value="졸업생">졸업생</option>
                    <option value="프리랜서">프리랜서</option>
                    <option value="직장인">직장인</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>소속 (학교명 또는 회사명)</label>
                  <input type="text" className={inputClass} placeholder="부산대학교 / (주)데벨" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>주요 역할 * (복수 선택)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleArrayField("roles", role)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.roles.includes(role)
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className={labelClass}>기술 스택 *</label>
                  <input type="text" className={inputClass} placeholder="React, Spring Boot, Figma, Python 등" value={form.techStack} onChange={(e) => updateField("techStack", e.target.value)} />
                  <p className="mt-1 text-xs text-zinc-400">쉼표로 구분해서 입력해주세요</p>
                </div>
                <div>
                  <label className={labelClass}>보유 자격증</label>
                  <input type="text" className={inputClass} placeholder="정보처리기사, AWS SAA 등" value={form.certifications} onChange={(e) => updateField("certifications", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>총 경력</label>
                  <select className={selectClass} value={form.experience} onChange={(e) => updateField("experience", e.target.value)}>
                    <option value="">선택하세요</option>
                    <option value="없음">없음</option>
                    <option value="1년 미만">1년 미만</option>
                    <option value="1-3년">1-3년</option>
                    <option value="3-5년">3-5년</option>
                    <option value="5-10년">5-10년</option>
                    <option value="10년 이상">10년 이상</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>프로젝트 관련 경력</label>
                  <textarea className={inputClass + " min-h-[100px] resize-none"} placeholder="주요 프로젝트 경험을 서술해주세요&#10;예: 2024 OO 해커톤 백엔드 개발" value={form.projectExperience} onChange={(e) => updateField("projectExperience", e.target.value)} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className={labelClass}>UMC/CMC 참여 여부</label>
                  <select className={selectClass} value={form.communityType} onChange={(e) => updateField("communityType", e.target.value)}>
                    <option value="">선택하세요</option>
                    <option value="UMC">UMC</option>
                    <option value="CMC">CMC</option>
                    <option value="둘 다">둘 다</option>
                    <option value="없음">없음</option>
                  </select>
                </div>
                {form.communityType && form.communityType !== "없음" && (
                  <>
                    <div>
                      <label className={labelClass}>기수</label>
                      <input type="number" className={inputClass} placeholder="10" value={form.generation} onChange={(e) => updateField("generation", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>활동 역할</label>
                      <select className={selectClass} value={form.communityRole} onChange={(e) => updateField("communityRole", e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="챌린저">챌린저</option>
                        <option value="리드">리드</option>
                        <option value="파트장">파트장</option>
                        <option value="운영진">운영진</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>파트/트랙</label>
                      <select className={selectClass} value={form.track} onChange={(e) => updateField("track", e.target.value)}>
                        <option value="">선택하세요</option>
                        {["Plan", "Design", "Web", "Android", "iOS", "Spring Boot", "Node.js", "기타"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <label className={labelClass}>Discord 닉네임 또는 사용자명</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="예: codexlive 또는 코덱스라이브"
                    value={form.discordHandle}
                    onChange={(e) => updateField("discordHandle", e.target.value)}
                    maxLength={80}
                  />
                  <p className="mt-1 text-xs text-zinc-400">직접 Discord 명령어를 입력하지 않아도 운영팀/봇이 서버 멤버와 매칭을 시도합니다.</p>
                  <label className="mt-3 flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      checked={form.activityConsent}
                      onChange={(e) => updateField("activityConsent", e.target.checked)}
                    />
                    <span>Discord 서버 내 닉네임·역할·활동 맥락을 인재풀 매칭 검토에 활용하는 데 동의합니다.</span>
                  </label>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <label className={labelClass}>가용 시기 *</label>
                  <select className={selectClass} value={form.availability} onChange={(e) => updateField("availability", e.target.value)}>
                    <option value="">선택하세요</option>
                    <option value="즉시">즉시</option>
                    <option value="1개월 이내">1개월 이내</option>
                    <option value="3개월 이내">3개월 이내</option>
                    <option value="미정">미정</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>희망 근무 형태 *</label>
                  <select className={selectClass} value={form.workType} onChange={(e) => updateField("workType", e.target.value)}>
                    <option value="">선택하세요</option>
                    <option value="상근">상근</option>
                    <option value="원격">원격</option>
                    <option value="혼합">혼합</option>
                    <option value="협의 가능">협의 가능</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>근무 가능 지역 *</label>
                  <input type="text" className={inputClass} placeholder="부산, 서울, 재택 등" value={form.workRegion} onChange={(e) => updateField("workRegion", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>희망 고용 형태 (복수 선택)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayField("employmentTypes", type)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.employmentTypes.includes(type)
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div>
                  <label className={labelClass}>포트폴리오 / GitHub URL</label>
                  <input type="url" className={inputClass} placeholder="https://github.com/username" value={form.portfolioUrl} onChange={(e) => updateField("portfolioUrl", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>자기소개 (500자 이내)</label>
                  <textarea className={inputClass + " min-h-[120px] resize-none"} placeholder="간단한 자기소개를 작성해주세요" maxLength={500} value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />
                  <p className="mt-1 text-xs text-zinc-400 text-right">{form.bio.length}/500</p>
                </div>
                <div>
                  <label className={labelClass}>기타 사항</label>
                  <textarea className={inputClass + " min-h-[80px] resize-none"} placeholder="요청 조건, 특이사항 등" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" /> 이전
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                다음 <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                {submitting ? "등록 중..." : "등록하기"} <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
