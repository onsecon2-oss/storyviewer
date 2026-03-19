import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const BASE_URL = "https://storyviewer-frontend.vercel.app";

  return {
    title: `@${username} 스토리 익명 보기`,
    description: `@${username}의 인스타그램 스토리, 게시물, 하이라이트를 로그인 없이 익명으로 확인하세요. 상대방에게 기록이 남지 않습니다.`,
    alternates: {
      canonical: `${BASE_URL}/viewer/${username}`,
    },
    openGraph: {
      title: `@${username} 인스타 스토리 몰래보기`,
      description: `@${username}의 스토리와 하이라이트를 익명으로 열람하세요.`,
      url: `${BASE_URL}/viewer/${username}`,
    },
    robots: {
      index: false,
    },
  };
}

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
