import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ne(o)rdinary Hire — 검증된 빌더 커뮤니티와 기회를 연결합니다",
  description:
    "너디너리 커뮤니티의 검증된 IT 인재 데이터를 채용·프로젝트·파트너 수요와 연결하는 공식 인재 DB 서비스.",
  openGraph: {
    title: "Ne(o)rdinary Hire",
    description:
      "검증된 빌더 커뮤니티를 채용·프로젝트 기회로 연결하는 Ne(o)rdinary 공식 인재 DB 서비스.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}