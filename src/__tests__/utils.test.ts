// ============================================================================
// FIFA Nexus AI — Utility Function Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  cn,
  formatNumber,
  formatPercent,
  formatTime,
  formatRelativeTime,
  getRiskColor,
  getRiskBgColor,
  getSeverityIcon,
  generateId,
  clamp,
  lerp,
  sanitizeInput,
} from "@/lib/utils";

describe("cn (class name merger)", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves Tailwind conflicts", () => {
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toBe("base visible");
  });
});

describe("formatNumber", () => {
  it("formats integers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(78542)).toBe("78,542");
  });

  it("formats with decimal places", () => {
    expect(formatNumber(1234.5678, 2)).toBe("1,234.57");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  it("formats percentage with one decimal", () => {
    expect(formatPercent(78.5)).toBe("78.5%");
  });

  it("shows positive sign when requested", () => {
    expect(formatPercent(5.2, true)).toBe("+5.2%");
  });

  it("does not show sign for negative values", () => {
    expect(formatPercent(-3.1)).toBe("-3.1%");
  });
});

describe("getRiskColor", () => {
  it("returns correct color for each risk level", () => {
    expect(getRiskColor("low")).toBe("text-emerald-400");
    expect(getRiskColor("medium")).toBe("text-amber-400");
    expect(getRiskColor("high")).toBe("text-orange-400");
    expect(getRiskColor("critical")).toBe("text-red-400");
  });

  it("returns fallback for unknown levels", () => {
    expect(getRiskColor("unknown")).toBe("text-slate-400");
  });
});

describe("getRiskBgColor", () => {
  it("returns correct bg classes for each risk level", () => {
    expect(getRiskBgColor("low")).toContain("bg-emerald");
    expect(getRiskBgColor("critical")).toContain("bg-red");
  });
});

describe("getSeverityIcon", () => {
  it("returns correct emoji for each severity", () => {
    expect(getSeverityIcon("info")).toBe("ℹ️");
    expect(getSeverityIcon("warning")).toBe("⚠️");
    expect(getSeverityIcon("critical")).toBe("🔴");
    expect(getSeverityIcon("emergency")).toBe("🚨");
  });

  it("returns default icon for unknown severity", () => {
    expect(getSeverityIcon("other")).toBe("📋");
  });
});

describe("generateId", () => {
  it("returns a non-empty string", () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("clamp", () => {
  it("clamps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles edge cases", () => {
    expect(clamp(0, 0, 0)).toBe(0);
    expect(clamp(100, 100, 100)).toBe(100);
  });
});

describe("lerp", () => {
  it("interpolates correctly", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("clamps t to 0-1 range", () => {
    expect(lerp(0, 100, -1)).toBe(0);
    expect(lerp(0, 100, 2)).toBe(100);
  });
});

describe("sanitizeInput", () => {
  it("escapes HTML entities", () => {
    expect(sanitizeInput("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(sanitizeInput("a & b")).toBe("a &amp; b");
  });

  it("escapes quotes", () => {
    expect(sanitizeInput('"test"')).toBe("&quot;test&quot;");
  });

  it("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("limits input length to 2000 chars", () => {
    const longInput = "a".repeat(3000);
    expect(sanitizeInput(longInput).length).toBeLessThanOrEqual(2000);
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent timestamps", () => {
    const recent = new Date(Date.now() - 5000).toISOString();
    expect(formatRelativeTime(recent)).toBe("just now");
  });

  it("returns seconds ago for timestamps under a minute", () => {
    const thirtySecsAgo = new Date(Date.now() - 30000).toISOString();
    expect(formatRelativeTime(thirtySecsAgo)).toBe("30s ago");
  });

  it("returns minutes ago for timestamps under an hour", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe("5m ago");
  });
});
