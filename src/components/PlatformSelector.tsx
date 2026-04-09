"use client";

import { Platform, PLATFORM_LABELS } from "@/types/job";

interface Props {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const ALL_PLATFORMS: Platform[] = [
  "profesia",
  "kariera",
  "linkedin",
  "social_media",
  "career_page",
];

const PLATFORM_ICONS: Record<Platform, string> = {
  profesia: "🏢",
  kariera: "💼",
  linkedin: "🔗",
  social_media: "📱",
  career_page: "🌐",
};

const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  profesia: "Formátovaný inzerát podľa štruktúry Profesia.sk",
  kariera: "Formátovaný inzerát podľa štruktúry Kariera.sk",
  linkedin: "Pútavý príspevok optimalizovaný pre LinkedIn s hashtagmi",
  social_media: "Krátky dynamický post pre Instagram a Facebook",
  career_page: "Detailný popis pre kariérnu stránku vašej firmy",
};

export default function PlatformSelector({ selected, onChange }: Props) {
  const toggle = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  const toggleAll = () => {
    if (selected.length === ALL_PLATFORMS.length) {
      onChange([]);
    } else {
      onChange([...ALL_PLATFORMS]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Vyberte platformy
        </h2>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {selected.length === ALL_PLATFORMS.length
            ? "Zrušiť všetky"
            : "Vybrať všetky"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform);
          return (
            <button
              key={platform}
              type="button"
              onClick={() => toggle(platform)}
              className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 text-blue-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              <span className="text-2xl mb-2">{PLATFORM_ICONS[platform]}</span>
              <span className="font-semibold text-gray-800 text-sm">
                {PLATFORM_LABELS[platform]}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {PLATFORM_DESCRIPTIONS[platform]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
