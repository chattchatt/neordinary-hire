"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, Database, MessageCircle, Sparkles, UsersRound } from "lucide-react";

const DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "#community";
const KAKAO_CONTACT_URL = "http://pf.kakao.com/_xcwDJT";

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
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
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
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #18181B 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-zinc-200/50 to-transparent blur-3xl" />
    </div>
  );
}

function DiscordCta({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isConfigured = !DISCORD_INVITE_URL.startsWith("#");
  const baseClass =
    variant === "light"
      ? "bg-white text-zinc-900 hover:bg-zinc-100"
      : "bg-zinc-900 text-white hover:bg-zinc-700 hover:shadow-2xl";

  return (
    <a
      href={DISCORD_INVITE_URL}
      target={isConfigured ? "_blank" : undefined}
      rel={isConfigured ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all hover:scale-105 active:scale-95 ${baseClass}`}
    >
      너디너리 디스코드 입장
      <MessageCircle className="h-4 w-4" />
    </a>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function Home() {
  const serviceFunctions = [
    {
      icon: Database,
      title: "검증된 인재 DB",
      desc: "커뮤니티 활동, 기술 스택, 희망 기회, 포트폴리오를 한 번에 정리해 파트너 수요와 연결합니다.",
      tags: ["Profile", "Stack", "Portfolio"],
    },
    {
      icon: UsersRound,
      title: "커뮤니티 기반 신뢰",
      desc: "UMC·CMC·너디너리 활동 맥락을 바탕으로 단순 이력서 밖의 협업 가능성과 성장성을 봅니다.",
      tags: ["UMC", "CMC", "Ne(o)rdinary"],
    },
    {
      icon: Building2,
      title: "기업·프로젝트 매칭",
      desc: "채용, 외주, 사이드 프로젝트, PoC 등 파트너의 실제 수요에 맞춰 후보군을 큐레이션합니다.",
      tags: ["Recruiting", "Project", "PoC"],
    },
    {
      icon: Sparkles,
      title: "외부 유입형 서비스 페이지",
      desc: "방문자가 기능을 이해하고 디스코드 입장, 간편 등록, 파트너 문의까지 이어지도록 설계합니다.",
      tags: ["Website", "Discord", "CTA"],
    },
  ];

  const flows = [
    { num: "01", title: "서비스 기능 확인", desc: "외부 방문자가 Hire가 무엇을 연결하는지, 어떤 인재와 기회가 있는지 먼저 이해합니다." },
    { num: "02", title: "디스코드 커뮤니티 입장", desc: "너디너리의 활동, 공지, 프로젝트 기회가 모이는 커뮤니티로 진입합니다." },
    { num: "03", title: "1분 인재 등록", desc: "이름, 연락처, 스택, 희망 직무, 포트폴리오 등 핵심 정보를 빠르게 남깁니다." },
    { num: "04", title: "기회 큐레이션", desc: "파트너 기업·프로젝트 수요가 생기면 적합한 후보군을 선별해 연결합니다." },
  ];

  const audiences = [
    { title: "빌더", desc: "채용, 프로젝트, 성장 기회를 찾는 개발자·디자이너·PM", cta: "인재 등록", href: "/register/quick" },
    { title: "파트너", desc: "검증된 IT 인재와 빠르게 연결되고 싶은 기업·기관", cta: "파트너 문의", href: KAKAO_CONTACT_URL },
    { title: "커뮤니티", desc: "활동 이력과 신뢰가 다음 기회로 이어지는 너디너리 생태계", cta: "디스코드 입장", href: DISCORD_INVITE_URL },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-900">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-100 bg-white/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <div className="rounded-lg bg-zinc-900 px-3 py-1.5">
              <Image src="/logo.png" alt="Ne(o)rdinary Hire" width={120} height={28} className="h-5 w-auto" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={KAKAO_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 sm:inline-flex"
            >
              파트너 문의
            </a>
            <DiscordCta />
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative px-6 pb-28 pt-40 sm:pt-44">
        <DotGrid />
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-500 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-zinc-900" />
            Ne(o)rdinary 공식 인재 연결 서비스
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            검증된 빌더 커뮤니티를<br className="hidden sm:block" /> 실제 기회로 연결합니다.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-500 sm:text-xl"
          >
            Ne(o)rdinary Hire는 너디너리 커뮤니티의 활동 이력과 인재 데이터를 바탕으로
            채용·프로젝트·파트너 수요를 연결하는 공식 서비스입니다. 기능을 확인하고,
            디스코드에서 커뮤니티와 기회를 이어가세요.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <DiscordCta />
            <Link
              href="/register/quick"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:scale-105 hover:bg-zinc-50 active:scale-95"
            >
              1분 인재 등록
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          {!DISCORD_INVITE_URL.startsWith("#") ? null : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mt-4 text-xs text-zinc-400"
            >
              배포 전 NEXT_PUBLIC_DISCORD_INVITE_URL을 설정하면 디스코드 초대 링크로 바로 연결됩니다.
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── Proof ─── */}
      <section className="border-y border-zinc-100 px-6 py-18 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          {[
            { value: 6500, suffix: "+", label: "커뮤니티 빌더 규모" },
            { value: 463, suffix: "명", label: "첫 인재 데이터 활용 사례" },
            { value: 3, suffix: "개", label: "UMC·CMC·너디너리 기반 네트워크" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div>
                <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm tracking-wide text-zinc-400">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Functions ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">Service Functions</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">소개 페이지를 넘어, 서비스 기능을 보여줍니다.</h2>
              <p className="mt-5 text-zinc-500">
                외부 인원이 페이지에 들어왔을 때 “무엇을 제공하는지 → 왜 신뢰할 수 있는지 → 어디로 들어가야 하는지”가 즉시 보이도록 구성했습니다.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {serviceFunctions.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <TiltCard className="h-full">
                    <div className="group h-full rounded-3xl border border-zinc-200 bg-zinc-50 p-7 transition-all duration-300 hover:border-zinc-400 hover:bg-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 text-2xl font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-3 leading-7 text-zinc-500">{item.desc}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-zinc-100 group-hover:bg-zinc-50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Flow ─── */}
      <section id="community" className="bg-zinc-50/70 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">Visitor Flow</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">외부 방문자의 다음 행동이 명확해야 합니다.</h2>
            </div>
          </Reveal>
          <div className="relative">
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-zinc-200" />
            <div className="space-y-12">
              {flows.map((step, i) => (
                <Reveal key={step.num} delay={i * 0.1}>
                  <div className="flex items-start gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-xs font-bold text-zinc-400">
                      {step.num}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <p className="mt-1 leading-7 text-zinc-500">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Audiences ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-14 text-center text-sm uppercase tracking-[0.28em] text-zinc-400">For Whom</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {audiences.map((audience, i) => {
              const isExternal = audience.href.startsWith("http") || audience.href.startsWith("#");
              const Tag = isExternal ? "a" : Link;
              return (
                <Reveal key={audience.title} delay={i * 0.1}>
                  <TiltCard className="h-full">
                    <div className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 p-7 transition-all duration-300 hover:border-zinc-400 hover:shadow-sm">
                      <div>
                        <h3 className="text-2xl font-bold">{audience.title}</h3>
                        <p className="mt-3 leading-7 text-zinc-500">{audience.desc}</p>
                      </div>
                      <Tag
                        href={audience.href}
                        {...(audience.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-900"
                      >
                        {audience.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Tag>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Ecosystem ─── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-zinc-900 p-8 text-white sm:p-12">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Ecosystem Principle</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">활동이 이력이 되고, 이력이 기회가 됩니다.</h2>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              너디너리의 불변 원리는 IT 작업자들이 스스로 만든 활동과 신뢰가 다음 무대로 확장되게 만드는 것입니다.
              Hire는 그 원리를 채용·프로젝트 연결이라는 정식 서비스로 확장한 형태입니다.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { name: "Ne(o)rdinary", role: "IT 작업자 커뮤니티" },
              { name: "UMC", role: "대학생 빌더 네트워크" },
              { name: "CMC", role: "서비스 런칭 챌린지" },
            ].map((eco, i) => (
              <Reveal key={eco.name} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-xl font-bold">{eco.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{eco.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-zinc-900 px-6 py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-60 -top-60 h-[500px] w-[500px] rounded-full border border-zinc-800"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full border border-zinc-800"
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">이제 등록보다 먼저, 연결됩니다.</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-8 text-zinc-500">
              기능을 확인한 외부 방문자가 디스코드로 들어오고, 커뮤니티 안에서 등록·문의·기회 연결까지 이어지는 흐름으로 전환합니다.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <DiscordCta variant="light" />
              <Link
                href="/register/quick"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                인재 DB 등록
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-100 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="rounded-lg bg-zinc-900 px-2.5 py-1">
            <Image src="/logo.png" alt="Ne(o)rdinary" width={100} height={24} className="h-4 w-auto" />
          </div>
          <div className="flex items-center gap-5 text-sm text-zinc-400">
            <a href={DISCORD_INVITE_URL} className="transition-colors hover:text-zinc-900">Discord</a>
            <a href={KAKAO_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-900">문의</a>
            <Link href="/register/quick" className="transition-colors hover:text-zinc-900">등록</Link>
          </div>
          <p className="text-xs text-zinc-300">© 2026 Ne(o)rdinary Hire</p>
        </div>
      </footer>
    </main>
  );
}
