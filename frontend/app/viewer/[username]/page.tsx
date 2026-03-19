"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdOverlay from "../../components/AdOverlay";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "stories" | "posts" | "highlights";

interface Profile {
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  is_private: boolean;
  is_verified: boolean;
  external_url: string | null;
}

interface Story {
  id: string;
  media_type: number;
  url: string;
  video_url: string | null;
  taken_at: string | null;
}

interface Post {
  id: string;
  media_type: number;
  thumbnail_url: string | null;
  video_url: string | null;
  caption: string | null;
  like_count: number;
  comment_count: number;
}

interface Highlight {
  id: string;
  media_type: number;
  url: string;
  video_url: string | null;
  taken_at: string | null;
}

function proxyUrl(url: string | null | undefined) {
  if (!url) return "";
  return `${API}/proxy?url=${encodeURIComponent(url)}`;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("stories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Story | Post | Highlight | null>(null);
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    fetch(`${API}/api/profile/${username}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "존재하지 않는 계정입니다" : "프로필을 불러올 수 없습니다");
        return r.json();
      })
      .then((data) => {
        setProfile(data);
        return Promise.all([
          fetch(`${API}/api/stories/${username}`).then((r) => r.json()).catch(() => ({ stories: [] })),
          fetch(`${API}/api/posts/${username}`).then((r) => r.json()).catch(() => ({ posts: [] })),
          fetch(`${API}/api/highlights/${username}`).then((r) => r.json()).catch(() => ({ highlights: [] })),
        ]);
      })
      .then(([s, p, h]) => {
        setStories(s.stories || []);
        setPosts(p.posts || []);
        setHighlights(h.highlights || h.stories || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (showAd) {
    return <AdOverlay onClose={() => setShowAd(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          <p style={{ color: "var(--muted)" }}>@{username} 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl">😕 {error}</p>
        <button onClick={() => router.push("/")} className="text-sm underline" style={{ color: "var(--muted)" }}>
          ← 다른 계정 검색
        </button>
      </div>
    );
  }

  if (!profile) return null;

  if (profile.is_private) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-semibold">비공개 계정입니다</h2>
        <p style={{ color: "var(--muted)" }}>@{username}은 공개 열람이 불가능합니다.</p>
        <button onClick={() => router.push("/")} className="text-sm underline" style={{ color: "var(--muted)" }}>
          ← 다른 계정 검색
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "stories", label: "스토리", count: stories.length },
    { id: "posts", label: "게시물", count: posts.length },
    { id: "highlights", label: "하이라이트", count: highlights.length },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <button onClick={() => router.push("/")} className="text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: "var(--muted)" }}>
        ← 다른 계정 검색
      </button>

      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid var(--border)" }}>
          {profile.profile_pic_url ? (
            <img src={proxyUrl(profile.profile_pic_url)} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: "var(--surface)" }}>
              👤
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            {profile.is_verified && <span title="인증됨" className="text-blue-400">✓</span>}
          </div>
          {profile.full_name && <p className="text-sm font-medium mb-1">{profile.full_name}</p>}
          {profile.biography && <p className="text-sm leading-snug" style={{ color: "var(--muted)" }}>{profile.biography}</p>}
          <div className="flex gap-4 mt-3 text-sm">
            <span><strong>{formatNum(profile.media_count)}</strong> <span style={{ color: "var(--muted)" }}>게시물</span></span>
            <span><strong>{formatNum(profile.follower_count)}</strong> <span style={{ color: "var(--muted)" }}>팔로워</span></span>
            <span><strong>{formatNum(profile.following_count)}</strong> <span style={{ color: "var(--muted)" }}>팔로잉</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-xl p-1" style={{ background: "var(--surface)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === t.id ? "var(--accent)" : "transparent",
              color: activeTab === t.id ? "#fff" : "var(--muted)",
            }}
          >
            {t.label} {t.count > 0 && <span className="opacity-70">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Stories Tab */}
      {activeTab === "stories" && (
        <div>
          {stories.length === 0 ? (
            <p className="text-center py-12" style={{ color: "var(--muted)" }}>현재 활성화된 스토리가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stories.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedMedia(s)}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group"
                  style={{ background: "var(--surface)" }}
                >
                  <img src={proxyUrl(s.url)} alt="스토리" className="w-full h-full object-cover" />
                  {s.media_type === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-3xl">▶</span>
                    </div>
                  )}
                  <a
                    href={s.video_url || s.url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg px-2 py-1 text-xs"
                  >
                    ↓
                  </a>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <p className="text-center py-12" style={{ color: "var(--muted)" }}>게시물이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedMedia(p)}
                  className="relative aspect-square overflow-hidden group"
                  style={{ background: "var(--surface)" }}
                >
                  {p.thumbnail_url && (
                    <img src={proxyUrl(p.thumbnail_url)} alt="게시물" className="w-full h-full object-cover" />
                  )}
                  {p.media_type === 2 && (
                    <div className="absolute top-2 right-2">
                      <span className="text-sm">▶</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-sm">
                    <span>❤️ {formatNum(p.like_count)}</span>
                    <span>💬 {formatNum(p.comment_count)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Highlights Tab */}
      {activeTab === "highlights" && (
        <div>
          {highlights.length === 0 ? (
            <p className="text-center py-12" style={{ color: "var(--muted)" }}>하이라이트가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {highlights.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedMedia(h)}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group"
                  style={{ background: "var(--surface)" }}
                >
                  <img src={proxyUrl(h.url)} alt="하이라이트" className="w-full h-full object-cover" />
                  {h.media_type === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-3xl">▶</span>
                    </div>
                  )}
                  <a
                    href={h.video_url || h.url}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg px-2 py-1 text-xs"
                  >
                    ↓
                  </a>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white text-2xl"
              onClick={() => setSelectedMedia(null)}
            >
              ✕
            </button>
            {"video_url" in selectedMedia && selectedMedia.video_url ? (
              <video src={selectedMedia.video_url} controls autoPlay className="w-full rounded-xl" />
            ) : (
              <img
                src={proxyUrl("url" in selectedMedia ? selectedMedia.url : selectedMedia.thumbnail_url)}
                alt="미디어"
                className="w-full rounded-xl"
              />
            )}
            <a
              href={"video_url" in selectedMedia && selectedMedia.video_url
                ? selectedMedia.video_url
                : ("url" in selectedMedia ? selectedMedia.url : selectedMedia.thumbnail_url) || ""}
              download
              className="mt-3 block w-full text-center py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              ↓ 다운로드
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
