// ============================================================================
// FIFA Nexus AI — Settings Store
// Zustand store with localStorage persistence for user preferences.
// Manages role selection, language, accessibility, and notification settings.
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";

/**
 * Extended settings state with mutation actions.
 * Persisted to `localStorage` under the key `"fifa-nexus-settings"`.
 */
interface SettingsState extends UserSettings {
  /** Update the user's active role (fan, manager, security, etc.). */
  setRole: (role: UserSettings["role"]) => void;
  /** Update the preferred language code (ISO 639-1). */
  setLanguage: (language: string) => void;
  /** Toggle screen reader optimizations and larger touch targets. */
  toggleAccessibility: () => void;
  /** Toggle high-contrast visual mode for visibility. */
  toggleHighContrast: () => void;
  /** Toggle reduced-motion mode for vestibular sensitivity. */
  toggleReducedMotion: () => void;
  /** Toggle real-time push notifications. */
  toggleNotifications: () => void;
  /** Apply a partial settings update. */
  updateSettings: (settings: Partial<UserSettings>) => void;
}

/**
 * Global settings store with localStorage persistence.
 *
 * @example
 * ```tsx
 * const { role, setRole } = useSettingsStore();
 * ```
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      role: "manager",
      language: "en",
      accessibilityMode: false,
      highContrast: false,
      reducedMotion: false,
      notifications: true,

      setRole: (role) => set({ role }),
      setLanguage: (language) => set({ language }),
      toggleAccessibility: () =>
        set((state) => ({ accessibilityMode: !state.accessibilityMode })),
      toggleHighContrast: () =>
        set((state) => ({ highContrast: !state.highContrast })),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
      updateSettings: (settings) => set(settings),
    }),
    {
      name: "fifa-nexus-settings",
    }
  )
);
