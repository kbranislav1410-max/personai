"use client";

import { useState } from "react";
import { Platform, PLATFORM_LABELS, GeneratedAds } from "@/types/job";

interface Props {
  ads: GeneratedAds;
  platforms: Platform[];
}

const PLATFORM_ICONS: Record<Platform, string> = {
  profesia: "🏢",
  kariera: "💼",
  linkedin: "🔗",
  social_media: "📱",
  career_page: "🌐",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  profesia: "border-orange-400",
  kariera: "border-purple-400",
  linkedin: "border-blue-600",
  social_media: "border-pink-400",
  career_page: "border-green-400",
};

const PLATFORM_BADGE: Record<Platform, string> = {
  profesia: "bg-orange-100 text-orange-700",
  kariera: "bg-purple-100 text-purple-700",
  linkedin: "bg-blue-100 text-blue-700",
  social_media: "bg-pink-100 text-pink-700",
  career_page: "bg-green-100 text-green-700",
};

function AdCard({
  platform,
  content,
}: {
  platform: Platform;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white rounded-xl border-l-4 shadow-sm ${PLATFORM_COLORS[platform]}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[platform]}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${PLATFORM_BADGE[platform]}`}
          >
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Skopírované!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Kopírovať
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}

export default function GeneratedAdViewer({ ads, platforms }: Props) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);

  const availablePlatforms = platforms.filter((p) => ads[p]);

  if (availablePlatforms.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Vygenerované inzeráty
      </h2>

      {availablePlatforms.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {availablePlatforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === platform
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{PLATFORM_ICONS[platform]}</span>
              {PLATFORM_LABELS[platform]}
            </button>
          ))}
        </div>
      )}

      {availablePlatforms.map((platform) => (
        <div
          key={platform}
          className={platform === activeTab ? "block" : "hidden"}
        >
          <AdCard platform={platform} content={ads[platform] ?? ""} />
        </div>
      ))}
    </div>
  );
}
