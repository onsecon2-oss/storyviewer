"use client";

import { useEffect, useState } from "react";

export default function AdOverlay({ onClose }: { onClose: () => void }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    // Load Kakao AdFit script
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.head.appendChild(script);

    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
        {/* Ad header */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--muted)" }}>광고</span>
          <button
            onClick={seconds === 0 ? onClose : undefined}
            className="text-sm font-semibold px-3 py-1 rounded-lg transition-all"
            style={{
              background: seconds === 0 ? "var(--accent)" : "var(--border)",
              color: seconds === 0 ? "#fff" : "var(--muted)",
              cursor: seconds === 0 ? "pointer" : "not-allowed",
            }}
          >
            {seconds > 0 ? `${seconds}초 후 닫기` : "닫기 ✕"}
          </button>
        </div>

        {/* Ad content */}
        <div className="flex items-center justify-center p-4" style={{ minHeight: "320px" }}>
          <ins
            className="kakao_ad_area"
            style={{ display: "block" }}
            data-ad-unit="DAN-FCj5aFQod8tkRLeJ"
            data-ad-width="320"
            data-ad-height="480"
          />
        </div>
      </div>
    </div>
  );
}
