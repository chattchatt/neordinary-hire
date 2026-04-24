"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ROLES = ["PM", "기획", "디자이너", "프론트엔드", "백엔드", "풀스택", "앱(iOS/Android)", "DevOps", "기타"];
const AVAILABILITY_OPTIONS = ["즉시", "1개월 내", "3개월 내", "미정"];
const EMPLOYMENT_TYPES = ["정규직", "프리랜서", "부업", "단발 프로젝트"];

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(phone);
}

export default function QuickRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roles: [] as string[],
    techStack: "",
    availability: "",
    employmentTypes: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setError("");
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
    setFieldErrors((prev) => ({ ...prev, roles: "" }));
    setError("");
  };

  const toggleEmploymentType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }));
    setFieldErrors((prev) => ({ ...prev, employmentTypes: "" }));
    setError("");
  };

  const isFormComplete =
    form.name.trim() !== "" &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone) &&
    form.roles.length > 0 &&
    form.techStack.trim() !== "" &&
    form.availability !== "" &&
    form.employmentTypes.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || submitting) return;

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/members/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError("already_exists");
        return;
      }
      if (!res.ok) {
        setError(data.error || "등록에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      router.push("/register/quick/success");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-300";
  const inputErrorClass =
    "w-full border border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all placeholder:text-zinc-300";
  const labelClass = "block text-sm font-semibold text-zinc-800 mb-1";
  const hintClass = "text-xs text-zinc-400 mt-1";

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={100} height={24} className="h-4 w-auto" />
            </div>
          </Link>
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
            홈으로
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              1~2분이면 완료
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
              너디너리 인재풀 등록
            </h1>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              부울경 UMC/CMC OB 전용 간이 등록폼입니다.
              <br />
              7가지 항목만 입력하면 파트너 기업에 자동 노출됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* 1. 성명 */}
            <div>
              <label className={labelClass}>
                성명 <span className="text-zinc-400 font-normal text-xs ml-1">필수</span>
              </label>
              <input
                type="text"
                className={fieldErrors.name ? inputErrorClass : inputClass}
                placeholder="홍길동"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                autoComplete="name"
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* 2. 이메일 */}
            <div>
              <label className={labelClass}>
                이메일 <span className="text-zinc-400 font-normal text-xs ml-1">식별자·필수</span>
              </label>
              <input
                type="email"
                className={fieldErrors.email ? inputErrorClass : inputClass}
                placeholder="hello@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                autoComplete="email"
              />
              <p className={hintClass}>기업 매칭 결과 안내에 사용됩니다</p>
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* 3. 전화번호 */}
            <div>
              <label className={labelClass}>
                전화번호 <span className="text-zinc-400 font-normal text-xs ml-1">필수</span>
              </label>
              <input
                type="tel"
                className={fieldErrors.phone ? inputErrorClass : inputClass}
                placeholder="010-1234-5678"
                value={form.phone}
                onChange={(e) => updateField("phone", formatPhone(e.target.value))}
                autoComplete="tel"
                maxLength={13}
              />
              <p className={hintClass}>매칭 시 즉시 연락을 위해 필수입니다</p>
              {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
            </div>

            {/* 4. 주요 역할 */}
            <div>
              <label className={labelClass}>
                주요 역할 <span className="text-zinc-400 font-normal text-xs ml-1">중복 선택 가능</span>
              </label>
              <p className={hintClass + " mb-2"}>본인과 가장 가까운 역할을 모두 선택하세요</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all ${
                      form.roles.includes(role)
                        ? "bg-zinc-900 text-white border-zinc-900 font-medium"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {fieldErrors.roles && <p className="text-xs text-red-500 mt-2">{fieldErrors.roles}</p>}
            </div>

            {/* 5. 기술 스택 */}
            <div>
              <label className={labelClass}>
                기술 스택 <span className="text-zinc-400 font-normal text-xs ml-1">필수</span>
              </label>
              <input
                type="text"
                className={fieldErrors.techStack ? inputErrorClass : inputClass}
                placeholder="예: React, Node.js, Figma"
                value={form.techStack}
                onChange={(e) => updateField("techStack", e.target.value)}
              />
              <p className={hintClass}>쉼표로 구분해서 자유롭게 입력하세요</p>
              {fieldErrors.techStack && <p className="text-xs text-red-500 mt-1">{fieldErrors.techStack}</p>}
            </div>

            {/* 6. 가용 시기 */}
            <div>
              <label className={labelClass}>
                가용 시기 <span className="text-zinc-400 font-normal text-xs ml-1">필수</span>
              </label>
              <p className={hintClass + " mb-2"}>프로젝트·채용 합류 가능한 시점</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField("availability", opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      form.availability === opt
                        ? "bg-zinc-900 text-white border-zinc-900 font-medium"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. 희망 근무형태 */}
            <div>
              <label className={labelClass}>
                희망 근무형태 <span className="text-zinc-400 font-normal text-xs ml-1">중복 선택 가능</span>
              </label>
              <p className={hintClass + " mb-2"}>해당하는 것을 모두 선택하세요</p>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleEmploymentType(type)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all ${
                      form.employmentTypes.includes(type)
                        ? "bg-zinc-900 text-white border-zinc-900 font-medium"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {fieldErrors.employmentTypes && (
                <p className="text-xs text-red-500 mt-2">{fieldErrors.employmentTypes}</p>
              )}
            </div>

            {/* Error messages */}
            {error === "already_exists" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">이미 등록되어 있어요.</p>
                <p className="text-amber-700 mb-3">해당 이메일로 이미 인재풀에 등록되셨습니다.</p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-zinc-900 font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  정식 프로필 채우러 가기 →
                </Link>
              </div>
            )}
            {error && error !== "already_exists" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormComplete || submitting}
                className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all ${
                  isFormComplete && !submitting
                    ? "bg-zinc-900 text-white hover:bg-zinc-700 shadow-lg shadow-zinc-900/20 scale-100 active:scale-[0.98]"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    등록 중...
                  </span>
                ) : isFormComplete ? (
                  "인재풀 등록하기 →"
                ) : (
                  "7가지 항목을 모두 입력해주세요"
                )}
              </button>
              <p className="text-center text-xs text-zinc-400 mt-3">
                정식 프로필(포트폴리오·자기소개 포함)은{" "}
                <Link href="/register" className="underline underline-offset-2 hover:text-zinc-700 transition-colors">
                  여기서
                </Link>{" "}
                작성할 수 있습니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
