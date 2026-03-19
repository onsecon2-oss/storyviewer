import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://storyviewer-five.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "인스타 스토리 몰래보기 — 익명 인스타그램 뷰어",
    template: "%s | 인스타 익명 뷰어",
  },
  description: "인스타그램 스토리, 게시물, 하이라이트를 로그인 없이 익명으로 확인하세요. 상대방에게 열람 기록이 남지 않습니다.",
  keywords: [
    "인스타 스토리 몰래보기",
    "인스타그램 스토리 익명",
    "인스타 스토리 보기",
    "인스타 익명 뷰어",
    "인스타그램 몰래보기",
    "인스타 하이라이트 보기",
    "instagram story viewer",
    "인스타 게시물 익명",
    "스토리 확인 안걸림",
    "인스타 스토리 기록없이",
    "인스타그램 익명 열람",
    "인스타 스토리 안걸리게 보기",
    "인스타그램 하이라이트 익명",
    "인스타 계정 몰래보기",
    "로그인없이 인스타보기",
    "인스타 스토리 뷰어",
    "anonymous instagram viewer",
    "instagram story anonymous",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "인스타 스토리 몰래보기 — 익명 인스타그램 뷰어",
    description: "로그인 없이 인스타그램 스토리를 익명으로 확인하세요. 상대방에게 절대 기록이 남지 않습니다.",
    type: "website",
    url: BASE_URL,
    siteName: "인스타 익명 뷰어",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "인스타 스토리 몰래보기 — 익명 인스타그램 뷰어",
    description: "로그인 없이 인스타그램 스토리를 익명으로 확인하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "인스타 익명 뷰어",
    url: "https://storyviewer-frontend.vercel.app",
    description: "인스타그램 스토리, 게시물, 하이라이트를 로그인 없이 익명으로 확인하는 서비스",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "인스타 스토리를 몰래 볼 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, 가능합니다. 저희 서비스는 로그인 없이 공개 계정의 스토리를 익명으로 열람합니다. 상대방에게 어떠한 알림도 전송되지 않습니다.",
        },
      },
      {
        "@type": "Question",
        name: "상대방에게 내가 봤다는 알림이 가나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "절대 가지 않습니다. 본 서비스는 익명으로 동작하며, 열람 기록이 상대방 계정에 남지 않습니다.",
        },
      },
      {
        "@type": "Question",
        name: "비공개 계정도 볼 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "아니요, 비공개(잠금) 계정은 지원하지 않습니다. 공개로 설정된 계정만 열람 가능합니다.",
        },
      },
      {
        "@type": "Question",
        name: "로그인이 필요한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "필요하지 않습니다. 인스타그램 계정 없이도 바로 사용 가능합니다.",
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        {children}
      </body>
    </html>
  );
}
