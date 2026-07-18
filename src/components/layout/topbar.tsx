"use client";

import { Bell, Globe, Radio } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useState } from "react";

export function Topbar() {
  const { language, setLanguage, role } = useSettingsStore();
  const [showLang, setShowLang] = useState(false);

  return (
    <header
      className="glass sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] px-6"
      role="banner"
    >
      {/* Left: Live indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
          <span className="live-dot" aria-hidden="true" />
          <span className="text-xs font-semibold text-emerald-400">LIVE</span>
        </div>
        <div className="hidden items-center gap-1.5 text-xs text-text-muted sm:flex">
          <Radio className="h-3 w-3" aria-hidden="true" />
          <span>Real-time data active</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
            aria-label="Select language"
            aria-expanded={showLang}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">
              {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || "English"}
            </span>
          </button>

          {showLang && (
            <div
              className="glass-panel absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-lg border border-white/[0.08] py-1 shadow-xl"
              role="listbox"
              aria-label="Language options"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLang(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-white/[0.06]"
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <span className="text-text-primary">{lang.name}</span>
                  <span className="text-text-muted">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Role Badge */}
        <div className="hidden items-center gap-2 rounded-lg bg-accent-blue/10 px-3 py-1.5 sm:flex">
          <div className="h-2 w-2 rounded-full bg-accent-blue" aria-hidden="true" />
          <span className="text-xs font-semibold capitalize text-accent-blue">
            {role}
          </span>
        </div>
      </div>
    </header>
  );
}
