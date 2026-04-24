"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

/* ── Utility: Fade on scroll ─────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Count-up number ─────────────────────────────────────────────── */
function CountUp({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Flip Words ──────────────────────────────────────────────────── */
function FlipWords({ words, interval = 2500 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className="inline-block relative h-[1.1em] overflow-hidden align-bottom">
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="absolute left-0"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: i === index ? 0 : -40, opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── 3D Tilt Card ────────────────────────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Dot Grid Background ─────────────────────────────────────────── */
function DotGrid() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #18181B 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-zinc-200/40 to-transparent rounded-full blur-3xl" />
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function Home() {
  const companies = ["네이버", "카카오", "쿠팡", "토스", "당근", "라인"];

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-hidden">
      {/* Nav */}
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
            등록하기
          </Link>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-44 pb-32 px-6">
        <DotGrid />
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            어디든.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-zinc-400 font-medium"
          >
            <FlipWords words={companies} interval={1800} />
            <span className="text-zinc-300 mx-2">·</span>
            <span className="text-zinc-300">못 가는 곳이 없습니다.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/register/quick"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95 hover:shadow-2xl"
            >
              1분 간편 등록
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 border border-zinc-300 px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-50 transition-all hover:scale-105 active:scale-95"
            >
              상세 프로필 등록
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20 px-6 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 6500, suffix: "+", label: "Verified Builders" },
            { value: 120, suffix: "+", label: "Top-tier Placements" },
            { value: 7, suffix: "일", label: "Avg. Matching Lead Time" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div>
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-zinc-400 tracking-wide">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Path Cards ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-sm text-zinc-400 tracking-widest uppercase text-center mb-16">Your Path</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "01", title: "GROWTH", sub: "폭발적 성장", tags: ["#EarlyStage", "#CoreMember", "#Equity"], desc: "J커브를 그리는 스타트업의 핵심 멤버로." },
              { num: "02", title: "WEALTH", sub: "최상위 보상", tags: ["#FinTech", "#TopComp", "#Stock"], desc: "개발자에게 최상위 연봉을 제공하는 금융권으로." },
              { num: "03", title: "STABILITY", sub: "검증된 무대", tags: ["#BigTech", "#Scale", "#System"], desc: "대규모 트래픽과 체계적 성장 프로그램의 빅테크로." },
              { num: "04", title: "GLOBAL", sub: "경계 없는 무대", tags: ["#Overseas", "#Relocation", "#GlobalHQ"], desc: "국내 실력을 글로벌 무대로 확장." },
            ].map((path, i) => (
              <Reveal key={path.title} delay={i * 0.1}>
                <TiltCard className="group cursor-default">
                  <div className="relative bg-zinc-50 rounded-2xl p-6 h-64 flex flex-col justify-between border border-zinc-100 hover:border-zinc-300 hover:bg-white transition-all duration-300 overflow-hidden">
                    <div>
                      <span className="text-xs text-zinc-300 font-mono">{path.num}</span>
                      <h3 className="text-lg font-bold mt-1 tracking-tight">{path.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{path.sub}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {path.tags.map((tag) => (
                        <span key={tag} className="text-xs text-zinc-400 bg-zinc-100 group-hover:bg-zinc-50 px-2 py-0.5 rounded-full transition-colors">{tag}</span>
                      ))}
                    </div>
                    {/* Hover reveal */}
                    <div className="absolute inset-0 bg-zinc-900 text-white p-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                      <p className="text-sm leading-relaxed">{path.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="py-24 px-6 bg-zinc-50/50">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-sm text-zinc-400 tracking-widest uppercase text-center mb-16">How it works</p>
          </Reveal>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-zinc-200" />
            <div className="space-y-12">
              {[
                { num: "01", title: "프로필 등록", desc: "3분. 스택, 커리어 방향, 커뮤니티 이력." },
                { num: "02", title: "전담 큐레이션", desc: "리크루팅 팀이 직접 검토. 레퍼런스 크로스 체크." },
                { num: "03", title: "맞춤형 매칭", desc: "당신이 선택한 Path에 맞춰 기업을 직접 연결." },
                { num: "04", title: "오퍼 & 합류", desc: "인터뷰 조율부터 처우 협상까지. 합류 후에도 네트워크." },
              ].map((step, i) => (
                <Reveal key={step.num} delay={i * 0.1}>
                  <div className="flex gap-6 items-start">
                    <div className="relative z-10 w-10 h-10 bg-white border-2 border-zinc-200 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 group-hover:border-zinc-900">
                      {step.num}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="text-base font-bold">{step.title}</h3>
                      <p className="text-sm text-zinc-400 mt-1">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ecosystem ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-sm text-zinc-400 tracking-widest uppercase text-center mb-16">Ecosystem</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Ne(o)rdinary", role: "IT 생태계 통합 플랫폼", tags: ["#NerdCon", "#ConnectDay", "#Festival"] },
              { name: "UMC", role: "University MakeUs Challenge", tags: ["#전국대학연합", "#스터디", "#해커톤"] },
              { name: "CMC", role: "Central MakeUs Challenge", tags: ["#MVP런칭", "#BM검증", "#수익형앱"] },
            ].map((eco, i) => (
              <Reveal key={eco.name} delay={i * 0.12}>
                <TiltCard>
                  <div className="border border-zinc-200 rounded-2xl p-6 hover:border-zinc-400 transition-all duration-300 h-48 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{eco.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{eco.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {eco.tags.map((tag) => (
                        <span key={tag} className="text-xs text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 bg-zinc-900 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -top-60 -right-60 w-[500px] h-[500px] border border-zinc-800 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] border border-zinc-800 rounded-full"
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">원한다면.</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-zinc-500 text-lg">당신의 니즈에 맞는 최고의 회사를 소개합니다.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register/quick"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95"
              >
                1분 간편 등록
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-transparent text-white border border-white/40 px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                상세 프로필 등록
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="bg-zinc-900 rounded-lg px-2.5 py-1">
            <Image src="/logo.png" alt="Ne(o)rdinary" width={100} height={24} className="h-4 w-auto" />
          </div>
          <a
            href="http://pf.kakao.com/_xcwDJT"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            문의
          </a>
          <p className="text-xs text-zinc-300">© 2026 Ne(o)rdinary</p>
        </div>
      </footer>
    </main>
  );
}
