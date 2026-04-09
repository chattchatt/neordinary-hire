import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Shield, RefreshCw, Building2, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={120} height={28} className="h-5 w-auto" />
            </div>
          </Link>
          <Link
            href="/register"
            className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            인재 등록
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
            한 번 등록하면,
            <br />
            모든 파트너 기업이
            <br />
            <span className="text-zinc-400">당신을 찾습니다.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            너디너리 소속 IT 빌더로 등록하세요.
            <br className="hidden sm:block" />
            부산은행을 포함한 모든 파트너 기업의 채용 기회에 자동으로 노출됩니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-zinc-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              지금 등록하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-400">
            현재 등록된 빌더 <span className="font-semibold text-zinc-600">0</span>명 · 참여 기업{" "}
            <span className="font-semibold text-zinc-600">1</span>개
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-zinc-100" />
      </div>

      {/* Value Props */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">한 번의 등록, 무한한 기회</h3>
              <p className="text-zinc-500 leading-relaxed">
                한 번 프로필을 등록하면 현재와 미래의 모든 파트너 기업에 자동으로 노출됩니다. 따로 지원할 필요가 없습니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">커뮤니티가 검증한 인재</h3>
              <p className="text-zinc-500 leading-relaxed">
                UMC/CMC 활동 이력이 곧 신뢰입니다. 너디너리 소속이라는 것만으로 기업에게 차별화된 인재로 인식됩니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">가용성 자동 관리</h3>
              <p className="text-zinc-500 leading-relaxed">
                주기적으로 가용 상태를 갱신하여 항상 최신 정보를 유지합니다. 기업은 즉시 투입 가능한 인재를 바로 찾을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 px-6 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">함께하는 기업들</p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
            {["BNK부산은행", "자버", "AWS"].map((name) => (
              <div key={name} className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-zinc-300" />
                <span className="text-xl font-bold text-zinc-300">{name}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-400">더 많은 기업이 합류하고 있습니다</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 text-center">어떻게 진행되나요?</h2>
          <div className="mt-16 space-y-12">
            {[
              { step: "01", title: "프로필 등록", desc: "기본 정보와 기술 스택, 경력 사항을 입력하세요. 3분이면 충분합니다." },
              { step: "02", title: "커뮤니티 인증", desc: "UMC/CMC 활동 이력으로 신뢰도를 높이세요. 프로젝트 포트폴리오도 추가할 수 있습니다." },
              { step: "03", title: "기업 매칭", desc: "파트너 기업이 역할, 스킬, 지역별로 인재를 검색합니다. 별도 지원 없이 자동 노출됩니다." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 sm:gap-8 items-start">
                <span className="text-4xl sm:text-5xl font-bold text-zinc-200 shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            지금 바로 등록하고
            <br />
            채용 기회를 넓히세요
          </h2>
          <p className="mt-6 text-zinc-400 text-lg">
            너디너리 소속만으로 부산은행, 자버 등 파트너 기업에 자동 노출됩니다.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-100 transition-colors"
          >
            지금 등록하기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-2.5 py-1">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={100} height={24} className="h-4 w-auto" />
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a
              href="http://pf.kakao.com/_xcwDJT"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-colors"
            >
              추가 문의 (카카오톡)
            </a>
          </div>
          <p className="text-xs text-zinc-300">© 2026 Ne(o)rdinary. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
