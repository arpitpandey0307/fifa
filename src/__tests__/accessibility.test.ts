// ============================================================================
// FIFA Nexus AI — Accessibility Compliance Tests
// Validates WCAG 2.1 AA compliance patterns across the application.
// ============================================================================

import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES, NAV_ITEMS } from "@/lib/constants";
import { getRiskColor, getRiskBgColor, getSeverityIcon, sanitizeInput } from "@/lib/utils";

describe("Accessibility: Language Support", () => {
  it("supports at least 7 languages for international fans", () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(7);
  });

  it("includes all FIFA official languages", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en"); // English
    expect(codes).toContain("es"); // Spanish
    expect(codes).toContain("fr"); // French
    expect(codes).toContain("ar"); // Arabic
    expect(codes).toContain("de"); // German
  });

  it("includes host country languages", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en"); // USA
    expect(codes).toContain("es"); // Mexico
  });

  it("each language has a native name for display", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.nativeName).toBeTruthy();
      expect(lang.nativeName.length).toBeGreaterThan(0);
    }
  });

  it("Arabic is flagged as RTL", () => {
    const arabic = SUPPORTED_LANGUAGES.find((l) => l.code === "ar");
    expect(arabic).toBeDefined();
    expect((arabic as Record<string, unknown>).rtl).toBe(true);
  });
});

describe("Accessibility: Navigation Structure", () => {
  it("all nav items have descriptive labels", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.length).toBeGreaterThan(2);
      expect(item.description.length).toBeGreaterThan(5);
    }
  });

  it("all nav items have unique hrefs", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("all nav items have icon identifiers", () => {
    for (const item of NAV_ITEMS) {
      expect(item.icon).toBeTruthy();
    }
  });

  it("settings page is included for accessibility configuration", () => {
    const settings = NAV_ITEMS.find((item) => item.id === "settings");
    expect(settings).toBeDefined();
    expect(settings!.description).toContain("accessibility");
  });
});

describe("Accessibility: Risk Communication", () => {
  it("risk levels use distinct color classes for color-blind users", () => {
    const colors = ["low", "medium", "high", "critical"].map(getRiskColor);
    const uniqueColors = new Set(colors);

    // All 4 risk levels must map to different visual indicators
    expect(uniqueColors.size).toBe(4);
  });

  it("risk background classes include border for non-color indicators", () => {
    for (const level of ["low", "medium", "high", "critical"]) {
      const classes = getRiskBgColor(level);
      // Each risk level should have both bg and border classes
      expect(classes).toContain("bg-");
      expect(classes).toContain("border-");
    }
  });

  it("severity icons provide text-based alternatives", () => {
    // Each severity must return a non-empty string (emoji) that conveys meaning
    for (const severity of ["info", "warning", "critical", "emergency"]) {
      const icon = getSeverityIcon(severity);
      expect(icon.length).toBeGreaterThan(0);
    }
  });
});

describe("Accessibility: Input Sanitization (XSS Prevention)", () => {
  it("sanitizes script injection attempts", () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("</script>");
  });

  it("preserves legitimate Unicode input (multilingual support)", () => {
    // Hindi
    expect(sanitizeInput("मुझे खाना कहाँ मिलेगा?")).toBe("मुझे खाना कहाँ मिलेगा?");
    // Japanese
    expect(sanitizeInput("食べ物はどこですか？")).toBe("食べ物はどこですか？");
    // Arabic
    expect(sanitizeInput("أين يمكنني العثور على الطعام؟")).toBe("أين يمكنني العثور على الطعام؟");
  });

  it("handles empty input gracefully", () => {
    expect(sanitizeInput("")).toBe("");
    expect(sanitizeInput("   ")).toBe("");
  });
});
