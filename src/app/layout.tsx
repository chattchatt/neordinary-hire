import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ne(o)rdinary Hire — IT 빌더 인재 플랫폼",
  description:
    "한 번 등록하면, 너디너리의 모든 파트너 기업이 당신을 찾습니다. 부산/울산/경남 IT 인재 DB.",
  openGraph: {
    title: "Ne(o)rdinary Hire",
    description:
      "한 번 등록하면, 너디너리의 모든 파트너 기업이 당신을 찾습니다.",
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