import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "등록 완료 — Ne(o)rdinary Hire",
  description: "인재풀 등록이 완료되었습니다.",
};

export default function QuickRegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={100} height={24} className="h-4 w-auto" />
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 pt-14">
        <div className="max-w-sm w-full text-center py-16">
          {/* Icon */}
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 mb-2">등록 완료!</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            너디너리 인재풀에 등록되었습니다.
            <br />
            파트너 기업 채용 시 자동으로 노출됩니다.
          </p>

          {/* Upsell */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">더 좋은 기회를 원한다면</p>
            <p className="text-sm text-zinc-700 font-medium mb-1">정식 프로필 작성 시 매칭 우선순위 상승</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              포트폴리오·자기소개·프로젝트 경력을 추가하면
              기업 담당자 눈에 먼저 띕니다.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              정식 프로필 작성하기 →
            </Link>
          </div>

          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
