import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "등록 완료 — Ne(o)rdinary Hire",
  description: "인재풀 등록이 완료되었습니다.",
};

interface QuickRegisterSuccessPageProps {
  searchParams: Promise<{ code?: string; profile?: string; discord?: string }>;
}

export default async function QuickRegisterSuccessPage({
  searchParams,
}: QuickRegisterSuccessPageProps) {
  const { code, profile, discord } = await searchParams;
  const hireLinkCode = typeof code === "string" ? code : "";
  const isFullProfile = profile === "full";
  const hasSubmittedDiscord = discord === "submitted";
  const discordInviteUrl =
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
    "https://discord.gg/neordinary";

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-zinc-900 rounded-lg px-3 py-1.5">
              <Image
                src="/logo.png"
                alt="Ne(o)rdinary Hire"
                width={100}
                height={24}
                className="h-4 w-auto"
              />
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 pt-14">
        <div className="max-w-sm w-full text-center py-16">
          {/* Icon */}
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            {isFullProfile ? "정식 프로필 등록 완료!" : "인재풀 등록 완료!"}
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            너디너리 인재풀에 등록되었습니다.
            <br />
            {hasSubmittedDiscord
              ? "Discord 정보까지 접수되었습니다. 운영팀/봇이 서버 멤버와 매칭을 시도하므로 지금 추가로 할 일은 없습니다."
              : "Discord 정보를 남기지 않았다면 나중에 직접 인증하거나 운영팀에 알려주면 됩니다."}
          </p>

          {hireLinkCode && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 text-left">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                {hasSubmittedDiscord
                  ? "접수 완료 · 커뮤니티 매칭 대기"
                  : "선택 사항 · 커뮤니티 매칭"}
              </p>
              {hasSubmittedDiscord ? (
                <>
                  <div className="rounded-xl bg-white/80 border border-indigo-100 px-4 py-3">
                    <p className="text-sm font-semibold text-zinc-900">
                      이제 사용자가 직접 할 일은 없습니다.
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                      운영팀/봇이 입력한 Discord 정보를 기준으로 서버 멤버를
                      확인합니다. 정확히 1명으로 확인되지 않을 때만 추가 확인을
                      요청할 수 있습니다.
                    </p>
                  </div>
                  <details className="group mt-3 rounded-xl bg-white/60 border border-indigo-100 px-4 py-3">
                    <summary className="cursor-pointer list-none text-xs font-semibold text-zinc-600 flex items-center justify-between gap-3">
                      매칭이 안 될 때만 직접 인증 방법 보기
                      <span className="text-zinc-400 group-open:rotate-180 transition-transform">
                        ⌄
                      </span>
                    </summary>
                    <div className="mt-4 space-y-3">
                      <p className="rounded-xl bg-white/70 border border-indigo-100 px-3 py-2 text-xs text-zinc-500 leading-relaxed">
                        직접 인증은 선택입니다. 정확히 본인 Discord 계정으로
                        바로 연결하고 싶거나 매칭이 안 될 때만 아래 연결 코드를
                        사용하세요.
                      </p>
                      <p className="text-xs text-zinc-400 mb-1">연동 코드</p>
                      <div className="rounded-xl bg-white border border-indigo-100 px-4 py-3 font-mono text-lg font-bold tracking-wider text-zinc-900">
                        {hireLinkCode}
                      </div>
                      <a
                        href={discordInviteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                      >
                        Discord 입장/직접 인증 열기
                      </a>
                      <div className="rounded-xl bg-white border border-indigo-100 p-4">
                        <p className="text-xs font-semibold text-zinc-700 mb-2">
                          선택 인증: NEORDINARY_ROLE_BOT에게 개인 연결 코드 전달
                        </p>
                        <div className="rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs text-white break-all">
                          /hire-link code:{hireLinkCode}
                        </div>
                        <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                          공개 채널에 코드를 올리지 마세요. NEORDINARY_ROLE_BOT
                          DM 또는 본인에게만 보이는 slash command 응답으로
                          연결하세요.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white border border-indigo-100 p-4">
                        <p className="text-xs font-semibold text-zinc-700 mb-2">
                          선택 인증: 역할·닉네임 최신 정보 동기화
                        </p>
                        <div className="rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs text-white">
                          /hire-sync-me
                        </div>
                      </div>
                    </div>
                  </details>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-700 mb-3">
                    Discord ID·사용자명·서버 닉네임을 입력하지 않았다면, 필요할
                    때 아래 코드로 직접 인증할 수 있습니다.
                  </p>
                  <p className="rounded-xl bg-white/70 border border-indigo-100 px-3 py-2 text-xs text-zinc-500 leading-relaxed mb-4">
                    직접 인증은 선택입니다. 정확히 본인 Discord 계정으로 바로
                    연결하고 싶거나 매칭이 안 될 때만 아래 연결 코드를
                    사용하세요.
                  </p>
                  <p className="text-xs text-zinc-400 mb-1">연동 코드</p>
                  <div className="rounded-xl bg-white border border-indigo-100 px-4 py-3 font-mono text-lg font-bold tracking-wider text-zinc-900">
                    {hireLinkCode}
                  </div>
                  <div className="mt-4 space-y-3">
                    <a
                      href={discordInviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                    >
                      Discord 입장/직접 인증 열기
                    </a>
                    <div className="rounded-xl bg-white border border-indigo-100 p-4">
                      <p className="text-xs font-semibold text-zinc-700 mb-2">
                        선택 인증: NEORDINARY_ROLE_BOT에게 개인 연결 코드 전달
                      </p>
                      <div className="rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs text-white break-all">
                        /hire-link code:{hireLinkCode}
                      </div>
                      <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                        공개 채널에 코드를 올리지 마세요. NEORDINARY_ROLE_BOT DM
                        또는 본인에게만 보이는 slash command 응답으로
                        연결하세요.
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-indigo-100 p-4">
                      <p className="text-xs font-semibold text-zinc-700 mb-2">
                        선택 인증: 역할·닉네임 최신 정보 동기화
                      </p>
                      <div className="rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs text-white">
                        /hire-sync-me
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!isFullProfile && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 mb-8 text-left">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                더 좋은 기회를 원한다면
              </p>
              <p className="text-sm text-zinc-700 font-medium mb-1">
                정식 프로필 작성 시 매칭 우선순위 상승
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                포트폴리오·자기소개·프로젝트 경력을 추가하면 기업 담당자 눈에
                먼저 띕니다.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                정식 프로필 작성하기 →
              </Link>
            </div>
          )}

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
