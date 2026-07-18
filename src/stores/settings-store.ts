import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";

interface SettingsState extends UserSettings {
  setRole: (role: UserSettings["role"]) => void;
  setLanguage: (language: string) => void;
  toggleAccessibility: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleNotifications: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

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
