"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.replace("@", "").trim();
    if (clean) router.push(`/viewer/${clean}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center mb-12 max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">인스타 스토리 뷰어</h1>
        </div>
        <p className="text-[var(--muted)] text-lg">
          인스타그램 스토리, 게시물, 하이라이트를 익명으로 확인하세요.
        </p>
      </div>

      {/* Privacy Banner */}
      <div
        className="w-full max-w-md mb-6 rounded-2xl px-5 py-3 text-sm text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
      >
        로그인 불필요 · 열람 기록 없음 · 상대방에게 절대 통보되지 않음
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span style={{ color: "var(--muted)" }} className="text-xl">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="인스타그램 아이디 입력"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "var(--foreground)" }}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: "var(--accent)" }}
          >
            보기
          </button>
        </div>
      </form>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full text-center">
        {[
          { icon: "📖", title: "스토리", desc: "상대방 모르게 스토리를 확인하세요" },
          { icon: "🖼️", title: "게시물", desc: "공개 계정의 피드를 자유롭게 둘러보세요" },
          { icon: "⭐", title: "하이라이트", desc: "저장된 하이라이트를 열람하세요" },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-semibold mb-1">{f.title}</div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-xs" style={{ color: "var(--muted)" }}>
        공개 계정만 지원 · 어떠한 데이터도 저장되지 않습니다
      </p>

      {/* FAQ */}
      <section className="mt-20 max-w-2xl w-full px-2">
        <h2 className="text-xl font-bold text-center mb-8">자주 묻는 질문</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "인스타 스토리를 몰래 볼 수 있나요?",
              a: "네, 가능합니다. 저희 서비스는 로그인 없이 공개 계정의 스토리를 익명으로 열람합니다. 상대방에게 어떠한 알림도 전송되지 않습니다.",
            },
            {
              q: "상대방에게 내가 봤다는 알림이 가나요?",
              a: "절대 가지 않습니다. 본 서비스는 익명으로 동작하며, 열람 기록이 상대방 계정에 남지 않습니다.",
            },
            {
              q: "비공개 계정도 볼 수 있나요?",
              a: "아니요, 비공개(잠금) 계정은 지원하지 않습니다. 공개로 설정된 계정만 열람 가능합니다.",
            },
            {
              q: "로그인이 필요한가요?",
              a: "필요하지 않습니다. 인스타그램 계정 없이도 바로 사용 가능합니다.",
            },
            {
              q: "하이라이트도 볼 수 있나요?",
              a: "네, 스토리뿐만 아니라 하이라이트와 게시물도 익명으로 열람할 수 있습니다.",
            },
            {
              q: "스토리를 다운로드할 수 있나요?",
              a: "네, 스토리 이미지 및 동영상을 다운로드할 수 있습니다.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="font-semibold mb-2">{item.q}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-12 mb-8 text-xs" style={{ color: "var(--muted)" }}>
        © 2025 인스타 익명 뷰어 · 공개 계정만 지원 · 어떠한 데이터도 저장되지 않습니다
      </p>
    </main>
  );
}
