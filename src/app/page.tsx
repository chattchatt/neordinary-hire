"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Users, Shield, RefreshCw, Building2, ChevronRight } from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SlideIn({ children, direction = "left", delay = 0 }: { children: React.ReactNode; direction?: "left" | "right"; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const x = direction === "left" ? -40 : 40;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={120} height={28} className="h-5 w-auto" />
            </div>
          </Link>
          <Link
            href="/register"
            className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95"
          >
            인재 등록
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]"
          >
            한 번 등록하면,
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]"
          >
            모든 파트너 기업이
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-400 leading-[1.1]"
          >
            당신을 찾습니다.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed"
          >
            너디너리 소속 IT 빌더로 등록하세요.
            <br className="hidden sm:block" />
            부산은행을 포함한 모든 파트너 기업의 채용 기회에 자동으로 노출됩니다.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="bg-zinc-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95 hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              지금 등록하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-sm text-zinc-400"
          >
            현재 등록된 빌더 <span className="font-semibold text-zinc-600">0</span>명 · 참여 기업{" "}
            <span className="font-semibold text-zinc-600">1</span>개
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-zinc-100 origin-left"
        />
      </div>

      {/* Value Props */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Users, title: "한 번의 등록, 무한한 기회", desc: "한 번 프로필을 등록하면 현재와 미래의 모든 파트너 기업에 자동으로 노출됩니다. 따로 지원할 필요가 없습니다." },
              { icon: Shield, title: "커뮤니티가 검증한 인재", desc: "UMC/CMC 활동 이력이 곧 신뢰입니다. 너디너리 소속이라는 것만으로 기업에게 차별화된 인재로 인식됩니다." },
              { icon: RefreshCw, title: "가용성 자동 관리", desc: "주기적으로 가용 상태를 갱신하여 항상 최신 정보를 유지합니다. 기업은 즉시 투입 가능한 인재를 바로 찾을 수 있습니다." },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                <div className="space-y-4 group">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 transition-colors duration-300"
                  >
                    <item.icon className="w-5 h-5 text-zinc-900 group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 px-6 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">함께하는 기업들</p>
          </FadeIn>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
            {["BNK부산은행", "자버", "AWS"].map((name, i) => (
              <FadeIn key={name} delay={0.1 + i * 0.15}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <Building2 className="w-6 h-6 text-zinc-300" />
                  <span className="text-xl font-bold text-zinc-300">{name}</span>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}>
            <p className="mt-8 text-sm text-zinc-400">더 많은 기업이 합류하고 있습니다</p>
          </FadeIn>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 text-center">어떻게 진행되나요?</h2>
          </FadeIn>
          <div className="mt-16 space-y-12">
            {[
              { step: "01", title: "프로필 등록", desc: "기본 정보와 기술 스택, 경력 사항을 입력하세요. 3분이면 충분합니다." },
              { step: "02", title: "커뮤니티 인증", desc: "UMC/CMC 활동 이력으로 신뢰도를 높이세요. 프로젝트 포트폴리오도 추가할 수 있습니다." },
              { step: "03", title: "기업 매칭", desc: "파트너 기업이 역할, 스킬, 지역별로 인재를 검색합니다. 별도 지원 없이 자동 노출됩니다." },
            ].map((item, i) => (
              <SlideIn key={item.step} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1}>
                <div className="flex gap-6 sm:gap-8 items-start group">
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    className="text-4xl sm:text-5xl font-bold text-zinc-200 shrink-0 group-hover:text-zinc-900 transition-colors duration-500"
                  >
                    {item.step}
                  </motion.span>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                    <p className="mt-2 text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-zinc-900 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 border border-zinc-800 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-60 h-60 border border-zinc-800 rounded-full"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              지금 바로 등록하고
              <br />
              채용 기회를 넓히세요
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-6 text-zinc-400 text-lg">
              너디너리 소속만으로 부산은행, 자버 등 파트너 기업에 자동 노출됩니다.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 hover:shadow-2xl"
            >
              지금 등록하기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
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