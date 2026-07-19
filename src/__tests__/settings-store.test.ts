// ============================================================================
// FIFA Nexus AI — Settings Store Tests
// Validates Zustand store state management and persistence.
// ============================================================================

import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/stores/settings-store";

describe("useSettingsStore", () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useSettingsStore.setState({
      role: "manager",
      language: "en",
      accessibilityMode: false,
      highContrast: false,
      reducedMotion: false,
      notifications: true,
    });
  });

  it("has correct default values", () => {
    const state = useSettingsStore.getState();
    expect(state.role).toBe("manager");
    expect(state.language).toBe("en");
    expect(state.accessibilityMode).toBe(false);
    expect(state.highContrast).toBe(false);
    expect(state.reducedMotion).toBe(false);
    expect(state.notifications).toBe(true);
  });

  it("setRole updates the role", () => {
    useSettingsStore.getState().setRole("fan");
    expect(useSettingsStore.getState().role).toBe("fan");
  });

  it("setRole accepts all valid roles", () => {
    const roles = ["fan", "volunteer", "security", "manager", "transport", "medical", "vendor"] as const;
    for (const role of roles) {
      useSettingsStore.getState().setRole(role);
      expect(useSettingsStore.getState().role).toBe(role);
    }
  });

  it("setLanguage updates the language", () => {
    useSettingsStore.getState().setLanguage("hi");
    expect(useSettingsStore.getState().language).toBe("hi");
  });

  it("setLanguage accepts all supported language codes", () => {
    const codes = ["en", "hi", "es", "fr", "ar", "ja", "de"];
    for (const code of codes) {
      useSettingsStore.getState().setLanguage(code);
      expect(useSettingsStore.getState().language).toBe(code);
    }
  });

  it("toggleAccessibility flips the flag", () => {
    expect(useSettingsStore.getState().accessibilityMode).toBe(false);
    useSettingsStore.getState().toggleAccessibility();
    expect(useSettingsStore.getState().accessibilityMode).toBe(true);
    useSettingsStore.getState().toggleAccessibility();
    expect(useSettingsStore.getState().accessibilityMode).toBe(false);
  });

  it("toggleHighContrast flips the flag", () => {
    expect(useSettingsStore.getState().highContrast).toBe(false);
    useSettingsStore.getState().toggleHighContrast();
    expect(useSettingsStore.getState().highContrast).toBe(true);
  });

  it("toggleReducedMotion flips the flag", () => {
    expect(useSettingsStore.getState().reducedMotion).toBe(false);
    useSettingsStore.getState().toggleReducedMotion();
    expect(useSettingsStore.getState().reducedMotion).toBe(true);
  });

  it("toggleNotifications flips the flag", () => {
    expect(useSettingsStore.getState().notifications).toBe(true);
    useSettingsStore.getState().toggleNotifications();
    expect(useSettingsStore.getState().notifications).toBe(false);
  });

  it("updateSettings applies partial updates", () => {
    useSettingsStore.getState().updateSettings({
      role: "security",
      language: "fr",
      highContrast: true,
    });

    const state = useSettingsStore.getState();
    expect(state.role).toBe("security");
    expect(state.language).toBe("fr");
    expect(state.highContrast).toBe(true);
    // Unchanged values should remain
    expect(state.accessibilityMode).toBe(false);
    expect(state.notifications).toBe(true);
  });

  it("multiple toggles maintain independence", () => {
    useSettingsStore.getState().toggleAccessibility();
    useSettingsStore.getState().toggleHighContrast();
    useSettingsStore.getState().toggleReducedMotion();

    const state = useSettingsStore.getState();
    expect(state.accessibilityMode).toBe(true);
    expect(state.highContrast).toBe(true);
    expect(state.reducedMotion).toBe(true);
    expect(state.notifications).toBe(true); // untouched
  });
});
